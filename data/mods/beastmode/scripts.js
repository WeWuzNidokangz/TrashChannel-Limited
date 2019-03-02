'use strict';

const DexCalculator = require('../../sim/dex-calculator');

const POKEDEX = require('./../../data/pokedex');
const MODMOVES = require('./moves');

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		// Generate a beast mode move for every pokemon
		let beastModeBaseMove = this.data.Movedex['beastmodebase'];
		/**@type {Template} */
		let modMoveTemplate;
		for (let modMoveId in this.data.Pokedex) {
			//console.log('Generating beast mode move for Pokemon with modMoveId: '+ modMoveId);

			let modMove = DexCalculator.deepClone(beastModeBaseMove);
			modMoveTemplate = this.getTemplate(modMoveId);

			// Base move name on source Pokemon
			modMove.id = modMoveId;
			modMove.name = 'Beast Pact: ' + modMoveTemplate.name;

			// Make CAP and non-existent Pokemon into isNonstandard moves
			if(modMoveTemplate.num < 1) {
				modMove.isNonstandard = true;
			}

			this.data.Movedex[modMoveId] = modMove;

			//console.log('modMoveId: '+ this.data.Movedex[modMoveId].toString());
		}

		// Let every pokemon learn a beast mode move to transform into every other pokemon
		for (let userId in this.data.Pokedex) {
			//console.log('Adding beast mode move to Pokemon with userId: '+ userId);
			let pokemonLearnset = this.modData('Learnsets', userId);
			if( undefined === pokemonLearnset ) continue;

			for (let moveId in this.data.Pokedex) {
				//console.log('Adding beast mode moveId: '+ moveId);
				pokemonLearnset.learnset[moveId] = ['5L1'];
			}
		}
	},
};

exports.BattleScripts = BattleScripts;
