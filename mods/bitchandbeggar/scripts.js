'use strict';

const DexCalculator = require('../../sim/dex-calculator');

// 18/10/27 TrashChannel: Based on mixandmega/scripts.js

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		for (let id in this.data.Items) {
			let bitchTemplate = this.getTemplate(id);
			if (!bitchTemplate.exists) continue;
			this.modData('Items', id).onTakeItem = false;
		}
	},
	canMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return null;
		let bitchTemplate = this.getTemplate(pokemon.item);
		if (bitchTemplate.exists) { // Bitch and beggar
			return bitchTemplate.id;
		}
		
		// Regular mega evo case: have to copy and paste code from data/scripts.js for now
		let altForme = pokemon.baseTemplate.otherFormes && this.getTemplate(pokemon.baseTemplate.otherFormes[0]);
		let item = pokemon.getItem();
		if (altForme && altForme.isMega && altForme.requiredMove && pokemon.baseMoves.includes(toId(altForme.requiredMove)) && !item.zMove) return altForme.species;
		if (item.megaEvolves !== pokemon.baseTemplate.baseSpecies || item.megaStone === pokemon.species) {
			return null;
		}
		return item.megaStone;
	},
	runMegaEvo: function (pokemon) {
		if (pokemon.template.isMega || pokemon.template.isPrimal) return false;

		const isUltraBurst = !pokemon.canMegaEvo;
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce it here for now.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// Take care of regular megaevo case first (this.getTemplate(pokemon.canMegaEvo).exists is true on Mega Stones!)
		let item = pokemon.getItem();
		let isBeggarEvo = !pokemon.getItem().exists;

		//console.log( 'isBeggarEvo: '+ isBeggarEvo.toString() +' pokemon.canMegaEvo: '+ pokemon.canMegaEvo.toString() );
		if(!isBeggarEvo) {
			const templateid = pokemon.canMegaEvo || pokemon.canUltraBurst;
			if (!templateid) return false;

			pokemon.formeChange(templateid, pokemon.getItem(), true);

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
		console.log("pokemon.hp: "+ pokemon.hp.toString() +" pokemon.maxhp: "+pokemon.maxhp.toString());

		// Bitch and Beggar case
		let bitchSpecies = pokemon.canMegaEvo || pokemon.canUltraBurst;
		/**@type {Template} */
		// @ts-ignore
		const template = this.getMixedTemplate(pokemon.originalSpecies, bitchSpecies);
		
		// Update ability for slot
		let oTemplate = this.getTemplate(pokemon.template);
		let oAbilitySlot = '0'; // Fallback to standard ability if we're in a meta that allows illegal abilities
		for (let abilityItr in oTemplate.abilities) {
			console.log("Ability slot: "+ abilityItr.toString() +" mine: "+pokemon.ability.toString()+" theirs: "+toId(oTemplate.abilities[abilityItr]).toString());
			// @ts-ignore
			if(pokemon.ability !== toId(oTemplate.abilities[abilityItr])) continue;
			oAbilitySlot = abilityItr;
			break;
		}
		// @ts-ignore
		template.abilities = {'0': template.abilities[oAbilitySlot]};

		// Graphical volatiles
		// @ts-ignore
		pokemon.formeChange(template, pokemon.getItem(), true);
		this.add('-start', pokemon, bitchSpecies, '[silent]');
		if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
			this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
		}

		// Recover HP to maintain proportion
		let newMaxHP = template.baseStats.hp;
		if( 0 == newMaxHP ) newMaxHP = 1;
		if( newMaxHP != oMaxHP ) {
			let newMaxHP = Math.floor(Math.floor(2 * template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = Math.floor(currentHPProp * newMaxHP);
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		}

		pokemon.canMegaEvo = null;
		if (isUltraBurst) pokemon.canUltraBurst = null;
		this.runEvent('AfterMega', pokemon);
		return true;
	},
	getMixedTemplate: function (originalSpecies, bitchSpecies) {
		let context = (typeof Dex != 'undefined') ? Dex : this;
		let originalTemplate = context.getTemplate(originalSpecies);
		let bitchTemplate = context.getTemplate(bitchSpecies);
		/**@type {{abilities: TemplateAbility, baseStats: {[k: string]: number}, weightkg: number, originalMega: string, requiredItem: string | undefined, type?: string, isMega?: boolean, isPrimal?: boolean}} */
		let deltas = {
			abilities: bitchTemplate.abilities,
			baseStats: bitchTemplate.baseStats,
			weightkg: bitchTemplate.weightkg,
			originalMega: bitchTemplate.species,
			requiredItem: bitchTemplate.id,
		};
		//console.log("bitch length: " + bitchTemplate.types.length );
		//console.log("beggar length: " + originalTemplate.types.length );
		if (bitchTemplate.types.length > originalTemplate.types.length) {
			deltas.type = bitchTemplate.types[1];
		} else if (bitchTemplate.types.length < originalTemplate.types.length) {
			deltas.type = (undefined !== originalTemplate.types[1]) ? originalTemplate.types[1] : originalTemplate.types[0];
		} else if ( (undefined !== bitchTemplate.types[1]) && (bitchTemplate.types[1] !== originalTemplate.types[1]) ) {
			deltas.type = bitchTemplate.types[1];
		}
		if (bitchTemplate.isMega) deltas.isMega = true;
		if (bitchTemplate.isPrimal) deltas.isPrimal = true;

		// @ts-ignore
		let template = this.doGetMixedTemplate(originalTemplate, deltas);
		return template;
	},
	doGetMixedTemplate: function (template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let context = (typeof Dex != 'undefined') ? Dex : this;
		if (!template || typeof template === 'string') template = context.getTemplate(template);
		template = Object.assign({}, template);
		// Generate ability mapping: take bitch's ability for slot if it exists,
		// otherwise fallback to standard ability
		for (let abilityItr in template.abilities) {
			// @ts-ignore
			if (!template.abilities[abilityItr]) continue;
			
			console.log("Ability slot: "+ abilityItr.toString() +" replacing: "+ template.abilities[abilityItr] +" with: "+ deltas.abilities[abilityItr]);
			if(undefined !== deltas.abilities[abilityItr]) {
				// @ts-ignore
				template.abilities[abilityItr] = deltas.abilities[abilityItr];
			}
			else {
				// @ts-ignore
				template.abilities[abilityItr] = deltas.abilities['0'];
			}
		}
		if (template.types[0] === deltas.type) {
			template.types = [deltas.type];
		} else if (deltas.type) {
			template.types = [template.types[0], deltas.type];
		}
		let baseStats = template.baseStats;
		// @ts-ignore
		template.baseStats = {};
		for (let statName in baseStats) {
			// @ts-ignore
			template.baseStats[statName] = DexCalculator.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, 255);
		}
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		template.originalMega = deltas.originalMega;
		template.requiredItem = deltas.requiredItem;
		if (deltas.isMega) template.isMega = true;
		if (deltas.isPrimal) template.isPrimal = true;
		return template;
	},
};

exports.BattleScripts = BattleScripts;
