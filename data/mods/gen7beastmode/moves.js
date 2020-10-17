'use strict';

// Needed to implement the beast mode transformation
const BeastModeTeams = require('./random-teams');
/** @type {typeof import('../../../sim/pokemon').Pokemon} */
const Pokemon = require(/** @type {any} */ ('../../../.sim-dist/pokemon')).Pokemon;
const DexCalculator = require('../../../trashchannel/dex-calculator');

/** @type {{[k: string]: ModdedMoveData}} */
let Moves = {
	"beastmodebase": {
		accuracy: true,
		basePower: 0,
		category: "Special",
		desc: "Change forme by making a pact with the named Pokemon!",
		shortDesc: "Go BEA5T M0D3!",
		id: "beastmodebase",
		name: "Beast Mode Base",
		infiltrates: true,
		// It seems that isNonstandard moves using Custom can't pass the validator
		//isNonstandard: "Custom",
		pp: 5,
		noPPBoosts: true,
		priority: 6,
		breaksProtect: true,
		onTryMove: function () {
			//throw new Error(`Reached beast mode!`);
			this.attrLastMove('[still]');
		},
		onPrepareHit: function (target, source) {
			this.add('-anim', source, 'Howl', source);
			this.add('-anim', source, 'Boomburst', source);
		},
		onHit: function (target, source, move) {
			// HP recovery support
			let oMaxHP = source.maxhp;
			if( 0 == oMaxHP ) oMaxHP = 1;
			let currentHPProp = source.hp / source.maxhp;
			console.log("source.hp: "+ source.hp.toString() +" source.maxhp: "+source.maxhp.toString());

			// Generate new beast mode species for this move
			const generator = new BeastModeTeams('gen7randombattle', this.prng);
			let set = generator.beastModeTransformation(move.id, source);
			source.formeChange(set.species, source.getItem(), false);

			// Copy evs/ivs
			for (let i in set.evs) {
				// @ts-ignore
				source.set.evs[i] = DexCalculator.clampIntRange(set.evs[i], 0, 255);
			}
			for (let i in set.ivs) {
				// @ts-ignore
				source.set.ivs[i] = DexCalculator.clampIntRange(set.ivs[i], 0, 31);
			}
			let hpData = this.getHiddenPower(set.ivs);
			/**@type {string} */
			source.hpType = hpData.type;
			/**@type {number} */
			source.hpPower = hpData.power;

			// Overwrite moves
			source.moveSlots = [];
			for (let newMove of set.moves) {
				let moveTemplate = this.getMove(newMove);
				if (source.moves.includes(moveTemplate.id)) continue;
				source.moveSlots.push({
					move: moveTemplate.name,
					id: moveTemplate.id,
					pp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? moveTemplate.pp : moveTemplate.pp * 8 / 5),
					maxpp: ((moveTemplate.noPPBoosts || moveTemplate.isZ) ? moveTemplate.pp : moveTemplate.pp * 8 / 5),
					target: moveTemplate.target,
					disabled: false,
					disabledSource: '',
					used: false,
				});
			}

			// Recover HP to maintain proportion
			let pokemonSpecies = source.species;
			let newMaxHP = pokemonSpecies.baseStats.hp;
			if( 0 == newMaxHP ) newMaxHP = 1;
			if( newMaxHP != oMaxHP ) {
				let newMaxHP = Math.floor(Math.floor(2 * pokemonSpecies.baseStats.hp + source.set.ivs['hp'] + Math.floor(source.set.evs['hp'] / 4) + 100) * source.level / 100 + 10);
				source.hp = Math.floor(currentHPProp * newMaxHP);
				this.add('-heal', source, source.getHealth, '[silent]');
			}

			this.add('message', `${source.name} went BEA5T M0D3!`);
		},
		flags: {mirror: 1, snatch: 1, authentic: 1},
		ignoreAbility: true,
		secondary: null,
		dontShowUseMoveMessage: true,
		target: "normal",
		type: "Fairy",
	},
};

exports.Moves = Moves;