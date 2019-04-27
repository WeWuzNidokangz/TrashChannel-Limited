/**
 * TrashChannel: New commands
 *
 * New commands for TrashChannel
 *
 * @license MIT
 */

'use strict';

const fs = require('fs');
const path = require('path');

const DexCalculator = require('../../trashchannel/dex-calculator');
const TrashChannelChatSupport = require('../../trashchannel/trashchannel-chatsupport');

const RULESETS = path.resolve(__dirname, '../../data/rulesets');
const FORMATS = path.resolve(__dirname, '../../config/formats');

const BITCHANDBEGGARMOD = path.resolve(__dirname, '../../data/mods/bitchandbeggar/scripts');

const MAX_PROCESSES = 1;
const RESULTS_MAX_LENGTH = 10;

function escapeHTML(str) {
	if (!str) return '';
	return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
}

/** @typedef {(this: CommandContext, target: string, room: ChatRoom, user: User, connection: Connection, cmd: string, message: string) => (void)} ChatHandler */
/** @typedef {{[k: string]: ChatHandler | string | true | string[] | ChatCommands}} ChatCommands */

/** @type {ChatCommands} */
const commands = {
	// DEBUG
	'!forcebattle': true,
	forcebattle: 'forcebattle',
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
		if (!toId(target)) return this.parse('/help 350tiershift');
		let template = Object.assign({}, Dex.getTemplate(target));
		if (!template.exists) return this.errorReply("Error: Pokemon not found.");

		//console.log('RULESETS: ' + RULESETS);

		// Load rulesets
		/**@type {{[k: string]: FormatsData}} */
		let Rulesets;
		try {
			Rulesets = require(RULESETS).BattleFormats;
		} catch (e) {
			console.log('e.code: ' + e.code);
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}

		// Deepclone template to avoid permanently altering the original
		let cloneTemplate = DexCalculator.deepClone(template);

		cloneTemplate = Rulesets['r350cuprule'].onModifyTemplate(cloneTemplate, null);
		if(!cloneTemplate) return this.errorReply(`r350cuprule.onModifyTemplate failed on this Pokemon.`);
		cloneTemplate = Rulesets['tiershiftrule'].onModifyTemplate(cloneTemplate, null, null, 'dummy'); // Set dummy effect to bypass internal validation
		if(!cloneTemplate) return this.errorReply(`tiershiftrule.onModifyTemplate failed on this Pokemon.`);

		this.sendReply(`|html|${Chat.getDataPokemonHTML(cloneTemplate)}`);
	},
	'350cuptiershifthelp': [`/350ts OR /350tiershift OR /350tiershift <pokemon> - Shows the base stats that a Pokemon would have in a mashup including 350 Cup and Tier Shift.`],

	'!mixandmegatiershift': true,
	tiershiftmixandmega: 'mixandmegatiershift',
	mnmts: 'mixandmegatiershift',
	tsmnm: 'mixandmegatiershift',
	mixandmegatiershift(target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target) || !target.includes('@')) return this.parse('/help mixandmegatiershift');
		let sep = target.split('@');
		let template = Dex.getTemplate(sep[0]);

		// Load rulesets
		/**@type {{[k: string]: FormatsData}} */
		let Rulesets;
		try {
			Rulesets = require(RULESETS).BattleFormats;
		} catch (e) {
			console.log('e.code: ' + e.code);
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}

		let cloneTemplate = DexCalculator.deepClone(template);
		cloneTemplate = Rulesets['tiershiftrule'].onModifyTemplate(cloneTemplate, null, null, 'dummy'); // Set dummy effect to bypass internal validation
		if(!cloneTemplate) return this.errorReply(`tiershiftrule.onModifyTemplate failed on this Pokemon.`);

		TrashChannelChatSupport.mixandmegainternal(this, cloneTemplate, sep[1], "TS");
	},
	mixandmegatiershifthelp: [`/mnmts <pokemon> @ <mega stone> - Shows the Tier Shifted Mix and Mega evolved Pokemon's type and stats.`],


	'!bitchandbeggar': true,
	bnb: 'bitchandbeggar',
	bitchandbeggar: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!toId(target) || !target.includes('@')) return this.parse('/help bitchandbeggar');
		let sep = target.split('@');
		let bitchTemplate = Dex.getTemplate(sep[1]);
		let beggarTemplate = Object.assign({}, Dex.getTemplate(sep[0]));
		if (!bitchTemplate.exists) return this.errorReply(`Error: Bitch Pokemon not found.`);
		if (!beggarTemplate.exists) return this.errorReply(`Error: Beggar Pokemon not found.`);
		if (beggarTemplate.isMega || beggarTemplate.name === 'Necrozma-Ultra') { // Mega Pokemon and Ultra Necrozma cannot be beggar evolved
			this.errorReply(`Warning: You cannot beggar evolve Mega Pokemon and Ultra Necrozma in Bitch and Beggar.`);
		}
		let banlist = Dex.getFormat('gen7bitchandbeggar').banlist;
		if (banlist.includes(bitchTemplate.name)) {
			this.errorReply(`Warning: ${bitchTemplate.name} is banned from Bitch and Beggar.`);
		}
		let cannotMega = Dex.getFormat('gen7bitchandbeggar').cannotMega || [];
		if (cannotMega.includes(beggarTemplate.name) && beggarTemplate.name !== bitchTemplate.megaEvolves && !beggarTemplate.isMega) { // Separate messages because there's a difference between being already beggar evolved / NFE and being banned from beggar evolving
			this.errorReply(`Warning: ${beggarTemplate.name} is banned from beggar evolving in Bitch and Beggar.`);
		}
		if (['Multitype', 'RKS System'].includes(beggarTemplate.abilities['0']) && !['Arceus', 'Silvally'].includes(beggarTemplate.name)) {
			this.errorReply(`Warning: ${beggarTemplate.name} is required to hold ${beggarTemplate.baseSpecies === 'Arceus' && beggarTemplate.requiredItems ? 'either ' + beggarTemplate.requiredItems[0] + ' or ' + beggarTemplate.requiredItems[1] : beggarTemplate.requiredItem}.`);
		}
		if (bitchTemplate.isUnreleased) {
			this.errorReply(`Warning: ${bitchTemplate.name} is unreleased and is not usable in current Bitch and Beggar.`);
		}
		
		// Load formats
		/**@type {{[k: string]: FormatsData}} */
		let Formats;
		try {
			Formats = require(FORMATS).Formats;
		} catch (e) {
			console.log('e.code: ' + e.code);
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}

		// BnB BST limit
		if(Formats) {
			let bitchBST = Dex.calcBST(bitchTemplate.baseStats);
			/**@type {FormatsData} */
			let BnBFormat = null;
			for(let nFrmItr=0; nFrmItr<Formats.length; ++nFrmItr) {
				//console.log("nFrmItr: " + nFrmItr.toString() + ", name: " + Formats[nFrmItr].name);
				if(Formats[nFrmItr].name === '[Gen 7] Bitch and Beggar') {
					BnBFormat = Formats[nFrmItr];
				}
			}
			if( null != BnBFormat ) {
				let bitchBSTLimit = BnBFormat.modValueNumberA;
				if(bitchBST > bitchBSTLimit) {
					this.errorReply(`Bitches are limited to ` + bitchBSTLimit.toString() + ` BST, but ` + bitchTemplate.name + ` has ` + bitchBST.toString() + `.`);
				}
			}
		}
		// Fake Pokemon and Mega Stones
		if (beggarTemplate.isNonstandard) {
			this.errorReply(`Warning: ${beggarTemplate.name} is not a real Pokemon and is therefore not usable in Bitch and Beggar.`);
		}
		// Actually can be used with CAP
		if (bitchTemplate.isNonstandard) {
			this.errorReply(`Warning: ${bitchTemplate.name} is a fake bitch created by the CAP Project and is restricted to CAP mashups.`);
		}

		// Load BnB mod functions
		/**@type {ModdedBattleScriptsData} */
		let BnBMod;
		try {
			BnBMod = require(BITCHANDBEGGARMOD).BattleScripts;
		} catch (e) {
			console.log('e.code: ' + e.code);
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
		}
		if(!BnBMod) return this.errorReply(`BITCHANDBEGGARMOD not found.`);

		// Do beggar evo calcs
		const mixedTemplate = BnBMod.getMixedTemplate(beggarTemplate.name, bitchTemplate.name);
		mixedTemplate.tier = "BnB";
		let weighthit = 20;
		if (mixedTemplate.weightkg >= 200) {
			weighthit = 120;
		} else if (mixedTemplate.weightkg >= 100) {
			weighthit = 100;
		} else if (mixedTemplate.weightkg >= 50) {
			weighthit = 80;
		} else if (mixedTemplate.weightkg >= 25) {
			weighthit = 60;
		} else if (mixedTemplate.weightkg >= 10) {
			weighthit = 40;
		}
		/** @type {{[k: string]: string}} */
		let details = {
			"Dex#": '' + mixedTemplate.num,
			"Gen": '' + mixedTemplate.gen,
			"Height": mixedTemplate.heightm + " m",
			"Weight": mixedTemplate.weightkg + " kg <em>(" + weighthit + " BP)</em>",
			"Dex Colour": mixedTemplate.color,
		};
		if (mixedTemplate.eggGroups) details["Egg Group(s)"] = mixedTemplate.eggGroups.join(", ");
		details['<font color="#686868">Does Not Evolve</font>'] = "";
		this.sendReply(`|raw|${Chat.getDataPokemonHTML(mixedTemplate)}`);
		this.sendReply('|raw|<font size="1">' + Object.keys(details).map(detail => {
			if (details[detail] === '') return detail;
			return '<font color="#686868">' + detail + ':</font> ' + details[detail];
		}).join("&nbsp;|&ThickSpace;") + '</font>');
	},
	bitchandbeggarhelp: [`/bnb <pokemon> @ <beggar bitch> - Shows the Bitch and Beggar evolved Pokemon's type and stats.`],
};

exports.commands = commands;