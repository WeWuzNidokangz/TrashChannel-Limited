'use strict';

const DexCalculator = require('../../../trashchannel/dex-calculator');

const fs = require('fs');
const path = require('path');

// Includes
const GENERIC_SCRIPTS = path.resolve(__dirname, '../../../data/scripts');
const MNM_SCRIPTS = path.resolve(__dirname, '../gen7mixandmega/scripts');
const MMCOLLECTION = path.resolve(__dirname, './mixedmetacollection');

// 18/12/20 TrashChannel: IT'S TIEM

/**@type {ModdedBattleScriptsData} */
let Scripts = {
	inherit: 'gen7',
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
				metaScript = require(metaScriptPath).Scripts;

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
				metaScript = require(metaScriptPath).Scripts;

				if(undefined !== metaScript.canMegaEvo) {
					console.log("4 canMegaEvo");
					return metaScript.canMegaEvo.call(this, pokemon);
				}
			}
			catch (e) {
				console.log("canMegaEvo metaScriptPath missing: " + metaScriptPath);
			}
		}

		let genericScript = require(GENERIC_SCRIPTS).Scripts;
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
				metaScript = require(metaScriptPath).Scripts;

				if(undefined !== metaScript.runMegaEvo) {
					return metaScript.runMegaEvo.call(this, pokemon);
				}
			}
			catch (e) {
				console.log("runMegaEvo metaScriptPath missing: " + metaScriptPath);
			}
		}

		// 19/05/06: Re-implement standard runMegaEvo, but prevent MnM megas from being disabled by regular single megaevo usage
		const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
		if (!speciesid) return false;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot mega evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		pokemon.formeChange(speciesid, pokemon.getItem(), true);

		// Limit one mega evolution
		let wasMega = pokemon.canMegaEvo;
		for (const ally of side.pokemon) {
			//console.log("ally meta: " + toID(ally.meta));
			let allyIsMnM = ('gen7mixandmega' === toID(ally.meta)); // MnM mons can still mega
			if(allyIsMnM) continue;

			if (wasMega) {
				ally.canMegaEvo = null;
			} else {
				ally.canUltraBurst = null;
			}
		}

		this.runEvent('AfterMega', pokemon);
		return true;
	},
	getMixedSpecies(originalSpecies, megaSpecies) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).Scripts;

		if(undefined !== MnMScript.getMixedSpecies) {
			return MnMScript.getMixedSpecies.call(this, originalSpecies, megaSpecies);
		}
	},
	getMegaDeltas(megaSpecies) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).Scripts;

		if(undefined !== MnMScript.getMegaDeltas) {
			return MnMScript.getMegaDeltas.call(this, megaSpecies);
		}
	},
	doGetMixedSpecies(speciesOrSpeciesName, deltas) { // Can only enter from MnM (for now)
		// Load MnM script functions
		/**@type {ModdedBattleScriptsData} */
		let MnMScript = require(MNM_SCRIPTS).Scripts;

		if(undefined !== MnMScript.doGetMixedSpecies) {
			return MnMScript.doGetMixedSpecies.call(this, speciesOrSpeciesName, deltas);
		}
	},
};

exports.Scripts = Scripts;
