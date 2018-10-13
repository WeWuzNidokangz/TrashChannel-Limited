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

const DexCalculator = require('../sim/dex-calculator');

const RULESETS = path.resolve(__dirname, '../data/rulesets');

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
			//return this.popupReply(`Only staff can use forcebattle.`);
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

		console.log('RULESETS: ' + RULESETS);

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
		let cloneTemplate = DexCalculator.deepClone(template) 

		cloneTemplate = Rulesets['r350cuprule'].onModifyTemplate(cloneTemplate, null);
		cloneTemplate = Rulesets['tiershiftrule'].onModifyTemplate(cloneTemplate, null);

		this.sendReply(`|html|${Chat.getDataPokemonHTML(cloneTemplate)}`);
	},
	'350cuptiershifthelp': [`/350ts OR /350tiershift OR /350tiershift <pokemon> - Shows the base stats that a Pokemon would have in a mashup including 350 Cup and Tier Shift.`],
};

exports.commands = commands;