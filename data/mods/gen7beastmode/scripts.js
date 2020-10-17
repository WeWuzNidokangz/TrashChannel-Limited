'use strict';

const DexCalculator = require('../../../trashchannel/dex-calculator');

const POKEDEX = require('./../../pokedex');
const MODMOVES = require('./moves');

/**@type {ModdedBattleScriptsData} */
let Scripts = {
	inherit: 'gen7',
	init() {
		// Generate a beast mode move for every pokemon
		let beastModeBaseMove = this.data.Moves['beastmodebase'];
		/**@type {Species} */
		let modMoveSpecies;
		for (let modMoveId in this.data.Pokedex) {
			//console.log('Generating beast mode move for Pokemon with modMoveId: '+ modMoveId);

			let modMove = DexCalculator.deepClone(beastModeBaseMove);
			modMoveSpecies = this.getSpecies(modMoveId);

			// Base move name on source Pokemon
			modMove.id = modMoveId;
			modMove.name = 'Beast Pact: ' + modMoveSpecies.name;

			// Make CAP and non-existent Pokemon into isNonstandard moves
			if(modMoveSpecies.num < 1) {
				modMove.isNonstandard = true;
			}

			this.data.Moves[modMoveId] = modMove;

			//console.log('modMoveId: '+ this.data.Moves[modMoveId].toString());
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

exports.Scripts = Scripts;
