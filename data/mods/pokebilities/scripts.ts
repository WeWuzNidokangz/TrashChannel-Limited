import {toID} from './../../../sim/dex';

export const Scripts: ModdedBattleScriptsData = {
	getEffect(name) {
		if (name && typeof name !== 'string') {
			return name;
		}
		let id = toID(name);
		if (id.startsWith('ability:')) return Object.assign(Object.create(this.getAbility(id.slice(8))), {id});
		return Object.getPrototypeOf(this).getEffect.call(this, name, true);
	},
	suppressingWeather() {
		let pokemon;
		for (let i = 0; i < this.sides.length; i++) {
			for (let j = 0; j < this.sides[i].active.length; j++) {
				pokemon = this.sides[i].active[j];
				if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
					return true;
				}
			}
		}
		return false;
	},
	pokemon: {
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(ability => this.hasAbility(ability));
			ability = toID(ability);
			return this.ability === ability || !!this.volatiles['ability:' + ability];
		},
		transformInto(pokemon, effect) {
			let species = pokemon.species;
			if (pokemon.fainted || pokemon.illusion || (pokemon.volatiles['substitute'] && this.battle.gen >= 5)) {
				return false;
			}
			if (!species.abilities || (pokemon && pokemon.transformed && this.battle.gen >= 2) || (this.transformed && this.battle.gen >= 5)) {
				return false;
			}
			if (!this.formeChange(species)) {
				return false;
			}
			this.transformed = true;

			this.types = pokemon.types;
			this.addedType = pokemon.addedType;
			this.knownType = this.side === pokemon.side && pokemon.knownType;
			this.apparentType = pokemon.apparentType;

			// 19/08/18 TrashChannel: Previous code did nothing to stats
			for (let statName in this.storedStats) {
				if ('hp' === statName) continue;
				// @ts-ignore
				this.storedStats[statName] = pokemon.storedStats[statName];
				//console.log("new " + statName + ": " + this.storedStats[statName].toString() );
			}
			this.moveSlots = [];
			this.set.ivs = (this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs);
			this.hpType = (this.battle.gen >= 5 ? this.hpType : pokemon.hpType);
			this.hpPower = (this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower);
			for (let i = 0; i < pokemon.moveSlots.length; i++) {
				let moveData = pokemon.moveSlots[i];
				let moveName = moveData.move;
				if (moveData.id === 'hiddenpower') {
					moveName = 'Hidden Power ' + this.hpType;
				}
				this.moveSlots.push({
					move: moveName,
					id: moveData.id,
					pp: moveData.maxpp === 1 ? 1 : 5,
					maxpp: this.battle.gen >= 5 ? (moveData.maxpp === 1 ? 1 : 5) : moveData.maxpp,
					target: moveData.target,
					disabled: false,
					used: false,
					virtual: true,
				});
			}
			for (let j in pokemon.boosts) {
				// @ts-ignore
				this.boosts[j] = pokemon.boosts[j];
			}
			if (effect) {
				this.battle.add('-transform', this, pokemon, '[from] ' + effect.fullname);
			} else {
				this.battle.add('-transform', this, pokemon);
			}
			this.setAbility(pokemon.ability, this, true);
			// @ts-ignore
			if (this.innates) {
				// @ts-ignore
				for (let innate of this.innates) {
					this.removeVolatile('ability:' + innate);
				}
			}
			if (pokemon.m.innates) {
				for (let innate of pokemon.m.innates) {
					this.addVolatile('ability:' + innate, this);
				}
			}
			return true;
		},
	},
};
