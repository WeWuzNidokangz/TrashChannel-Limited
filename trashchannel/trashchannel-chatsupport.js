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

'use strict';

//const fs = require('fs');
//const path = require('path');

class TrashChannelChatSupport {
	constructor() {

	}

	/**
	 * @param {string} stone
	 * @return {Object}
	 */
	static getMegaStone(stone) {
		let item = Dex.getItem(stone);
		if (!item.exists) {
			if (toID(stone) === 'dragonascent') {
				let move = Dex.getMove(stone);
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

	/**
	 * @param {CommandContext} commandContext
	 * @param {Template} template
	 * @param {string} stoneName
	 * @param {string} tierTextSuffix
	 * @return {Object}
	 */
	static mixandmegainternal(commandContext, template, stoneName, tierTextSuffix) {
		let stone = TrashChannelChatSupport.getMegaStone(stoneName);
		if (!stone.exists) return commandContext.errorReply(`Error: Mega Stone not found.`);
		if (!template) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (!template.exists) return commandContext.errorReply(`Error: Pokemon not found.`);
		if (template.isMega || template.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be mega evolved
			commandContext.errorReply(`Warning: You cannot mega evolve Mega Pokemon and Ultra Necrozma in Mix and Mega.`);
		}
		let banlist = Dex.getFormat('gen7mixandmega').banlist;
		if (banlist.includes(stone.name)) {
			commandContext.errorReply(`Warning: ${stone.name} is banned from Mix and Mega.`);
		}
		let restrictedStones = Dex.getFormat('gen7mixandmega').restrictedStones || [];
		if (restrictedStones.includes(stone.name) && template.name !== stone.megaEvolves) {
			commandContext.errorReply(`Warning: ${stone.name} is restricted to ${stone.megaEvolves} in Mix and Mega.`);
		}
		let cannotMega = Dex.getFormat('gen7mixandmega').cannotMega || [];
		if (cannotMega.includes(template.name) && template.name !== stone.megaEvolves && !template.isMega) { // Separate messages because there's a difference between being already mega evolved / NFE and being banned from mega evolving
			commandContext.errorReply(`Warning: ${template.name} is banned from mega evolving with a non-native mega stone in Mix and Mega.`);
		}
		if (['Multitype', 'RKS System'].includes(template.abilities['0']) && !['Arceus', 'Silvally'].includes(template.name)) {
			commandContext.errorReply(`Warning: ${template.name} is required to hold ${template.baseSpecies === 'Arceus' && template.requiredItems ? 'either ' + template.requiredItems[0] + ' or ' + template.requiredItems[1] : template.requiredItem}.`);
		}
		if (stone.isUnreleased) {
			commandContext.errorReply(`Warning: ${stone.name} is unreleased and is not usable in current Mix and Mega.`);
		}
		if (toID(stoneName) === 'dragonascent' && !['smeargle', 'rayquaza', 'rayquazamega'].includes(toID(template.name))) {
			commandContext.errorReply(`Warning: Only Pokemon with access to Dragon Ascent can mega evolve with Mega Rayquaza's traits.`);
		}
		// Fake Pokemon and Mega Stones
		if (template.isNonstandard) {
			commandContext.errorReply(`Warning: ${template.name} is not a real Pokemon and is therefore not usable in Mix and Mega.`);
		}
		if (stone.isNonstandard) {
			commandContext.errorReply(`Warning: ${stone.name} is a fake mega stone created by the CAP Project and is restricted to the CAP ${stone.megaEvolves}.`);
		}
		let baseTemplate = Dex.getTemplate(stone.megaEvolves);
		let megaTemplate = Dex.getTemplate(stone.megaStone);
		if (stone.id === 'redorb') { // Orbs do not have 'Item.megaStone' or 'Item.megaEvolves' properties.
			megaTemplate = Dex.getTemplate("Groudon-Primal");
			baseTemplate = Dex.getTemplate("Groudon");
		} else if (stone.id === 'blueorb') {
			megaTemplate = Dex.getTemplate("Kyogre-Primal");
			baseTemplate = Dex.getTemplate("Kyogre");
		}
		/** @type {{baseStats: {[k: string]: number}, weightkg: number, type?: string}} */
		let deltas = {
			baseStats: {},
			weightkg: megaTemplate.weightkg - baseTemplate.weightkg,
		};
		for (let statId in megaTemplate.baseStats) {
			// @ts-ignore
			deltas.baseStats[statId] = megaTemplate.baseStats[statId] - baseTemplate.baseStats[statId];
		}
		if (megaTemplate.types.length > baseTemplate.types.length) {
			deltas.type = megaTemplate.types[1];
		} else if (megaTemplate.types.length < baseTemplate.types.length) {
			deltas.type = baseTemplate.types[0];
		} else if (megaTemplate.types[1] !== baseTemplate.types[1]) {
			deltas.type = megaTemplate.types[1];
		}
		//////////////////////////////////////////
		let mixedTemplate = Dex.deepClone(template);
		mixedTemplate.abilities = Object.assign({}, megaTemplate.abilities);
		if (mixedTemplate.types[0] === deltas.type) { // Add any type gains
			mixedTemplate.types = [deltas.type];
		} else if (deltas.type) {
			mixedTemplate.types = [mixedTemplate.types[0], deltas.type];
		}
		for (let statName in template.baseStats) { // Add the changed stats and weight
			mixedTemplate.baseStats[statName] = Dex.clampIntRange(mixedTemplate.baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		mixedTemplate.weighthg = Math.max(1, template.weighthg + deltas.weighthg);
		mixedTemplate.tier = "MnM";
		//#region TrashChannel
		if(tierTextSuffix) {
			mixedTemplate.tier += tierTextSuffix;
		}
		//#endregion
		let weighthit = 20;
		if (mixedTemplate.weightkg >= 2000) {
			weighthit = 120;
		} else if (mixedTemplate.weightkg >= 1000) {
			weighthit = 100;
		} else if (mixedTemplate.weightkg >= 500) {
			weighthit = 80;
		} else if (mixedTemplate.weightkg >= 250) {
			weighthit = 60;
		} else if (mixedTemplate.weightkg >= 100) {
			weighthit = 40;
		}
		/** @type {{[k: string]: string}} */
		let details = {
			"Dex#": '' + mixedTemplate.num,
			"Gen": '' + mixedTemplate.gen,
			"Height": mixedTemplate.heightm + " m",
			"Weight": mixedTemplate.weighthg / 10 + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedTemplate.color,
		};
		if (mixedTemplate.eggGroups) details["Egg Group(s)"] = mixedTemplate.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		commandContext.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedTemplate)}`);
		commandContext.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	}
}

module.exports = TrashChannelChatSupport;
