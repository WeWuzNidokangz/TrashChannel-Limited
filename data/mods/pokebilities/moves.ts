export const Moves: {[k: string]: ModdedMoveData} = {
	gastroacid: {
		inherit: true,
		effect: {
			// Ability suppression implemented in Pokemon.ignoringAbility() within sim/pokemon.js
			onStart(pokemon) {
				this.add('-endability', pokemon);
				this.singleEvent('End', this.dex.getAbility(pokemon.ability), pokemon.abilityData, pokemon, pokemon, 'gastroacid');
				// @ts-ignore
				if (pokemon.m.innates) pokemon.m.innates.forEach(innate => pokemon.removeVolatile("ability:" + innate));
			},
		},
	},
};