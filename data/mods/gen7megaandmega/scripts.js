'use strict';

// 19/07/14 TrashChannel: Based on mixandmega/scripts.js

/**@type {ModdedBattleScriptsData} */
let Scripts = {
	inherit: 'gen7',
	init() {
		for (let id in this.data.Items) {
			if (!this.data.Items[id].megaStone) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	canMegaEvo(pokemon) {
		// Mega and Mega: Ignore regular quick return for post-mega formes

		const item = pokemon.getItem();
		if (item.megaStone) {
			//if (item.megaStone === pokemon.species) return null;
			return item.megaStone;
		} else if (pokemon.baseMoves.includes(/** @type {ID} */('dragonascent'))) {
			return 'Rayquaza-Mega';
		} else {
			return null;
		}
	},
	runMegaEvo(pokemon) {
		// Mega and Mega: Ignore regular quick return for post-mega formes

		const isUltraBurst = !pokemon.canMegaEvo;
		/**@type {Species} */
		// @ts-ignore
		const species = this.getMixedSpecies(pokemon.m.originalSpecies, pokemon.canMegaEvo || pokemon.canUltraBurst);
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// Do we have a proper sprite for it?
		// @ts-ignore assert non-null pokemon.canMegaEvo
		if (isUltraBurst || this.dex.getSpecies(pokemon.canMegaEvo).baseSpecies === pokemon.m.originalSpecies) {
			pokemon.formeChange(species, pokemon.getItem(), true);
		} else {
			let oSpecies = this.dex.getSpecies(pokemon.m.originalSpecies);
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(species.originalMega);
			pokemon.formeChange(species, pokemon.getItem(), true);
			this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		}

		pokemon.canMegaEvo = null;
		if (isUltraBurst) pokemon.canUltraBurst = null;
		return true;
	},
	getMixedSpecies(originalSpecies, megaSpecies) {
		let originalSpecies = this.dex.getSpecies(originalSpecies);
		let megaSpecies = this.dex.getSpecies(megaSpecies);

		// Mega and Mega: Ignore regular quick return for post-mega formes
		// @ts-ignore
		let deltas = this.getMegaDeltas(megaSpecies);
		// @ts-ignore
		let species = this.doGetMixedSpecies(originalSpecies, deltas);
		return species;
	},
	getMegaDeltas(megaSpecies) {
		let baseSpecies = this.dex.getSpecies(megaSpecies.baseSpecies);
		/**@type {{ability: string, baseStats: {[k: string]: number}, weightkg: number, originalMega: string, requiredItem: string | undefined, type?: string, isMega?: boolean, isPrimal?: boolean}} */
		let deltas = {
			ability: megaSpecies.abilities['0'],
			baseStats: {},
			weightkg: megaSpecies.weightkg - baseSpecies.weightkg,
			originalMega: megaSpecies.name,
			requiredItem: megaSpecies.requiredItem,
		};
		for (let statId in megaSpecies.baseStats) {
			// @ts-ignore
			deltas.baseStats[statId] = megaSpecies.baseStats[statId] - baseSpecies.baseStats[statId];
		}
		if (megaSpecies.types.length > baseSpecies.types.length) {
			deltas.type = megaSpecies.types[1];
		} else if (megaSpecies.types.length < baseSpecies.types.length) {
			deltas.type = baseSpecies.types[0];
		} else if (megaSpecies.types[1] !== baseSpecies.types[1]) {
			deltas.type = megaSpecies.types[1];
		}
		if (megaSpecies.isMega) deltas.isMega = true;
		if (megaSpecies.isPrimal) deltas.isPrimal = true;
		return deltas;
	},
	doGetMixedSpecies(speciesOrSpeciesName, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let species = this.dex.deepClone(this.dex.getSpecies(speciesOrSpeciesName));
		species.abilities = {'0': deltas.ability};
		if (species.types[0] === deltas.type) {
			species.types = [deltas.type];
		} else if (deltas.type) {
			species.types = [species.types[0], deltas.type];
		}
		let baseStats = species.baseStats;
		for (let statName in baseStats) {
			baseStats[statName] = this.dex.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		species.originalMega = deltas.originalMega;
		species.requiredItem = deltas.requiredItem;
		if (deltas.isMega) species.isMega = true;
		if (deltas.isPrimal) species.isPrimal = true;
		return species;
	},
};

exports.Scripts = Scripts;
