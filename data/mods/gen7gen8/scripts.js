'use strict';

const DexCalculator = require('../../../trashchannel/dex-calculator');

const DynamaxStatBonus = 0.5;
const DynamaxTurnDuration = 3;

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	canMegaEvo(pokemon) {
		const side = pokemon.side;

		let bHasUsedDynamax = false;
		for (const ally of side.pokemon) {
			if(!ally.m.hasDynamaxed) continue;
			bHasUsedDynamax = true;
			break;
		}

		if (bHasUsedDynamax) return null;

		return "Dynamax Band Thingy";
	},
	runMegaEvo(pokemon) {
		const side = pokemon.side;

		// Pokémon affected by Sky Drop cannot Mega Evolve. Enforce on Dynamax as well.
		for (const foeActive of side.foe.active) {
			if (foeActive.volatiles['skydrop'] && foeActive.volatiles['skydrop'].source === pokemon) {
				return false;
			}
		}

		// HP recovery support
		let oMaxHP = pokemon.maxhp;
		if( 0 == oMaxHP ) oMaxHP = 1;
		let currentHPProp = pokemon.hp / pokemon.maxhp;
		//console.log("pokemon.hp: "+ pokemon.hp.toString() +" pokemon.maxhp: "+pokemon.maxhp.toString());

		// Dynamax case
		let oTemplate = this.getTemplate(pokemon.template);
		/**@type {Template} */
		// @ts-ignore
		const template = this.getMixedTemplate(pokemon.m.originalSpecies, pokemon.ability);

		// Messages
		this.add('message', pokemon.name + ' is reacting to the Dynamax Band thingy...');

		// Graphical volatiles
		// @ts-ignore
		pokemon.formeChange(template, 'Dynamax', true);
		// @ts-ignore
		//this.add('-start', pokemon, 'Dynamax', '[silent]');

		// Update Dynamax status
		pokemon.m.isDynamax = true;
		pokemon.m.hasDynamaxed = true;
		pokemon.m.remainingDynamaxTurns = DynamaxTurnDuration;

		// Recover HP to maintain proportion
		let newMaxHP = template.baseStats.hp;
		if( 0 == newMaxHP ) newMaxHP = 1;
		if( newMaxHP != oMaxHP ) {
			let newMaxHP = Math.floor(Math.floor(2 * template.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100) * pokemon.level / 100 + 10);
			pokemon.hp = Math.floor(currentHPProp * newMaxHP);
			pokemon.maxhp = Math.floor(newMaxHP);
			// Proportional HP remains the same so heal effect seems unnecessary
			//this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		}

		/**@type {Partial<PureEffect>} */
		let effect = {
			duration: 4,
			onEnd(target) {
				this.add('-start', target, 'perish0');
				target.faint();
			},
			onResidualOrder: 20,
			onResidual(pokemon) {
				//this.add('-start', pokemon, 'Dynamax', '[silent]');
				let duration = pokemon.volatiles['perishsong'].duration;
				this.add('-start', pokemon, 'perish' + duration);
			},
			onSwitchOut(pokemon) {
				/*let typeMod = this.clampIntRange(pokemon.runEffectiveness(this.getActiveMove('stealthrock')), -6, 6);
				this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);*/
			},
		};

		// Messages
		this.add('message', pokemon.name + ' became BIG AF!!');

		pokemon.canMegaEvo = null;
		this.runEvent('AfterMega', pokemon);
		return true;
	},
	getMixedTemplate(originalSpecies, abilityId) {
		//console.log("originalSpecies: "+ originalSpecies.toString());
		let context = (typeof Dex != 'undefined') ? Dex : this;
		let originalTemplate = context.getTemplate(originalSpecies);

		/**@type {StatsTable} */
		let newBaseStats = originalTemplate.baseStats;
		for (let statName in newBaseStats) {
			// @ts-ignore
			newBaseStats[statName] = this.clampIntRange(DynamaxStatBonus * newBaseStats[statName], 1, DynamaxStatBonus * 255);
		}

		/**@type {{ability: string, baseStats: {[k: string]: number}, weightkg: number}} */
		let deltas = {
			ability: abilityId,
			baseStats: newBaseStats,
			weightkg: DynamaxStatBonus * originalTemplate.weightkg,
		};

		// @ts-ignore
		let template = this.doGetMixedTemplate(originalTemplate, deltas);
		return template;
	},
	doGetMixedTemplate(template, deltas) {
		if (!deltas) throw new TypeError("Must specify deltas!");
		let context = (typeof Dex != 'undefined') ? Dex : this;
		if (!template || typeof template === 'string') template = context.getTemplate(template);
		template = DexCalculator.deepClone(template);
		// @ts-ignore
		template.abilities = {'0': deltas.ability};

		let baseStats = template.baseStats;
		// @ts-ignore
		template.baseStats = {};
		for (let statName in baseStats) {
			// @ts-ignore
			template.baseStats[statName] = DexCalculator.clampIntRange(baseStats[statName] + deltas.baseStats[statName], 1, DynamaxStatBonus * 255);
		}
		// @ts-ignore
		template.weightkg = Math.max(0.1, template.weightkg + deltas.weightkg);
		return template;
	},
};

exports.BattleScripts = BattleScripts;
