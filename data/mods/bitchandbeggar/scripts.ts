import {DexCalculator} from '../../../.trashchannel-dist/dex-calculator';

// 18/10/27 TrashChannel: Based on mixandmega/scripts.js

export const Scripts: ModdedBattleScriptsData = {
	init() {
		for (let id in this.data.Items) {
			let bitchSpecies = this.getSpecies(id);
			if (!bitchSpecies.exists) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	canMegaEvo(pokemon) {
		if (pokemon.species.isMega || pokemon.species.isPrimal) return null;

		let bitchSpecies = this.dex.getSpecies(pokemon.item);
		if (bitchSpecies.exists) { // Bitch and beggar
			return bitchSpecies.id;
		}

		// Regular mega evo is no longer supported in Gen 8 (could add back for Natdex, etc later)
		return null;
	},
	runMegaEvo(pokemon) {
		if (pokemon.species.isMega || pokemon.species.isPrimal) return false;

		const isUltraBurst = !pokemon.canMegaEvo;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// Take care of regular megaevo case first (this.dex.getSpecies(pokemon.canMegaEvo).exists is true on Mega Stones!)
		let item = pokemon.getItem();
		let isBeggarEvo = !pokemon.getItem().exists;

		//console.log( 'isBeggarEvo: '+ isBeggarEvo.toString() +' pokemon.canMegaEvo: '+ pokemon.canMegaEvo.toString() );
		if(!isBeggarEvo) {
			const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!speciesid) return false;

			pokemon.formeChange(speciesid, pokemon.getItem(), true);

			// Limit one mega evolution
			let wasMega = pokemon.canMegaEvo;
			for (const ally of side.pokemon) {
				if (wasMega) {
					ally.canMegaEvo = null;
				} else {
					ally.canUltraBurst = null;
				}
			}

			pokemon.canMegaEvo = null;
			if (isUltraBurst) pokemon.canUltraBurst = null;
			this.runEvent('AfterMega', pokemon);
			return true;
		}

		// HP recovery support
		let oMaxHP = pokemon.maxhp;
		if( 0 == oMaxHP ) oMaxHP = 1;
		let currentHPProp = pokemon.hp / pokemon.maxhp;
		//console.log("pokemon.hp: "+ pokemon.hp.toString() +" pokemon.maxhp: "+pokemon.maxhp.toString());

		// Bitch and Beggar case
		let bitchSpecies = pokemon.canMegaEvo || pokemon.canUltraBurst;
		/**@type {Species} */
		// @ts-ignore
		const species = this.getMixedSpecies(pokemon.m.originalSpecies, bitchSpecies);
		
		// Update ability for slot
		let oSpecies = this.dex.getSpecies(pokemon.species);
		let oAbilitySlot = pokemon.calcActiveAbilitySlot();
		// @ts-ignore
		species.abilities = {'0': species.abilities[oAbilitySlot]};

		// Graphical volatiles
		// @ts-ignore
		pokemon.formeChange(species, pokemon.getItem(), true);
		// @ts-ignore
		this.add('-start', pokemon, this.dex.generateMegaStoneName(bitchSpecies), '[silent]');
		if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		}

		// Recover HP to maintain proportion
		let newMaxHP = species.baseStats.hp;
		if( 0 == newMaxHP ) newMaxHP = 1;
		if( newMaxHP != oMaxHP ) {
			let newMaxHP = Math.floor(Math.floor(2 * species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = Math.floor(currentHPProp * newMaxHP);
			pokemon.maxhp = Math.floor(newMaxHP);
			// Proportional HP remains the same so heal effect seems unnecessary
			//this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		}

		pokemon.canMegaEvo = null;
		if (isUltraBurst) pokemon.canUltraBurst = null;
		this.runEvent('AfterMega', pokemon);
		return true;
	},
	getMixedSpecies(originalForme, bitchForme) {
		//console.log("originalForme: "+ originalForme.toString());
		//console.log("bitchForme: "+ bitchForme.toString());
		let context = (typeof Dex != 'undefined') ? Dex : this.dex;
		let originalSpecies = context.getSpecies(originalForme);
		let bitchSpecies = context.getSpecies(bitchForme);
		/**@type {{abilities: SpeciesAbility, baseStats: {[k: string]: number}, weighthg: number, originalMega: string, requiredItem: string | undefined, type?: string, isMega?: boolean, isPrimal?: boolean}} */
		let deltas = {
			abilities: bitchSpecies.abilities,
			baseStats: bitchSpecies.baseStats,
			weighthg: bitchSpecies.weighthg,
			originalMega: bitchSpecies.name,
			requiredItem: bitchSpecies.id,
		};
		//console.log("bitch length: " + bitchSpecies.types.length );
		//console.log("beggar length: " + originalSpecies.types.length );
		if (bitchSpecies.types.length > originalSpecies.types.length) {
			deltas.type = bitchSpecies.types[1];
		} else if (bitchSpecies.types.length < originalSpecies.types.length) {
			deltas.type = (undefined !== originalSpecies.types[1]) ? originalSpecies.types[1] : originalSpecies.types[0];
		} else if ( (undefined !== bitchSpecies.types[1]) && (bitchSpecies.types[1] !== originalSpecies.types[1]) ) {
			deltas.type = bitchSpecies.types[1];
		}
		if (bitchSpecies.isMega) deltas.isMega = true;
		if (bitchSpecies.isPrimal) deltas.isPrimal = true;

		// @ts-ignore
		let species = this.doGetMixedSpecies(originalSpecies, deltas);
		return species;
	},
	doGetMixedSpecies(speciesOrForme, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let context = (typeof Dex != 'undefined') ? Dex : this.dex;
		if (!speciesOrForme || typeof speciesOrForme === 'string') speciesOrForme = context.getSpecies(speciesOrForme);
		let species = DexCalculator.deepClone(speciesOrForme);
		// Generate ability mapping: take bitch's ability for slot if it exists,
		// otherwise fallback to standard ability
		for (let abilityItr in species.abilities) {
			// @ts-ignore
			if (!species.abilities[abilityItr]) continue;
			
			console.log("Ability slot: "+ abilityItr.toString() +" replacing: "+ species.abilities[abilityItr] +" with: "+ deltas.abilities[abilityItr]);
			if(undefined !== deltas.abilities[abilityItr]) {
				// @ts-ignore
				species.abilities[abilityItr] = deltas.abilities[abilityItr];
			}
			else {
				// @ts-ignore
				species.abilities[abilityItr] = deltas.abilities['0'];
			}
		}
		if (species.types[0] === deltas.type) {
			species.types = [deltas.type];
		} else if (deltas.type) {
			species.types = [species.types[0], deltas.type];
		}
		let baseStats = species.baseStats;
		// @ts-ignore
		species.baseStats = {};
		for (let statName in baseStats) {
			// @ts-ignore
			species.baseStats[statName] = DexCalculator.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		species.weighthg = Math.max(1, species.weighthg + deltas.weighthg);
		species.originalMega = deltas.originalMega;
		species.requiredItem = deltas.requiredItem;
		if (deltas.isMega) species.isMega = true;
		if (deltas.isPrimal) species.isPrimal = true;
		return species;
	},
};
