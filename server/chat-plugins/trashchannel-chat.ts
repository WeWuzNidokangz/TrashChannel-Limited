/**
 * TrashChannel: New commands
 *
 * New commands for TrashChannel
 *
 * @license MIT
 */

import {DexCalculator} from '../../.trashchannel-dist/dex-calculator';
import {TrashChannelChatSupport} from '../../.trashchannel-dist/trashchannel-chatsupport';

import {Formats as Rulesets} from '../../.data-dist/rulesets';
import {Formats} from '../../.config-dist/formats';

import {Scripts as BnBMod} from '../../.data-dist/mods/bitchandbeggar/scripts';

function escapeHTML(str: string) {
	if (!str) return '';
	return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
}

/** @typedef {(this: CommandContext, target: string, room: ChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

export const commands: ChatCommands = {
	// DEBUG
	'!forcebattle': true,
	forcebattle: function (target, room, user, connection, cmd, message) {
		if(!user.isStaff) {
			return this.popupReply(`Only staff can use forcebattle.`);
		}

		/** @type {string} */
		let targetName = '';
		/** @type {string} */
		let formatName = '';
		/** @type {string} */
		let userTeam = '';
		/** @type {string} */
		let targetTeam = '';

		let targets = target.split("^");
		let targetsBuffer = [];
		let qty;
		for (let trgItr=0; trgItr<targets.length; ++trgItr) {
			switch(trgItr) {
				case 0:
				targetName = targets[trgItr];
				break;
				case 1:
				formatName = targets[trgItr];
				break;
				case 2:
				userTeam = targets[trgItr];
				break;
				case 3:
				targetTeam = targets[trgItr];
				break;
			}
		}

		targetName = this.splitTarget(targetName);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply(`The user '${targetName}' was not found.`);
		}
		if (user.locked && !targetUser.locked) {
			return this.popupReply(`You are locked and cannot battle unlocked users.`);
		}
		if (Punishments.isBattleBanned(user)) {
			return this.popupReply(`You are banned from battling and cannot battle users.`);
		}
		const format = Dex.getFormat(formatName, true);

		/*
		if( typeof format !== 'Format') {
			return this.popupReply(`Invalid format: ` + format);
		}
		*/

		Rooms.createBattle(formatName, {
			p1: user,
			p1team: userTeam,
			p2: targetUser,
			p2team: targetTeam,
			rated: '',
		});
	},

	// HELP
	'!350tiershift': true,
	'350tiershift': '350cuptiershift',
	'350ts': '350cuptiershift',
	'350cuptiershift': function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toID(target)) return this.parse('/help 350tiershift');
		let species = Object.assign({}, Dex.getSpecies(target));
		if (!species.exists) return this.errorReply("Error: Pokemon not found.");

		// Deepclone species to avoid permanently altering the original
		let cloneSpecies = DexCalculator.deepClone(species);

		cloneSpecies = Rulesets['350cuprule'].onModifySpecies(cloneSpecies, null);
		if(!cloneSpecies) return this.errorReply(`350cuprule.onModifySpecies failed on this Pokemon.`);
		cloneSpecies = Rulesets['tiershiftrule'].onModifySpecies(cloneSpecies, null, null, 'dummy'); // Set dummy effect to bypass internal validation
		if(!cloneSpecies) return this.errorReply(`tiershiftrule.onModifySpecies failed on this Pokemon.`);

		this.sendReply(`|html|${Chat.getDataPokemonHTML(cloneSpecies)}`);
	},
	'350cuptiershifthelp': [`/350ts OR /350tiershift OR /350cuptiershift <pokemon> - Shows the base stats that a Pokemon would have in a mashup including 350 Cup and Tier Shift.`],

	'!mixandmegatiershift': true,
	tiershiftmixandmega: 'mixandmegatiershift',
	mnmts: 'mixandmegatiershift',
	tsmnm: 'mixandmegatiershift',
	mixandmegatiershift(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toID(target) || !target.includes('@')) return this.parse('/help mixandmegatiershift');
		let dex = Dex;
		const sep = target.split('@');
		const stoneName = sep.slice(1).join('@').trim().split(',');
		const mod = stoneName[1];
		if (mod && toID(mod) in Dex.dexes) dex = Dex.mod(toID(mod));
		const species = Dex.getSpecies(sep[0]);

		let cloneSpecies = DexCalculator.deepClone(species);
		cloneSpecies = Rulesets['tiershiftrule'].onModifySpecies(cloneSpecies, null, null, 'dummy'); // Set dummy effect to bypass internal validation
		if(!cloneSpecies) return this.errorReply(`tiershiftrule.onModifySpecies failed on this Pokemon.`);

		TrashChannelChatSupport.mixandmegainternal(this, cloneSpecies, stoneName[0], mod, "TS");
	},
	mixandmegatiershifthelp: [`/mnmts <pokemon> @ <mega stone[, generation]> - Shows the Tier Shifted Mix and Mega evolved Pokemon's type and stats.`],

	'!bitchandbeggar': true,
	bnb: 'bitchandbeggar',
	bitchandbeggar: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toID(target) || !target.includes('@')) return this.parse('/help bitchandbeggar');
		let sep = target.split('@');
		let bitchSpecies = Dex.getSpecies(sep[1]);
		let beggarSpecies = Object.assign({}, Dex.getSpecies(sep[0]));
		if (!bitchSpecies.exists) return this.errorReply(`Error: Bitch Pokemon not found.`);
		if (!beggarSpecies.exists) return this.errorReply(`Error: Beggar Pokemon not found.`);
		if (beggarSpecies.isMega || beggarSpecies.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be beggar evolved
			this.errorReply(`Warning: You cannot beggar evolve Mega Pokemon and Ultra Necrozma in Bitch and Beggar.`);
		}
		let banlist = Dex.getFormat('gen8bitchandbeggar').banlist;
		if (banlist.includes(bitchSpecies.name)) {
			this.errorReply(`Warning: ${bitchSpecies.name} is banned from Bitch and Beggar.`);
		}
		let cannotMega = Dex.getFormat('gen8bitchandbeggar').cannotMega || [];
		if (cannotMega.includes(beggarSpecies.name) && beggarSpecies.name !== bitchSpecies.megaEvolves && !beggarSpecies.isMega) { // Separate messages because there's a difference between being already beggar evolved / NFE and being banned from beggar evolving
			this.errorReply(`Warning: ${beggarSpecies.name} is banned from beggar evolving in Bitch and Beggar.`);
		}
		if (['Multitype', 'RKS System'].includes(beggarSpecies.abilities['0']) && !['Arceus', 'Silvally'].includes(beggarSpecies.name)) {
			this.errorReply(`Warning: ${beggarSpecies.name} is required to hold ${beggarSpecies.baseSpecies === 'Arceus' && beggarSpecies.requiredItems ? 'either ' + beggarSpecies.requiredItems[0] + ' or ' + beggarSpecies.requiredItems[1] : beggarSpecies.requiredItem}.`);
		}
		if (bitchSpecies.isUnreleased) {
			this.errorReply(`Warning: ${bitchSpecies.name} is unreleased and is not usable in current Bitch and Beggar.`);
		}

		// BnB BST limit
		if(Formats) {
			let bitchBST = Dex.calcBST(bitchSpecies.baseStats);
			/**@type {FormatsData} */
			let BnBFormat = null;
			for(let nFrmItr=0; nFrmItr<Formats.length; ++nFrmItr) {
				//console.log("nFrmItr: " + nFrmItr.toString() + ", name: " + Formats[nFrmItr].name);
				if(Formats[nFrmItr].name === '[Gen 8] Bitch and Beggar') {
					BnBFormat = Formats[nFrmItr];
				}
			}
			if( null != BnBFormat ) {
				let bitchBSTLimit = BnBFormat.modValueNumberA;
				if(bitchBST > bitchBSTLimit) {
					this.errorReply(`Bitches are limited to ` + bitchBSTLimit.toString() + ` BST, but ` + bitchSpecies.name + ` has ` + bitchBST.toString() + `.`);
				}
			}
		}
		// Fake Pokemon and Mega Stones
		if (beggarSpecies.isNonstandard === "CAP") {
			this.errorReply(`Warning: ${beggarSpecies.name} is not a real Pokemon and is therefore not usable in Bitch and Beggar.`);
		}
		// Actually can be used with CAP
		if (bitchSpecies.isNonstandard === "CAP") {
			this.errorReply(`Warning: ${bitchSpecies.name} is a fake bitch created by the CAP Project and is restricted to CAP mashups.`);
		}

		// Load BnB mod functions
		if(!BnBMod) return this.errorReply(`BnBMod not found.`);

		// Do beggar evo calcs
		const mixedSpecies = BnBMod.getMixedSpecies(beggarSpecies.name, bitchSpecies.name);
		mixedSpecies.tier = "BnB";
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
		/** @type {{[k: string]: string}} */
		let details = {
			"Dex#": '' + mixedSpecies.num,
			"Gen": '' + mixedSpecies.gen,
			"Height": mixedSpecies.heightm + " m",
			"Weight": mixedSpecies.weighthg / 10  + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedSpecies.color,
		};
		if (mixedSpecies.eggGroups) details["Egg Group(s)"] = mixedSpecies.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedSpecies)}`);
		this.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	},
	bitchandbeggarhelp: [`/bnb <pokemon> @ <beggar bitch> - Shows the Bitch and Beggar evolved Pokemon's type and stats.`],
};