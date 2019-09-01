'use strict';

/**@type {{[k: string]: ModdedPureEffectData}} */
let BattleStatuses = {
	// This overrides the implementation of Arceus and Silvally's actual typing.
	// Their true typing for all their formes is set by the Camomons mechanic, and it's only
	// Multitype and RKS System, respectively, that changes their type.
	arceus: {
		name: 'Arceus',
		id: 'arceus',
		num: 493,
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed) return types;
			let camoDefaultTypes = [...new Set(pokemon.baseMoveSlots.slice(0, 2).map(move => this.getMove(move.id).type))];
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'multitype') {
				type = pokemon.getItem().onPlate;
				if (!type) {
					return camoDefaultTypes;
				}
			}
			return [type];
		},
	},
	silvally: {
		name: 'Silvally',
		id: 'silvally',
		num: 773,
		onTypePriority: 1,
		onType(types, pokemon) {
			if (pokemon.transformed) return types;
			let camoDefaultTypes = [...new Set(pokemon.baseMoveSlots.slice(0, 2).map(move => this.getMove(move.id).type))];
			/** @type {string | undefined} */
			let type = 'Normal';
			if (pokemon.ability === 'rkssystem') {
				type = pokemon.getItem().onMemory;
				if (!type) {
					return camoDefaultTypes;
				}
			}
			return [type];
		},
	},
};

exports.BattleStatuses = BattleStatuses;
