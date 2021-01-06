// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

import {toID} from './../sim/dex';

export const Formats: FormatList = [

	// Random Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Random Mashups",
	},
	{ // 19/11/30: It is automatically generating teams from Gen 8 so call it Gen 8 for now
		name: "[Gen 8] Suicide Cup: Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to end their lives in a quick and humane manner.`,
		threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
        ],

		mod: 'suicidecup',
		forcedLevel: 100,
		team: 'randomSC',
		ruleset: ['PotD', 'Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause'],
	},
	{
		name: "[Gen 8] Mix and Mega: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with mega stones (and they know how to use 'em!)`,

		mod: 'mixandmega',
		team: 'randomHCMnM',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin() {
            for (const pokemon of this.getAllPokemon()) {
                pokemon.m.originalSpecies = pokemon.baseSpecies.name;
            }
        },
        onSwitchIn(pokemon) {
            // @ts-ignore
            const oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
            if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
                // Place volatiles on the Pokémon to show its mega-evolved condition and details
                this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
                const oSpecies = this.dex.getSpecies(pokemon.m.originalSpecies);
                if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
                    this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
                }
            }
        },
        onSwitchOut(pokemon) {
            // @ts-ignore
            const oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
            if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
                this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
            }
        },
	},
	{
		name: "[Gen 8] Partners in Crime: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon where both active ally Pok&eacute;mon share dumb abilities and moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		mod: 'pic',
		gameType: 'doubles',
		team: 'randomHCPiC',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		onBeforeSwitchIn(pokemon) {
			for (const side of this.sides) {
				if (side.active.every(ally => ally && !ally.fainted)) {
					let pokeA = side.active[0], pokeB = side.active[1];
					if (pokeA.ability !== pokeB.ability) {
						const pokeAInnate = 'ability:' + pokeB.ability;
						pokeA.volatiles[pokeAInnate] = {id: toID(pokeAInnate), target: pokeA};
						const pokeBInnate = 'ability:' + pokeA.ability;
						pokeB.volatiles[pokeBInnate] = {id: toID(pokeBInnate), target: pokeB};
					}
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	{
		name: "[Gen 8] Pokebilities: Random Battle (Beta)",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with all of their released Abilities simultaneously.`,

		mod: 'pokebilities',
		team: 'randomPokebilities',
		ruleset: ['[Gen 8] OU'],
		onBegin() {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let pokemon of allPokemon) {
				if (pokemon.ability === toID(pokemon.species.abilities['S'])) {
					continue;
				}
				// @ts-ignore
				pokemon.m.innates = Object.keys(pokemon.species.abilities).filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden)).map(key => toID(pokemon.species.abilities[key])).filter(ability => ability !== pokemon.ability);
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			// @ts-ignore
			if (pokemon.m.innates) pokemon.m.innates.forEach(innate => pokemon.addVolatile("ability:" + innate, pokemon));
		},
		onAfterMega(pokemon) {
			Object.keys(pokemon.volatiles).filter(innate => innate.startsWith('ability:')).forEach(innate => pokemon.removeVolatile(innate));
			pokemon.m.innates = undefined;
		},
	},
	{
		name: "[Gen 8] Trademarked: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with random trademarks.`,

		mod: 'gen8',
		team: 'randomHCTM',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		pokemon: {
			getAbility() {
				const move = this.battle.dex.getMove(toID(this.ability));
				if (!move.exists) return Object.getPrototypeOf(this).getAbility.call(this);
				return {
					id: move.id,
					name: move.name,
					onStart(pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.useMove(move, pokemon);
					},
					toString() {
						return "";
					},
				};
			},
		},
	},

	// Mashups Spotlight
	///////////////////////////////////////////////////////////////////
	{
		section: "Mashups Spotlight",
		column: 1,
	},
    {
        name: "[Gen 8] Tier Shift AAA",
        desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users. Those below OU get all their stats, excluding HP, boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Tier Shift AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3662165/">Vanilla Tier Shift</a>`
        ],

        mod: 'gen8',
        ruleset: [
            '[Gen 8] OU', 'Overflow Stat Mod', 'Tier Shift Rule', '2 Ability Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Archeops', 'Arctovish', 'Regigigas', 'Shedinja', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy',
			'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword',
			'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple',
			'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Damp Rock', 'Eviolite', 'Heat Rock', 'Light Ball',
        ],
		unbanlist: [
			'Zamazenta-Crowned',
		],
    },

	// Official OM Mashups
	///////////////////////////////////////////////////////////////////
	{
		section: "Official OM Mashups (Singles)",
		column: 1,
	},
    {
        name: "[Gen 8] Almost Any Ability Ubers",
        desc: `Pok&eacute;mon can use almost any ability in an Ubers environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675589/">Vanilla Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675564/">Vanilla Ubers Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675194/">Vanilla Ubers Viability Rankings</a>`
        ],

        mod: 'gen8',
        ruleset: [
            'Standard', 'Dynamax Clause', '2 Ability Clause', 'Dynamax Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Calyrex-Shadow', 'Shedinja', 'Urshifu-Base', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat',
			'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost',
			'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass',
        ],
    },
    {
        name: "[Gen 8] CAAAmomons",
        desc: `Pok&eacute;mon can use almost any ability and will be the typing of their first two moves.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] CAAAmomons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656413/">Vanilla Camomons</a>`
        ],

        mod: 'gen8',
        ruleset: [
            'Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Camomons Rule', '2 Ability Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Archeops', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dragonite', 'Eternatus', 'Genesect', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem', 'Lugia', 'Lunala', 'Marshadow',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shedinja',
			'Solgaleo', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zygarde-Base', 'Arena Trap',
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion',
			'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Power Construct',
			'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Baton Pass',
        ],
    },
    {
        name: "[Gen 8] STAAABmons OUBL (UUBERS)",
        desc: `(No description)`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STAAABmons OUBL (UUBERS) Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656429/">Vanilla STABmons</a>`
        ],

        mod: 'gen8',
        ruleset: [
            'Standard', 'STABmons Move Legality', 'Dynamax Clause', '2 Ability Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Eternatus', 'Genesect', 'Giratina', 'Groudon', 'Ho-Oh',
			'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Landorus-Base', 'Lugia', 'Lunala', 'Mamoswine',
			'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Reshiram',
			'Shedinja', 'Silvally', 'Thundurus-Base', 'Xerneas', 'Yveltal', 'Zekrom', 'Zygarde-Base', 'Arena Trap',
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion',
			'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Power Construct',
			'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'King\'s Rock', 'Baton Pass', 'Hypnosis', 'Sing', 'Sleep Powder',
        ],
		restricted: [
			'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend',
			'Geomancy', 'Lovely Kiss', 'No Retreat', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'Transform',
			'V-create', 'Wicked Blow',
		],
    },
    {
        name: "[Gen 8] STAAABmons",
        desc: `Pok&eacute;mon can use almost any ability and any move of their typing.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656429/">Vanilla STABmons</a>`
        ],

        mod: 'gen8',
        ruleset: [
            'Standard', 'STABmons Move Legality', 'Dynamax Clause', '2 Ability Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Archeops', 'Blacephalon', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chandelure', 'Dialga', 'Dragapult', 'Dragonite',
			'Eternatus', 'Genesect', 'Giratina', 'Groudon', 'Ho-Oh', 'Kartana', 'Keldeo', 'Kyogre',
			'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shedinja',
			'Silvally', 'Solgaleo', 'Tapu Koko', 'Terrakion', 'Thundurus', 'Urshifu-Base', 'Volcarona', 'Xerneas',
			'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zeraora', 'Zygarde-Base', 'Zygarde-Complete', 'Arena Trap',
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion',
			'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Power Construct',
			'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost', 'Stakeout', 'Tinted Lens', 'Water Bubble',
			'Wonder Guard', 'King\'s Rock', 'Baton Pass', 'Electrify', 'Hypnosis', 'Sing', 'Sleep Powder',
        ],
		restricted: [
			'Acupressure', 'Astral Barrage', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Extreme Speed', 'Fishious Rend', 'Geomancy',
			'Glacial Lance', 'Lovely Kiss', 'No Retreat', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'Transform',
			'V-create', 'Wicked Blow',
		],
    },
    {
        name: "[Gen 8] STABmons Ubers",
        desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in an Ubers environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675589/">Vanilla Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675564/">Vanilla Ubers Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3675194/">Vanilla Ubers Viability Rankings</a>`
        ],

        mod: 'gen8',
        ruleset: [
            'Standard', 'Dynamax Clause', 'STABmons Move Legality', 'Dynamax Clause',
        ],
        banlist: [
            'King\'s Rock', 'Razor Fang', 'Baton Pass',
        ],
		restricted: [
			'Acupressure', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy',
			'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'V-create', 'Wicked Blow',
		],
    },
    {
        name: "[Gen 8] STABmons Mix and Mega",
        desc: `Pok&eacute;mon can use any move of their typing and mega evolve with any stone to gain the respective boosts.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Mix and Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656469/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3659028/">Vanilla M&amp;M Resources</a>`
        ],

        mod: 'mixandmega',
        ruleset: [
            'Obtainable', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod',
			'Overflow Stat Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'Mix and Mega Standard Package', 'STABmons Move Legality',
        ],
        banlist: [
            'Calyrex-Shadow', 'Kyogre', 'Zacian-Crowned', 'Moody', 'Shadow Tag', 'Beedrillite', 'Blazikenite', 'Gengarite',
			'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Baton Pass', 'Electrify',
        ],
		restricted: [
			'Calyrex-Ice', 'Dialga', 'Eternatus', 'Gengar', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyurem-Black',
			'Kyurem-White', 'Lugia', 'Lunala', 'Mamoswine', 'Marshadow', 'Melmetal', 'Mewtwo', 'Naganadel',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Regigigas', 'Reshiram', 'Xerneas', 'Yveltal',
			'Zacian', 'Zekrom', 'Zygarde-Base', 'Zygarde-Complete', 'Acupressure', 'Belly Drum', 'Bolt Beak', 'Boomburst',
			'Double Iron Bash', 'Extreme Speed', 'Fishious Rend', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore',
			'Thousand Arrows', 'Transform', 'V-create', 'Wicked Blow',
		],
    },
	{
		section: "Official OM Mashups (Doubles)",
		column: 1,
	},
    {
        name: "[Gen 8] Almost Any Ability Doubles",
        desc: `Pok&eacute;mon can use almost any ability in a Doubles environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672010/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
        ],

        mod: 'gen8',
		gameType: 'doubles',
        ruleset: [
            'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', '2 Ability Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'DUber', 'Dracovish', 'Dracozolt', 'Kartana', 'Kyurem-Black', 'Marshadow', 'Regigigas', 'Shedinja',
			'Anger Point', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Gorilla Tactics', 'Huge Power',
			'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero', 'Moody', 'Neutralizing Gas',
			'Parental Bond', 'Power Construct', 'Protean', 'Pure Power', 'Rattled', 'Serene Grace', 'Shadow Tag', 'Simple',
			'Soul-Heart', 'Speed Boost', 'Stakeout', 'Steam Engine', 'Water Bubble', 'Wonder Guard',
        ],
    },
    {
        name: "[Gen 8] Balanced Hackmons Doubles",
        desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Balanced Hackmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661142/">Vanilla Doubles Ubers</a>`
        ],

        mod: 'gen8',
		gameType: 'doubles',
        ruleset: [
            'Standard Doubles', 'Forme Clause', '!Gravity Sleep Clause', '!Obtainable Abilities', '!Obtainable Moves', '!Obtainable Misc', '!Species Clause',
        ],
        banlist: [
            'Comatose + Sleep Talk', 'Shedinja', 'Anger Point', 'Arena Trap', 'Contrary', 'Gorilla Tactics', 'Huge Power', 'Illusion',
			'Innards Out', 'Justified', 'Libero', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power',
			'Rattled', 'Shadow Tag', 'Soul-Heart', 'Stakeout', 'Stamina', 'Steam Engine', 'Wandering Spirit', 'Water Bubble',
			'Wonder Guard', 'Double Iron Bash', 'Octolock',
        ],
    },
    {
        name: "[Gen 8] Camomons Doubles",
        desc: `Pok&eacute;mon change type to match their first two moves in a Doubles environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Camomons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672010/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
        ],

        mod: 'gen8',
		gameType: 'doubles',
        ruleset: [
            'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', 'Camomons Rule', '!Sleep Clause Mod',
        ],
        banlist: [
            'DUber', 'Calyrex-Ice', 'Calyrex-Shadow', 'Dialga', 'Dragonite', 'Eternatus', 'Genesect', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kartana', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala',
			'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram', 'Shedinja',
			'Solgaleo', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom', 'Zygarde-Base', 'Moody',
			'Power Construct', 'Shadow Tag', 'Baton Pass',
        ],
    },
    {
        name: "[Gen 8] STABmons Doubles",
        desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3672010/">Vanilla Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658826/">Vanilla Doubles OU Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3673519/">Vanilla Doubles OU Viability Rankings</a>`
        ],

        mod: 'gen8',
		gameType: 'doubles',
        ruleset: [
            'Standard Doubles', 'Dynamax Clause', 'Swagger Clause', 'STABmons Move Legality',
        ],
        banlist: [
            'DUber', 'Blissey', 'Chansey', 'Shedinja', 'Silvally', 'Snorlax', 'Power Construct', 'Shadow Tag',
			'Swift Swim',
        ],
		restricted: [
			'Acupressure', 'Belly Drum', 'Bolt Beak', 'Decorate', 'Diamond Storm', 'Double Iron Bash', 'Fishious Rend', 'Geomancy',
			'Glacial Lance', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows',
		],
    },
	{
		section: "Official OM Mashups (Little Cup)",
		column: 1,
	},
    {
        name: "[Gen 8] Almost Any Ability Little Cup",
        desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Little Cup environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Almost Any Ability Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
        ],

        mod: 'gen8',
		maxLevel: 5,
        ruleset: [
            'Little Cup', 'Standard', 'Dynamax Clause', '!Obtainable Abilities',
        ],
        banlist: [
            'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Gastly', 'Rufflet', 'Scyther', 'Sneasel', 'Swirlix',
			'Tangela', 'Vulpix-Alola', 'Arena Trap', 'Chlorophyll', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat',
			'Gorilla Tactics', 'Huge Power', 'Ice Scales', 'Illusion', 'Imposter', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Simple', 'Speed Boost',
			'Stakeout', 'Water Bubble', 'Wonder Guard', 'Baton Pass',
        ],
    },
    {
        name: "[Gen 8] Balanced Hackmons Little Cup",
        desc: `Pok&eacute;mon can use anything that can be hacked in-game and is usable in local battles is allowed in a Little Cup environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Balanced Hackmons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
        ],

        mod: 'gen8',
		maxLevel: 5,
        ruleset: [
            'Little Cup', 'Standard', 'Dynamax Clause', '!Obtainable',
        ],
        banlist: [
            'Comatose + Sleep Talk', 'Nonexistent', 'Past', 'Cutiefly', 'Scyther', 'Sneasel', 'Tangela', 'Type: Null',
			'Arena Trap', 'Contrary', 'Gorilla Tactics', 'Huge Power', 'Illusion', 'Innards Out', 'Intrepid Sword', 'Libero',
			'Magnet Pull', 'Moody', 'Neutralizing Gas', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Stakeout',
			'Water Bubble', 'Wonder Guard', 'Baton Pass',
        ],
		unbanlist: [
			'Chlorophyll',
		],
    },
    {
        name: "[Gen 8] Camomons Little Cup",
        desc: `Pok&eacute;mon change type to match their first two moves in a Little Cup environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] Camomons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
        ],

        mod: 'gen8',
		maxLevel: 5,
        ruleset: [
            'Little Cup', 'Standard', 'Dynamax Clause', 'Camomons Rule',
        ],
        banlist: [
            'Calyrex-Ice', 'Calyrex-Shadow', 'Corsola-Galar', 'Cutiefly', 'Darmanitan-Galar', 'Dialga', 'Dragonite', 'Drifloon',
			'Eternatus', 'Gastly', 'Genesect', 'Giratina', 'Gothita', 'Groudon', 'Ho-Oh', 'Kartana',
			'Kyogre', 'Kyurem', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Rayquaza', 'Reshiram', 'Rufflet', 'Scyther', 'Shedinja', 'Sneasel', 'Solgaleo',
			'Swirlix', 'Tangela', 'Vulpix-Alola', 'Xerneas', 'Yveltal', 'Zacian', 'Zamazenta', 'Zekrom',
			'Zygarde-Base', 'Chlorophyll', 'Moody', 'Power Construct', 'Baton Pass',
        ],
    },
    {
        name: "[Gen 8] STABmons Little Cup",
        desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Little Cup environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3657159/#post-8299984">[Gen 8] STABmons Little Cup Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3656348/">Vanilla LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3661419/">Vanilla LC Sample Teams</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657374/">Vanilla LC Viability Rankings</a>`
        ],

        mod: 'gen8',
		maxLevel: 5,
        ruleset: [
            'Little Cup', 'Standard', 'Dynamax Clause', 'STABmons Move Legality',
        ],
        banlist: [
            'Corsola-Galar', 'Cutiefly', 'Drifloon', 'Gastly', 'Gothita', 'Rufflet', 'Scyther', 'Sneasel',
			'Swirlix', 'Tangela', 'Vulpix-Alola', 'Chlorophyll', 'Moody', 'Baton Pass',
        ],
		restricted: [
			'Acupressure', 'Belly Drum', 'Bolt Beak', 'Double Iron Bash', 'Electrify', 'Extreme Speed', 'Fishious Rend', 'Geomancy',
			'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', 'V-create', 'Wicked Blow',
		],
    },

	// Other OM Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Other Mashups",
	},
	{
		section: "US/UM Official OM Mashups (Singles)",
	},
	{
		name: "[Gen 7] Pure Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, with no bans or clauses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/pure-hackmons-introduction">Pure Hackmons Introduction</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/page-4#post-7866923">Pure Hackmons Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/old-generations-of-hackmons-megathread.3649618/">Pure Hackmons Old Gens Megathread</a>`,
		],

		mod: 'gen7',
		ruleset: ['-Nonexistent', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Mix and Mega Anything Goes",
		desc: `Mega Stones and Primal Orbs can be used on any Pok&eacute;mon with no Mega Evolution limit, and no bans or clauses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">MnM AG Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587441/">Vanilla Anything Goes</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Gen 7 Mix and Mega Battle Effects'],
		restricted: ['Ultranecrozium Z'],
	},
	{
		name: "[Gen 7] Almost Any Ability Ubers",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">AAA Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: ['Necrozma-Dusk-Mane', 'Shedinja'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Arena Trap', 'Shadow Tag', // For Ubers
		],
	},
	{
		name: "[Gen 7] CAAAmomons",
		desc: `Pok&eacute;mon change type to match their first two moves, and can use any ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">CAAAmomons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Camomons Rule', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Kartana', 'Kyurem-Black', 'Latias-Mega', 'Shedinja', 'Kommonium Z', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 
			'Innards Out', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Keldeo', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile'
		],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		minSourceGen: 8,
	},
	{
		name: "[Gen 7] STABmons Ubers",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STABmons Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'STABmons Move Legality'],
		banlist: ['Arceus', 'Komala', 'Kangaskhan-Mega'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] STAAABmons",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, and learn any move of their type, apart from those restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Archeops', 'Blacephalon', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Komala', 'Kyurem-Black', 'Regigigas', 'Shedinja',
			'Silvally', 'Slaking', 'Tapu Koko', 'Terrakion', 'Thundurus-Base', 'Thundurus-Therian', 'King\'s Rock', 'Razor Fang', // STABmons
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', // AAA
		],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] STAB n Mega",
		desc: `Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit, and Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STAB n Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Standard', 'Gen 7 Mix and Mega Standard Package', 'STABmons Move Legality', 'Mega Rayquaza Clause'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // Mix and Mega
			'King\'s Rock', 'Razor Fang', // STABmons
			'Arceus', 'Kangaskhanite', // STAB n Mega
		],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows',
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom', // Mix and Mega
			'Blacephalon', 'Kartana', 'Silvallly', 'Tapu Koko', 'Tapu Lele', // STAB n Mega
		],
	},
	{
		section: "US/UM Official OM Mashups (Doubles)",
	},
	{
		name: "[Gen 7] Balanced Hackmons Doubles",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, in a doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Balanced Hackmons Doubles Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk'],
	},
	{
		name: "[Gen 7] Almost Any Ability Doubles",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Doubles environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Almost Any Ability Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', // Doubles AAA
		],
		restrictedAbilities: [
			'Anger Point', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Justified', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Shadow Tag', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	/*{
		name: "[Gen 7] Mix and Mega Doubles",
		desc: `Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit, in a Doubles setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Mix and Mega Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7mixandmega',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'Gen 7 Mix and Mega Standard Package', 'Mega Rayquaza Clause'],
		banlist: [
			'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles
			'Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // MnM
		],
		restricted: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Snorlax', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		onBegin() {
			if (this.rated && this.format.id === 'gen8nationaldex') this.add('html', `<div class="broadcast-red"><strong>National Dex is currently suspecting Genesect! For information on how to participate check out the <a href="https://www.smogon.com/forums/threads/3659573/">suspect thread</a>.</strong></div>`);
		},
	},*/
	{
		name: "[Gen 7] STABmons Doubles",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Doubles setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">STABmons Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Obtainable', 'Standard Doubles', 'Swagger Clause', 'STABmons Move Legality'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Drizzle', 'Komala', 'Shedinja', 'Silvally', // STABmons Doubles
		],
		restricted: ['Chatter', 'Diamond Storm', 'Geomancy', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
	},
	{
		section: "US/UM Official OM Mashups (Little Cup)",
	},
	{
		name: "[Gen 7] Balanced Hackmons LC",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed, in a Little Cup setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">Balanced Hackmons LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		maxLevel: 5,
		ruleset: ['-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Little Cup'],
		banlist: [
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Arena Trap', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Chatter', 'Comatose + Sleep Talk',  // Balanced Hackmons
			'Gligar', 'Scyther', 'Sneasel', 'Type: Null', // Balanced Hackmons LC
		],
	},
	{
		name: "[Gen 7] Almost Any Ability LC",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in a Little Cup setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">Almost Any Ability LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		maxLevel: 5,
		ruleset: ['Obtainable', 'Standard', 'Swagger Clause', 'Little Cup', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Aipom', 'Cutiefly', 'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Tangela', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Archen', // Almost Any Ability LC
		],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', // AAA
			'Arena Trap', 'Shadow Tag', // Almost Any Ability LC
		],
	},
	{
		name: "[Gen 7] STABmons LC",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in a Little Cup environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802590">STABmons LC Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">Vanilla LC Metagame Discussion</a>`,
		],

		mod: 'gen7',
		maxLevel: 5,
		ruleset: ['Obtainable', 'Standard', 'Swagger Clause', 'Little Cup', 'STABmons Move Legality'],
		banlist: [
			'Aipom', 'Cutiefly', 'Drifloon', 'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Torchic', 'Vulpix-Base', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Shadow Tag', // STABmons LC
		],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] Mix and Mega LC",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'gen7mixandmega',
		maxLevel: 5,
		ruleset: ['Obtainable', 'Standard', 'Little Cup', 'Gen 7 Mix and Mega Standard Package'],
		banlist: ['Eevium Z', 'Baton Pass', 'Dragon Rage', 'Electrify', 'Sonic Boom'],
		restricted: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Dratini', 'Gligar', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix',
		],
	},
	{
		section: "US/UM Other Mashups",
	},
	{
		name: "[Gen 7] Mix and Mega Tier Shift",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit, and Pokemon get a +10 boost to each stat per tier below OU they are in. UU gets +10, RU +20, NU +30, and PU +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Vanilla Tier Shift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'gen7mixandmega',
		ruleset: ['Obtainable', 'Standard', 'Gen 7 Mix and Mega Standard Package', 'Tier Shift Rule', 'Mega Rayquaza Clause'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restricted: [
			'Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
	},
	{
		name: "[Gen 7] STAAABmons RU",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, and learn any move of their type, apart from those restricted to their natural users, in an RU environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">OU STAAABmons Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646905/">Vanilla RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645873/">Vanilla RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645338/">Vanilla RU Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] UU', 'STABmons Move Legality', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'UU', 'RUBL', // RU
			'Aerodactyl', 'Archeops', 'Komala', 'Regigigas', 'Shedinja', 'Silvally', 'Slaking', // AAA
			'King\'s Rock', 'Razor Fang', // STABmons
			'Marowak-Alola', 'Emboar' // STAAABmons RU
		],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		unbanlist: [
			'Drought', // RU
			'Drizzle' // AAA
		],
	},
	{
		name: "[Gen 7] Camomons Ubers",
		desc: `Pok&eacute;mon change type to match their first two moves, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Camomons Rule'],
		banlist: ['Shedinja'],
	},
	{
		name: "[Gen 7] CAAAmomons Ubers",
		desc: `Pok&eacute;mon change type to match their first two moves, and can use any ability, barring the few that are restricted to their natural users, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Vanilla Ubers</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'Camomons Rule', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: ['Shedinja', 'Necrozma-Dusk-Mane'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Arena Trap', 'Shadow Tag', // For Ubers
		],
	},
	{
		name: "[Gen 7] PokeAAAbilities",
		desc: `Pok&eacute;mon have all of their released Abilities simultaneously, and can use any 1 additional ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588652/">Vanilla Pok&eacute;bilities</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
		],

		mod: 'gen7pokebilities',
		ruleset: ['[Gen 7] OU', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'Bibarel', 'Bidoof', 'Diglett', 'Dugtrio', 'Excadrill', 'Glalie', 'Gothita', 'Gothitelle', 'Gothorita', 'Octillery', 'Porygon-Z', 'Remoraid', 'Smeargle', 'Snorunt', 'Trapinch', 'Wobbuffet', 'Wynaut', // Pokebilities
			 'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile' // AAA
		],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onBegin() {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let pokemon of allPokemon) {
				if (pokemon.ability === toID(pokemon.species.abilities['S'])) {
					continue;
				}
				// @ts-ignore
				pokemon.innates = Object.keys(pokemon.species.abilities).filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden)).map(key => toID(pokemon.species.abilities[key])).filter(ability => ability !== pokemon.ability);
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (pokemon.innates) pokemon.innates.forEach(innate => pokemon.addVolatile("ability" + innate, pokemon));
		},
		onAfterMega(pokemon) {
			Object.keys(pokemon.volatiles).filter(innate => innate.startsWith('ability')).forEach(innate => pokemon.removeVolatile(innate));
			pokemon.innates = undefined;
		},
	},
	{
		name: "[Gen 7] Camomons Balanced Hackmons",
		desc: `Nearly anything that can be hacked in-game and is usable in local battles is allowed but each Pok&eacute;mon can change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Vanilla Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588586/">Vanilla BH Suspects and Bans Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">Vanilla BH Resources</a>`,
		],
		mod: 'gen7',
		ruleset: [ 
			'-Nonexistent', '2 Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', // BH
			'Camomons Rule', // Camomons
			'Species Clause', // BH Camomons
		 ],
		banlist: [
			'Arena Trap', 'Contrary', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk',  // BH
			'V-Create', // BH Camomons
		],
	},
	{
		name: "[Gen 7] Tier Shift AAA",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users. Pok&eacute;mon below OU get all their stats boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Vanilla Tier Shift</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'AAA Standard Package', '!Obtainable Abilities', 'Tier Shift Rule'],
		banlist: [
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile', // Almost Any Ability
			'Damp Rock', 'Deep Sea Tooth', 'Eviolite', // Tier Shift
			'Thick Club', 'Absol', 'Metagross', // TS AAA
		],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},

	// Expanded Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "Expanded Other Metagames",
		column: 2,
	},
	{
        name: "[Gen 8] Suicide Cup",
        desc: `Victory is obtained when all of your Pok&eacute;mon have fainted.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
        ],

        mod: 'gen8',
        forcedLevel: 100,
        ruleset: ['Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview'],
        banlist: [
        	'Shedinja', 'Infiltrator', 'Magic Guard', 'Choice Scarf', 'Leppa Berry', 'Explosion',
            'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Self-Destruct',
        ],
    },
	{
        name: "[Gen 8] Suicide Cup: National Dex",
        desc: `Victory is obtained when all of your Pok&eacute;mon have fainted, in a National Dex environment.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
        ],

        mod: 'gen8',
        forcedLevel: 100,
        ruleset: [
			'Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause',
			'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview', '+Past', '+Unreleased', 'Standard NatDex'
		],
		banlist: [
        	'Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Assault Vest', 'Choice Scarf', 'Leppa Berry', 'Explosion',
            'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self-Destruct',
        ],
	},
	{
		name: "[Gen 8] Partners in Crime",
		desc: `Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.`,

		mod: 'pic',
		gameType: 'doubles',
		ruleset: ['[Gen 8] Doubles OU', 'Sleep Clause Mod'],
		banlist: [
			'Huge Power', 'Pure Power', 'Wonder Guard', 'Shadow Tag', 'Normalize', 'Trace', 'Imposter', 'Transform',
			'Arctovish', 'Arctozolt', 'Dracovish', 'Dracozolt',
		],
		onBeforeSwitchIn(pokemon) {
			for (const side of this.sides) {
				if (side.active.every(ally => ally && !ally.fainted)) {
					let pokeA = side.active[0], pokeB = side.active[1];
					if (pokeA.ability !== pokeB.ability) {
						const pokeAInnate = 'ability:' + pokeB.ability;
						pokeA.volatiles[pokeAInnate] = {id: toID(pokeAInnate), target: pokeA};
						const pokeBInnate = 'ability:' + pokeA.ability;
						pokeB.volatiles[pokeBInnate] = {id: toID(pokeBInnate), target: pokeB};
					}
				}
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability:' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability:' + pokemon.ability;
					delete ally.volatiles[ally.m.innate];
					ally.addVolatile(ally.m.innate);
				}
			}
		},
		onSwitchOut(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		onFaint(pokemon) {
			if (pokemon.m.innate) {
				pokemon.removeVolatile(pokemon.m.innate);
				delete pokemon.m.innate;
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.m.innate) {
				ally.removeVolatile(ally.m.innate);
				delete ally.m.innate;
			}
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
	},
	{
		name: "[Gen 8] Pokebilities (Beta)",
		desc: `Pok&eacute;mon have all of their released Abilities simultaneously.`,

		mod: 'pokebilities',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Diglett', 'Dugtrio', 'Excadrill', 'Glalie', 'Gothita', 'Gothitelle', 'Gothorita', 'Octillery', 'Porygon-Z', 'Remoraid', 'Snorunt', 'Trapinch', 'Wobbuffet', 'Wynaut'],
		onBegin() {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let pokemon of allPokemon) {
				if (pokemon.ability === toID(pokemon.species.abilities['S'])) {
					continue;
				}
				// @ts-ignore
				pokemon.m.innates = Object.keys(pokemon.species.abilities).filter(key => key !== 'S' && (key !== 'H' || !pokemon.species.unreleasedHidden)).map(key => toID(pokemon.species.abilities[key])).filter(ability => ability !== pokemon.ability);
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			// @ts-ignore
			if (pokemon.m.innates) pokemon.m.innates.forEach(innate => pokemon.addVolatile("ability:" + innate, pokemon));
		},
		onAfterMega(pokemon) {
			Object.keys(pokemon.volatiles).filter(innate => innate.startsWith('ability:')).forEach(innate => pokemon.removeVolatile(innate));
			pokemon.m.innates = undefined;
		},
	},
	{
		name: "[Gen 8] 350 Cup",
		desc: "Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled. &bullet; <a href=\"https://www.smogon.com/forums/threads/350-cup.3656554/\">350 Cup</a>",
		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', '350 Cup Rule', 'Dynamax Clause'],
		banlist: [
			'Shadow Tag', 'Arena Trap', // Abilities
			'Eviolite', 'Light Ball', // Items
			'Rufflet​', 'Pawniard​', // Pokemon
		],
	},
	{
		name: "[Gen 8] Scalemons",
		desc: `Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3658482/">Scalemons</a>`,
		],

		mod: 'gen8',
		ruleset: ['[Gen 8] Ubers', 'Dynamax Clause', 'Scalemons Mod'],
		banlist: [
			'Crawdaunt', 'Darmanitan', 'Darmanitan-Galar', 'Darumaka', 'Darumaka-Galar', 'Gastly',
			'Arena Trap', 'Drizzle', 'Drought', 'Huge Power', 'Moody', 'Shadow Tag', 'Baton Pass', 'Rain Dance', 'Sunny Day', 'Eviolite', 'Light Ball',
		],
	},
	{
		name: "[Gen 7] Almost Any Ability",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">AAA Resources</a>`,
		],

		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU', '2 Ability Clause', '!Obtainable Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Victini', 'Weavile'],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			let restrictedAbilities = format.restrictedAbilities || [];
			if (restrictedAbilities.includes(set.ability)) {
				let species = this.dex.getSpecies(set.species || set.name);
				let legalAbility = false;
				for (let i in species.abilities) {
					// @ts-ignore
					if (set.ability === species.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 7] Tier Shift",
		desc: "Pok&eacute;mon below OU get all their stats boosted. UU/RUBL get +10, RU/NUBL get +20, NU/PUBL get +30, and PU or lower get +40.",
		threads: [
			"&bullet; <a href=\"https://www.smogon.com/forums/threads/3610073/\">Tier Shift</a>",
		],

		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU', 'Tier Shift Rule'],
		banlist: ['Drought', 'Damp Rock', 'Deep Sea Tooth', 'Eviolite', 'Heat Rock'],
	},
	{
		name: "[Gen 7] STABmons",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">STABmons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality'],
		banlist: ['Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang'],
		restricted: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] Camomons",
		desc: `Pok&eacute;mon change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
		],
		mod: 'gen7',
		//searchShow: false,
		ruleset: ['[Gen 7] OU'],
		banlist: ['Dragonite', 'Kartana', 'Kyurem-Black', 'Latias-Mega', 'Shedinja', 'Kommonium Z'],
		onModifySpecies(species, target, source, effect) {
			if (!target) return; // Chat command
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.dex.getMove(move.id).type))];
			return Object.assign({}, species, {types: types});
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] 350 Cup",
		desc: "Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled. &bullet; <a href=\"https://www.smogon.com/forums/threads/3589641/\">350 Cup</a>",
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', '350 Cup Rule'],
		banlist: ['Deep Sea Tooth', 'Eevium Z', 'Eviolite', 'Light Ball'],
	},
	{
		name: "[Gen 7] Inverse",
		desc: "The effectiveness of each attack is inverted. &bullet; <a href=\"https://www.smogon.com/forums/threads/3590154/\">Inverse</a>",
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Inverse Mod'],
		banlist: ['Hoopa-Unbound', 'Kyurem-Black', 'Serperior'],
		unbanlist: ['Aegislash', 'Dialga', 'Giratina', 'Pheromosa', 'Solgaleo', 'Lucarionite'],
	},
	{
        name: "[Gen 7] Suicide Cup",
        desc: `Victory is obtained when all of your Pok&eacute;mon have fainted.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
        ],

        mod: 'gen7',
        forcedLevel: 100,
        ruleset: ['Suicide Cup Standard Package', 'Cancel Mod', 'Evasion Moves Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Team Preview'],
        banlist: [
        	'Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Assault Vest', 'Choice Scarf', 'Leppa Berry', 'Explosion',
            'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self-Destruct',
        ],
    },
	{
		name: "[Gen 7] Reversed",
		desc: `Every Pok&eacute;mon has its base Atk and Sp. Atk stat, as well as its base Def and Sp. Def stat, swapped.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623871/">Reversed</a>`,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Reversed Rule'],
		banlist: ['Kyurem-Black', 'Tapu Koko'],
		unbanlist: ['Kyurem-White', 'Marshadow', 'Metagross-Mega', 'Naganadel', 'Reshiram'],
	},
	{
		name: "[Gen 7] Gods and Followers",
		desc: `The Pok&eacute;mon in the first slot is the God; the Followers must share a type with the God. If the God Pok&eacute;mon faints, the Followers are inflicted with Embargo.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3589187/">Gods and Followers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Baton Pass'],
		onValidateTeam(team, format, teamHas) {
			/*console.log("onvt: " + this.formatsCache);
			for( let i=0; i<this.formatsCache.length; i++) {
				console.console.log("i: " + this.formatsCache[i]);
			}*/
			let problemsArray = /** @type {string[]} */ ([]);
			let types = /** @type {string[]} */ ([]);
			for (const [i, set] of team.entries()) {
				let item = this.dex.getItem(set.item);
				let species = this.dex.getSpecies(set.species);
				if (!species.exists) return [`The Pok\u00e9mon "${set.name || set.species}" does not exist.`];
				if (i === 0) {
					types = species.types;
					if (species.name.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz') types = ['Psychic'];
					if (item.megaStone && species.name === item.megaEvolves) {
						species = this.dex.getSpecies(item.megaStone);
						let baseSpecies = this.dex.getSpecies(item.megaEvolves);
						types = baseSpecies.types.filter(type => species.types.includes(type));
					}
					// 18/10/08 TrashChannel: Since this is already an ubers-based meta,
					// we shouldn't need to check the gods for any additional bans
				} else {
					// 18/10/08 TrashChannel: Avoid using OU validator as it interferes with mashups
					// followerbanlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass'],
					if ("Uber" == species.tier) { // Ban ubers
						problemsArray.push("You can't use an Ubers pokemon as a follower!");
					}
					let followerBannedAbilities = ['Arena Trap', 'Power Construct', 'Shadow Tag'];
					let ability = this.getAbility(set.ability);
					let abilityName = ability.toString();
					for (let nBanAbItr = 0; nBanAbItr < followerBannedAbilities.length; ++nBanAbItr) {
						if (followerBannedAbilities[nBanAbItr] == abilityName) { // Ban OU banned abilities
							problemsArray.push("Follower has the banned ability: " + followerBannedAbilities[nBanAbItr] + "!");
						}
					}
					// Baton Pass is also banned on Ubers, so we move it to general banlist
					let followerTypes = species.types;
					if (item.megaStone && species.name === item.megaEvolves) {
						species = this.dex.getSpecies(item.megaStone);
						let baseSpecies = this.dex.getSpecies(item.megaEvolves);
						if (baseSpecies.types.some(type => types.includes(type)) && species.types.some(type => types.includes(type))) {
							followerTypes = baseSpecies.types.concat(species.types).filter(type => species.types.concat(baseSpecies.types).includes(type));
						}
					}
				}
			}
		},
	},
	{
		name: "[Gen 7] Fortemons",
		desc: `Pok&eacute;mon have all of their moves inherit the properties of the move in their item slot.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638520/">Fortemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Serene Grace'],
		restricted: ['Bide', 'Chatter', 'Dynamic Punch', 'Fake Out', 'Frustration', 'Inferno', 'Power Trip', 'Power-Up Punch', 'Pursuit', 'Return', 'Stored Power', 'Zap Cannon'],
		validateSet(set, teamHas) {
			const restrictedMoves = this.format.restricted || [];
			let item = set.item;
			let move = this.dex.getMove(set.item);
			if (!move.exists || move.type === 'Status' || restrictedMoves.includes(move.name) || move.flags['charge'] || move.priority > 0) return this.validateSet(set, teamHas);
			set.item = '';
			let problems = this.validateSet(set, teamHas) || [];
			set.item = item;
			// @ts-ignore
			if (this.format.checkCanLearn.call(this, move, this.dex.getSpecies(set.species))) problems.push(`${set.species} can't learn ${move.name}.`);
			// @ts-ignore
			if (move.secondaries && move.secondaries.some(secondary => secondary.boosts && secondary.boosts.accuracy < 0)) problems.push(`${set.name || set.species}'s move ${move.name} can't be used as an item.`);
			return problems.length ? problems : null;
		},
		checkCanLearn(move, species, lsetData, set) {
			if (move.id === 'beatup' || move.id === 'fakeout' || move.damageCallback || move.multihit) return {type: 'invalid'};
			return this.checkCanLearn(move, species, lsetData, set);
		},
		onValidateTeam(team, format) {
			/**@type {{[k: string]: true}} */
			let itemTable = {};
			for (const set of team) {
				let move = this.getMove(set.item);
				if (!move.exists) continue;
				if (itemTable[move.id]) {
					return ["You are limited to one of each forte by Forte Clause.", "(You have more than one " + move.name + ")"];
				}
				itemTable[move.id] = true;
			}
		},
		onBegin() {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				let move = this.getActiveMove(pokemon.set.item);
				if (move.exists && move.category !== 'Status') {
					// @ts-ignore
					pokemon.forte = move;
					pokemon.item = 'ultranecroziumz';
				}
			}
		},
		onModifyPriority(priority, pokemon, target, move) {
			// @ts-ignore
			if (move.category !== 'Status' && pokemon && pokemon.forte) {
				let ability = pokemon.getAbility();
				// @ts-ignore
				if (ability.id === 'triage' && pokemon.forte.flags['heal']) return priority + (move.flags['heal'] ? 0 : 3);
				// @ts-ignore
				return priority + pokemon.forte.priority;
			}
		},
		onModifyMovePriority: 1,
		onModifyMove(move, pokemon) {
			// @ts-ignore
			if (move.category !== 'Status' && pokemon.forte) {
				// @ts-ignore
				Object.assign(move.flags, pokemon.forte.flags);
				// @ts-ignore
				if (pokemon.forte.self) {
					// @ts-ignore
					if (pokemon.forte.self.onHit && move.self && move.self.onHit) {
						// @ts-ignore
						for (let i in pokemon.forte.self) {
							if (i.startsWith('onHit')) continue;
							// @ts-ignore
							move.self[i] = pokemon.forte.self[i];
						}
					} else {
						// @ts-ignore
						move.self = Object.assign(move.self || {}, pokemon.forte.self);
					}
				}
				// @ts-ignore
				if (pokemon.forte.secondaries) move.secondaries = (move.secondaries || []).concat(pokemon.forte.secondaries);
				// @ts-ignore
				move.critRatio = (move.critRatio - 1) + (pokemon.forte.critRatio - 1) + 1;
				for (let prop of ['basePowerCallback', 'breaksProtect', 'defensiveCategory', 'drain', 'forceSwitch', 'ignoreAbility', 'ignoreDefensive', 'ignoreEvasion', 'ignoreImmunity', 'pseudoWeather', 'recoil', 'selfSwitch', 'sleepUsable', 'stealsBoosts', 'thawsTarget', 'useTargetOffensive', 'volatileStatus', 'willCrit']) {
					// @ts-ignore
					if (pokemon.forte[prop]) {
						// @ts-ignore
						if (typeof pokemon.forte[prop] === 'number') {
							// @ts-ignore
							let num = move[prop] || 0;
							// @ts-ignore
							move[prop] = num + pokemon.forte[prop];
						} else {
							// @ts-ignore
							move[prop] = pokemon.forte[prop];
						}
					}
				}
			}
		},
		// @ts-ignore
		onHitPriority: 1,
		onHit(target, source, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte) {
				// @ts-ignore
				if (source.forte.onHit) this.singleEvent('Hit', source.forte, {}, target, source, move);
				// @ts-ignore
				if (source.forte.self && source.forte.self.onHit) this.singleEvent('Hit', source.forte.self, {}, source, source, move);
				// @ts-ignore
				if (source.forte.onAfterHit) this.singleEvent('AfterHit', source.forte, {}, target, source, move);
			}
		},
		// @ts-ignore
		onAfterSubDamagePriority: 1,
		onAfterSubDamage(damage, target, source, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte && source.forte.onAfterSubDamage) this.singleEvent('AfterSubDamage', source.forte, null, target, source, move);
		},
		onModifySecondaries(secondaries, target, source, move) {
			if (secondaries.some(s => !!s.self)) move.selfDropped = false;
		},
		// @ts-ignore
		onAfterMoveSecondarySelfPriority: 1,
		onAfterMoveSecondarySelf(source, target, move) {
			// @ts-ignore
			if (move && move.category !== 'Status' && source.forte && source.forte.onAfterMoveSecondarySelf) this.singleEvent('AfterMoveSecondarySelf', source.forte, null, source, target, move);
		},
	},
	{
		name: "[Gen 7] Averagemons",
		desc: `Every Pok&eacute;mon, including formes, has base 100 in every stat.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590605/">Averagemons</a>`,
		],

		mod: 'gen7',
		ruleset: ['Obtainable', 'Standard', 'Averagemons Rule'],
		banlist: [
			'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Smeargle',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club', 'Baton Pass', 'Chatter',
		],
	},
	{
		name: "[Gen 7] Chimera",
		desc: `Bring 6 Pok&eacute;mon and choose their order at Team Preview. The lead Pok&eacute;mon then receives the item, ability, stats, and moves of the other five Pok&eacute;mon, who play no further part in the battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3607451/">Chimera</a>`,
		],

		mod: 'gen7',
		teamLength: {
			validate: [6, 6],
			battle: 6,
		},
		ruleset: ['Obtainable', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: [
			'Shedinja', 'Smeargle', 'Huge Power', 'Pure Power', 'Deep Sea Tooth', 'Eviolite', 'Focus Sash', 'Light Ball', 'Lucky Punch',
			'Stick', 'Thick Club', 'Dark Void', 'Grass Whistle', 'Hypnosis', 'Lovely Kiss', 'Perish Song', 'Sing', 'Sleep Powder', 'Spore', 'Transform',
		],
		onValidateSet(set) {
			if (set && set.item) {
				let item = this.dex.getItem(set.item);
				if (item.zMoveUser || item.megaStone || item.onPrimal) return [`${set.name || set.species}'s item ${set.item} is banned.`];
			}
		},
		onBeforeSwitchIn(pokemon) {
			let allies = pokemon.side.pokemon.splice(1);
			pokemon.side.pokemonLeft = 1;
			let species = this.dex.deepClone(pokemon.baseSpecies);
			pokemon.item = allies[0].item;
			species.abilities = allies[1].baseSpecies.abilities;
			pokemon.ability = pokemon.baseAbility = allies[1].ability;

			// Stats
			species.baseStats = allies[2].baseSpecies.baseStats;
			pokemon.hp = pokemon.maxhp = species.maxHP = allies[2].maxhp;
			pokemon.set.evs = allies[2].set.evs;
			pokemon.set.nature = allies[2].getNature().name;
			// @ts-ignore
			pokemon.set.ivs = pokemon.baseIvs = allies[2].set.ivs;
			// @ts-ignore
			pokemon.hpType = pokemon.baseHpType = allies[2].baseHpType;

			// @ts-ignore
			pokemon.moveSlots = pokemon.baseMoveSlots = allies[3].baseMoveSlots.slice(0, 2).concat(allies[4].baseMoveSlots.slice(2)).filter((move, index, moveSlots) => moveSlots.find(othermove => othermove.id === move.id) === move);
			pokemon.setSpecies(species);
		},
	},
	{
		name: "[Gen 7] Godly Gift",
		desc: `Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597618/">Godly Gift</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Uber > 1', 'Uber ++ Arena Trap', 'Uber ++ Power Construct', 'Blissey', 'Chansey', 'Deoxys-Attack', 'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Sableye-Mega', 'Toxapex', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Baton Pass'],
		onModifySpecies(species, target, source, effect) {
			if (source || !target || !target.side) return;
			let uber = target.side.team.find(set => {
				let item = this.dex.getItem(set.item);
				return set.ability === 'Arena Trap' || set.ability === 'Power Construct' || this.dex.getSpecies(item.megaEvolves === set.species ? item.megaStone : set.species).tier === 'Uber';
			}) || target.side.team[0];
			let stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)];
			let pokemon = this.dex.deepClone(species);
			// @ts-ignore
			pokemon.baseStats[stat] = this.dex.getSpecies(uber.species).baseStats[stat];
			return pokemon;
		},
	},
	{
		name: "[Gen 7] Nature Swap",
		desc: `Pok&eacute;mon have their base stats swapped depending on their nature.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3612727/">Nature Swap</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Blissey', 'Chansey', 'Cloyster', 'Hoopa-Unbound', 'Kyurem-Black', 'Stakataka'],
		battle: {
			natureModify(stats, set) {
				let nature = this.getNature(set.nature);
				let stat;
				if (nature.plus) {
					// @ts-ignore
					stat = nature.plus;
					// @ts-ignore
					stats[stat] = Math.floor(stats[stat] * 1.1);
				}
				return stats;
			},
		},
		onModifySpecies(species, target, source, effect) {
			if (!target) return;
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let nature = this.getNature(target.set.nature);
			if (!nature.plus) return species;
			let newStats = Object.assign({}, species.baseStats);
			let swap = newStats[nature.plus];
			// @ts-ignore
			newStats[nature.plus] = newStats[nature.minus];
			// @ts-ignore
			newStats[nature.minus] = swap;
			return Object.assign({}, species, {baseStats: newStats});
		},
	},
	{
		name: "[Gen 7] Follow the Leader",
		desc: `The first Pok&eacute;mon provides the moves and abilities for all other Pok&eacute;mon on the team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3603860/">Follow the Leader</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Regigigas', 'Shedinja', 'Slaking', 'Smeargle', 'Imposter', 'Huge Power', 'Pure Power'],
		checkCanLearn(move, species, lsetData, set) {
			// @ts-ignore
			return set.follower ? null : this.checkCanLearn(move, species, lsetData, set);
		},
		validateSet(set, teamHas) {
			if (!teamHas.leader) {
				let problems = this.validateSet(set, teamHas);
				teamHas.leader = set.species;
				return problems;
			}
			let leader = this.dex.deepClone(set);
			leader.species = teamHas.leader;
			let problems = this.validateSet(leader, teamHas);
			if (problems) return problems;
			set.ability = this.dex.getSpecies(set.species || set.name).abilities['0'];
			// @ts-ignore
			set.follower = true;
			problems = this.validateSet(set, teamHas);
			set.ability = leader.ability;
			return problems;
		},
	},
	{
		name: "[Gen 7] Mix and Mega",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,

		mod: 'gen7mixandmega',
		ruleset: ['Standard', 'Mega Rayquaza Clause', 'Gen 7 Mix and Mega Standard Package'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restricted: [
			'Arceus', 'Deoxys', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem', 'Landorus-Therian', 'Lugia',
			'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shuckle',
			'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
			'Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z',
		],
		unbanlist: ['Deoxys-Defense', 'Kyurem-Base', 'Necrozma-Base'],
	},

	// Pet Mods
	///////////////////////////////////////////////////////////////////

	/*{
		section: "Pet Mods",
		column: 2,
	},*/
	/*{
		name: "[Gen 8 Pet Mod] Roulettemons",
		desc: `A metagame made up of brand new Pok&eacute;mon that have randomly generated moves, stats, abilities, and types.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3649106/">Roulettemons</a>`,
		],

		mod: 'roulettemons',
		ruleset: ['Standard NatDex', 'Dynamax Clause', 'Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Baton Pass Clause', 'OHKO Clause'],
		banlist: ['All Pokemon'],
		unbanlist: [
			'Koatric', 'Aquazelle', 'Salamalix', 'Brawnkey', 'Stuneleon', 'Chillyte', 'Eartharoo', 'Crazefly', 'Electritar', 'Aquatopus', 'Scorpita', 'Baloon', 'Kinesel', 'Glacida', 'Pidgeotine', 'Gorilax', 'Albatrygon', 'Chillvark', 'Komodith', 'Giranium', 'Flamyle', 'Voltecta', 'Ostria', 'Ninjoth', 'Herbigator', 'Anteros', 'Gladiaster', 'Hyperoach', 'Barracoth', 'Toados', 'Voltarak', 'Mosqung', 'Flamepion', 'Hyenix', 'Rhinolite', 'Bellena', 'Falcola', 'Beanium', 'Lemotic', 'Biceon', 'Skeleray', 'Specyte', 'Ramron', 'Panthee', 'Blastora', 'Balar', 'Dropacle', 'Fluffora', 'Dolphena', 'Tigire', 'Catelax',
		],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},*/
	/*{
		name: "[Gen 7 Pet Mod] Clean Slate: Micro",
		desc: `A brand new "micrometagame" created from scratch, with the ultimate goal of creating a unique, compact metagame different from any other tier.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3652540/">Clean Slate: Micro</a>`,
		],

		mod: 'cleanslatemicro',
		ruleset: ['Standard Pet Mod'],
		unbanlist: [
			'Crobat', 'Dragalge', 'Dugtrio-Alola', 'Farfetch\'d', 'Galvantula', 'Heracross-Base', 'Kyurem-Base', 'Ludicolo',
			'Magearna-Base', 'Malamar', 'Ninetales-Base', 'Pupitar', 'Purugly', 'Rotom-Base', 'Rotom-Heat', 'Rotom-Mow',
			'Rotom-Wash', 'Torterra', 'Type: Null', 'Umbreon', 'Wailord',
		],
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
		},
	},*/
	/*
	{
		name: "[Gen 8] Megamax",
		desc: `A metagame where Gigantamax formes are turned into new Mega Evolutions. To see the new stats of a Megamax forme or to see what new ability does, do <code>/dt [target], megamax</code>.`,
		threads: [
			`<a href="https://www.smogon.com/forums/threads/3658623/">Megamax</a>`,
		],

		mod: 'megamax',
		ruleset: ['[Gen 8] OU'],
		banlist: ['Corviknight-Gmax', 'Melmetal-Gmax', 'Urshifu-Gmax'],
		onChangeSet(set) {
			if (set.species.endsWith('-Gmax')) set.species = set.species.slice(0, -5);
		},
		checkCanLearn(move, species, lsetData, set) {
			if (species.name === 'Pikachu' || species.name === 'Pikachu-Gmax') {
				if (['boltstrike', 'fusionbolt', 'pikapapow', 'zippyzap'].includes(move.id)) {
					return null;
				}
			}
			if (species.name === 'Meowth' || species.name === 'Meowth-Gmax') {
				if (['partingshot', 'skillswap', 'wrap'].includes(move.id)) {
					return null;
				}
			}
			if (species.name === 'Eevee' || species.name === 'Eevee-Gmax') {
				if (['iciclecrash', 'liquidation', 'sappyseed', 'sizzlyslide', 'wildcharge'].includes(move.id)) {
					return null;
				}
			}
			return this.checkCanLearn(move, species, lsetData, set);
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			if (newSpecies.forme.includes('Gmax')) {
				newSpecies.isMega = true;
			}
			return newSpecies;
		},
		onSwitchIn(pokemon) {
			const baseSpecies = this.dex.getSpecies(pokemon.species.baseSpecies);
			if (baseSpecies.exists && pokemon.species.name !== (pokemon.species.changesFrom || baseSpecies.name)) {
				if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onAfterMega(pokemon) {
			const baseSpecies = this.dex.getSpecies(pokemon.species.baseSpecies);
			if (baseSpecies.exists && pokemon.species.name !== (pokemon.species.changesFrom || baseSpecies.name)) {
				if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
	},*/
	/*{
		name: "[Gen 8] Optimons",
		desc: `Every Pok&eacute;mon is optimized to become viable for a balanced metagame. To see the new stats of optimized Pok&eacute;mon, do <code>/dt [pokemon], optimons</code>.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3657509/">Optimons</a>`,
		],

		mod: 'optimons',
		searchShow: false,
		ruleset: ['[Gen 8] OU'],
		unbanlist: ['Electabuzz', 'Electivire', 'Elekid', 'Magby', 'Magmar', 'Magmortar', 'Yanma', 'Yanmega'],
		onSwitchIn(pokemon) {
			const baseSpecies = this.dex.mod('gen8').getSpecies(pokemon.species.name);
			if (pokemon.species.types.length !== baseSpecies.types.length || pokemon.species.types[1] !== baseSpecies.types[1]) {
				this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
			}
		},
	},*/

	// TrashChannel Original Programming
	///////////////////////////////////////////////////////////////////

	{
		section: "TrashChannel Original Programming",
		column: 3,
	},
	{
		name: "[Gen 8] Bitch and Beggar",
		onDesc() {
			let bstLimitString = this.modValueNumberA ? " (<=" + this.modValueNumberA.toString() + ")" : "";
			return "You've heard of Mix and Mega, what about Bitch and Beggar? Pok&eacute;mon can 'Beggar-Evolve' using low" + bstLimitString + " BST Pok&eacute;mon as Stones.";
		},
		threads: [
			``,
		],

		mod: 'bitchandbeggar',
		ruleset: ['Obtainable', 'Bitch And Beggar Rule', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Dynamax Clause', 'Sleep Clause Mod', 'Endless Battle Clause'],
		banlist: [
			'AG', 'Eternatus', 'Gothitelle', 'Gothorita', 'Zacian', 'Moody', 'Baton Pass', 'Electrify',
			'Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite',
		],
		restrictionlist: [
			'Huge Power', 'Pure Power', 'Wonder Guard', 
		],
		modValueNumberA: 300,
		onValidateTeam(team) {
			/**@type {{[k: string]: true}} */
			let itemTable = {};
			for (const set of team) {
				let beggarSpecies = this.dex.getSpecies(set.species || set.name);
				let bitchSpecies = this.dex.getSpecies(set.item);
				if (this.dex.getRuleTable(this.format).has('-AG') ) {
					if(['Venusaur', 'Blastoise', 'Zamazenta'].includes(beggarSpecies.baseSpecies)) {
						return [`${beggarSpecies.name} is not allowed to hold ${set.item}.`];
					}
					if (!bitchSpecies.exists) continue;
					if (itemTable[bitchSpecies.id]) return ["You are limited to one of each Bitch.", "(You have more than one " + bitchSpecies.name + ")"];
				}
				itemTable[bitchSpecies.id] = true;
			}
		},
		onValidateSet(set, format, setHas, teamHas, ruleTable) {
			//console.log('BnB: val ');
			//console.log('format.modValueNumberA: '+format.modValueNumberA.toString());

			let beggarSpecies = this.dex.getSpecies(set.species || set.name);
			let bitchSpecies = this.dex.getSpecies(set.item);
			//console.log('bitch: '+set.item);
			if(!bitchSpecies.exists) return;

			let problems = [];
			let bitchBST = this.dex.calcBST(bitchSpecies.baseStats);
			//console.log('bitchBST: '+bitchBST.toString());
			if(format.modValueNumberA) {
				if(bitchBST > format.modValueNumberA) {
					problems.push("Bitches are limited to " + format.modValueNumberA.toString() + " BST, but " + bitchSpecies.name + " has " + bitchBST.toString() + "!");
				}
			}
			let uberBitches = format.restricted || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(beggarSpecies.name) || set.ability === 'Power Construct' || uberBitches.includes(bitchSpecies.name)) return ["" + beggarSpecies.name + " is not allowed to hold " + bitchSpecies.name + "."];
			
			// Load BnB mod functions
			// @ts-ignore
			import {Scripts as BnBMod} from '../.data-dist/mods/bitchandbeggar/scripts';

			const mixedSpecies = BnBMod.getMixedSpecies(beggarSpecies.name, bitchSpecies.baseSpecies);
			let oAbilitySlot = this.dex.calcActiveAbilitySlot(beggarSpecies, set.ability);
			//console.log("oAbilitySlot: " + oAbilitySlot);
			// @ts-ignore
			let postBeggarAbilityName = mixedSpecies.abilities[oAbilitySlot];
			let postBeggarAbilityId = toID(postBeggarAbilityName);
			//console.log("postBeggarAbilityId: " + postBeggarAbilityId);
			let abilityTest = '-ability:'+postBeggarAbilityId;
			//console.log("abilityTest: " + abilityTest);
			ruleTable.forEach((v, rule) => {
				//console.log("BnB rule: " + rule);
				if( rule === abilityTest ) {
					//console.log("BnB rule IN ");
					problems.push("If "+set.name+" beggar-evolves with the ability "+ set.ability + ", it will gain the banned ability "
						+ postBeggarAbilityName + " from its bitch "+ bitchSpecies.name + ".");
				}
			});
			let restrictedAbilities = format.restrictedAbilities || [];
			if (restrictedAbilities.includes(postBeggarAbilityId)) {
				//console.log("BnB restriction IN ");
				problems.push("If "+set.name+" beggar-evolves with the ability "+ set.ability + ", it will gain the restricted ability "
					+ postBeggarAbilityName + " from its bitch "+ bitchSpecies.name + ".");
			}
			return problems;
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchSpecies = this.dex.getSpecies(pokemon.item);
			if(!bitchSpecies.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.dex.generateMegaStoneName(bitchSpecies), '[silent]');
				let oSpecies = this.dex.getSpecies(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 8] Bitch and Beggar: Hackmons Cup",
		desc: `You've heard of Mix and Mega, what about Bitch and Beggar? Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, move, and bitch.`,
		threads: [
			``,
		],
		mod: 'bitchandbeggar',
		ruleset: ['Obtainable', 'HP Percentage Mod', 'Cancel Mod'],
		team: 'randomHCBnB',
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.name;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchSpecies = this.dex.getSpecies(pokemon.item);
			if(!bitchSpecies.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.dex.generateMegaStoneName(bitchSpecies), '[silent]');
				let oSpecies = this.dex.getSpecies(pokemon.m.originalSpecies);
				if (oSpecies.types.length !== pokemon.species.types.length || oSpecies.types[1] !== pokemon.species.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.species.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				this.add('-end', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 8] Live and Learn",
		desc: `Pok&eacute;mon can learn each other's moves and abilities when they are activated.`,
		threads: [
            `&bullet; <a href="https://www.youtube.com/watch?v=z1BRZg0GG0A">OST</a>`,
        ],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Darmanitan-Galar', 'Eternatus', 'Kyurem-Black', 'Kyurem-White', 'Lunala', 'Marshadow', 'Melmetal',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Reshiram', 'Shedinja', 'Solgaleo', 'Toxapex',
			'Zacian', 'Zamazenta', 'Zekrom', 'Leppa Berry', 'Baton Pass',
			'Arena Trap', 'Gorilla Tactics', 'Imposter', 'Mirror Armor', 'Moody', 'Neutralizing Gas', 'Shadow Tag',
			'Trace',
		],
		// @ts-ignore
		runTeachableMoment(battle: Battle, effectName: string, checkAbility?: boolean, checkMove?: boolean) {
			// @ts-ignore
			if (this.format && this.format.banlist && this.format.banlist.includes(effectName)) return;

			const effectID = toID(effectName);
			const effectAsAbility = checkAbility ? battle.dex.getAbility(effectID) : null;
			const effectAsMove = checkMove ? battle.dex.getMove(effectID) : null;

			for (const side of battle.sides) {
				if (!side) continue;
				if (side.active.every(ally => ally && !ally.fainted)) {
					for (const activePokemon of side.active) {
						if (!activePokemon) continue;

						// Ability case
						if (checkAbility && effectAsAbility && effectAsAbility.exists) {
							const lAbilities = activePokemon.m.learnedAbilities;
							if (!lAbilities) continue;
							if (lAbilities.has(effectID)) continue;
							lAbilities.add(effectID);
							const effect = 'ability:' + effectID;
							battle.add('message', activePokemon.name+' noticed and learned the ability '+effectAsAbility.name+'!');
							// Non-immediate additions (depending on timing may be called twice, etc)
							if (['intimidate', 'download', 'intrepidsword', 'dauntlessshield'].includes(effectID)) continue;
							activePokemon.addVolatile(effect);
							//console.log('adding volatile: ' + effectID);
						}

						// Move case
						if (checkMove && effectAsMove && effectAsMove.exists) {
							const lMoves = activePokemon.m.learnedMoves;
							if (!lMoves) continue;
							if (lMoves.has(effectID)) continue;
							if (lMoves.length >= 24) {
								battle.add('message', activePokemon.name+' has run out of moveslots and cannot learn the move '+effectName+'!');
								continue;
							}
							lMoves.add(effectID);
							activePokemon.moveSlots.push({
								move: effectAsMove.name,
								id: effectAsMove.id,
								pp: ((effectAsMove.noPPBoosts || effectAsMove.isZ) ? effectAsMove.pp : effectAsMove.pp * 8 / 5),
								maxpp: ((effectAsMove.noPPBoosts || effectAsMove.isZ) ? effectAsMove.pp : effectAsMove.pp * 8 / 5),
								target: effectAsMove.target,
								disabled: false,
								disabledSource: '',
								used: false,
							});
							battle.add('message', activePokemon.name+' noticed and learned the move '+effectAsMove.name+'!');
						}
					}
				}
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.learnedAbilities = new Set<string>();
				pokemon.m.learnedAbilities.add(pokemon.baseAbility);
				//console.log('adding base ability: ' + pokemon.baseAbility);

				pokemon.m.learnedMoves = new Set<string>();
				for (const move of pokemon.baseMoves) {
					if (!move) continue;
					pokemon.m.learnedMoves.add(move);
					//console.log('adding base move: ' + move);
				}
			}
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				//console.log('adding extra ability: ' + ability);
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: toID(effect), target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				const effect = 'ability:' + ability;
				//console.log('adding extra ability: ' + ability);
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onAfterMove(pokemon, target, move) {
			if (!move) return;
			//console.log('onAfterMove: ' + move);
			let format = this.format;
			// @ts-ignore
			if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
			// @ts-ignore
			format.runTeachableMoment!(this, move.name, false, true);
			if(move.hasBounced) {
				// @ts-ignore
				format.runTeachableMoment!(this, 'Magic Bounce', true, false);
			}
		},
		battle: {
			doOnShowAbility(abilityName: string)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, abilityName, true, false);
			},
			/*doOnRunSingleEvent(
				eventid: string, effect: Effect, effectData: AnyObject | null,
				target: string | Pokemon | Side | Field | Battle | null, source?: string | Pokemon | Effect | false | null,
				sourceEffect?: Effect | string | null, relayVar?: any
			)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');

				if (effect) {
					if ( ('Ability' !== effect.effectType) &&
						('Move' !== effect.effectType) ) {
						return;
					}
					// @ts-ignore
					format.runTeachableMoment!(this, effect.id, true, false);
				}

				if (!sourceEffect) return;
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},
			doOnRunEvent(eventid: string, target?: Pokemon | Pokemon[] | Side | Battle | null, source?: string | Pokemon | false | null,
				sourceEffect?: Effect | null, relayVar?: any, onEffect?: boolean, fastExit?: boolean)
			{
				//if (eventid) console.log('eventid: ' + eventid);
				if ( ('Ability' !== eventid) &&
					('Move' !== eventid) ) {
					return;
				}

				if (!sourceEffect) return;
				//console.log('sourceEffect.name: ' + sourceEffect.name);

				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},*/
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
				const abilityid = toID(ability);
				return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
			},
		},
	},
	{
		name: "[Gen 8] Live and Learn: Random Battle",
		desc: `Pok&eacute;mon can learn each other's moves and abilities when they are activated.`,
		threads: [
            `&bullet; <a href="https://www.youtube.com/watch?v=z1BRZg0GG0A">OST</a>`,
        ],

		mod: 'liveandlearn',
		team: 'randomLaL',
		ruleset: ['Standard', 'Dynamax Clause'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.learnedAbilities = new Set<string>();
				pokemon.m.learnedAbilities.add(pokemon.baseAbility);
				//console.log('adding base ability: ' + pokemon.baseAbility);

				pokemon.m.learnedMoves = new Set<string>();
				for (const move of pokemon.baseMoves) {
					if (!move) continue;
					pokemon.m.learnedMoves.add(move);
					//console.log('adding base move: ' + move);
				}
			}
		},
		onBeforeSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				//console.log('adding extra ability: ' + ability);
				const effect = 'ability:' + ability;
				pokemon.volatiles[effect] = {id: toID(effect), target: pokemon};
			}
		},
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			for (const ability of pokemon.m.learnedAbilities) {
				if (ability === pokemon.baseAbility) continue;
				const effect = 'ability:' + ability;
				//console.log('adding extra ability: ' + ability);
				delete pokemon.volatiles[effect];
				pokemon.addVolatile(effect);
			}
		},
		onAfterMove(pokemon, target, move) {
			if (!move) return;
			//console.log('onAfterMove: ' + move);
			let format = this.format;
			// @ts-ignore
			if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
			// @ts-ignore
			format.runTeachableMoment!(this, move.name, false, true);
			if(move.hasBounced) {
				// @ts-ignore
				format.runTeachableMoment!(this, 'Magic Bounce', true, false);
			}
		},
		battle: {
			doOnShowAbility(abilityName: string)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, abilityName, true, false);
			},
			/*doOnRunSingleEvent(
				eventid: string, effect: Effect, effectData: AnyObject | null,
				target: string | Pokemon | Side | Field | Battle | null, source?: string | Pokemon | Effect | false | null,
				sourceEffect?: Effect | string | null, relayVar?: any
			)
			{
				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');

				if (effect) {
					if ( ('Ability' !== effect.effectType) &&
						('Move' !== effect.effectType) ) {
						return;
					}
					// @ts-ignore
					format.runTeachableMoment!(this, effect.id, true, false);
				}

				if (!sourceEffect) return;
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},
			doOnRunEvent(eventid: string, target?: Pokemon | Pokemon[] | Side | Battle | null, source?: string | Pokemon | false | null,
				sourceEffect?: Effect | null, relayVar?: any, onEffect?: boolean, fastExit?: boolean)
			{
				//if (eventid) console.log('eventid: ' + eventid);
				if ( ('Ability' !== eventid) &&
					('Move' !== eventid) ) {
					return;
				}

				if (!sourceEffect) return;
				//console.log('sourceEffect.name: ' + sourceEffect.name);

				let format = this.format;
				// @ts-ignore
				if (!format.runTeachableMoment) format = this.dex.getFormat('gen8liveandlearn');
				// @ts-ignore
				format.runTeachableMoment!(this, sourceEffect.name, true, false);
			},*/
		},
		field: {
			suppressingWeather() {
				for (const side of this.battle.sides) {
					for (const pokemon of side.active) {
						if (pokemon && !pokemon.ignoringAbility() && pokemon.hasAbility('Cloud Nine')) {
							return true;
						}
					}
				}
				return false;
			},
		},
		pokemon: {
			hasAbility(ability) {
				if (this.ignoringAbility()) return false;
				if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
				const abilityid = toID(ability);
				return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
			},
		},
	},
	{
		name: "[Gen 7] The Call of Pikacthulhu",
		desc: `Pok&eacute;mon have Perish status applied when entering battle.`,
		threads: [
			``,
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		onSwitchIn(pokemon) {
			// @ts-ignore
			pokemon.addVolatile('perishsong', pokemon);
		},
	},

	// Mirror Universe Mashups
	///////////////////////////////////////////////////////////////////

	{
		section: "Mirror Universe Mashups",
		column: 3,
	},
	{
		name: "[Gen 7] CRABmons",
		desc: `Pok&eacute;mon change type to match any two moves they could learn naturally, and can use any move of their new typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'CRABmons Move Legality', 'Camomons Rule'],
		banlist: [
			'Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang', // STABmons
			'Dragonite', 'Latias-Mega', 'Shedinja', 'Kommonium Z', // Camomons
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', // STABmons
			'V-create', // CRABmons
		],
	},
	{
		name: "[Gen 7] CRAAABmons RU",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, can change type to match any two moves they could learn naturally, and can use any move of their new typing, in addition to the moves they can normally learn, in an RU environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Vanilla Camomons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646905/">Vanilla RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645873/">Vanilla RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645338/">Vanilla RU Sample Teams</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] UU', 'CRABmons Move Legality', 'Camomons Rule', 'AAA Standard Package', '!Obtainable Abilities'],
		banlist: [
			'UU', 'RUBL', // RU
			'Archeops', 'Komala', 'Regigigas', 'Silvally', 'Slaking', // AAA
			'Aerodactyl', 'Araquanid', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang', // STABmons
			'Dragonite', 'Latias-Mega', 'Shedinja', 'Kommonium Z', // Camomons
			'Marowak-Alola', 'Emboar' // STAAABmons RU
		],
		restricted: [
			'Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows', // STABmons
			'V-create', // CRABmons
		],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		unbanlist: [
			'Drought', // RU
			'Drizzle' // AAA
		],
	},
];
