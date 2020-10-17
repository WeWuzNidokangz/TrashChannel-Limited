/**
 * Dex Calculator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * 18/10/13 TrashChannel:
 * Base class for Dex that encapsulates calculation functionality like Clamp
 * that we want to be able to include in chat commands, etc also
 *
 * @license MIT license
 */

import {Utils} from '../lib/utils';

export const TrashChannelChatSupport = new class TrashChannelChatSupport {
	getMegaStone(stone: string, mod = 'gen8'): Item | null {
		let dex = Dex;
		if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
		const item = dex.getItem(stone);
		if (!item.exists) {
			if (toID(stone) === 'dragonascent') {
				const move = dex.getMove(stone);
				return {
					id: move.id,
					name: move.name,
					fullname: move.name,
					megaEvolves: 'Rayquaza',
					megaStone: 'Rayquaza-Mega',
					exists: true,
					// Adding extra values to appease typescript
					gen: 6,
					num: -1,
					effectType: 'Item',
					sourceEffect: '',
				};
			} else {
				return null;
			}
		}
		if (!item.megaStone && !item.onPrimal) return null;
		return item;
	}

	mixandmegainternal(commandContext: CommandContext, species: Species, stoneName: string, mod: string, tierTextSuffix: string) {
		let dex = Dex;
		if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
		const stone = this.getMegaStone(stoneName);
		if (!stone || (dex.gen >= 8 && ['redorb', 'blueorb'].includes(stone.id))) return commandContext.errorReply(`Error: Mega Stone not found.`);
		if (!species) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (!species.exists) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (species.isMega || species.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be mega evolved
			commandContext.errorReply(`Warning: You cannot mega evolve Mega Pokemon and Ultra Necrozma in Mix and Mega.`);
		}
		const banlist = Dex.getFormat('gen8mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			commandContext.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		const restrictedStones = Dex.getFormat('gen8mixandmega').banlist || [];
		if (restrictedStones.includes(stone.name) && species.name !== stone.megaEvolves) {
			commandContext.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega.`);
		}
		const cannotMega = Dex.getFormat('gen8mixandmega').cannotMega || [];
		if (cannotMega.includes(species.name) && species.name !== stone.megaEvolves && !species.isMega) { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			commandContext.errorReply(`Warning: ${species.name} is banned from mega evolving with a non-native mega stone in Mix and Mega.`);
		}
		if (['Multitype', 'RKS System'].includes(species.abilities['0']) && !['Arceus', 'Silvally'].includes(species.name)) {
			commandContext.errorReply(`Warning: ${species.name} is required to hold ${species.baseSpecies === 'Arceus' && species.requiredItems ? 'either ' + species.requiredItems[0] + ' or ' + species.requiredItems[1] : species.requiredItem}.`);
		}
		if (toID(stoneName) === 'dragonascent' && !['smeargle', 'rayquaza', 'rayquazamega'].includes(toID(species.name))) {
			commandContext.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Pokemon and Mega Stones
		if (species.isNonstandard === "CAP") {
			commandContext.errorReply(`Warning: ${species.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (stone.isNonstandard === "CAP") {
			commandContext.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseSpecies = Dex.getSpecies(stone.megaEvolves);
		let megaSpecies = Dex.getSpecies(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaSpecies = Dex.getSpecies("Groudon-Primal");
			baseSpecies = Dex.getSpecies("Groudon");
		} else if (stone.id === 'blueorb') {
			megaSpecies = Dex.getSpecies("Kyogre-Primal");
			baseSpecies = Dex.getSpecies("Kyogre");
		}
		const deltas: StoneDeltas = {
			baseStats: Object.create(null),
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
			bst: megaSpecies.bst - baseSpecies.bst,
		};
		let statId: StatName;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = dex.gen >= 8 ? 'mono' : megaSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		//////////////////////////////////////////
		const mixedSpecies = Utils.deepClone(species);
		mixedSpecies.abilities = Utils.deepClone(megaSpecies.abilities);
		if (mixedSpecies.types[0] === deltas.type) { // Add any type gains
			mixedSpecies.types = [deltas.type];
		} else if (deltas.type === 'mono') {
			mixedSpecies.types = [mixedSpecies.types[0]];
		} else if (deltas.type) {
			mixedSpecies.types = [mixedSpecies.types[0], deltas.type];
		}
		let statName: StatName;
		mixedSpecies.bst = 0;
		for (statName in species.baseStats) { // Add the changed stats and weight
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(
				mixedSpecies.baseStats[statName] + deltas.baseStats[statName], 1, 255
			);
			mixedSpecies.bst += mixedSpecies.baseStats[statName];
		}
		mixedSpecies.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		mixedSpecies.tier = "MnM";
		//#region TrashChannel
		if(tierTextSuffix) {
			mixedSpecies.tier += tierTextSuffix;
		}
		//#endregion
		let weighthit = 20;
		if (mixedSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (mixedSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (mixedSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (mixedSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (mixedSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": '' + mixedSpecies.num,
			Gen: '' + mixedSpecies.gen,
			Height: mixedSpecies.heightm + " m",
			Weight: mixedSpecies.weighthg / 10 + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		commandContext.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		commandContext.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	}

	gen7mixandmegainternal(commandContext: CommandContext, species: Species, stoneName: string, tierTextSuffix: string) {
		const stone = this.getMegaStone(stoneName);
		if (!stone || !stone.exists) return commandContext.errorReply(`Error: Mega Stone not found.`);
		if (!species) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (!species.exists) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (species.isMega || species.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be mega evolved
			commandContext.errorReply(`Warning: You cannot mega evolve Mega Pokemon and Ultra Necrozma in Mix and Mega.`);
		}
		const banlist = Dex.getFormat('gen7mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			commandContext.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		const restrictedStones = Dex.getFormat('gen7mixandmega').restrictedStones || [];
		if (restrictedStones.includes(stone.name) && species.name !== stone.megaEvolves) {
			commandContext.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega.`);
		}
		const cannotMega = Dex.getFormat('gen7mixandmega').cannotMega || [];
		if (cannotMega.includes(species.name) && species.name !== stone.megaEvolves && !species.isMega) { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			commandContext.errorReply(`Warning: ${species.name} is banned from mega evolving with a non-native mega stone in Mix and Mega.`);
		}
		if (['Multitype', 'RKS System'].includes(species.abilities['0']) && !['Arceus', 'Silvally'].includes(species.name)) {
			commandContext.errorReply(`Warning: ${species.name} is required to hold ${species.baseSpecies === 'Arceus' && species.requiredItems ? 'either ' + species.requiredItems[0] + ' or ' + species.requiredItems[1] : species.requiredItem}.`);
		}
		if (stone.isUnreleased) {
			commandContext.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
		}
		if (toID(stoneName) === 'dragonascent' && !['smeargle', 'rayquaza', 'rayquazamega'].includes(toID(species.name))) {
			commandContext.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Pokemon and Mega Stones
		if (species.isNonstandard) {
			commandContext.errorReply(`Warning: ${species.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (stone.isNonstandard) {
			commandContext.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseSpecies = Dex.getSpecies(stone.megaEvolves);
		let megaSpecies = Dex.getSpecies(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaSpecies = Dex.getSpecies("Groudon-Primal");
			baseSpecies = Dex.getSpecies("Groudon");
		} else if (stone.id === 'blueorb') {
			megaSpecies = Dex.getSpecies("Kyogre-Primal");
			baseSpecies = Dex.getSpecies("Kyogre");
		}
		const deltas: StoneDeltas = {
			baseStats: Object.create(null),
			weighthg: megaSpecies.weighthg - baseSpecies.weighthg,
			bst: megaSpecies.bst - baseSpecies.bst,
		};
		let statId: StatName;
		for (statId in megaSpecies.baseStats) {
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = baseSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		//////////////////////////////////////////
		const mixedSpecies = Utils.deepClone(species);
		mixedSpecies.abilities = Object.assign({}, megaSpecies.abilities);
		if (mixedSpecies.types[0] === deltas.type) { // Add any type gains
			mixedSpecies.types = [deltas.type];
		} else if (deltas.type) {
			mixedSpecies.types = [mixedSpecies.types[0], deltas.type];
		}
		for (let statName in species.baseStats) { // Add the changed stats and weight
			mixedSpecies.baseStats[statName] = Utils.clampIntRange(
				mixedSpecies.baseStats[statName] + deltas.baseStats[statName], 1, 255
			);
			mixedSpecies.bst += mixedSpecies.baseStats[statName];
		}
		mixedSpecies.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		mixedSpecies.tier = "MnM";
		//#region TrashChannel
		if(tierTextSuffix) {
			mixedSpecies.tier += tierTextSuffix;
		}
		//#endregion
		let weighthit = 20;
		if (mixedSpecies.weighthg >= 2000) {
			weighthit = 120;
		} else if (mixedSpecies.weighthg >= 1000) {
			weighthit = 100;
		} else if (mixedSpecies.weighthg >= 500) {
			weighthit = 80;
		} else if (mixedSpecies.weighthg >= 250) {
			weighthit = 60;
		} else if (mixedSpecies.weighthg >= 100) {
			weighthit = 40;
		}
		const details: {[k: string]: string} = {
			"Dex#": '' + mixedSpecies.num,
			Gen: '' + mixedSpecies.gen,
			Height: mixedSpecies.heightm + " m",
			Weight: mixedSpecies.weighthg / 10 + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		commandContext.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		commandContext.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	}
};
