'use strict';

const DexCalculator = require('../../sim/dex-calculator');

const fs = require('fs');
const path = require('path');

// Includes
const GENERIC_SCRIPTS = path.resolve(__dirname, '../../data/scripts');
const MNM_SCRIPTS = path.resolve(__dirname, '../mixandmega/scripts');
const MMCOLLECTION = path.resolve(__dirname, './mixedmetacollection');

// 18/12/20 TrashChannel: IT'S TIEM

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		console.log("1 init");

		// Load MxM definitions structure
		/**@type {{[k: string]: MixedMeta}} */
		let MMCollection;
		try {
			MMCollection = require(MMCOLLECTION).MixedMetaCollection;
		} catch (e) {
			console.log('e.code: ' + e.code);
			if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
				throw e;
			}
			return undefined;
		}

		// Have to execute for every meta
		for (const mixedMetaKey in MMCollection) {
			console.log("init for mixedMetaKey: " + mixedMetaKey);
			
			let mixedMetaValue = MMCollection[mixedMetaKey];
			let metaFormat = this.getFormat(mixedMetaValue.format);
			let metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);
			console.log(metaScriptPath);

			/**@type {ModdedBattleScriptsData} */
			let metaScript;
			try {
				// Load meta script functions
				/**@type {ModdedBattleScriptsData} */
				metaScript = require(metaScriptPath).BattleScripts;

				if(undefined !== metaScript.init) {
					return metaScript.init.call(this);
				}
			}
			catch (e) {
				console.log("init metaScriptPath missing: " + metaScriptPath);
			}
		}
	},
	canMegaEvo(pokemon) {
		console.log("1 canMegaEvo");

		// Called before onBegin so we need to cache meta
		let metaFormat = this.getFormat(pokemon.meta);
		if(metaFormat.determineMeta) {
			pokemon.meta = metaFormat.determineMeta.call(this, pokemon.set, null);
		}

		if(pokemon.meta) {
			console.log("2 canMegaEvo");

			let metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);

			/**@type {ModdedBattleScriptsData} */
			let metaScript;
			try {
				console.log("3 canMegaEvo");

				// Load meta script functions
				/**@type {ModdedBattleScriptsData} */
				metaScript = require(metaScriptPath).BattleScripts;

				if(undefined !== metaScript.canMegaEvo) {
					console.log("4 canMegaEvo");
					return metaScript.canMegaEvo.call(this, pokemon);
				}
			}
			catch (e) {
				console.log("canMegaEvo metaScriptPath missing: " + metaScriptPath);
			}
		}

		let genericScript = require(GENERIC_SCRIPTS).BattleScripts;
		if(undefined !== genericScript.canMegaEvo) {
			return genericScript.canMegaEvo.call(this, pokemon);
		}
	},
	runMegaEvo(pokemon) {
		if(pokemon.meta) {
			let metaFormat = this.getFormat(pokemon.meta);

			let metaScriptPath = path.resolve(__dirname, `../${metaFormat.mod}/scripts`);

			/**@type {ModdedBattleScriptsData} */
			let metaScript;
			try {
				// Load meta script functions
				/**@type {ModdedBattleScriptsData} */
				metaScript = require(metaScriptPath).BattleScripts;

				if(undefined !== metaScript.runMegaEvo) {
					return metaScript.runMegaEvo.call(this, pokemon);
				}
			}
			catch (e) {
				console.log("runMegaEvo metaScriptPath missing: " + metaScriptPath);
			}
		}

		let genericScript = require(GENERIC_SCRIPTS).BattleScripts;
		if(undefined !== genericScript.runMegaEvo) {
			return genericScript.runMegaEvo.call(this, pokemon);
		}
	},
	getMixedTemplate(originalSpecies, megaSpecies) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).BattleScripts;

		if(undefined !== MnMScript.getMixedTemplate) {
			return MnMScript.getMixedTemplate.call(this, originalSpecies, megaSpecies);
		}
	},
	getMegaDeltas(megaTemplate) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).BattleScripts;

		if(undefined !== MnMScript.getMegaDeltas) {
			return MnMScript.getMegaDeltas.call(this, megaTemplate);
		}
	},
	doGetMixedTemplate(templateOrTemplateName, deltas) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).BattleScripts;

		if(undefined !== MnMScript.doGetMixedTemplate) {
			return MnMScript.doGetMixedTemplate.call(this, templateOrTemplateName, deltas);
		}
	},
};

exports.BattleScripts = BattleScripts;
