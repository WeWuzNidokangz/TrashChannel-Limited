export const Abilities: {[k: string]: ModdedAbilityData} = {
	powerofalchemy: {
		inherit: true,
		onAllyFaint(ally) {
			let pokemon = this.effectData.target;
			if (!pokemon.hp) return;
			let isAbility = pokemon.ability === 'powerofalchemy';
			/**@type {string[]} */
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities = possibleAbilities.concat(ally.m.innates);
			let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode'];
			bannedAbilities.push(pokemon.ability);
			if (pokemon.m.innates) bannedAbilities = bannedAbilities.concat(pokemon.m.innates);
			possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			let ability = this.dex.getAbility(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Power of Alchemy', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("abilitypowerofalchemy");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	receiver: {
		inherit: true,
		onAllyFaint(ally) {
			let pokemon = this.effectData.target;
			if (!pokemon.hp) return;
			let isAbility = pokemon.ability === 'receiver';
			/**@type {string[]} */
			let possibleAbilities = [ally.ability];
			if (ally.m.innates) possibleAbilities = possibleAbilities.concat(ally.m.innates);
			let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'wonderguard', 'zenmode'];
			bannedAbilities.push(pokemon.ability);
			if (pokemon.m.innates) bannedAbilities = bannedAbilities.concat(pokemon.m.innates);
			possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
			if (!possibleAbilities.length) return;
			let ability = this.dex.getAbility(possibleAbilities[this.random(possibleAbilities.length)]);
			this.add('-ability', pokemon, ability, '[from] ability: Receiver', '[of] ' + ally);
			if (isAbility) {
				pokemon.setAbility(ability);
			} else {
				pokemon.removeVolatile("ability:receiver");
				pokemon.addVolatile("ability:" + ability, pokemon);
			}
		},
	},
	trace: {
		inherit: true,
		onUpdate(pokemon) {
			if (!pokemon.isStarted) return;
			let isAbility = pokemon.ability === 'trace';
			/**@type {Pokemon[]} */
			let possibleTargets = [];
			for (let target of pokemon.side.foe.active) {
				if (target && !target.fainted) {
					possibleTargets.push(target);
				}
			}
			while (possibleTargets.length) {
				let rand = this.random(possibleTargets.length);
				let target = possibleTargets[rand];
				/**@type {string[]} */
				let possibleAbilities = [target.ability];
				if (target.m.innates) possibleAbilities = possibleAbilities.concat(target.m.innates);
				let bannedAbilities = ['battlebond', 'comatose', 'disguise', 'flowergift', 'forecast', 'illusion', 'imposter', 'multitype', 'powerconstruct', 'powerofalchemy', 'receiver', 'rkssystem', 'schooling', 'shieldsdown', 'stancechange', 'trace', 'zenmode'];
				bannedAbilities.push(pokemon.ability);
				if (pokemon.m.innates) bannedAbilities = bannedAbilities.concat(pokemon.m.innates);
				possibleAbilities = possibleAbilities.filter(val => !bannedAbilities.includes(val));
				if (!possibleAbilities.length) {
					possibleTargets.splice(rand, 1);
					continue;
				}
				let ability = this.dex.getAbility(this.sample(possibleAbilities));
				this.add('-ability', pokemon, ability, '[from] ability: Trace', '[of] ' + target);
				if (isAbility) {
					pokemon.setAbility(ability);
				} else {
					pokemon.removeVolatile("ability:trace");
					pokemon.addVolatile("ability:" + ability, pokemon);
				}
				return;
			}
		},
	},
};
