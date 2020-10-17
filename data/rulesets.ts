// Note: These are the rules that formats use
// The list of formats is stored in config/formats.js

// #region TrashChannel Rules
import {Utils} from './../lib/utils';
import {DexCalculator} from '../.trashchannel-dist/dex-calculator';
// #endregion TrashChannel Rules

export const Formats: {[k: string]: FormatData} = {

	// Rulesets
	///////////////////////////////////////////////////////////////////

	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		desc: "The standard ruleset for all offical Smogon singles tiers (Ubers, OU, etc.)",
		ruleset: [
			'Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standardnext: {
		effectType: 'ValidatorRule',
		name: 'Standard NEXT',
		desc: "The standard ruleset for the NEXT mod",
		ruleset: [
			'+Unreleased', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
		banlist: ['Soul Dew'],
	},
	standardgbu: {
		effectType: 'ValidatorRule',
		name: 'Standard GBU',
		desc: "The standard ruleset for all official in-game Pok&eacute;mon tournaments and Battle Spot",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Cancel Mod'],
		banlist: ['Battle Bond',
			'Mewtwo', 'Mew',
			'Lugia', 'Ho-Oh', 'Celebi',
			'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys',
			'Dialga', 'Palkia', 'Giratina', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
			'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect',
			'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion',
			'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zeraora',
			'Meltan', 'Melmetal', 'Zacian', 'Zamazenta', 'Eternatus', 'Zarude',
		],
		onValidateSet(set, format) {
			if (this.gen < 7 && this.toID(set.item) === 'souldew') {
				return [`${set.name || set.species} has Soul Dew, which is banned in ${format.name}.`];
			}
		},
	},
	minimalgbu: {
		effectType: 'ValidatorRule',
		name: 'Minimal GBU',
		desc: "The standard ruleset for official tournaments, but without Restricted Legendary bans",
		ruleset: ['Obtainable', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: ['Battle Bond',
			'Mew',
			'Celebi',
			'Jirachi', 'Deoxys',
			'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
			'Victini', 'Keldeo', 'Meloetta', 'Genesect',
			'Diancie', 'Hoopa', 'Volcanion',
			'Magearna', 'Marshadow', 'Zeraora',
		],
		onValidateSet(set, format) {
			if (this.gen < 7 && this.toID(set.item) === 'souldew') {
				return [`${set.name || set.species} has Soul Dew, which is banned in ${format.name}.`];
			}
		},
	},
	standarddoubles: {
		effectType: 'ValidatorRule',
		name: 'Standard Doubles',
		desc: "The standard ruleset for all official Smogon doubles tiers",
		ruleset: [
			'Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Gravity Sleep Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod',
		],
	},
	standardnatdex: {
		effectType: 'ValidatorRule',
		name: 'Standard NatDex',
		desc: "The standard ruleset for all National Dex tiers",
		ruleset: [
			'Obtainable', '+Unobtainable', '+Past', 'Team Preview', 'Nickname Clause', 'HP Percentage Mod', 'Cancel Mod', 'Endless Battle Clause',
		],
		onValidateSet(set) {
			// These Pokemon are still unobtainable
			const unobtainables = [
				'Eevee-Starter', 'Floette-Eternal', 'Pichu-Spiky-eared', 'Pikachu-Belle', 'Pikachu-Cosplay', 'Pikachu-Libre',
				'Pikachu-PhD', 'Pikachu-Pop-Star', 'Pikachu-Rock-Star', 'Pikachu-Starter', 'Eternatus-Eternamax',
			];
			const species = this.dex.getSpecies(set.species);
			if (unobtainables.includes(species.name)) {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			if (species.tier === "Unreleased") {
				const basePokemon = this.toID(species.baseSpecies);
				if (this.ruleTable.has(`+pokemon:${species.id}`) || this.ruleTable.has(`+basepokemon:${basePokemon}`)) {
					return;
				}
				return [`${set.name || set.species} does not exist in the National Dex.`];
			}
			// Items other than Z-Crystals and Pokémon-specific items should be illegal
			if (!set.item) return;
			const item = this.dex.getItem(set.item);
			if (!item.isNonstandard) return;
			if (['Past', 'Unobtainable'].includes(item.isNonstandard) && !item.zMove && !item.itemUser && !item.forcedForme) {
				if (this.ruleTable.has(`+item:${item.id}`)) return;
				return [`${set.name}'s item ${item.name} does not exist in Gen ${this.dex.gen}.`];
			}
		},
	},
	obtainable: {
		effectType: 'ValidatorRule',
		name: 'Obtainable',
		desc: "Makes sure the team is possible to obtain in-game.",
		ruleset: ['Obtainable Moves', 'Obtainable Abilities', 'Obtainable Formes', 'Obtainable Misc'],
		banlist: ['Unreleased', 'Unobtainable', 'Nonexistent'],
		// Mostly hardcoded in team-validator.ts
		onValidateTeam(team, format) {
			let kyuremCount = 0;
			let necrozmaDMCount = 0;
			let necrozmaDWCount = 0;
			for (const set of team) {
				if (set.species === 'Kyurem-White' || set.species === 'Kyurem-Black') {
					if (kyuremCount > 0) {
						return [
							`You cannot have more than one Kyurem-Black/Kyurem-White.`,
							`(It's untradeable and you can only make one with the DNA Splicers.)`,
						];
					}
					kyuremCount++;
				}
				if (set.species === 'Necrozma-Dusk-Mane') {
					if (necrozmaDMCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dusk-Mane`,
							`(It's untradeable and you can only make one with the N-Solarizer.)`,
						];
					}
					necrozmaDMCount++;
				}
				if (set.species === 'Necrozma-Dawn-Wings') {
					if (necrozmaDWCount > 0) {
						return [
							`You cannot have more than one Necrozma-Dawn-Wings`,
							`(It's untradeable and you can only make one with the N-Lunarizer.)`,
						];
					}
					necrozmaDWCount++;
				}
			}
			return [];
		},
	},
	obtainablemoves: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Moves',
		desc: "Makes sure moves are learnable by the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableabilities: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Abilities',
		desc: "Makes sure abilities match the species.",
		// Hardcoded in team-validator.ts
	},
	obtainableformes: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Formes',
		desc: "Makes sure in-battle formes only appear in-battle.",
		// Hardcoded in team-validator.ts
	},
	obtainablemisc: {
		effectType: 'ValidatorRule',
		name: 'Obtainable Misc',
		desc: "Validate all obtainability things that aren't moves/abilities (Hidden Power type, gender, stats, etc).",
		// Mostly hardcoded in team-validator.ts
		onChangeSet(set) {
			const species = this.dex.getSpecies(set.species);

			if (species.gender) {
				if (set.gender !== species.gender) {
					set.gender = species.gender;
				}
			} else {
				if (set.gender !== 'M' && set.gender !== 'F') {
					set.gender = '';
				}
			}

			// limit one of each move
			const moves = [];
			if (set.moves) {
				const hasMove: {[k: string]: true} = {};
				for (const moveId of set.moves) {
					const move = this.dex.getMove(moveId);
					const moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(moveId);
				}
			}
			set.moves = moves;
		},
	},
	hoennpokedex: {
		effectType: 'ValidatorRule',
		name: 'Hoenn Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Hoenn region (OR/AS)",
		onValidateSet(set, format) {
			const hoennDex = [
				"Abra", "Absol", "Aggron", "Alakazam", "Altaria", "Anorith", "Armaldo", "Aron", "Azumarill", "Azurill", "Bagon", "Baltoy", "Banette", "Barboach", "Beautifly", "Beldum", "Bellossom", "Blaziken", "Breloom", "Budew", "Cacnea", "Cacturne", "Camerupt", "Carvanha", "Cascoon", "Castform", "Chimecho", "Chinchou", "Chingling", "Clamperl", "Claydol", "Combusken", "Corphish", "Corsola", "Cradily", "Crawdaunt", "Crobat", "Delcatty", "Dodrio", "Doduo", "Donphan", "Dusclops", "Dusknoir", "Duskull", "Dustox", "Electrike", "Electrode", "Exploud", "Feebas", "Flygon", "Froslass", "Gallade", "Gardevoir", "Geodude", "Girafarig", "Glalie", "Gloom", "Golbat", "Goldeen", "Golduck", "Golem", "Gorebyss", "Graveler", "Grimer", "Grovyle", "Grumpig", "Gulpin", "Gyarados", "Hariyama", "Heracross", "Horsea", "Huntail", "Igglybuff", "Illumise", "Jigglypuff", "Kadabra", "Kecleon", "Kingdra", "Kirlia", "Koffing", "Lairon", "Lanturn", "Latias", "Latios", "Lileep", "Linoone", "Lombre", "Lotad", "Loudred", "Ludicolo", "Lunatone", "Luvdisc", "Machamp", "Machoke", "Machop", "Magcargo", "Magikarp", "Magnemite", "Magneton", "Magnezone", "Makuhita", "Manectric", "Marill", "Marshtomp", "Masquerain", "Mawile", "Medicham", "Meditite", "Metagross", "Metang", "Mightyena", "Milotic", "Minun", "Mudkip", "Muk", "Natu", "Nincada", "Ninetales", "Ninjask", "Nosepass", "Numel", "Nuzleaf", "Oddish", "Pelipper", "Phanpy", "Pichu", "Pikachu", "Pinsir", "Plusle", "Poochyena", "Probopass", "Psyduck", "Raichu", "Ralts", "Regice", "Regirock", "Registeel", "Relicanth", "Rhydon", "Rhyhorn", "Rhyperior", "Roselia", "Roserade", "Sableye", "Salamence", "Sandshrew", "Sandslash", "Sceptile", "Seadra", "Seaking", "Sealeo", "Seedot", "Seviper", "Sharpedo", "Shedinja", "Shelgon", "Shiftry", "Shroomish", "Shuppet", "Silcoon", "Skarmory", "Skitty", "Slaking", "Slakoth", "Slugma", "Snorunt", "Solrock", "Spheal", "Spinda", "Spoink", "Starmie", "Staryu", "Surskit", "Swablu", "Swalot", "Swampert", "Swellow", "Taillow", "Tentacool", "Tentacruel", "Torchic", "Torkoal", "Trapinch", "Treecko", "Tropius", "Vibrava", "Vigoroth", "Vileplume", "Volbeat", "Voltorb", "Vulpix", "Wailmer", "Wailord", "Walrein", "Weezing", "Whiscash", "Whismur", "Wigglytuff", "Wingull", "Wobbuffet", "Wurmple", "Wynaut", "Xatu", "Zangoose", "Zigzagoon", "Zubat",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!hoennDex.includes(species.baseSpecies) && !this.ruleTable.has('+' + species.id)) {
				return [species.baseSpecies + " is not in the Hoenn Pokédex."];
			}
		},
	},
	sinnohpokedex: {
		effectType: 'ValidatorRule',
		name: 'Sinnoh Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Sinnoh region (Platinum)",
		onValidateSet(set, format) {
			const sinnohDex = [
				"Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Abra", "Kadabra", "Alakazam", "Magikarp", "Gyarados", "Budew", "Roselia", "Roserade", "Zubat", "Golbat", "Crobat", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Machop", "Machoke", "Machamp", "Psyduck", "Golduck", "Burmy", "Wormadam", "Mothim", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Heracross", "Aipom", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Gastly", "Haunter", "Gengar", "Misdreavus", "Mismagius", "Murkrow", "Honchkrow", "Glameow", "Purugly", "Goldeen", "Seaking", "Barboach", "Whiscash", "Chingling", "Chimecho", "Stunky", "Skuntank", "Meditite", "Medicham", "Bronzor", "Bronzong", "Ponyta", "Rapidash", "Bonsly", "Sudowoodo", "Mime Jr.", "Mr. Mime", "Happiny", "Chansey", "Blissey", "Cleffa", "Clefairy", "Clefable", "Chatot", "Pichu", "Pikachu", "Raichu", "Hoothoot", "Noctowl", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Snorlax", "Unown", "Riolu", "Lucario", "Wooper", "Quagsire", "Wingull", "Pelipper", "Girafarig", "Hippopotas", "Hippowdon", "Azurill", "Marill", "Azumarill", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Remoraid", "Octillery", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Feebas", "Milotic", "Mantyke", "Mantine", "Snover", "Abomasnow", "Sneasel", "Weavile", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Manaphy", "Rotom", "Gligar", "Gliscor", "Nosepass", "Probopass", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Lickitung", "Lickilicky", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Swablu", "Altaria", "Togepi", "Togetic", "Togekiss", "Houndour", "Houndoom", "Magnemite", "Magneton", "Magnezone", "Tangela", "Tangrowth", "Yanma", "Yanmega", "Tropius", "Rhyhorn", "Rhydon", "Rhyperior", "Duskull", "Dusclops", "Dusknoir", "Porygon", "Porygon2", "Porygon-Z", "Scyther", "Scizor", "Elekid", "Electabuzz", "Electivire", "Magby", "Magmar", "Magmortar", "Swinub", "Piloswine", "Mamoswine", "Snorunt", "Glalie", "Froslass", "Absol", "Giratina",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if ((!sinnohDex.includes(species.baseSpecies) || species.gen > 4) && !this.ruleTable.has('+' + species.id)) {
				return [`${species.name} is not in the Sinnoh Pokédex.`];
			}
		},
	},
	kalospokedex: {
		effectType: 'ValidatorRule',
		name: 'Kalos Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Kalos region (XY)",
		onValidateSet(set, format) {
			const kalosDex = [
				"Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Zigzagoon", "Linoone", "Fletchling", "Fletchinder", "Talonflame", "Pidgey", "Pidgeotto", "Pidgeot", "Scatterbug", "Spewpa", "Vivillon", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Pichu", "Pikachu", "Raichu", "Bidoof", "Bibarel", "Dunsparce", "Azurill", "Marill", "Azumarill", "Burmy", "Wormadam", "Mothim", "Surskit", "Masquerain", "Magikarp", "Gyarados", "Corphish", "Crawdaunt", "Goldeen", "Seaking", "Carvanha", "Sharpedo", "Litleo", "Pyroar", "Psyduck", "Golduck", "Farfetch\u2019d", "Riolu", "Lucario", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Flabe\u0301be\u0301", "Floette", "Florges", "Budew", "Roselia", "Roserade", "Ledyba", "Ledian", "Combee", "Vespiquen", "Skitty", "Delcatty", "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Doduo", "Dodrio", "Plusle", "Minun", "Gulpin", "Swalot", "Scraggy", "Scrafty", "Abra", "Kadabra", "Alakazam", "Oddish", "Gloom", "Vileplume", "Bellossom", "Sentret", "Furret", "Nincada", "Ninjask", "Shedinja", "Espurr", "Meowstic", "Kecleon", "Honedge", "Doublade", "Aegislash", "Venipede", "Whirlipede", "Scolipede", "Audino", "Smeargle", "Croagunk", "Toxicroak", "Ducklett", "Swanna", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Volbeat", "Illumise", "Hoppip", "Skiploom", "Jumpluff", "Munchlax", "Snorlax", "Whismur", "Loudred", "Exploud", "Meditite", "Medicham", "Zubat", "Golbat", "Crobat", "Axew", "Fraxure", "Haxorus", "Diancie", "Hoopa", "Volcanion",
				"Drifloon", "Drifblim", "Mienfoo", "Mienshao", "Zangoose", "Seviper", "Spoink", "Grumpig", "Absol", "Inkay", "Malamar", "Lunatone", "Solrock", "Bagon", "Shelgon", "Salamence", "Wingull", "Pelipper", "Taillow", "Swellow", "Binacle", "Barbaracle", "Dwebble", "Crustle", "Tentacool", "Tentacruel", "Wailmer", "Wailord", "Luvdisc", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Staryu", "Starmie", "Shellder", "Cloyster", "Qwilfish", "Horsea", "Seadra", "Kingdra", "Relicanth", "Sandile", "Krokorok", "Krookodile", "Helioptile", "Heliolisk", "Hippopotas", "Hippowdon", "Rhyhorn", "Rhydon", "Rhyperior", "Onix", "Steelix", "Woobat", "Swoobat", "Machop", "Machoke", "Machamp", "Cubone", "Marowak", "Kangaskhan", "Mawile", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Aerodactyl", "Ferroseed", "Ferrothorn", "Snubbull", "Granbull", "Electrike", "Manectric", "Houndour", "Houndoom", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Emolga", "Yanma", "Yanmega", "Hawlucha", "Sigilyph", "Golett", "Golurk", "Nosepass", "Probopass", "Makuhita", "Hariyama", "Throh", "Sawk", "Starly", "Staravia", "Staraptor", "Stunky", "Skuntank", "Nidoran-F", "Nidorina", "Nidoqueen", "Nidoran-M", "Nidorino", "Nidoking", "Dedenne", "Chingling", "Chimecho", "Mime Jr.", "Mr. Mime", "Solosis", "Duosion", "Reuniclus", "Wynaut", "Wobbuffet", "Roggenrola", "Boldore", "Gigalith", "Sableye", "Carbink", "Tauros", "Miltank", "Mareep", "Flaaffy", "Ampharos", "Pinsir", "Heracross", "Pachirisu", "Slowpoke", "Slowbro", "Slowking", "Exeggcute", "Exeggutor", "Chatot", "Mantyke", "Mantine", "Clamperl", "Huntail", "Gorebyss", "Remoraid", "Octillery", "Corsola", "Chinchou", "Lanturn", "Alomomola", "Lapras", "Articuno", "Zapdos", "Moltres",
				"Diglett", "Dugtrio", "Trapinch", "Vibrava", "Flygon", "Gible", "Gabite", "Garchomp", "Geodude", "Graveler", "Golem", "Slugma", "Magcargo", "Shuckle", "Skorupi", "Drapion", "Wooper", "Quagsire", "Goomy", "Sliggoo", "Goodra", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Bellsprout", "Weepinbell", "Victreebel", "Carnivine", "Gastly", "Haunter", "Gengar", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Ekans", "Arbok", "Stunfisk", "Barboach", "Whiscash", "Purrloin", "Liepard", "Poochyena", "Mightyena", "Patrat", "Watchog", "Pawniard", "Bisharp", "Klefki", "Murkrow", "Honchkrow", "Foongus", "Amoonguss", "Lotad", "Lombre", "Ludicolo", "Buizel", "Floatzel", "Basculin", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Litwick", "Lampent", "Chandelure", "Rotom", "Magnemite", "Magneton", "Magnezone", "Voltorb", "Electrode", "Trubbish", "Garbodor", "Swinub", "Piloswine", "Mamoswine", "Bergmite", "Avalugg", "Cubchoo", "Beartic", "Smoochum", "Jynx", "Vanillite", "Vanillish", "Vanilluxe", "Snover", "Abomasnow", "Delibird", "Sneasel", "Weavile", "Timburr", "Gurdurr", "Conkeldurr", "Torkoal", "Sandshrew", "Sandslash", "Aron", "Lairon", "Aggron", "Larvitar", "Pupitar", "Tyranitar", "Heatmor", "Durant", "Spinarak", "Ariados", "Spearow", "Fearow", "Cryogonal", "Skarmory", "Noibat", "Noivern", "Gligar", "Gliscor", "Hoothoot", "Noctowl", "Igglybuff", "Jigglypuff", "Wigglytuff", "Shuppet", "Banette", "Zorua", "Zoroark", "Gothita", "Gothorita", "Gothitelle", "Bonsly", "Sudowoodo", "Spinda", "Teddiursa", "Ursaring", "Lickitung", "Lickilicky", "Scyther", "Scizor", "Ditto", "Swablu", "Altaria", "Druddigon", "Deino", "Zweilous", "Hydreigon", "Dratini", "Dragonair", "Dragonite", "Xerneas", "Yveltal", "Zygarde", "Mewtwo",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if ((!kalosDex.includes(species.baseSpecies) || species.gen > 6) && !this.ruleTable.has('+' + species.id)) {
				return [`${species.name} is not in the Kalos Pokédex.`];
			}
		},
	},
	alolapokedex: {
		effectType: 'ValidatorRule',
		name: 'Alola Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Alola region (US/UM)",
		onValidateSet(set, format) {
			const alolaDex = [
				"Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Pikipek", "Trumbeak", "Toucannon", "Yungoos", "Gumshoos", "Rattata-Alola", "Raticate-Alola", "Caterpie", "Metapod", "Butterfree", "Ledyba", "Ledian", "Spinarak", "Ariados", "Buneary", "Lopunny", "Inkay", "Malamar", "Zorua", "Zoroark", "Furfrou", "Pichu", "Pikachu", "Raichu-Alola", "Grubbin", "Charjabug", "Vikavolt", "Bonsly", "Sudowoodo", "Happiny", "Chansey", "Blissey", "Munchlax", "Snorlax", "Slowpoke", "Slowbro", "Slowking", "Wingull", "Pelipper", "Abra", "Kadabra", "Alakazam", "Meowth-Alola", "Persian-Alola", "Magnemite", "Magneton", "Magnezone", "Grimer-Alola", "Muk-Alola", "Mime Jr.", "Mr. Mime", "Ekans", "Arbok", "Dunsparce", "Growlithe", "Arcanine", "Drowzee", "Hypno", "Makuhita", "Hariyama", "Smeargle", "Crabrawler", "Crabominable", "Gastly", "Haunter", "Gengar", "Drifloon", "Drifblim", "Murkrow", "Honchkrow", "Zubat", "Golbat", "Crobat", "Noibat", "Noivern", "Diglett-Alola", "Dugtrio-Alola", "Spearow", "Fearow", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Mankey", "Primeape", "Delibird", "Hawlucha", "Oricorio", "Cutiefly", "Ribombee", "Flabe\u0301be\u0301", "Floette", "Florges", "Petilil", "Lilligant", "Cottonee", "Whimsicott", "Psyduck", "Golduck", "Smoochum", "Jynx", "Magikarp", "Gyarados", "Barboach", "Whiscash", "Seal", "Dewgong", "Machop", "Machoke", "Machamp", "Roggenrola", "Boldore", "Gigalith", "Carbink", "Sableye", "Mawile", "Rockruff", "Lycanroc", "Spinda", "Tentacool", "Tentacruel", "Finneon", "Lumineon", "Wishiwashi", "Luvdisc", "Corsola", "Mareanie", "Toxapex", "Shellder", "Cloyster", "Clamperl", "Huntail", "Gorebyss", "Remoraid", "Octillery", "Mantyke", "Mantine", "Bagon", "Shelgon", "Salamence", "Lillipup", "Herdier", "Stoutland", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Mareep", "Flaaffy", "Ampharos", "Mudbray", "Mudsdale", "Igglybuff", "Jigglypuff", "Wigglytuff", "Tauros", "Miltank", "Surskit", "Masquerain", "Dewpider", "Araquanid", "Fomantis", "Lurantis", "Morelull", "Shiinotic", "Paras", "Parasect", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Goldeen", "Seaking", "Basculin", "Feebas", "Milotic", "Alomomola", "Fletchling", "Fletchinder", "Talonflame", "Salandit", "Salazzle", "Cubone", "Marowak-Alola", "Kangaskhan", "Magby", "Magmar", "Magmortar", "Larvesta", "Volcarona", "Stufful", "Bewear", "Bounsweet", "Steenee", "Tsareena", "Comfey", "Pinsir", "Hoothoot", "Noctowl", "Kecleon", "Oranguru", "Passimian", "Goomy", "Sliggoo", "Goodra", "Castform", "Wimpod", "Golisopod", "Staryu", "Starmie", "Sandygast", "Palossand", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Lileep", "Cradily", "Anorith", "Armaldo", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Tirtouga", "Carracosta", "Archen", "Archeops", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Pupitar", "Larvitar", "Tyranitar", "Phantump", "Trevenant", "Natu", "Xatu", "Nosepass", "Probopass", "Pyukumuku", "Chinchou", "Lanturn", "Type: Null", "Silvally", "Poipole", "Naganadel", "Zygarde", "Trubbish", "Garbodor", "Minccino", "Cinccino", "Pineco", "Forretress", "Skarmory", "Ditto", "Cleffa", "Clefairy", "Clefable", "Elgyem", "Beheeyem", "Minior", "Beldum", "Metang", "Metagross", "Porygon", "Porygon2", "Porygon-Z", "Pancham", "Pangoro", "Komala", "Torkoal", "Turtonator", "Houndour", "Houndoom", "Dedenne", "Togedemaru", "Electrike", "Manectric", "Elekid", "Electabuzz", "Electivire", "Geodude-Alola", "Graveler-Alola", "Golem-Alola", "Sandile", "Krokorok", "Krookodile", "Trapinch", "Vibrava", "Flygon", "Gible", "Gabite", "Garchomp", "Baltoy", "Claydol", "Golett", "Golurk", "Klefki", "Mimikyu", "Shuppet", "Banette", "Frillish", "Jellicent", "Bruxish", "Drampa", "Absol", "Snorunt", "Glalie", "Froslass", "Sneasel", "Weavile", "Sandshrew-Alola", "Sandslash-Alola", "Vulpix-Alola", "Ninetales-Alola", "Vanillite", "Vanillish", "Vanilluxe", "Scraggy", "Scrafty", "Pawniard", "Bisharp", "Snubbull", "Granbull", "Shellos", "Gastrodon", "Relicanth", "Dhelmise", "Carvanha", "Sharpedo", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Wailmer", "Wailord", "Lapras", "Tropius", "Exeggcute", "Exeggutor-Alola", "Corphish", "Crawdaunt", "Mienfoo", "Mienshao", "Jangmo-o", "Hakamo-o", "Kommo-o", "Emolga", "Scyther", "Scizor", "Heracross", "Aipom", "Ampibom", "Litleo", "Pyroar", "Misdreavus", "Mismagius", "Druddigon", "Lickitung", "Lickilicky", "Riolu", "Lucario", "Dratini", "Dragonair", "Dragonite", "Aerodactyl", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Nihilego", "Stakataka", "Blacephalon", "Buzzwole", "Pheromosa", "Xurkitree", "Celesteela", "Kartana", "Guzzlord", "Necrozma", "Magearna", "Marshadow", "Zeraora",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!alolaDex.includes(species.baseSpecies) && !alolaDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Alola Pokédex.`];
			}
		},
	},
	galarpokedex: {
		effectType: 'ValidatorRule',
		name: 'Galar Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Galar region (Sw/Sh)",
		banlist: ['Raichu-Alola', 'Weezing-Base'],
		onValidateSet(set, format) {
			const galarDex = [
				"Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Blipbug", "Dottler", "Orbeetle", "Caterpie", "Metapod", "Butterfree", "Grubbin", "Charjabug", "Vikavolt", "Hoothoot", "Noctowl", "Rookidee", "Corvisquire", "Corviknight", "Skwovet", "Greedent", "Pidove", "Tranquill", "Unfezant", "Nickit", "Thievul", "Zigzagoon", "Linoone", "Obstagoon", "Wooloo", "Dubwool", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Chewtle", "Drednaw", "Purrloin", "Liepard", "Yamper", "Boltund", "Bunnelby", "Diggersby", "Minccino", "Cinccino", "Bounsweet", "Steenee", "Tsareena", "Oddish", "Gloom", "Vileplume", "Bellossom", "Budew", "Roselia", "Roserade", "Wingull", "Pelipper", "Joltik", "Galvantula", "Electrike", "Manectric", "Vulpix", "Ninetales", "Growlithe", "Arcanine", "Vanillite", "Vanillish", "Vanilluxe", "Swinub", "Piloswine", "Mamoswine", "Delibird", "Snorunt", "Glalie", "Froslass", "Baltoy", "Claydol", "Mudbray", "Mudsdale", "Dwebble", "Crustle", "Golett", "Golurk", "Munna", "Musharna", "Natu", "Xatu", "Stufful", "Bewear", "Snover", "Abomasnow", "Krabby", "Kingler", "Wooper", "Quagsire", "Corphish", "Crawdaunt", "Nincada", "Ninjask", "Shedinja", "Tyrogue", "Hitmonlee", "Hitmonchan", "Hitmontop", "Pancham", "Pangoro", "Klink", "Klang", "Klinklang", "Combee", "Vespiquen", "Bronzor", "Bronzong", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Drifloon", "Drifblim", "Gossifleur", "Eldegoss", "Cherubi", "Cherrim", "Stunky", "Skuntank", "Tympole", "Palpitoad", "Seismitoad", "Duskull", "Dusclops", "Dusknoir", "Machop", "Machoke", "Machamp", "Gastly", "Haunter", "Gengar", "Magikarp", "Gyarados", "Goldeen", "Seaking", "Remoraid", "Octillery", "Shellder", "Cloyster", "Feebas", "Milotic", "Basculin", "Wishiwashi", "Pyukumuku", "Trubbish", "Garbodor", "Sizzlipede", "Centiskorch", "Rolycoly", "Carkol", "Coalossal", "Diglett", "Dugtrio", "Drilbur", "Excadrill", "Roggenrola", "Boldore", "Gigalith", "Timburr", "Gurdurr", "Conkeldurr", "Woobat", "Swoobat", "Noibat", "Noivern", "Onix", "Steelix", "Arrokuda", "Barraskewda", "Meowth", "Perrserker", "Persian", "Milcery", "Alcremie", "Cutiefly", "Ribombee", "Ferroseed", "Ferrothorn", "Pumpkaboo", "Gourgeist", "Pichu", "Pikachu", "Raichu", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon", "Applin", "Flapple", "Appletun", "Espurr", "Meowstic", "Swirlix", "Slurpuff", "Spritzee", "Aromatisse", "Dewpider", "Araquanid", "Wynaut", "Wobbuffet", "Farfetch\u2019d", "Sirfetch\u2019d", "Chinchou", "Lanturn", "Croagunk", "Toxicroak", "Scraggy", "Scrafty", "Stunfisk", "Shuckle", "Barboach", "Whiscash", "Shellos", "Gastrodon", "Wimpod", "Golisopod", "Binacle", "Barbaracle", "Corsola", "Cursola", "Impidimp", "Morgrem", "Grimmsnarl", "Hatenna", "Hattrem", "Hatterene", "Salandit", "Salazzle", "Pawniard", "Bisharp", "Throh", "Sawk", "Koffing", "Weezing", "Bonsly", "Sudowoodo", "Cleffa", "Clefairy", "Clefable", "Togepi", "Togetic", "Togekiss", "Munchlax", "Snorlax", "Cottonee", "Whimsicott", "Rhyhorn", "Rhydon", "Rhyperior", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Karrablast", "Escavalier", "Shelmet", "Accelgor", "Elgyem", "Beheeyem", "Cubchoo", "Beartic", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Skorupi", "Drapion", "Litwick", "Lampent", "Chandelure", "Inkay", "Malamar", "Sneasel", "Weavile", "Sableye", "Mawile", "Maractus", "Sigilyph", "Riolu", "Lucario", "Torkoal", "Mimikyu", "Cufant", "Copperajah", "Qwilfish", "Frillish", "Jellicent", "Mareanie", "Toxapex", "Cramorant", "Toxel", "Toxtricity", "Toxtricity-Low-Key", "Silicobra", "Sandaconda", "Hippopotas", "Hippowdon", "Durant", "Heatmor", "Helioptile", "Heliolisk", "Hawlucha", "Trapinch", "Vibrava", "Flygon", "Axew", "Fraxure", "Haxorus", "Yamask", "Runerigus", "Cofagrigus", "Honedge", "Doublade", "Aegislash", "Ponyta", "Rapidash", "Sinistea", "Polteageist", "Indeedee", "Phantump", "Trevenant", "Morelull", "Shiinotic", "Oranguru", "Passimian", "Morpeko", "Falinks", "Drampa", "Turtonator", "Togedemaru", "Snom", "Frosmoth", "Clobbopus", "Grapploct", "Pincurchin", "Mantyke", "Mantine", "Wailmer", "Wailord", "Bergmite", "Avalugg", "Dhelmise", "Lapras", "Lunatone", "Solrock", "Mime Jr.", "Mr. Mime", "Mr. Rime", "Darumaka", "Darmanitan", "Stonjourner", "Eiscue", "Duraludon", "Rotom", "Ditto", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish", "Charmander", "Charmeleon", "Charizard", "Type: Null", "Silvally", "Larvitar", "Pupitar", "Tyranitar", "Deino", "Zweilous", "Hydreigon", "Goomy", "Sliggoo", "Goodra", "Jangmo-o", "Hakamo-o", "Kommo-o", "Dreepy", "Drakloak", "Dragapult",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!galarDex.includes(species.baseSpecies) && !galarDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Galar Pokédex.`];
			}
		},
	},
	isleofarmorpokedex: {
		effectType: 'ValidatorRule',
		name: 'Isle of Armor Pokedex',
		desc: "Only allows Pok&eacute;mon native to the Isle of Armor in the Galar Region (Sw/Sh DLC1)",
		onValidateSet(set, format) {
			const ioaDex = [
				"Slowpoke", "Slowbro", "Slowking", "Buneary", "Lopunny", "Happiny", "Chansey", "Blissey", "Skwovet", "Greedent", "Igglybuff", "Jigglypuff", "Wigglytuff", "Blipbug", "Dottler", "Fomantis", "Lurantis", "Applin", "Flapple", "Appletun", "Fletchling", "Fletchinder", "Talonflame", "Shinx", "Luxio", "Luxray", "Klefki", "Pawniard", "Bisharp", "Abra", "Kadabra", "Alakazam", "Ralts", "Kirlia", "Gardevoir", "Gallade", "Krabby", "Kingler", "Tentacool", "Tentacruel", "Magikarp", "Gyarados", "Remoraid", "Octillery", "Mantyke", "Mantine", "Wingull", "Pelipper", "Skorupi", "Drapion", "Dunsparce", "Bouffalant", "Lickitung", "Lickilicky", "Chewtle", "Drednaw", "Wooper", "Quagsire", "Goomy", "Sliggoo", "Goodra", "Druddigon", "Shelmet", "Accelgor", "Karrablast", "Escavalier", "Bulbasaur", "Ivysaur", "Venusaur", "Squirtle", "Wartortle", "Blastoise", "Venipede", "Whirlipede", "Scolipede", "Foongus", "Amoonguss", "Comfey", "Tangela", "Tangrowth", "Croagunk", "Toxicroak", "Pichu", "Pikachu", "Raichu", "Zorua", "Zoroark", "Oranguru", "Passimian", "Corphish", "Crawdaunt", "Cramorant", "Goldeen", "Seaking", "Arrokuda", "Barraskewda", "Staryu", "Starmie", "Kubfu", "Urshifu", "Emolga", "Dedenne", "Morpeko", "Magnemite", "Magneton", "Magnezone", "Inkay", "Malamar", "Wishiwashi", "Carvanha", "Sharpedo", "Lillipup", "Herdier", "Stoutland", "Tauros", "Miltank", "Scyther", "Scizor", "Pinsir", "Heracross", "Dwebble", "Crustle", "Wimpod", "Golisopod", "Pincurchin", "Mareanie", "Toxapex", "Clobbopus", "Grapploct", "Shellder", "Cloyster", "Sandygast", "Palossand", "Drifloon", "Drifblim", "Barboach", "Whiscash", "Azurill", "Marill", "Azumarill", "Poliwag", "Poliwhirl", "Poliwrath", "Politoed", "Psyduck", "Golduck", "Whismur", "Loudred", "Exploud", "Woobat", "Swoobat", "Skarmory", "Roggenrola", "Boldore", "Gigalith", "Rockruff", "Lycanroc", "Salandit", "Salazzle", "Scraggy", "Scrafty", "Mienfoo", "Mienshao", "Jangmo-o", "Hakamo-o", "Kommo-o", "Sandshrew", "Sandslash", "Cubone", "Marowak", "Kangaskhan", "Torkoal", "Silicobra", "Sandaconda", "Sandile", "Krokorok", "Krookodile", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Rhyhorn", "Rhydon", "Rhyperior", "Larvesta", "Volcarona", "Chinchou", "Lanturn", "Wailmer", "Wailord", "Frillish", "Jellicent", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Horsea", "Seadra", "Kingdra", "Petilil", "Lilligant", "Combee", "Vespiquen", "Exeggcute", "Exeggutor", "Ditto", "Porygon", "Porygon2", "Porygon-Z",
			];
			const species = this.dex.getSpecies(set.species || set.name);
			if (!ioaDex.includes(species.baseSpecies) && !ioaDex.includes(species.name) &&
				!this.ruleTable.has('+' + species.id)) {
				return [`${species.baseSpecies} is not in the Isle of Armor Pokédex.`];
			}
		},
	},
	potd: {
		effectType: 'Rule',
		name: 'PotD',
		onBegin() {
			if (global.Config && global.Config.potd) {
				this.add('rule', "Pokemon of the Day: " + this.dex.getSpecies(Config.potd).name);
			}
		},
	},
	teampreview: {
		effectType: 'Rule',
		name: 'Team Preview',
		desc: "Allows each player to see the Pok&eacute;mon on their opponent's team before they choose their lead Pok&eacute;mon",
		onBegin() {
			this.add('clearpoke');
			for (const pokemon of this.getAllPokemon()) {
				const details = pokemon.details.replace(', shiny', '')
					.replace(/(Arceus|Gourgeist|Genesect|Pumpkaboo|Silvally|Urshifu)(-[a-zA-Z?-]+)?/g, '$1-*');
				this.add('poke', pokemon.side.id, details, this.gen < 8 && pokemon.item ? 'item' : '');
			}
		},
		onTeamPreview() {
			this.makeRequest('teampreview');
		},
	},
	onevsone: {
		effectType: 'Rule',
		name: 'One vs One',
		desc: "Only allows one Pok&eacute;mon in battle",
		onValidateTeam(team, format) {
			if (format.gameType !== 'singles') {
				return [`One vs One is for singles formats.`, `(Use Two vs Two in doubles)`];
			}
		},
		onStart() {
			if (this.format.gameType === 'singles') (this.format as any).teamLength = {battle: 1};
		},
	},
	twovstwo: {
		effectType: 'Rule',
		name: 'Two vs Two',
		desc: "Only allows two Pok&eacute;mon in battle",
		onValidateTeam(team, format) {
			if (format.gameType === 'triples') {
				return [`Two vs Two is for non-triples formats.`];
			}
		},
		onStart() {
			if (this.format.gameType !== 'triples') (this.format as any).teamLength = {battle: 2};
		},
	},
	littlecup: {
		effectType: 'ValidatorRule',
		name: 'Little Cup',
		desc: "Only allows Pok&eacute;mon that can evolve and don't have any prior evolutions",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species || set.name);
			if (species.prevo && this.dex.getSpecies(species.prevo).gen <= this.gen) {
				return [set.species + " isn't the first in its evolution family."];
			}
			if (!species.nfe) {
				return [set.species + " doesn't have an evolution family."];
			}
			// Temporary hack for LC past-gen formats and other mashups
			if (set.level > 5) {
				return [`${set.species} can't be above level 5 in Little Cup formats.`];
			}
		},
	},
	blitz: {
		effectType: 'Rule',
		name: 'Blitz',
		// THIS 100% INTENTIONALLY SAYS TEN SECONDS PER TURN
		// IGNORE maxPerTurn. addPerTurn IS 5, TRANSLATING TO AN INCREMENT OF 10.
		desc: "Super-fast 'Blitz' timer giving 30 second Team Preview and 10 seconds per turn.",
		onBegin() {
			this.add('rule', 'Blitz: Super-fast timer');
		},
		timer: {starting: 15, addPerTurn: 5, maxPerTurn: 15, maxFirstTurn: 40, grace: 30},
	},
	vgctimer: {
		effectType: 'Rule',
		name: 'VGC Timer',
		desc: "VGC's timer: 90 second Team Preview, 7 minutes Your Time, 1 minute per turn",
		timer: {
			starting: 7 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90,
			grace: 90, timeoutAutoChoose: true, dcTimerBank: false,
		},
	},
	speciesclause: {
		effectType: 'ValidatorRule',
		name: 'Species Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon from the same species",
		onBegin() {
			this.add('rule', 'Species Clause: Limit one of each Pokémon');
		},
		onValidateTeam(team, format) {
			const speciesTable: Set<number> = new Set();
			for (const set of team) {
				const species = this.dex.getSpecies(set.species);
				if (speciesTable.has(species.num)) {
					return [`You are limited to one of each Pokémon by Species Clause.`, `(You have more than one ${species.baseSpecies})`];
				}
				speciesTable.add(species.num);
			}
		},
	},
	nicknameclause: {
		effectType: 'ValidatorRule',
		name: 'Nickname Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same nickname",
		onValidateTeam(team, format) {
			const nameTable: Set<string> = new Set();
			for (const set of team) {
				const name = set.name;
				if (name) {
					if (name === this.dex.getSpecies(set.species).baseSpecies) continue;
					if (nameTable.has(name)) {
						return [`Your Pokémon must have different nicknames.`, `(You have more than one ${name})`];
					}
					nameTable.add(name);
				}
			}
			// Illegality of impersonation of other species is
			// hardcoded in team-validator.js, so we are done.
		},
	},
	itemclause: {
		effectType: 'ValidatorRule',
		name: 'Item Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon with the same item",
		onBegin() {
			this.add('rule', 'Item Clause: Limit one of each item');
		},
		onValidateTeam(team) {
			const itemTable: Set<string> = new Set();
			for (const set of team) {
				const item = this.toID(set.item);
				if (!item) continue;
				if (itemTable.has(item)) {
					return [
						`You are limited to one of each item by Item Clause.`,
						`(You have more than one ${this.dex.getItem(item).name})`,
					];
				}
				itemTable.add(item);
			}
		},
	},
	"2abilityclause": {
		effectType: 'ValidatorRule',
		name: '2 Ability Clause',
		desc: "Prevents teams from having more than two Pok&eacute;mon with the same ability",
		onBegin() {
			this.add('rule', '2 Ability Clause: Limit two of each ability');
		},
		onValidateTeam(team) {
			const abilityTable: {[k: string]: number} = {};
			const base: {[k: string]: string} = {
				airlock: 'cloudnine',
				battlearmor: 'shellarmor',
				clearbody: 'whitesmoke',
				dazzling: 'queenlymajesty',
				emergencyexit: 'wimpout',
				filter: 'solidrock',
				gooey: 'tanglinghair',
				insomnia: 'vitalspirit',
				ironbarbs: 'roughskin',
				libero: 'protean',
				minus: 'plus',
				powerofalchemy: 'receiver',
				teravolt: 'moldbreaker',
				turboblaze: 'moldbreaker',
			};
			for (const set of team) {
				let ability: string = this.toID(set.ability);
				if (!ability) continue;
				if (ability in base) ability = base[ability];
				if (ability in abilityTable) {
					if (abilityTable[ability] >= 2) {
						return [
							`You are limited to two of each ability by 2 Ability Clause.`,
							`(You have more than two ${this.dex.getAbility(ability).name} variants)`,
						];
					}
					abilityTable[ability]++;
				} else {
					abilityTable[ability] = 1;
				}
			}
		},
	},
	ohkoclause: {
		effectType: 'ValidatorRule',
		name: 'OHKO Clause',
		desc: "Bans all OHKO moves, such as Fissure",
		onBegin() {
			this.add('rule', 'OHKO Clause: OHKO moves are banned');
		},
		onValidateSet(set) {
			const problems: string[] = [];
			if (set.moves) {
				for (const moveId of set.moves) {
					const move = this.dex.getMove(moveId);
					if (move.ohko) problems.push(move.name + ' is banned by OHKO Clause.');
				}
			}
			return problems;
		},
	},
	evasionabilitiesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Abilities Clause',
		desc: "Bans abilities that boost Evasion under certain weather conditions",
		banlist: ['Sand Veil', 'Snow Cloak'],
		onBegin() {
			this.add('rule', 'Evasion Abilities Clause: Evasion abilities are banned');
		},
	},
	evasionmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Evasion Moves Clause',
		desc: "Bans moves that consistently raise the user's evasion when used",
		banlist: ['Minimize', 'Double Team'],
		onBegin() {
			this.add('rule', 'Evasion Moves Clause: Evasion moves are banned');
		},
	},
	accuracymovesclause: {
		effectType: 'ValidatorRule',
		name: 'Accuracy Moves Clause',
		desc: "Bans moves that have a chance to lower the target's accuracy when used",
		banlist: [
			'Flash', 'Kinesis', 'Leaf Tornado', 'Mirror Shot', 'Mud Bomb', 'Mud-Slap', 'Muddy Water', 'Night Daze', 'Octazooka', 'Sand Attack', 'Smokescreen',
		],
		onBegin() {
			this.add('rule', 'Accuracy Moves Clause: Accuracy-lowering moves are banned');
		},
	},
	sleepmovesclause: {
		effectType: 'ValidatorRule',
		name: 'Sleep Moves Clause',
		desc: "Bans all moves that induce sleep, such as Hypnosis",
		banlist: ['Yawn'],
		onBegin() {
			this.add('rule', 'Sleep Clause: Sleep-inducing moves are banned');
		},
		onValidateSet(set) {
			const problems = [];
			if (set.moves) {
				for (const id of set.moves) {
					const move = this.dex.getMove(id);
					if (move.status && move.status === 'slp') problems.push(move.name + ' is banned by Sleep Clause.');
				}
			}
			return problems;
		},
	},
	gravitysleepclause: {
		effectType: 'ValidatorRule',
		name: 'Gravity Sleep Clause',
		desc: "Bans sleep moves below 100% accuracy, in conjunction with Gravity or Gigantamax Orbeetle",
		banlist: [
			'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder',
		],
		onValidateTeam(team) {
			let hasOrbeetle = false;
			let hasSleepMove = false;
			for (const set of team) {
				const species = this.dex.getSpecies(set.species);
				if (species.name === "Orbeetle" && set.gigantamax) hasOrbeetle = true;
				if (!hasOrbeetle && species.name === "Orbeetle-Gmax") hasOrbeetle = true;
				for (const moveid of set.moves) {
					const move = this.dex.getMove(moveid);
					if (move.status && move.status === 'slp' && move.accuracy < 100) hasSleepMove = true;
				}
			}
			if (hasOrbeetle && hasSleepMove) {
				return [`The combination of Gravity and Gigantamax Orbeetle on the same team is banned.`];
			}
		},
		onBegin() {
			this.add('rule', 'Gravity Sleep Clause: The combination of sleep-inducing moves with imperfect accuracy and Gravity or Gigantamax Orbeetle are banned');
		},
	},
	endlessbattleclause: {
		effectType: 'Rule',
		name: 'Endless Battle Clause',
		desc: "Prevents players from forcing a battle which their opponent cannot end except by forfeit",
		// implemented in sim/battle.js, see https://dex.pokemonshowdown.com/articles/battlerules#endlessbattleclause for the specification.
		onBegin() {
			this.add('rule', 'Endless Battle Clause: Forcing endless battles is banned');
		},
	},
	moodyclause: {
		effectType: 'ValidatorRule',
		name: 'Moody Clause',
		desc: "Bans the ability Moody",
		banlist: ['Moody'],
		onBegin() {
			this.add('rule', 'Moody Clause: Moody is banned');
		},
	},
	swaggerclause: {
		effectType: 'ValidatorRule',
		name: 'Swagger Clause',
		desc: "Bans the move Swagger",
		banlist: ['Swagger'],
		onBegin() {
			this.add('rule', 'Swagger Clause: Swagger is banned');
		},
	},
	batonpassclause: {
		effectType: 'ValidatorRule',
		name: 'Baton Pass Clause',
		desc: "Stops teams from having more than one Pok&eacute;mon with Baton Pass, and no Pok&eacute;mon may be capable of passing boosts to both Speed and another stat",
		banlist: ["Baton Pass > 1"],
		onBegin() {
			this.add('rule', 'Baton Pass Clause: Limit one Baton Passer, can\'t pass Spe and other stats simultaneously');
		},
		onValidateSet(set, format, setHas) {
			if (!('move:batonpass' in setHas)) return;

			const item = this.dex.getItem(set.item);
			const ability = this.toID(set.ability);
			let speedBoosted: boolean | string = false;
			let nonSpeedBoosted: boolean | string = false;

			for (const moveId of set.moves) {
				const move = this.dex.getMove(moveId);
				if (move.id === 'flamecharge' || (move.boosts && move.boosts.spe && move.boosts.spe > 0)) {
					speedBoosted = true;
				}
				const nonSpeedBoostedMoves = [
					'acupressure', 'bellydrum', 'chargebeam', 'curse', 'diamondstorm', 'fellstinger', 'fierydance',
					'flowershield', 'poweruppunch', 'rage', 'rototiller', 'skullbash', 'stockpile',
				];
				if (nonSpeedBoostedMoves.includes(move.id) ||
					move.boosts && ((move.boosts.atk && move.boosts.atk > 0) || (move.boosts.def && move.boosts.def > 0) ||
					(move.boosts.spa && move.boosts.spa > 0) || (move.boosts.spd && move.boosts.spd > 0))) {
					nonSpeedBoosted = true;
				}
				if (item.zMove && move.type === item.zMoveType && move.zMove?.boost) {
					const boosts = move.zMove.boost;
					if (boosts.spe && boosts.spe > 0) {
						if (!speedBoosted) speedBoosted = move.name;
					}
					if (
						((boosts.atk && boosts.atk > 0) || (boosts.def && boosts.def > 0) ||
						(boosts.spa && boosts.spa > 0) || (boosts.spd && boosts.spd > 0))
					) {
						if (!nonSpeedBoosted || move.name === speedBoosted) nonSpeedBoosted = move.name;
					}
				}
			}

			const speedBoostedAbilities = ['motordrive', 'rattled', 'speedboost', 'steadfast', 'weakarmor'];
			const speedBoostedItems = ['blazikenite', 'eeviumz', 'kommoniumz', 'salacberry'];
			if (speedBoostedAbilities.includes(ability) || speedBoostedItems.includes(item.id)) {
				speedBoosted = true;
			}
			if (!speedBoosted) return;

			const nonSpeedBoostedAbilities = [
				'angerpoint', 'competitive', 'defiant', 'download', 'justified', 'lightningrod', 'moxie', 'sapsipper', 'stormdrain',
			];
			const nonSpeedBoostedItems = [
				'absorbbulb', 'apicotberry', 'cellbattery', 'eeviumz', 'ganlonberry', 'keeberry', 'kommoniumz', 'liechiberry',
				'luminousmoss', 'marangaberry', 'petayaberry', 'snowball', 'starfberry', 'weaknesspolicy',
			];
			if (nonSpeedBoostedAbilities.includes(ability) || nonSpeedBoostedItems.includes(item.id)) {
				nonSpeedBoosted = true;
			}
			if (!nonSpeedBoosted) return;

			// if both boost sources are Z-moves, and they're distinct
			if (speedBoosted !== nonSpeedBoosted && typeof speedBoosted === 'string' && typeof nonSpeedBoosted === 'string') return;

			return [
				`${set.name || set.species} can Baton Pass both Speed and a different stat, which is banned by Baton Pass Clause.`,
			];
		},
	},
	"3batonpassclause": {
		effectType: 'ValidatorRule',
		name: '3 Baton Pass Clause',
		desc: "Stops teams from having more than three Pok&eacute;mon with Baton Pass",
		banlist: ["Baton Pass > 3"],
		onBegin() {
			this.add('rule', '3 Baton Pass Clause: Limit three Baton Passers');
		},
	},
	cfzclause: {
		effectType: 'ValidatorRule',
		name: 'CFZ Clause',
		desc: "Bans the use of crystal-free Z-Moves",
		banlist: [
			'10,000,000 Volt Thunderbolt', 'Acid Downpour', 'All-Out Pummeling', 'Black Hole Eclipse', 'Bloom Doom',
			'Breakneck Blitz', 'Catastropika', 'Clangorous Soulblaze', 'Continental Crush', 'Corkscrew Crash',
			'Devastating Drake', 'Extreme Evoboost', 'Genesis Supernova', 'Gigavolt Havoc', 'Guardian of Alola',
			'Hydro Vortex', 'Inferno Overdrive', 'Let\'s Snuggle Forever', 'Light That Burns the Sky',
			'Malicious Moonsault', 'Menacing Moonraze Maelstrom', 'Never-Ending Nightmare', 'Oceanic Operetta',
			'Pulverizing Pancake', 'Savage Spin-Out', 'Searing Sunraze Smash', 'Shattered Psyche', 'Sinister Arrow Raid',
			'Soul-Stealing 7-Star Strike', 'Splintered Stormshards', 'Stoked Sparksurfer', 'Subzero Slammer',
			'Supersonic Skystrike', 'Tectonic Rage', 'Twinkle Tackle',
		],
		onBegin() {
			this.add('rule', 'CFZ Clause: Crystal-free Z-Moves are banned');
		},
	},
	zmoveclause: {
		effectType: 'ValidatorRule',
		name: 'Z-Move Clause',
		desc: "Bans Pok&eacute;mon from holding Z-Crystals",
		onValidateSet(set) {
			const item = this.dex.getItem(set.item);
			if (item.zMove) return [`${set.name || set.species}'s item ${item.name} is banned by Z-Move Clause.`];
		},
		onBegin() {
			this.add('rule', 'Z-Move Clause: Z-Moves are banned');
		},
	},
	notfullyevolved: {
		effectType: 'ValidatorRule',
		name: 'Not Fully Evolved',
		desc: "Bans Pok&eacute;mon that are fully evolved or can't evolve",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species);
			if (!species.nfe) {
				return [set.species + " cannot evolve."];
			}
		},
	},
	hppercentagemod: {
		effectType: 'Rule',
		name: 'HP Percentage Mod',
		desc: "Shows the HP of Pok&eacute;mon in percentages",
		onBegin() {
			this.add('rule', 'HP Percentage Mod: HP is shown in percentages');
			this.reportPercentages = true;
		},
	},
	exacthpmod: {
		effectType: 'Rule',
		name: 'Exact HP Mod',
		desc: "Shows the exact HP of all Pok&eacute;mon",
		onBegin() {
			this.add('rule', 'Exact HP Mod: Exact HP is shown');
			this.reportExactHP = true;
		},
	},
	cancelmod: {
		effectType: 'Rule',
		name: 'Cancel Mod',
		desc: "Allows players to change their own choices before their opponents make one",
		onBegin() {
			this.supportCancel = true;
		},
	},
	sleepclausemod: {
		effectType: 'Rule',
		name: 'Sleep Clause Mod',
		desc: "Prevents players from putting more than one of their opponent's Pok&eacute;mon to sleep at a time, and bans Mega Gengar from using Hypnosis",
		banlist: ['Hypnosis + Gengarite'],
		onBegin() {
			this.add('rule', 'Sleep Clause Mod: Limit one foe put to sleep');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						if (!pokemon.statusData.source || pokemon.statusData.source.side !== pokemon.side) {
							this.add('-message', 'Sleep Clause Mod activated.');
							return false;
						}
					}
				}
			}
		},
	},
	stadiumsleepclause: {
		effectType: 'Rule',
		name: 'Stadium Sleep Clause',
		desc: "Prevents players from putting one of their opponent's Pok\u00E9mon to sleep if any of the opponent's other Pok\u00E9mon are asleep (different from Sleep Clause Mod because putting your own Pok\u00E9mon to sleep is enough to prevent opponents from putting your others to sleep).",
		onBegin() {
			this.add('rule', 'Stadium Sleep Clause: Limit one foe put to sleep');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'slp') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.hp && pokemon.status === 'slp') {
						this.add('-message', "Sleep Clause activated. (In Stadium, Sleep Clause activates if any of the opponent's Pokemon are asleep, even if self-inflicted from Rest)");
						return false;
					}
				}
			}
		},
	},
	switchpriorityclausemod: {
		effectType: 'Rule',
		name: 'Switch Priority Clause Mod',
		desc: "Makes a faster Pokémon switch first when double-switching, unlike in Emerald link battles, where player 1's Pokémon would switch first",
		onBegin() {
			this.add('rule', 'Switch Priority Clause Mod: Faster Pokémon switch first');
		},
	},
	freezeclausemod: {
		effectType: 'Rule',
		name: 'Freeze Clause Mod',
		desc: "Prevents players from freezing more than one of their opponent's Pok&eacute;mon at a time",
		onBegin() {
			this.add('rule', 'Freeze Clause Mod: Limit one foe frozen');
		},
		onSetStatus(status, target, source) {
			if (source && source.side === target.side) {
				return;
			}
			if (status.id === 'frz') {
				for (const pokemon of target.side.pokemon) {
					if (pokemon.status === 'frz') {
						this.add('-message', 'Freeze Clause activated.');
						return false;
					}
				}
			}
		},
	},
	sametypeclause: {
		effectType: 'ValidatorRule',
		name: 'Same Type Clause',
		desc: "Forces all Pok&eacute;mon on a team to share a type with each other",
		onBegin() {
			this.add('rule', 'Same Type Clause: Pokémon in a team must share a type');
		},
		onValidateTeam(team) {
			let typeTable: string[] = [];
			for (const [i, set] of team.entries()) {
				let species = this.dex.getSpecies(set.species);
				if (!species.types) return [`Invalid pokemon ${set.name || set.species}`];
				if (i === 0) {
					typeTable = species.types;
				} else {
					typeTable = typeTable.filter(type => species.types.includes(type));
				}
				if (this.gen >= 7) {
					const item = this.dex.getItem(set.item);
					if (item.megaStone && species.name === item.megaEvolves) {
						species = this.dex.getSpecies(item.megaStone);
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
					if (item.id === "ultranecroziumz" && species.baseSpecies === "Necrozma") {
						species = this.dex.getSpecies("Necrozma-Ultra");
						typeTable = typeTable.filter(type => species.types.includes(type));
					}
				}
				if (!typeTable.length) return [`Your team must share a type.`];
			}
		},
	},
	megarayquazaclause: {
		effectType: 'Rule',
		name: 'Mega Rayquaza Clause',
		desc: "Prevents Rayquaza from mega evolving",
		onBegin() {
			this.add('rule', 'Mega Rayquaza Clause: You cannot mega evolve Rayquaza');
			for (const pokemon of this.getAllPokemon()) {
				if (pokemon.species.id === 'rayquaza') pokemon.canMegaEvo = null;
			}
		},
	},
	dynamaxclause: {
		effectType: 'Rule',
		name: 'Dynamax Clause',
		desc: "Prevents Pok&eacute;mon from dynamaxing",
		onValidateSet(set) {
			if (set.gigantamax) {
				return [
					`Your set for ${set.species} is flagged as Gigantamax, but Gigantamaxing is disallowed`,
					`(If this was a mistake, disable Gigantamaxing on the set.)`,
				];
			}
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.canDynamax = false;
			}
			this.add('rule', 'Dynamax Clause: You cannot dynamax');
		},
	},
	dynamaxubersclause: {
		effectType: 'Rule',
		name: 'Dynamax Ubers Clause',
		desc: "Prevents Pok&eacute;mon on the Ubers dynamax banlist from dynamaxing",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				if (this.ruleTable.isRestrictedSpecies(pokemon.species)) {
					pokemon.canDynamax = false;
				}
			}
			this.add('html', 'Ubers Dynamax Clause: Pokémon on the <a href="https://www.smogon.com/dex/ss/formats/uber/">Ubers Dynamax Banlist</a> cannot Dynamax.');
		},
	},
	arceusevlimit: {
		effectType: 'ValidatorRule',
		name: 'Arceus EV Limit',
		desc: "Restricts Arceus to a maximum of 100 EVs in any one stat, and only multiples of 10",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species);
			if (species.num === 493 && set.evs) {
				let stat: StatName;
				for (stat in set.evs) {
					const ev = set.evs[stat];
					if (ev > 100) {
						return [
							"Arceus can't have more than 100 EVs in any stat, because Arceus is only obtainable from level 100 events.",
							"Level 100 Pokemon can only gain EVs from vitamins (Carbos etc), which are capped at 100 EVs.",
						];
					}
					if (!(
						ev % 10 === 0 ||
						(ev % 10 === 8 && ev % 4 === 0)
					)) {
						return [
							"Arceus can only have EVs that are multiples of 10, because Arceus is only obtainable from level 100 events.",
							"Level 100 Pokemon can only gain EVs from vitamins (Carbos etc), which boost in multiples of 10.",
						];
					}
				}
			}
		},
	},
	inversemod: {
		effectType: 'Rule',
		name: 'Inverse Mod',
		desc: "The mod for Inverse Battle which inverts the type effectiveness chart; weaknesses become resistances, while resistances and immunities become weaknesses",
		onNegateImmunity: false,
		onBegin() {
			this.add('rule', 'Inverse Mod: Weaknesses become resistances, while resistances and immunities become weaknesses.');
		},
		onEffectivenessPriority: 1,
		onEffectiveness(typeMod, target, type, move) {
			// The effectiveness of Freeze Dry on Water isn't reverted
			if (move && move.id === 'freezedry' && type === 'Water') return;
			if (move && !this.dex.getImmunity(move, type)) return 1;
			return -typeMod;
		},
	},
	stabmonsmovelegality: {
		effectType: 'ValidatorRule',
		name: 'STABmons Move Legality',
		desc: "Allows Pok&eacute;mon to use any move that they or a previous evolution/out-of-battle forme share a type with",
		checkLearnset(move, species, setSources, set) {

			function logMapElements(value, key, map) {
				console.log(`m[${key}] = ${value}`);
			}

			const restrictedMoves = this.format.restricted || [];
			let rejectForNonstandard = false;
			if(move.isNonstandard) {
				const ruleTable = this.dex.getRuleTable(this.format);
				//ruleTable.forEach(logMapElements); // Debug
				switch(move.isNonstandard) {
					case "Past":
						rejectForNonstandard = !ruleTable.has('standardnatdex');
						break;
					case "Future":
						rejectForNonstandard = !ruleTable.has('+pokemontag:future');
						break;
					case "Unobtainable":
						rejectForNonstandard = ruleTable.has('obtainablemoves');
						break;
					case "CAP":
						rejectForNonstandard = !ruleTable.has('+pokemontag:cap');
						break;
					case "LGPE":
						rejectForNonstandard = !ruleTable.has('+pokemontag:lgpe');
						break;
					case "Custom":
						rejectForNonstandard = !ruleTable.has('+pokemontag:custom');
						break;
					default: rejectForNonstandard = true; break;
				}
			}
			if (!rejectForNonstandard && !move.isZ && !move.isMax && !this.ruleTable.isRestricted(`move:${move.id}`)) {
				const dex = this.dex;
				let types: string[];
				if (species.forme || species.otherFormes) {
					const baseSpecies = dex.getSpecies(species.baseSpecies);
					const originalForme = dex.getSpecies(species.changesFrom || species.name);
					types = originalForme.types;
					if (baseSpecies.otherFormes) {
						for (const formeName of baseSpecies.otherFormes) {
							if (baseSpecies.prevo) {
								const prevo = dex.getSpecies(baseSpecies.prevo);
								if (prevo.evos.includes(formeName)) continue;
							}
							const forme = dex.getSpecies(formeName);
							if (forme.changesFrom === originalForme.name && !forme.battleOnly) {
								types = types.concat(forme.types);
							}
						}
					}
				} else {
					types = species.types;
				}

				let prevo = species.prevo;
				while (prevo) {
					const prevoSpecies = dex.getSpecies(prevo);
					types = types.concat(prevoSpecies.types);
					prevo = prevoSpecies.prevo;
				}
				if (types.includes(move.type)) return null;
			}
			return this.checkLearnset(move, species, setSources, set);
		},
	},
	allowtradeback: {
		effectType: 'ValidatorRule',
		name: 'Allow Tradeback',
		desc: "Allows Gen 1 pokemon to have moves from their Gen 2 learnsets",
		// Implemented in team-validator.js
	},
	allowavs: {
		effectType: 'ValidatorRule',
		name: 'Allow AVs',
		desc: "Tells formats with the 'letsgo' mod to take Awakening Values into consideration when calculating stats",
		// implemented in TeamValidator#validateStats
	},
	nfeclause: {
		effectType: 'ValidatorRule',
		name: 'NFE Clause',
		desc: "Bans all NFE Pokemon",
		onValidateSet(set) {
			const species = this.dex.getSpecies(set.species || set.name);
			if (species.nfe) {
				if (this.ruleTable.has(`+pokemon:${species.id}`)) return;
				return [`${set.species} is banned due to NFE Clause.`];
			}
		},
	},
	mimicglitch: {
		effectType: 'ValidatorRule',
		name: 'Mimic Glitch',
		desc: "Allows any Pokemon with access to Assist, Copycat, Metronome, Mimic, or Transform to gain access to almost any other move.",
		// Implemented in sim/team-validator.ts
	},
	formeclause: {
		effectType: 'ValidatorRule',
		name: 'Forme Clause',
		desc: "Prevents teams from having more than one Pok&eacute;mon of the same forme",
		onBegin() {
			this.add('rule', 'Forme Clause: Limit one of each forme of a Pokémon');
		},
		onValidateTeam(team) {
			const formeTable: Set<string> = new Set();
			for (const set of team) {
				let species = this.dex.getSpecies(set.species);
				if (species.name !== species.baseSpecies) {
					const baseSpecies = this.dex.getSpecies(species.baseSpecies);
					if (
						species.types.join('/') === baseSpecies.types.join('/') &&
						Object.values(species.baseStats).join('/') === Object.values(baseSpecies.baseStats).join('/')
					) {
						species = baseSpecies;
					}
				}
				if (formeTable.has(species.name)) {
					return [
						`You are limited to one of each forme of a Pokémon by Forme Clause.`,
						`(You have more than one of ${species.name})`,
					];
				}
				formeTable.add(species.name);
			}
		},
	},
	'350cupmod': {
		effectType: 'Rule',
		name: '350 Cup Mod',
		desc: "If a Pok&eacute;mon's BST is 350 or lower, all of its stats get doubled.",
		onBegin() {
			this.add('rule', '350 Cup Mod: If a Pokemon\'s BST is 350 or lower, all of its stats get doubled.');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			if (newSpecies.bst <= 350) {
				newSpecies.bst = 0;
				for (const stat in newSpecies.baseStats) {
					newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * 2, 1, 255);
					newSpecies.bst += newSpecies.baseStats[stat];
				}
			}
			return newSpecies;
		},
	},
	flippedmod: {
		effectType: 'Rule',
		name: 'Flipped Mod',
		desc: "Every Pok&eacute;mon's stats are reversed. HP becomes Spe, Atk becomes Sp. Def, Def becomes Sp. Atk, and vice versa.",
		onBegin() {
			this.add('rule', 'Flipped Mod: Pokemon have their stats flipped (HP becomes Spe, vice versa).');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const reversedNums = Object.values(newSpecies.baseStats).reverse();
			for (const [i, statName] of Object.keys(newSpecies.baseStats).entries()) {
				newSpecies.baseStats[statName] = reversedNums[i];
			}
			return newSpecies;
		},
	},
	scalemonsmod: {
		effectType: 'Rule',
		name: 'Scalemons Mod',
		desc: "Every Pok&eacute;mon's stats, barring HP, are scaled to give them a BST as close to 600 as possible",
		onBegin() {
			this.add('rule', 'Scalemons Mod: Every Pokemon\'s stats, barring HP, are scaled to come as close to a BST of 600 as possible');
		},
		onModifySpecies(species) {
			const newSpecies = this.dex.deepClone(species);
			const bstWithoutHp: number = newSpecies.bst - newSpecies.baseStats['hp'];
			const scale = 600 - newSpecies.baseStats['hp'];
			newSpecies.bst = newSpecies.baseStats['hp'];
			for (const stat in newSpecies.baseStats) {
				if (stat === 'hp') continue;
				newSpecies.baseStats[stat] = this.clampIntRange(newSpecies.baseStats[stat] * scale / bstWithoutHp, 1, 255);
				newSpecies.bst += newSpecies.baseStats[stat];
			}
			return newSpecies;
		},
	},
// #region TrashChannel Rules
	/////////////////////////////
	// TrashChannel: New rules //
	/////////////////////////////
    "350cuprule": {
		effectType: 'Rule',
		name: '350 Cup Rule',
		desc: "The mod for 350 Cup: Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled.",
        onModifySpecies: function (species, target, source, effect) {
			//console.log('350cuprule: onModifySpecies');
            let bst = 0;
            Object.values(species.baseStats).forEach(stat => {
                bst += stat;
            });
			if (bst <= 350) {
				let dex = this && this.dex ? this.dex : DexCalculator;
				let pokemon = dex.deepClone(species);
				for (let i in pokemon.baseStats) {
					pokemon.baseStats[i] *= 2;
				}
				return pokemon;
			}
            return species;
        },
	},
	aaarestrictionsvalidation: {
		effectType: 'Rule',
		name: 'AAA Restrictions Validation',
		desc: "Validates restricted abilities in AAA.",
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
	// 19/11/30: We want '!Obtainable Abilities' to be effective from here but it isn't
	// Most likely can't unwrap it in order: https://github.com/smogon/pokemon-showdown/commit/c1ecbc65223525d8a6e0dd66cb1f0327996b3d7d
	aaastandardpackage: {
		effectType: 'Rule',
		name: 'AAA Standard Package',
		desc: "Standard package of rulesets for Almost Any Ability.",
		ruleset: ['2 Ability Clause', 'AAA Restrictions Validation'],
	},
	averagemonsrule: {
		effectType: 'Rule',
		name: 'Averagemons Rule',
		desc: "The mod for Averagemons: Every Pok&eacute;mon, including formes, has base 100 in every stat.",
		onModifySpecies: function (species, target, source, effect) {
			if (!effect) return;
			let dex = this && this.dex ? this.dex : DexCalculator;
			let pokemon = dex.deepClone(species);
			pokemon.baseStats = {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100};
			return pokemon;
		},
	},
	balancedhackmonsvalidation: {
		effectType: 'Rule',
		name: 'Balanced Hackmons Validation',
		desc: "Forces Zacian/Zamzenta sets to conform to on-cart behaviour.",
		onValidateSet(set) {
			if (set.species === 'Zacian-Crowned' && (toID(set.item) !== 'rustedsword' || toID(set.ability) !== 'intrepidsword')) {
				return [set.species + " is banned."];
			}
		},
		onChangeSet(set) {
			const item = toID(set.item);
			if (set.species === 'Zacian' && item === 'rustedsword') {
				set.species = 'Zacian-Crowned';
				set.ability = 'Intrepid Sword';
				let ironHead = set.moves.indexOf('ironhead');
				if (ironHead >= 0) {
					set.moves[ironHead] = 'behemothblade';
				}
			}
			if (set.species === 'Zamazenta' && item === 'rustedshield') {
				set.species = 'Zamazenta-Crowned';
				set.ability = 'Dauntless Shield';
				let ironHead = set.moves.indexOf('ironhead');
				if (ironHead >= 0) {
					set.moves[ironHead] = 'behemothbash';
				}
			}
		},
	},
	camomonsrule: {
		effectType: 'Rule',
		name: 'Camomons Rule',
		desc: "The mod for Camomons: Pok&eacute;mon change type to match their first two moves.",
		onModifySpecies(species, target, source, effect) {
			//console.log('camomonsrule: onModifySpecies');
			if (!target) return; // Chat command
			//console.log('passed target');
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.dex.getMove(move.id).type))];
			return Object.assign({}, species, {types: types});
		},
		onSwitchIn: function (pokemon) {
			//console.log('camomonsrule: onSwitchIn');
			for( let nTypeItr=0; nTypeItr<2; ++nTypeItr) {
				//console.log('nTypeItr: ' + nTypeItr.toString() + ' pokemon.types: ' + pokemon.types[nTypeItr].toString() );
				if(null === pokemon.lockTypesArray[nTypeItr]) continue;
				// @ts-ignore
				pokemon.types[nTypeItr] = pokemon.lockTypesArray[nTypeItr];
			}
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
		onAfterMega: function (pokemon) {
			//console.log('camomonsrule: onAfterMega');
			for( let nTypeItr=0; nTypeItr<2; ++nTypeItr) {
				//console.log('nTypeItr: ' + nTypeItr.toString() + ' pokemon.types: ' + pokemon.types[nTypeItr].toString() );
				if(null === pokemon.lockTypesArray[nTypeItr]) continue;
				// @ts-ignore
				pokemon.types[nTypeItr] = pokemon.lockTypesArray[nTypeItr];
			}
			this.add('-start', pokemon, 'typechange', pokemon.getTypes(true).join('/'), '[silent]');
		},
	},
	crabmonsmovelegality: {
		effectType: 'ValidatorRule',
		name: 'CRABmons Move Legality',
		desc: "Allows Pok&eacute;mon to use any move that they or a they share a type with in a Camomons environment",
		checkLearnset(move, species, lsetData, set) {
			// Get species
			let dex = this.dex;
			let baseSpecies = dex.getSpecies(species.baseSpecies);

			// Determine target typing
			let types = [...new Set(set.moves.slice(0, 2).map(moveId => dex.getMove(moveId).type))];

			// Do full set validation to determine if we can access this typing if this the first move
			if(toID(move) === toID(set.moves[0])) {
				// Check that under these conditions, we learn native moves that could give us that typing normally
				let typesetArray = Array();
				for( let nTypeItr=0; nTypeItr<2; ++nTypeItr ) {
					typesetArray[nTypeItr] = DexCalculator.getMovesPokemonLearnsOfType(baseSpecies, types[nTypeItr]);
					if( typesetArray[nTypeItr].length > 0 ) continue;
					// Reject early if we get zero moves of that type
					return this.checkLearnset(move, species, lsetData, set);
				}

				// Same type case
				if( types[0] === types[1] ) {
					if( 1 === typesetArray[0].length ) { // Reject early if we don't learn sufficient moves from the type to fill out both slots
						return this.checkLearnset(move, species, lsetData, set);
					}
				}

				// Real validation complex check (check level limitations, move incompatibilities, etc)
				let bFoundViableLearnPattern = false;
				let typeALset = typesetArray[0];
				let typeBLset = typesetArray[1];
				let typeBLsetTemp;
				let sMoveA, sMoveB;
				let hypotheticalSet = DexCalculator.deepClone(set);
				let nMvBItr;
				for( let nMvAItr=typeALset.length-1; nMvAItr>-1; --nMvAItr ) {
					sMoveA = typeALset[nMvAItr];
					// Check if we should reject for not learning move A independently
					hypotheticalSet.moves = [sMoveA];
					if( null !== this.checkLearnset(sMoveA, species, lsetData, hypotheticalSet) ) {
						continue;
					}
					// Operate interior loop on a deep clone of B that can't have a duplicate of the current move from A
					typeBLsetTemp = DexCalculator.arrayRemove(typeBLset, sMoveA);
					for( nMvBItr=typeBLsetTemp.length-1; nMvBItr>-1; --nMvBItr ) {
						sMoveB = typeBLsetTemp[nMvBItr];
						// Check if we should reject for not learning move A independently
						hypotheticalSet.moves = [sMoveB];
						if( null !== this.checkLearnset(sMoveB, species, lsetData, hypotheticalSet) ) {
							typeBLset = DexCalculator.arrayRemove(typeBLset, sMoveB); // No point checking this in further loops
							continue;
						}
						// Check if we should reject for not learning moves A and B together
						hypotheticalSet.moves = [sMoveA, sMoveB];
						if( null !== this.checkLearnset(sMoveA, species, lsetData, hypotheticalSet) ) {
							continue;
						}
						// We have located a valid hypothetical moveset that could give us the specified typing
						bFoundViableLearnPattern = true;
						break;
					}
					if(bFoundViableLearnPattern) break;
				}

				if(!bFoundViableLearnPattern) {
					return this.checkLearnset(move, species, lsetData, set);
				}
			}

			// Check that out moveset includes only legal moves or moves that would be legal under STABmons with our new typing
			const restrictedMoves = this.format.restricted || [];
			if (!move.isZ && !restrictedMoves.includes(move.name)) {
				if (types.includes(move.type)) return null;
			}
			return this.checkLearnset(move, species, lsetData, set);
		},
		unbanlist: [ // Deal with this hot garbage hack from Pokemon rule that should have been fixed months ago
			'Chansey + Charm + Seismic Toss', 'Chansey + Charm + Psywave',
			'Blissey + Charm + Seismic Toss', 'Blissey + Charm + Psywave',
			'Shiftry + Leaf Blade + Sucker Punch'
		],
	},
	megamonslegalityexpansion: { // 19/11/30: Megamons needs to be reprogrammed completely
		effectType: 'Rule',
		name: 'Megamons Legality Expansion',
		desc: "Megamons: make mega formes legal as base Pokemon.",
		onChangeSet(set, format) {
			let item = this.dex.getItem(set.item);
			let species = this.dex.getSpecies(set.species);
			let problems = [];
			let totalEV = 0;
			let allowCAP = !!(format && this.dex.getRuleTable(format).has('allowcap'));

			if (set.species === set.name) delete set.name;
			if (species.gen > this.gen) {
				problems.push(set.species + ' does not exist in gen ' + this.gen + '.');
			}
			if (species.gen && species.gen !== this.gen && species.tier === 'Illegal') {
				problems.push(set.species + ' does not exist outside of gen ' + species.gen + '.');
			}
			/**@type {Ability} */
			// @ts-ignore
			let ability = {};
			if (set.ability) {
				ability = this.dex.getAbility(set.ability);
				if (ability.gen > this.gen) {
					problems.push(ability.name + ' does not exist in gen ' + this.gen + '.');
				}
			}
			if (set.moves) {
				for (const moveid of set.moves) {
					let move = this.dex.getMove(moveid);
					if (move.gen > this.gen) {
						problems.push(move.name + ' does not exist in gen ' + this.gen + '.');
					} else if (!allowCAP && move.isNonstandard) {
						problems.push(move.name + ' does not exist.');
					}
				}
			}
			if (item.gen > this.gen) {
				problems.push(item.name + ' does not exist in gen ' + this.gen + '.');
			}
			if (set.moves && set.moves.length > 4) {
				problems.push((set.name || set.species) + ' has more than four moves.');
			}
			if (set.level && set.level > 100) {
				problems.push((set.name || set.species) + ' is higher than level 100.');
			}

			if (!allowCAP || !species.tier.startsWith('CAP')) {
				if (species.isNonstandard && species.num > -5000) {
					problems.push(set.species + ' does not exist.');
				}
			}

			if (!allowCAP && ability.isNonstandard) {
				problems.push(ability.name + ' does not exist.');
			}

			if (item.isNonstandard) {
				if (item.isNonstandard === 'Past' || item.isNonstandard === 'Future') {
					problems.push(item.name + ' does not exist in this generation.');
				} else if (!allowCAP) {
					problems.push(item.name + ' does not exist.');
				}
			}

			if (set.evs) {
				for (let k in set.evs) {
					// @ts-ignore
					if (typeof set.evs[k] !== 'number' || set.evs[k] < 0) {
						// @ts-ignore
						set.evs[k] = 0;
					}
					// @ts-ignore
					totalEV += set.evs[k];
				}
			}

			// ----------- legality line ------------------------------------------
			if (!this.dex.getRuleTable(format).has('-illegal')) return problems;
			// everything after this line only happens if we're doing legality enforcement

			// Pokestar studios
			if (species.num <= -5000 && species.isNonstandard) {
				problems.push(`${set.species} cannot be obtained by legal means.`);
			}

			// only in gen 1 and 2 it was legal to max out all EVs
			if (this.gen >= 3 && totalEV > 510) {
				problems.push((set.name || set.species) + " has more than 510 total EVs.");
			}

			if (species.gender) {
				if (set.gender !== species.gender) {
					set.gender = species.gender;
				}
			} else {
				if (set.gender !== 'M' && set.gender !== 'F') {
					set.gender = '';
				}
			}

			// Legendary Pokemon must have at least 3 perfect IVs in gen 6
			let baseSpecies = this.dex.getSpecies(species.baseSpecies);
			if (set.ivs && this.gen >= 6 && (baseSpecies.gen >= 6 || format.requirePentagon) && (species.eggGroups[0] === 'Undiscovered' || species.species === 'Manaphy') && !species.prevo && !species.nfe &&
				// exceptions
				species.species !== 'Unown' && species.baseSpecies !== 'Pikachu' && (species.baseSpecies !== 'Diancie' || !set.shiny)) {
				let perfectIVs = 0;
				for (let i in set.ivs) {
					// @ts-ignore
					if (set.ivs[i] >= 31) perfectIVs++;
				}
				let reason = (format.requirePentagon ? " and this format requires gen " + this.gen + " Pokémon" : " in gen 6");
				if (perfectIVs < 3) problems.push((set.name || set.species) + " must have at least three perfect IVs because it's a legendary" + reason + ".");
			}

			// limit one of each move
			let moves = [];
			if (set.moves) {
				/**@type {{[k: string]: true}} */
				let hasMove = {};
				for (const moveId of set.moves) {
					let move = this.dex.getMove(moveId);
					let moveid = move.id;
					if (hasMove[moveid]) continue;
					hasMove[moveid] = true;
					moves.push(moveId);
				}
			}
			set.moves = moves;

			let battleForme = species.battleOnly && species.species;
			// 19/07/14 TrashChannel: Option to pass non-mega analogous behaviour like Primal Reversion and Ultra Burst
			let allowIrregularMegaesques = !!(format && this.dex.getRuleTable(format).has('megamonsallowirregularmegaesques'));
			if (battleForme && !species.isMega) {
				if (species.requiredAbility && set.ability !== species.requiredAbility) {
					problems.push("" + species.species + " transforms in-battle with " + species.requiredAbility + "."); // Darmanitan-Zen, Zygarde-Complete
				}
				if (species.requiredItems && !allowIrregularMegaesques) {
					if (species.species === 'Necrozma-Ultra') {
						problems.push(`Necrozma-Ultra must start the battle as Necrozma-Dawn-Wings or Necrozma-Dusk-Mane holding Ultranecrozium Z.`); // Necrozma-Ultra transforms from one of two formes, and neither one is the base forme
					} else if (!species.requiredItems.includes(item.name)) {
						problems.push(`${species.species} transforms in-battle with ${Chat.plural(species.requiredItems.length, "either ") + species.requiredItems.join(" or ")}.`); // Mega or Primal
					}
				}
				if (species.requiredMove && set.moves.indexOf(toID(species.requiredMove)) < 0 &&
				   (!allowIrregularMegaesques || ('dragonascent' !== toID(species.requiredMove)))) { // 19/07/14 TrashChannel: Allow Rayquaza-Mega without Dragon Ascent as an irregular megaesque
					problems.push(`${species.species} transforms in-battle with ${species.requiredMove}.`); // Meloetta-Pirouette, Rayquaza-Mega
				}
				if (!format.noChangeForme &&
				   (!allowIrregularMegaesques || !species.requiredItems)) { // 19/07/14 TrashChannel: Prevent irregular megaesques from being reverted on battle start
					//console.log("Replacing (battle): " + set.species.toString());
					set.species = species.baseSpecies; // Fix battle-only forme
				}
			} else {
				if (species.requiredAbility && set.ability !== species.requiredAbility) {
					problems.push(`${(set.name || set.species)} needs the ability ${species.requiredAbility}.`); // No cases currently.
				}
				if (species.requiredItems && !species.requiredItems.includes(item.name) && !species.isMega) {
					problems.push(`${(set.name || set.species)} needs to hold ${Chat.plural(species.requiredItems.length, "either ") + species.requiredItems.join(" or ")}.`); // Memory/Drive/Griseous Orb/Plate/Z-Crystal - Forme mismatch
				}
				if (species.requiredMove && set.moves.indexOf(toID(species.requiredMove)) < 0 &&
				   (!allowIrregularMegaesques || ('dragonascent' !== toID(species.requiredMove)))) { // 19/07/14 TrashChannel: Allow Rayquaza-Mega without Dragon Ascent as an irregular megaesque
					problems.push(`${(set.name || set.species)} needs to have the move ${species.requiredMove}.`); // Keldeo-Resolute
				}

				// Mismatches between the set forme (if not base) and the item signature forme will have been rejected already.
				// It only remains to assign the right forme to a set with the base species (Arceus/Genesect/Giratina/Silvally).
				if (item.forcedForme && species.species === this.dex.getSpecies(item.forcedForme).baseSpecies && !format.noChangeForme) {
					//console.log("Replacing (item): " + set.species.toString());
					set.species = item.forcedForme;
				}
			}

			if (set.species !== species.species) {
				// Autofixed forme.
				species = this.dex.getSpecies(set.species);

				if (!this.dex.getRuleTable(format).has('ignoreillegalabilities') && !format.noChangeAbility) {
					// Ensure that the ability is (still) legal.
					let legalAbility = false;
					for (let i in species.abilities) {
						// @ts-ignore
						if (species.abilities[i] !== set.ability) continue;
						legalAbility = true;
						break;
					}
					if (!legalAbility) { // Default to first ability.
						set.ability = species.abilities['0'];
					}
				}
			}

			return problems;
		},
		onSwitchIn(pokemon) {
			let item = pokemon.getItem();
			if (item.megaEvolves && pokemon.species.name === item.megaEvolves) {
				pokemon.canMegaEvo = item.megaStone;
			}
		},
	},
	megamonsstandardvalidation: {
		name: 'Megamons Allow Irregular Megaesques',
		desc: "Allow irregular Megaesque Pokemon like Primals and Ultras to be used without items with Megamons Legality Expansion.",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.hasActivatedPrimalOrb = false;
			}
		},
	},
	megamonsallowirregularmegaesques: { // Not part of Standard Package
		effectType: 'Rule',
		name: 'Megamons Allow Irregular Megaesques',
		desc: "Allow irregular Megaesque Pokemon like Primals and Ultras to be used without items with Megamons Legality Expansion.",
	},
	megamonsstandardpackage: {
		effectType: 'Rule',
		name: 'Megamons Standard Package',
		desc: "Standard package of rulesets for Megamons.",
		ruleset: ['Megamons Legality Expansion', 'Megamons Standard Validation'],
	},
	gen7mixandmegastandardvalidation: {
		effectType: 'ValidatorRule',
		name: 'Gen 7 Mix and Mega Standard Validation',
		desc: "Standard validation for Gen 7 Mix and Mega.",
		onValidateTeam(team) {
			/**@type {{[k: string]: true}} */
			let itemTable = {};
			for (const set of team) {
				let item = this.dex.getItem(set.item);
				if (!item) continue;
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.dex.getItem(item).name + ")"];
				if (itemTable[item.id] && ['blueorb', 'redorb'].includes(item.id)) return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.dex.getItem(item).name + ")"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet(set, format) {
			let species = this.dex.getSpecies(set.species || set.name);
			let item = this.dex.getItem(set.item);
			if (!item.megaEvolves && !['blueorb', 'redorb', 'ultranecroziumz'].includes(item.id)) return;
			if (species.baseSpecies === item.megaEvolves || (species.baseSpecies === 'Groudon' && item.id === 'redorb') || (species.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (species.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz')) return;
			let uberStones = format.restricted || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(species.name) || set.ability === 'Power Construct' || uberStones.includes(item.name)) return ["" + species.species + " is not allowed to hold " + item.name + "."];
		},
	},
	gen7mixandmegabattleeffects: {
		effectType: 'Rule',
		name: 'Gen 7 Mix and Mega Battle Effects',
		desc: "Battle effects for Gen 7 Mix and Mega (insufficient to run MnM without mod, crashes when called though Mix and Meta).",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseSpecies.species;
			}
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
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
	gen7mixandmegastandardpackage: {
		effectType: 'Rule',
		name: 'Gen 7 Mix and Mega Standard Package',
		desc: "Standard package of rulesets for Mix and Mega (insufficient to run MnM without mod, crashes when called though Mix and Meta).",
		ruleset: ['Gen 7 Mix and Mega Standard Validation', 'Gen 7 Mix and Mega Battle Effects'],
	},
	mixandmegastandardvalidation: {
		effectType: 'ValidatorRule',
		name: 'Mix and Mega Standard Validation',
		desc: "Standard validation for Mix and Mega.",
		onValidateTeam(team, format) {
			const restrictedPokemon = format.restricted || [];
            const itemTable = new Set<ID>();
            for (const set of team) {
                const item = this.dex.getItem(set.item);
                if (!item || !item.megaStone) continue;
                const species = this.dex.getSpecies(set.species);
                if (species.isNonstandard) return [`${species.baseSpecies} does not exist in gen 8.`];
                if (restrictedPokemon.includes(species.name)) {
                    return [`${species.name} is not allowed to hold ${item.name}.`];
                }
                if (itemTable.has(item.id)) {
                    return [`You are limited to one of each mega stone.`, `(You have more than one ${item.name})`];
                }
                itemTable.add(item.id);
            }
		},
	},
	mixandmegabattleeffects: {
		effectType: 'Rule',
		name: 'Mix and Mega Battle Effects',
		desc: "Battle effects for Mix and Mega (insufficient to run MnM without mod, crashes when called though Mix and Meta).",
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
                pokemon.m.originalSpecies = pokemon.baseSpecies.name;
            }
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			let oMegaSpecies = this.dex.getSpecies(pokemon.species.originalMega);
			if (oMegaSpecies.exists && pokemon.m.originalSpecies !== oMegaSpecies.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaSpecies.requiredItem || oMegaSpecies.requiredMove, '[silent]');
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
	mixandmegastandardpackage: {
		effectType: 'Rule',
		name: 'Mix and Mega Standard Package',
		desc: "Standard package of rulesets for Mix and Mega (insufficient to run MnM without mod, crashes when called though Mix and Meta).",
		ruleset: ['Mix and Mega Standard Validation', 'Mix and Mega Battle Effects'],
	},
	pokebilitiesliterule: {
		effectType: 'Rule',
		name: 'Pokebilities Lite Rule',
		desc: "Basic Pokebilities functionality (does not override broken abilities like Trace).",
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
	reversedrule: {
		effectType: 'Rule',
		name: 'Reversed Rule',
		desc: "The mod for Reversed: Every Pok&eacute;mon has its base Atk and Sp. Atk stat, as well as its base Def and Sp. Def stat, swapped.",
		onModifySpecies: function (species, target, source, effect) {
			if (!effect) return;
			let dex = this && this.dex ? this.dex : DexCalculator;
			let pokemon = dex.deepClone(species);
			const atk = pokemon.baseStats.atk;
			const def = pokemon.baseStats.def;
			pokemon.baseStats.atk = pokemon.baseStats.spa;
			pokemon.baseStats.def = pokemon.baseStats.spd;
			pokemon.baseStats.spa = atk;
			pokemon.baseStats.spd = def;
			return pokemon;
		},
	},
	tiershiftrule: {
		effectType: 'Rule',
		name: 'Tier Shift Rule',
		desc: "The mod for Tier Shift: Pokemon get a +10 boost to each stat per tier below OU they are in. UU gets +10, RU +20, NU +30, and PU +40.",
        onModifySpecies(species, target, source, effect) {
			//console.log('tiershiftrule: onModifySpecies');
			if (!effect) return;
			if (!species.abilities) return false;
			/** @type {{[tier: string]: number}} */
			const boosts = {
				'UU': 10,
				'RUBL': 10,
				'RU': 20,
				'NUBL': 20,
				'NU': 30,
				'PUBL': 30,
				'PU': 40,
				'NFE': 40,
				'LC Uber': 40,
				'LC': 40,
			};
			if (target && target.set.ability === 'Drizzle') return;
			let dex = this && this.dex ? this.dex : DexCalculator;
			let tier = species.tier || 'OU';
			if (target && target.set.item) {
				let item = this.dex.getItem(target.set.item);
				if (item.name === 'Kommonium Z' || item.name === 'Mewnium Z') return;
				if (item.megaEvolves === species.name) tier = this.dex.getSpecies(item.megaStone).tier;
			}
			if (target && target.set.moves.includes('auroraveil')) tier = 'UU';
			if (target && target.set.ability === 'Drought') tier = 'RU';

			if (tier[0] === '(') tier = tier.slice(1, -1);
			if (!(tier in boosts)) return;
			let pokemon = dex.deepClone(species);
			//console.info(pokemon.baseStats);
			let boost = boosts[tier];
			//console.log("boost: " + boost.toString());
			for (let statName in pokemon.baseStats) {
				if (statName === 'hp') continue;
				pokemon.baseStats[statName] = Utils.clampIntRange(pokemon.baseStats[statName] + boost, 1, 255);
			}
			//console.info(pokemon.baseStats);
			return pokemon;
        },
	},
	suicidecupbattleeffects: {
		effectType: 'Rule',
		name: 'Suicide Cup Battle Effects',
		desc: "The mod for Suicide Cup: Victory is obtained when all of your Pok&eacute;mon have fainted.",
	},
	suicidecupstandardteamvalidation: {
		effectType: 'ValidatorRule',
		name: 'Suicide Cup Standard Team Validation',
		desc: "Standard team validation for Suicide Cup.",
		onValidateTeam: function (team) {
            let problems = [];
            if (team.length !== 6) problems.push(`Your team cannot have less than 6 Pok\u00e9mon.`);
            let families = {};
            for (const set of team) {
                let species = this.dex.getSpecies(set.species);
                if (species.baseSpecies) species = this.dex.getSpecies(species.baseSpecies);
                if (species.prevo) {
	                species = this.dex.getSpecies(species.prevo);
                    if (species.prevo) {
	                	species = this.dex.getSpecies(species.prevo);
                    }
                }
                if (!families[species.name]) families[species.name] = [];
                families[species.name].push(set.species);
            }
            for (const family in families) {
                if (families[family].length > 1) problems.push(`${DexCalculator.toListString(families[family])} are in the same evolutionary family.`);
            }
            return problems;
        },
	},
	suicidecupstandardsetvalidation: {
		effectType: 'ValidatorRule',
		name: 'Suicide Cup Standard Set Validation',
		desc: "Standard set validation for Suicide Cup.",
		onValidateSet(set, format) {
			let nRequiredLevel = 100;
			if(format.forcedLevel) {
				nRequiredLevel = format.forcedLevel;
			}
			else if(format.maxForcedLevel) {
				nRequiredLevel = format.maxForcedLevel;
			}
			//const format = Dex.getFormat(this.format, true);
			let ruleTable = this.dex.getRuleTable(format);
			if(ruleTable.has('littlecup')) {
				nRequiredLevel = 5;
			}
			if(set.level !== nRequiredLevel) {
				return ["" + set.species + " is level " + set.level.toString() + ", but the format requires a level of " + nRequiredLevel.toString() + "."];
			}
		},
	},
	suicidecupstandardpackage: {
		effectType: 'Rule',
		name: 'Suicide Cup Standard Package',
		desc: "Standard package of rulesets for Suicide Cup.",
		ruleset: ['Suicide Cup Battle Effects', 'Suicide Cup Standard Team Validation', 'Suicide Cup Standard Set Validation'],
	},
	// Original Metas
	bitchandbeggarrule: {
		effectType: 'Rule',
		name: 'Bitch And Beggar Rule',
		desc: "The mod for Bitch And Beggar: ",
	},
	beastmoderule: {
		effectType: 'Rule',
		name: 'Beast Mode Rule',
		desc: "The mod for BEA5T M0D3: ",
	},
// #endregion TrashChannel Rules
};
