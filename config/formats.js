// @ts-nocheck
'use strict';

// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

//#region TrashChannel: Includes
const fs = require('fs');
const path = require('path');

const RULESETS = path.resolve(__dirname, '../data/rulesets');

// Mix and Meta includes
const MMCOLLECTION = path.resolve(__dirname, '../data/mods/mixandmeta/mixedmetacollection');

// Bitch and Beggar includes
const BITCHANDBEGGARMOD = path.resolve(__dirname, '../data/mods/bitchandbeggar/scripts');
//#endregion

/**@type {(FormatsData | {section: string, column?: number})[]} */
let Formats = [
//#region TrashChannel: Mashups
	// Mashups Spotlight
	///////////////////////////////////////////////////////////////////
	{
		section: "Mashups Spotlight",
	},
	{
		name: "[Gen 7] Almost Any Ability Ubers",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">AAA Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Vanilla Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">Vanilla AAA Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/np-ubers-stage-1-into-the-unknown.3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'AAA Standard Package'],
		banlist: ['Necrozma-Dusk-Mane', 'Shedinja'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
			'Arena Trap', 'Shadow Tag', // For Ubers
		],
	},
	{
		section: "Official OM Mashups (Singles)",
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
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Mix and Mega Anything Goes",
		desc: `Mega Stones and Primal Orbs can be used on any fully evolved Pok&eacute;mon with no Mega Evolution limit, and no bans or clauses.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">MnM AG Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587441/">Vanilla Anything Goes</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'mixandmega',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Mix and Mega Battle Effects'],
		restrictedStones: ['Ultranecrozium Z'],
		cannotMega: [],
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
		ruleset: ['[Gen 7] OU', 'Camomons Rule', 'AAA Standard Package'],
		banlist: [
			'Kartana', 'Kyurem-Black', 'Shedinja', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 
			'Innards Out', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard', 
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Keldeo', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Weavile'
		],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] STABmons Ubers",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn, in an Ubers environment.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802586">STABmons Ubers Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">Vanilla STABmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/np-ubers-stage-1-into-the-unknown.3637068/">Vanilla Ubers</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'STABmons Move Legality'],
		banlist: ['Arceus', 'Komala', 'Kangaskhan-Mega'],
		restrictedMoves: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
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
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality', 'AAA Standard Package'],
		banlist: [
			'Aerodactyl-Mega', 'Archeops', 'Blacephalon', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Komala', 'Kyurem-Black', 'Regigigas', 'Shedinja',
			'Silvally', 'Slaking', 'Tapu Koko', 'Terrakion', 'Thundurus-Base', 'Thundurus-Therian', 'King\'s Rock', 'Razor Fang'],
		restrictedMoves: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
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

		mod: 'mixandmega',
		ruleset: ['Pokemon', 'Standard', 'Mix and Mega Standard Package', 'STABmons Move Legality', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // Mix and Mega
			'King\'s Rock', 'Razor Fang', // STABmons
			'Arceus', 'Kangaskhanite', // STAB n Mega
		],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		cannotMega: [
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom', // Mix and Mega
			'Blacephalon', 'Kartana', 'Silvallly', 'Tapu Koko', 'Tapu Lele', // STAB n Mega
		],
		restrictedMoves: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		section: "Official OM Mashups (Doubles)",
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
		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
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
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview', 'AAA Standard Package'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', // Doubles AAA
		],
		restrictedAbilities: [
			'Anger Point', 'Arena Trap', 'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Justified', 'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Shadow Tag', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
	},
	{
		name: "[Gen 7] Mix and Mega Doubles",
		desc: `Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit, in a Doubles setting.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/om-mashup-megathread.3635904/#post-7802587">Mix and Mega Doubles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Vanilla Doubles OU Metagame Discussion</a>`,
		],

		mod: 'mixandmega',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Mix and Mega Standard Package', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: [
			'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles
			'Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify', // MnM
		],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite'],
		cannotMega: [
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Snorlax', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
	},
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
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview', 'STABmons Move Legality'],
		banlist: [
			'DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder', // Doubles OU
			'Drizzle', 'Komala', 'Shedinja', 'Silvally', // STABmons Doubles
		],
		restrictedMoves: ['Chatter', 'Diamond Storm', 'Geomancy', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
	},
	{
		section: "Official OM Mashups (Little Cup)",
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
		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview', 'Little Cup'],
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
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Little Cup', 'AAA Standard Package'],
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
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Little Cup', 'AAA Standard Package'],
		banlist: [
			'Aipom', 'Cutiefly', 'Drifloon', 'Gligar', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Torchic', 'Vulpix-Base', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', // LC
			'Shadow Tag', // STABmons LC
		],
		restrictedMoves: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] Mix and Mega LC",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3635904/">OM Mashup Megathread</a>`,
		],

		mod: 'mixandmega',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup', 'Mix and Mega Standard Package'],
		banlist: ['Eevium Z', 'Baton Pass', 'Dragon Rage', 'Electrify', 'Sonic Boom'],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Gengarite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		cannotMega: [
			'Dratini', 'Gligar', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Vulpix',
		],
	},
	{
		section: "Other Mashups",
	},
	{
		name: "[Gen 7] Mix and Mega Tier Shift",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit, and Pokemon get a +10 boost to each stat per tier below OU they are in. UU gets +10, RU +20, NU +30, and PU +40.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3610073/">Vanilla Tier Shift</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Vanilla Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Vanilla Mix and Mega Resources</a>`,
		],

		mod: 'mixandmega',
		ruleset: ['Pokemon', 'Standard', 'Mix and Mega Standard Package', 'Tier Shift Rule', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		cannotMega: [
			'Archeops', 'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
	},
	{
		name: "[Gen 7] Mix and Mega: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with mega stones (and they know how to use 'em!)`,

		mod: 'mixandmega',
		team: 'randomHCMnM',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseTemplate.species;
			}
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				let oTemplate = this.getTemplate(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Partners in Crime: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon where both active ally Pok&eacute;mon share dumb abilities and moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		mod: 'pic',
		gameType: 'doubles',
		team: 'randomHCPiC',
		// searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (this.sides[0].active.every(ally => ally && !ally.fainted)) {
				let p1a = this.sides[0].active[0], p1b = this.sides[0].active[1];
				if (p1a.ability !== p1b.ability) {
					let p1aInnate = 'ability' + p1b.ability;
					p1a.volatiles[p1aInnate] = {id: p1aInnate, target: p1a};
					let p1bInnate = 'ability' + p1a.ability;
					p1b.volatiles[p1bInnate] = {id: p1bInnate, target: p1b};
				}
			}
			if (this.sides[1].active.every(ally => ally && !ally.fainted)) {
				let p2a = this.sides[1].active[0], p2b = this.sides[1].active[1];
				if (p2a.ability !== p2b.ability) {
					let p2a_innate = 'ability' + p2b.ability;
					p2a.volatiles[p2a_innate] = {id: p2a_innate, target: p2a};
					let p2b_innate = 'ability' + p2a.ability;
					p2b.volatiles[p2b_innate] = {id: p2b_innate, target: p2b};
				}
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability' + pokemon.ability;
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
	},
	{
		name: "[Gen 7] Trademarked: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with random trademarks.`,

		mod: 'gen7',
		team: 'randomHCTM',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
		battle: {
			getAbility(name) {
				let move = this.getMove(toID(name));
				if (!move.exists) return Object.getPrototypeOf(this).getAbility.call(this, name);
				return {
					id: move.id,
					name: move.name,
					onStart(pokemon) {
						this.add('-activate', pokemon, 'ability: ' + move.name);
						this.useMove(move.id, pokemon);
					},
					toString() {
						return ""; // for useMove
					},
				};
			},
		},
	},
//#endregion TrashChannel: Mashups

	// US/UM Singles
	///////////////////////////////////////////////////////////////////
	{
		section: "> Literally playing standard",
	},
	{
		name: "[Gen 7] Random Battle",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with sets that are generated to be competitively viable.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591157/">Sets and Suggestions</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3616946/">Role Compendium</a>`,
		],

		mod: 'gen7',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Unrated Random Battle",

		mod: 'gen7',
		searchShow: false,
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621042/">OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621329/">OU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3638845/">OU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass'],
	},
	{
		name: "[Gen 7] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3637068/">Ubers Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623296/">Ubers Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3639330/">Ubers Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: ['Baton Pass'],
	},
	{
		name: "[Gen 7] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641851/">UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641346/">UU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621217/">UU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] OU'],
		banlist: ['OU', 'UUBL', 'Drizzle', 'Drought', 'Kommonium Z', 'Mewnium Z'],
	},
	{
		name: "[Gen 7] RU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647724/">RU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645873/">RU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645338/">RU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] UU'],
		banlist: ['UU', 'RUBL', 'Aurora Veil'],
		unbanlist: ['Reuniclus', 'Drought'],
	},
	{
		name: "[Gen 7] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3650028/">NU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645166/">NU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3632667/">NU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] RU'],
		banlist: ['RU', 'NUBL', 'Reuniclus', 'Drought'],
		unbanlist: ['Camerupt-Mega'],
	},
	{
		name: "[Gen 7] PU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645983/">PU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3614892/">PU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3614470/">PU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] NU'],
		banlist: ['NU', 'PUBL', 'Camerupt-Mega'],
	},
	{
		name: "[Gen 7] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587196/">LC Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/dex/sm/formats/lc/">LC Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621440/">LC Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588679/">LC Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Little Cup'],
		banlist: [
			'Aipom', 'Cutiefly', 'Drifloon', 'Gligar', 'Gothita', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon',
			'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Trapinch', 'Vulpix-Base', 'Wingull', 'Yanma',
			'Eevium Z', 'Baton Pass', 'Dragon Rage', 'Sonic Boom',
		],
	},
	{
		name: "[Gen 7] Monotype",
		desc: `All the Pok&eacute;mon on a team must share a type.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621036/">Monotype Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3622349">Monotype Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3599682/">Monotype Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: [
			'Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Gengar-Mega', 'Giratina', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Kartana', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna',
			'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Tapu Lele', 'Xerneas', 'Yveltal', 'Zekrom', 'Zygarde',
			'Battle Bond', 'Shadow Tag', 'Damp Rock', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
		],
	},
	{
		name: "[Gen 7] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587441/">Anything Goes Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591711/">Anything Goes Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646736/">Anything Goes Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 7] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646757/">1v1 Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646758/">1v1 Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646826/">1v1 Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		teamLength: {
			validate: [1, 3],
			battle: 1,
		},
		allowMultisearch: true,
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Accuracy Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: [
			'Illegal', 'Unreleased', 'Arceus', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense', 'Dialga', 'Giratina',
			'Groudon', 'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo',
			'Mimikyu', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky',
			'Snorlax', 'Solgaleo', 'Tapu Koko', 'Xerneas', 'Yveltal', 'Zekrom', 'Focus Sash', 'Perish Song', 'Detect + Fightinium Z',
		],
	},
	{
		name: "[Gen 7] ZU",
		desc: `The unofficial usage-based tier below PU.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646743/">ZU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643412/">ZU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3646739/">ZU Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] PU'],
		banlist: [
			'PU', 'Carracosta', 'Crabominable', 'Exeggutor-Base', 'Gorebyss', 'Jynx', 'Musharna', 'Raticate-Alola',
			'Raticate-Alola-Totem', 'Throh', 'Turtonator', 'Type: Null', 'Ursaring', 'Victreebel', 'Zangoose',
		],
	},
	{
		name: "[Gen 7] CAP",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3621207/">CAP Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3626018/">CAP Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3634419/">CAP Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] OU', 'Allow CAP'],
		banlist: ['Crucibelle + Head Smash', 'Crucibelle + Low Kick', 'Tomohawk + Earth Power', 'Tomohawk + Reflect'],
	},
	{
		name: "[Gen 7] CAP LC",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3599594/">CAP LC</a>`],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		maxLevel: 5,
		ruleset: ['[Gen 7] LC', 'Allow CAP'],
	},
	{
		name: "[Gen 7] Battle Spot Singles",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3601012/">Introduction to Battle Spot Singles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3605970/">Battle Spot Singles Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3601658/">Battle Spot Singles Roles Compendium</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593055/">Battle Spot Singles Sample Teams</a>`,
		],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 7] Battle Spot Special 15",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3648618/">Battle Spot Special 15</a>`],

		mod: 'gen7',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [1, 6],
			battle: 1,
		},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: ['Unreleased', 'Illegal', 'Mewtwo', 'Dusclops', 'Dusknoir'],
		onValidateSet(set, format) {
			if (set.moves.length !== 1 || this.getMove(set.moves[0]).id !== 'metronome') {
				return [`${set.name || set.species} has illegal moves.`, `(${format.name} only allows the move Metronome)`];
			}
			if (set.item) {
				const item = this.getItem(set.item);
				if (item.megaStone) return [`${set.name || set.species} has ${item.name}, which is banned in ${format.name}.`];
			}
		},
	},
	{
		name: "[Gen 7] Custom Game",

		mod: 'gen7',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		teamLength: {
			validate: [1, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// US/UM Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Test Doubles",
	},
	{
		name: "[Gen 7] Random Doubles Battle",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3601525/">Sets and Suggestions</a>`],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3648227/">Doubles OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623347/">Doubles OU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590987/">Doubles OU Sample Teams</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: ['DUber', 'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder'],
	},
	{
		name: "[Gen 7] Doubles Ubers",

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Dark Void'],
	},
	{
		name: "[Gen 7] Doubles UU",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3598014/">Doubles UU Metagame Discussion</a>`],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 7] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 7] VGC 2019 Sun Series",

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 7 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90, grace: 90, timeoutAutoChoose: true, dcTimerBank: false},
		ruleset: ['Pokemon', 'Minimal GBU'],
		banlist: ['Unown', 'Dragon Ascent', 'Custap Berry', 'Enigma Berry', 'Jaboca Berry', 'Micle Berry', 'Rowap Berry'],
		requirePlus: true,
		onValidateTeam(team) {
			const legends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma'];
			let n = 0;
			let problems = [];
			for (const set of team) {
				const baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) {
					n++;
					if (n === 3) problems.push(`You can only use up to two legendary Pok\u00E9mon.`);
				}
				const item = this.getItem(set.item);
				if (item.zMove || item.megaStone || ['redorb', 'blueorb'].includes(item.id)) problems.push(`${set.name || set.species}'s item ${item.name} is banned.`);
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] VGC 2019 Moon Series",

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 7 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90, grace: 90, timeoutAutoChoose: true, dcTimerBank: false},
		ruleset: ['Pokemon', 'Minimal GBU'],
		banlist: ['Unown', 'Dragon Ascent'],
		requirePlus: true,
		onValidateTeam(team) {
			const legends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma'];
			let n = 0;
			let problems = [];
			for (const set of team) {
				const baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) {
					n++;
					if (n === 3) problems.push(`You can only use up to two legendary Pok\u00E9mon.`);
				}
				const item = this.getItem(set.item);
				if (item.megaStone || ['redorb', 'blueorb', 'ultranecroziumz'].includes(item.id)) problems.push(`${set.name || set.species}'s item ${item.name} is banned.`);
			}
			return problems;
		},
	},
	{
		name: "[Gen 7] VGC 2019 Ultra Series",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641100/">VGC 2019 Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3641123/">VGC 2019 Viability Rankings</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 7 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90, grace: 90, timeoutAutoChoose: true, dcTimerBank: false},
		ruleset: ['Pokemon', 'Minimal GBU'],
		banlist: ['Unown'],
		requirePlus: true,
		onValidateTeam(team) {
			const legends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma'];
			let n = 0;
			for (const set of team) {
				const baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) n++;
				if (n > 2) return [`You can only use up to two legendary Pok\u00E9mon.`];
			}
		},
	},
	{
		name: "[Gen 7] VGC 2018",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3631800/">VGC 2018 Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3622041/">VGC 2018 Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3628885/">VGC 2018 Sample Teams</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 5 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90, grace: 90, timeoutAutoChoose: true, dcTimerBank: false},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Unown', 'Custap Berry', 'Enigma Berry', 'Jaboca Berry', 'Micle Berry', 'Rowap Berry'],
		requirePlus: true,
	},
	{
		name: "[Gen 7] VGC 2017",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3583926/">VGC 2017 Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591794/">VGC 2017 Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3590391/">VGC 2017 Sample Teams</a>`,
		],

		mod: 'vgc17',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 15 * 60, addPerTurn: 0, maxPerTurn: 55, maxFirstTurn: 90, grace: 90, timeoutAutoChoose: true, dcTimerBank: false},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod', 'Alola Pokedex'],
		banlist: [
			'Illegal', 'Unreleased', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zygarde', 'Mega',
			'Custap Berry', 'Enigma Berry', 'Jaboca Berry', 'Micle Berry', 'Rowap Berry',
		],
		requirePlus: true,
	},
	{
		name: "[Gen 7] Battle Spot Doubles",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595001/">Battle Spot Doubles Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593890/">Battle Spot Doubles Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595859/">Battle Spot Doubles Sample Teams</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 7] 2v2 Doubles",
		desc: `Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3606989/">2v2 Doubles</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		teamLength: {
			validate: [2, 4],
			battle: 2,
		},
		ruleset: ['Pokemon', 'Standard Doubles', 'Accuracy Moves Clause', 'Swagger Clause', 'Z-Move Clause', 'Sleep Clause Mod', 'Team Preview'],
		banlist: [
			'Arceus', 'Dialga', 'Giratina', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White',
			'Lugia', 'Lunala', 'Magearna', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Snorlax', 'Solgaleo', 'Tapu Lele', 'Xerneas', 'Yveltal', 'Zekrom',
			'Power Construct', 'Eevium Z', 'Focus Sash', 'Dark Void', 'Final Gambit', 'Perish Song',
			'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder',
		],
	},
	{
		name: '[Gen 7] Metronome Battle',
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3632075/">Metronome Battle</a>`,
		],

		mod: 'gen7',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		teamLength: {
			validate: [2, 2],
			battle: 2,
		},
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
		banlist: [
			'Pokestar Spirit', 'Battle Bond', 'Cheek Pouch', 'Cursed Body', 'Desolate Land', 'Dry Skin', 'Fluffy', 'Fur Coat', 'Grassy Surge',
			'Huge Power', 'Ice Body', 'Iron Barbs', 'Moody', 'Parental Bond', 'Poison Heal', 'Power Construct', 'Pressure', 'Primordial Sea', 'Protean',
			'Pure Power', 'Rain Dish', 'Rough Skin', 'Sand Stream', 'Schooling', 'Snow Warning', 'Stamina', 'Volt Absorb', 'Water Absorb', 'Wonder Guard',
			'Abomasite', 'Aguav Berry', 'Assault Vest', 'Berry', 'Berry Juice', 'Berserk Gene', 'Black Sludge', 'Enigma Berry', 'Figy Berry', 'Gold Berry',
			'Iapapa Berry', 'Kangaskhanite', 'Leftovers', 'Mago Berry', 'Medichamite', 'Normalium Z', 'Oran Berry', 'Rocky Helmet', 'Shell Bell',
			'Sitrus Berry', 'Wiki Berry', 'Harvest + Rowap Berry', 'Harvest + Jaboca Berry', 'Shedinja + Sturdy',
		],
		onValidateSet(set) {
			let template = this.getTemplate(set.species);
			if (template.types.includes('Steel')) return [`${template.species} is a Steel-type, which is banned from Metronome Battle.`];
			let bst = 0;
			for (let stat in template.baseStats) {
				// @ts-ignore
				bst += template.baseStats[stat];
			}
			if (bst > 625) return [`${template.species} is banned.`, `(Pok\u00e9mon with a BST higher than 625 are banned)`];
			let item = this.getItem(set.item);
			if (set.item && item.megaStone) {
				let bstMega = 0;
				let megaTemplate = this.getTemplate(item.megaStone);
				for (let stat in megaTemplate.baseStats) {
					// @ts-ignore
					bstMega += megaTemplate.baseStats[stat];
				}
				if (template.baseSpecies === item.megaEvolves && bstMega > 625) return [`${set.name || set.species}'s item ${item.name} is banned.`, `(Pok\u00e9mon with a BST higher than 625 are banned)`];
			}
			if (set.moves.length !== 1 || this.getMove(set.moves[0]).id !== 'metronome') return [`${set.name || set.species} has illegal moves.`, `(Pok\u00e9mon can only have one Metronome in their moveset)`];
		},
	},
	{
		name: "[Gen 7] Doubles Custom Game",

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		onBegin() { this.trunc = n => Math.trunc(n); },
		defaultLevel: 100,
		debug: true,
		teamLength: {
			validate: [2, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "OM of the Month",
		column: 2,
	},
	{
		name: "[Gen 7] Trademarked",
		desc: `Pok&eacute;mon may use any Status move as an Ability, excluding those that are banned.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647897/">Trademarked</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Hoopa-Unbound', 'Slaking', 'Regigigas'],
        restrictedMoves: ['Assist', 'Baneful Bunker', 'Block', 'Copycat', 'Destiny Bond', 'Detect', 'Ingrain', 'King\'s Shield', 'Mat Block', 'Mean Look', 'Metronome', 'Nature Power', 'Parting Shot', 'Protect', 'Roar', 'Skill Swap', 'Spider Web', 'Spiky Shield', 'Whirlwind'],
		onValidateTeam(team, format, teamHas) {
			for (let trademark in teamHas.trademarks) {
				if (teamHas.trademarks[trademark] > 1) return [`You are limited to 1 of each Trademark. (You have ${teamHas.trademarks[trademark]} of ${trademark}).`];
			}
		},
		validateSet(set, teamHas) {
			const restrictedMoves = this.format.restrictedMoves || [];
			// 19/05/06 TrashChannel: Include add-on rules
			const ruleTable = this.ruleTable;
			let move = this.dex.getMove(set.ability);
			if (move.category !== 'Status' || move.status === 'slp' || set.moves.map(toID).includes(move.id)) return this.validateSet(set, teamHas);
			if( ruleTable.has('-illegal') ) {
				if (restrictedMoves.includes(move.name)) return this.validateSet(set, teamHas);
			}
			let TeamValidator = /** @type {new(format: string | Format) => Validator} */ (this.constructor);
			let sAddOnRulesString = '';
			if(ruleTable) {
				ruleTable.forEach((v, rule) => {
					//console.log("Trademarked rule: " + rule);
					sAddOnRulesString += ','+rule;
				});
			}
			let validator = new TeamValidator(Dex.getFormat(this.format.id + '@@@ignoreillegalabilities'+sAddOnRulesString));
			let moves = set.moves;
			set.moves = [set.ability];
			set.ability = '';
			let problems = validator.validateSet(set, {}) || [];
			set.moves = moves;
			set.ability = '';
			problems = problems.concat(validator.validateSet(set, teamHas) || []);
			set.ability = move.id;
			if (!teamHas.trademarks) teamHas.trademarks = {};
			teamHas.trademarks[move.name] = (teamHas.trademarks[move.name] || 0) + 1;
			return problems.length ? problems : null;
		},
		battle: {
            getAbility(name) {
                let move = this.getMove(toID(name));
                if (!move.exists) return Object.getPrototypeOf(this).getAbility.call(this, name);
                return {
                    id: move.id,
                    name: move.name,
                    onStart(pokemon) {
                        this.add('-activate', pokemon, 'ability: ' + move.name);
                        this.useMove(move.id, pokemon);
                    },
                    toString() {
                        return ""; // for useMove
                    },
                };
            },
        },
	},
	{
		name: "[Gen 7] Ultimate Z",
		desc: `Use any type of Z-Crystal on any move and as many times per battle as desired.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3609393/">Ultimate Z</a>`,
		],

		mod: 'ultimatez',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kyurem-Black', 'Celebrate', 'Conversion', 'Happy Hour', 'Hold Hands'],
		onValidateSet(set) {
			let problems = [];
			if (this.getItem(set.item).zMove && set.moves) {
				for (const moveId of set.moves) {
					let move = this.getMove(moveId);
					if (!move.zMoveBoost) continue;
					if (move.zMoveBoost.evasion) problems.push(move.name + ' is banned in combination with a Z-Crystal.');
				}
			}
			return problems;
		},
	},
	{
		section: "Other Metagames",
		column: 2,
	},
	{
		name: "[Gen 7] Balanced Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587475/">Balanced Hackmons</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588586/">BH Suspects and Bans Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3593766/">BH Resources</a>`,
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Sleep Clause Mod', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Illusion', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Psychic Surge', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk'],
	},
	{
		name: "[Gen 7] Mix and Mega",
		desc: `Mega Stones and Primal Orbs can be used on almost any Pok&eacute;mon with no Mega Evolution limit.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587740/">Mix and Mega</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3591580/">Mix and Mega Resources</a>`,
		],

		mod: 'mixandmega',
		ruleset: ['Pokemon', 'Standard', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Pidgeotite', 'Ultranecrozium Z'],
		cannotMega: [
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black',
			'Kyurem-White', 'Landorus-Therian', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		onValidateTeam(team) {
			/**@type {{[k: string]: true}} */
			let itemTable = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				if (!item) continue;
				if (itemTable[item.id] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
				if (itemTable[item.id] && ['blueorb', 'redorb'].includes(item.id)) return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
				itemTable[item.id] = true;
			}
		},
		onValidateSet(set, format) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			if (!item.megaEvolves && !['blueorb', 'redorb', 'ultranecroziumz'].includes(item.id)) return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz')) return;
			let uberStones = format.restrictedStones || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(template.name) || set.ability === 'Power Construct' || uberStones.includes(item.name)) return ["" + template.species + " is not allowed to hold " + item.name + "."];
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseTemplate.species;
			}
		},
		onSwitchIn(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				let oTemplate = this.getTemplate(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Almost Any Ability",
		desc: `Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587901/">Almost Any Ability</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3595753/">AAA Resources</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Ability Clause', 'Ignore Illegal Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion', 'Weavile'],
		unbanlist: ['Aegislash', 'Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet(set, format) {
			let restrictedAbilities = format.restrictedAbilities || [];
			if (restrictedAbilities.includes(set.ability)) {
				let template = this.getTemplate(set.species || set.name);
				let legalAbility = false;
				for (let i in template.abilities) {
					// @ts-ignore
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 7] Camomons",
		desc: `Pok&eacute;mon change type to match their first two moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598418/">Camomons</a>`,
		],
		mod: 'gen7',
		// searchShow: false,
		ruleset: ['[Gen 7] OU'],
		banlist: ['Dragonite', 'Kartana', 'Kyurem-Black', 'Shedinja'],
		onModifyTemplate(template, target, source, effect) {
			if (!target) return; // Chat command
			if (effect && ['imposter', 'transform'].includes(effect.id)) return;
			let types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.getMove(move.id).type))];
			return Object.assign({}, template, {types: types});
		},
		onSwitchIn(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
		onAfterMega(pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] STABmons",
		desc: `Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587949/">STABmons</a>`,
		],

		mod: 'gen7',
		// searchShow: false,
		ruleset: ['[Gen 7] OU', 'STABmons Move Legality'],
		banlist: ['Aerodactyl-Mega', 'Blacephalon', 'Kartana', 'Komala', 'Kyurem-Black', 'Porygon-Z', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Thundurus-Base', 'King\'s Rock', 'Razor Fang'],
		restrictedMoves: ['Acupressure', 'Belly Drum', 'Chatter', 'Extreme Speed', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Spore', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] Tier Shift",
		ruleset: ['[Gen 7] OU', 'Tier Shift Rule'],
		banlist: ['Damp Rock', 'Deep Sea Tooth', 'Eviolite'],
		desc: '<a href="http://www.smogon.com/forums/threads/3610073/">Tier Shift</a>: Pokemon get a +10 boost to each stat per tier below OU they are in. UU gets +10, RU +20, NU +30, and PU +40.',
		mod: 'gen7',
	},
	{
		name: "[Gen 7] Partners in Crime",
		desc: `Doubles-based metagame where both active ally Pok&eacute;mon share abilities and moves.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3618488/">Partners in Crime</a>`,
		],

		mod: 'pic',
		gameType: 'doubles',
		// searchShow: false,
		ruleset: ['[Gen 7] Doubles OU', 'Sleep Clause Mod'],
		banlist: [
			'Kangaskhanite', 'Mawilite', 'Medichamite',
			'Huge Power', 'Imposter', 'Normalize', 'Pure Power', 'Wonder Guard', 'Mimic', 'Sketch', 'Sweet Scent', 'Transform',
		],
		onSwitchInPriority: 2,
		onSwitchIn(pokemon) {
			if (this.sides[0].active.every(ally => ally && !ally.fainted)) {
				let p1a = this.sides[0].active[0], p1b = this.sides[0].active[1];
				if (p1a.ability !== p1b.ability) {
					let p1aInnate = 'ability' + p1b.ability;
					p1a.volatiles[p1aInnate] = {id: p1aInnate, target: p1a};
					let p1bInnate = 'ability' + p1a.ability;
					p1b.volatiles[p1bInnate] = {id: p1bInnate, target: p1b};
				}
			}
			if (this.sides[1].active.every(ally => ally && !ally.fainted)) {
				let p2a = this.sides[1].active[0], p2b = this.sides[1].active[1];
				if (p2a.ability !== p2b.ability) {
					let p2a_innate = 'ability' + p2b.ability;
					p2a.volatiles[p2a_innate] = {id: p2a_innate, target: p2a};
					let p2b_innate = 'ability' + p2a.ability;
					p2b.volatiles[p2b_innate] = {id: p2b_innate, target: p2b};
				}
			}
			let ally = pokemon.side.active.find(ally => ally && ally !== pokemon && !ally.fainted);
			if (ally && ally.ability !== pokemon.ability) {
				if (!pokemon.m.innate) {
					pokemon.m.innate = 'ability' + ally.ability;
					delete pokemon.volatiles[pokemon.m.innate];
					pokemon.addVolatile(pokemon.m.innate);
				}
				if (!ally.m.innate) {
					ally.m.innate = 'ability' + pokemon.ability;
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
	},
	{
		name: "[Gen 6] Gen-NEXT OU",

		mod: 'gennext',
		searchShow: false,
		challengeShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber'],
	},

	// Let's Go!
	///////////////////////////////////////////////////////////////////

	{
		section: "Let's Go!",
		column: 2,
	},
	{
		name: "[Gen 7 Let's Go] Random Battle",

		mod: 'letsgo',
		challengeShow: false,
		searchShow: false,
		team: 'random',
		ruleset: ['Pokemon', 'Allow AVs', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7 Let's Go] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3644015/">LGPE OverUsed</a>`,
		],

		mod: 'letsgo',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Evasion Moves Clause', 'OHKO Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Uber'],
	},
	{
		name: "[Gen 7 Let's Go] Singles No Restrictions",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643931/">Let's Go! Discussion</a>`,
		],

		mod: 'letsgo',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Allow AVs', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 7 Let's Go] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3645303/">LGPE DOU</a>`,
		],

		mod: 'letsgo',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		forcedLevel: 50,
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Evasion Moves Clause', 'OHKO Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Mewtwo'],
	},
	{
		name: "[Gen 7 Let's Go] Doubles No Restrictions",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3643931/">Let's Go! Discussion</a>`,
		],

		mod: 'letsgo',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Allow AVs', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},

	// Randomized Metas
	///////////////////////////////////////////////////////////////////

	{
		section: "Randomized Metas",
		column: 2,
	},
	{
		name: "[Gen 7] Battle Factory",
		desc: `Randomized teams of Pok&eacute;mon for a generated Smogon tier with sets that are competitively viable.`,

		mod: 'gen7',
		team: 'randomFactory',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause'],
	},
	{
		name: "[Gen 7] BSS Factory",
		desc: `Randomized 3v3 Singles featuring Pok&eacute;mon and movesets popular in Battle Spot Singles.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3604845/">Information and Suggestions Thread</a>`,
		],

		mod: 'gen7',
		team: 'randomBSSFactory',
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard GBU'],
	},
	{
		name: "[Gen 7] Monotype Random Battle",

		mod: 'gen7',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Super Staff Bros Brawl",
		desc: "Super Staff Bros returns for another round! Battle with a random team of pokemon created by the sim staff.",
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/super-staff-bros-brawl">Introduction &amp; Roster</a>`,
		],

		mod: 'ssb',
		team: 'randomStaffBros',
		challengeShow: false,
		searchShow: false,
		ruleset: ['HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod'],
		onBegin() {
			this.add('raw|SUPER STAFF BROS <b>BRAWL</b>!!');
			this.add('message', 'GET READY FOR THE NEXT BATTLE!');
			this.add(`raw|<div class='broadcast-green'><b>Wondering what all these custom moves, abilities, and items do?<br />Check out the <a href="https://www.smogon.com/articles/super-staff-bros-brawl" target="_blank">Super Staff Bros Brawl Guide</a> and find out!</b></div>`);
		},
		onSwitchIn(pokemon) {
			let name = toID(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
			if (this.getTemplate(name).exists) {
				// Certain pokemon have volatiles named after their speciesid
				// To prevent overwriting those, and to prevent accidentaly leaking
				// that a pokemon is on a team through the onStart even triggering
				// at the start of a match, users with pokemon names will need their
				// statuse's to end in "user".
				name = /** @type {ID} */(name + 'user');
			}
			// Add the mon's status effect to it as a volatile.
			let status = this.getEffect(name);
			if (status && status.exists) {
				pokemon.addVolatile(name, pokemon);
			}
		},
	},
	{
		name: "[Gen 7] Challenge Cup 1v1",

		mod: 'gen7',
		team: 'randomCC',
		teamLength: {
			battle: 1,
		},
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Challenge Cup 2v2",

		mod: 'gen7',
		team: 'randomCC',
		gameType: 'doubles',
		teamLength: {
			battle: 2,
		},
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item.`,

		mod: 'gen7',
		team: 'randomHC',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Doubles Hackmons Cup",

		mod: 'gen7',
		gameType: 'doubles',
		team: 'randomHC',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Random Battle",

		mod: 'gen6',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Battle Factory",
		desc: `Randomized teams of Pok&eacute;mon for a generated Smogon tier with sets that are competitively viable.`,

		mod: 'gen6',
		team: 'randomFactory',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause'],
	},
	{
		name: "[Gen 5] Random Battle",

		mod: 'gen5',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 4] Random Battle",

		mod: 'gen4',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 3] Random Battle",

		mod: 'gen3',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] Random Battle",

		mod: 'gen2',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] Random Battle",

		mod: 'gen1',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] Challenge Cup",

		mod: 'gen1',
		team: 'randomCC',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},

	// RoA Spotlight
	///////////////////////////////////////////////////////////////////

	{
		section: "RoA Spotlight",
		column: 3,
	},
	{
		name: "[Gen 6] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/tags/uu/">ORAS UU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3598164/">ORAS UU Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 6] OU'],
		banlist: ['OU', 'UUBL', 'Drizzle', 'Drought'],
	},
	{
		name: "[Gen 5] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8031457/">BW 1v1</a>`,
		],

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 3] UU'],
		banlist: ['UU'],
	},
	{
		name: "[Gen 5] Balanced Hackmons",
		desc: `Anything that can be hacked in-game and is usable in local battles is allowed.`,

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 4] OU', 'Same Type Clause'],
		banlist: [],
	},

	// Past Gens OU
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Gens OU",
		column: 3,
	},
	{
		name: "[Gen 6] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/tags/ou/">ORAS OU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3623399/">ORAS OU Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3642242/">ORAS OU Sample Teams</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause'],
		banlist: ['Uber', 'Arena Trap', 'Shadow Tag', 'Soul Dew', 'Baton Pass'],
	},
	{
		name: "[Gen 5] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3599678/">BW2 OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431094/">BW2 Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Uber', 'Arena Trap', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Rush', 'Soul Dew'],
	},
	{
		name: "[Gen 4] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3506147/">DPP OU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3551992/">DPP OU Viability Ranking</a>`,
		],

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Baton Pass Clause'],
		banlist: ['Uber', 'Sand Veil', 'Soul Dew'],
	},
	{
		name: "[Gen 3] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3503019/">ADV OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431087/">ADV Sample Teams</a>`,
		],

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 2] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3556533/">GSC OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431086/">GSC Sample Teams</a>`,
		],

		mod: 'gen2',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3572352/">RBY OU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431045/">RBY Sample Teams</a>`,
		],

		mod: 'gen1',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},

	// OR/AS Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "OR/AS Singles",
		column: 3,
	},
	{
		name: "[Gen 6] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3522911/">ORAS Ubers</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3535106/">ORAS Ubers Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
	},
	{
		name: "[Gen 6] RU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/tags/ru/">ORAS RU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3574583/">ORAS RU Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 6] UU'],
		banlist: ['UU', 'RUBL'],
	},
	{
		name: "[Gen 6] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/tags/nu/">ORAS NU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3555650/">ORAS NU Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 6] RU'],
		banlist: ['RU', 'NUBL'],
	},
	{
		name: "[Gen 6] PU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/tags/pu/">ORAS PU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3528743/">ORAS PU Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 6] NU'],
		banlist: ['NU', 'PUBL', 'Chatter'],
	},
	{
		name: "[Gen 6] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dex/xy/formats/lc/">ORAS LC Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3547566/">ORAS LC Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Baton Pass', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
	},
	{
		name: "[Gen 6] Monotype",
		desc: `All the Pok&eacute;mon on a team must share a type.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7421332/">ORAS Monotype</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: [
			'Aegislash', 'Altaria-Mega', 'Arceus', 'Blaziken', 'Charizard-Mega-X', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Gengar-Mega',
			'Giratina', 'Greninja', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Mawile-Mega', 'Metagross-Mega',
			'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Sableye-Mega', 'Salamence-Mega', 'Shaymin-Sky', 'Slowbro-Mega', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Shadow Tag', 'Damp Rock', 'Smooth Rock', 'Soul Dew', 'Baton Pass',
		],
	},
	{
		name: "[Gen 6] Anything Goes",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3523229/">ORAS Anything Goes</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3548945/">ORAS AG Resources</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 6] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/8031456/">ORAS 1v1</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		teamLength: {
			validate: [1, 3],
			battle: 1,
		},
		ruleset: ['Pokemon', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Accuracy Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: [
			'Illegal', 'Unreleased', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense',
			'Dialga', 'Giratina', 'Groudon', 'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Focus Sash', 'Soul Dew', 'Perish Song',
		],
	},
	{
		name: "[Gen 6] CAP",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3537407/">ORAS CAP Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3545628/">ORAS CAP Viability Rankings</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/5594694/">ORAS CAP Sample Teams</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 6] OU', 'Allow CAP'],
	},
	{
		name: "[Gen 6] Battle Spot Singles",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3527960/">ORAS Battle Spot Singles</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3554616/">ORAS BSS Viability Rankings</a>`,
		],

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Custom Game",

		mod: 'gen6',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// OR/AS Doubles/Triples
	///////////////////////////////////////////////////////////////////

	{
		section: "OR/AS Doubles/Triples",
	},
	{
		name: "[Gen 6] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3498688/">ORAS Doubles OU Banlist</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3535930/">ORAS Doubles OU Viability Rankings</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: ['DUber', 'Soul Dew', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder'],
	},
	{
		name: "[Gen 6] VGC 2016",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3558332/">VGC 2016 Rules</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3580592/">VGC 2016 Viability Rankings</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: [
			'Illegal', 'Unreleased', 'Mew', 'Celebi', 'Jirachi', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Phione', 'Manaphy', 'Darkrai',
			'Shaymin', 'Shaymin-Sky', 'Arceus', 'Victini', 'Keldeo', 'Meloetta', 'Genesect', 'Diancie', 'Hoopa', 'Hoopa-Unbound', 'Volcanion', 'Soul Dew',
		],
		requirePentagon: true,
		onValidateTeam(team) {
			const legends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde'];
			let n = 0;
			for (const set of team) {
				let baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) n++;
				if (n > 2) return ["You can only use up to two legendary Pok\u00E9mon."];
			}
		},
	},
	{
		name: "[Gen 6] Battle Spot Doubles",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3560820/">ORAS Battle Spot Doubles Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3560824/">ORAS BSD Viability Rankings</a>`,
		],

		mod: 'gen6',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Doubles Custom Game",

		mod: 'gen6',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Battle Spot Triples",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3533914/">ORAS Battle Spot Triples Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3549201/">ORAS BST Viability Rankings</a>`,
		],

		mod: 'gen6',
		gameType: 'triples',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [6, 6],
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Triples Custom Game",

		mod: 'gen6',
		gameType: 'triples',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// B2/W2 Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "B2/W2 Singles",
		column: 4,
	},
	{
		name: "[Gen 5] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3550881/">BW2 Ubers Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6446463/">BW2 Ubers Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
	},
	{
		name: "[Gen 5] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3474024/">BW2 UU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431094/">BW2 Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Uber', 'OU', 'UUBL', 'Arena Trap', 'Drought', 'Sand Stream', 'Snow Warning'],
	},
	{
		name: "[Gen 5] RU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3473124/">BW2 RU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431094/">BW2 Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'RUBL', 'Shell Smash + Baton Pass'],
	},
	{
		name: "[Gen 5] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3484121/">BW2 NU Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431094/">BW2 Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU', 'NUBL', 'Prankster + Assist'],
	},
	{
		name: "[Gen 5] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3485860/">BW2 LC Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431094/">BW2 Sample Teams</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Sand Rush', 'Gligar', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela'],
	},
	{
		name: "[Gen 5] Monotype",
		desc: `All the Pok&eacute;mon on a team must share a type.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7421333/">BW Monotype</a>`,
		],

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 5] OU', 'Same Type Clause'],
	},
	{
		name: "[Gen 5] GBU Singles",

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Custom Game",

		mod: 'gen5',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// B2/W2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: 'B2/W2 Doubles',
		column: 4,
	},
	{
		name: "[Gen 5] Doubles OU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3533424/">BW2 Doubles Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3533421/">BW2 Doubles Viability Ranking</a>`,
		],

		mod: 'gen5',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['DUber', 'Soul Dew', 'Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] GBU Doubles",

		mod: 'gen5',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Doubles Custom Game",

		mod: 'gen5',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// DPP Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "DPP Singles",
		column: 4,
	},
	{
		name: "[Gen 4] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7433831/">DPP Ubers Information &amp; Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3505128/">DPP Ubers Viability Ranking</a>`,
		],

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus'],
	},
	{
		name: "[Gen 4] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3532624/">DPP UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3503638/">DPP UU Viability Ranking</a>`,
		],

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 4] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 4] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3583742/">DPP NU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/3512254/">DPP NU Viability Ranking</a>`,
		],

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 4] UU'],
		banlist: ['UU', 'NUBL'],
		unbanlist: ['Sand Veil'],
	},
	{
		name: "[Gen 4] LC",
		threads: [
			`&bullet; <a href="https://www.smogon.com/dp/articles/little_cup_guide">DPP LC Guide</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/7336500/">DPP LC Viability Ranking</a>`,
		],

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['LC Uber', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma', 'Berry Juice', 'Deep Sea Tooth', 'Dragon Rage', 'Hypnosis', 'Sonic Boom'],
	},
	{
		name: "[Gen 4] Anything Goes",

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 4] Custom Game",

		mod: 'gen4',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// DPP Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "DPP Doubles",
		column: 4,
	},
	{
		name: "[Gen 4] Doubles OU",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3618411/">DPP Doubles</a>`],

		mod: 'gen4',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 4] OU'],
		banlist: ['Explosion', 'Soul Dew'],
		unbanlist: ['Garchomp', 'Latias', 'Latios', 'Manaphy', 'Mew', 'Salamence', 'Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 4] Doubles Custom Game",

		mod: 'gen4',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Generations",
		column: 4,
	},
	{
		name: "[Gen 3] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7433832/">ADV Ubers Information &amp; Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3536426/">ADV Ubers Viability Ranking</a>`,
		],

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Smeargle + Ingrain', 'Wobbuffet + Leftovers'],
	},
	{
		name: "[Gen 3] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3585923/">ADV UU Metagame Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3548578/">ADV UU Viability Rankings</a>`,
		],

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 3] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 3] NU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3503540/">ADV NU Viability Rankings</a>`,
		],

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 3] UU'],
		banlist: ['UU'],
	},
	{
		name: "[Gen 3] Custom Game",

		mod: 'gen3',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 3] Doubles Custom Game",

		mod: 'gen3',
		gameType: 'doubles',
		challengeShow: false,
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 2] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/posts/7433879/">GSC Ubers Information &amp; Resources</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431086/">GSC Sample Teams</a>`,
		],

		mod: 'gen2',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] UU",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3576710/">GSC UU</a>`],

		mod: 'gen2',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 2] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 2] NU",
		threads: [`&bullet; <a href="https://www.smogon.com/forums/threads/3642565/">GSC NU</a>`],

		mod: 'gen2',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 2] UU'],
		banlist: ['UU'],
	},
	{
		name: "[Gen 2] Custom Game",

		mod: 'gen2',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Ubers",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3541329/">RBY Ubers Viability Ranking</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/posts/6431045/">RBY Sample Teams</a>`,
		],

		mod: 'gen1',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] UU",
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3573896/">RBY UU General Discussion</a>`,
			`&bullet; <a href="https://www.smogon.com/forums/threads/3647713/">RBY UU Viability Ranking</a>`,
		],

		mod: 'gen1',
		challengeShow: false,
		searchShow: false,
		ruleset: ['[Gen 1] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 1] OU (tradeback)",
		desc: `RBY OU with movepool additions from the Time Capsule.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/articles/rby-tradebacks-ou/">Information</a>`,
		],

		mod: 'gen1',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Allow Tradeback', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Stadium OU",

		mod: 'stadium',
		challengeShow: false,
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Custom Game",

		mod: 'gen1',
		challengeShow: false,
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		trunc(n) { return Math.trunc(n); },
		defaultLevel: 100,
		ruleset: ['HP Percentage Mod', 'Cancel Mod'],
	},

//#region TrashChannel: Ex-OMotM
	// Expanded OMs
	///////////////////////////////////////////////////////////////////

	{
		section: "Expanded OMs",
		column: 2,
	},
	{
		name: "[Gen 7] 350 Cup",
		desc: "Pok&eacute;mon with a base stat total of 350 or lower get their stats doubled. &bullet; <a href=\"https://www.smogon.com/forums/threads/3589641/\">350 Cup</a>",
		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers', 'R 350 Cup Rule'],
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
		name: "[Gen 7] Sketchmons",
		desc: `Pok&eacute;mon can learn one of any move they don't normally learn, barring the few that are banned.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3587743/">Sketchmons</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Kartana', 'Porygon-Z', 'Battle Bond'],
		restrictedMoves: [
			'Belly Drum', 'Celebrate', 'Chatter', 'Conversion', 'Extreme Speed', "Forest's Curse", 'Geomancy', 'Happy Hour', 'Hold Hands',
			'Lovely Kiss', 'Purify', 'Quiver Dance', 'Shell Smash', 'Shift Gear', 'Sketch', 'Spore', 'Sticky Web', 'Trick-or-Treat',
		],
		checkLearnset(move, template, lsetData, set) {
			let problem = this.checkLearnset(move, template, lsetData, set);
			if (!problem) return null;
			const restrictedMoves = this.format.restrictedMoves || [];
			if (move.isZ || restrictedMoves.includes(move.name)) return problem;
			// @ts-ignore
			if (set.sketchMove) return {type: 'oversketched', maxSketches: 1};
			// @ts-ignore
			set.sketchMove = move.id;
			return null;
		},
		onValidateTeam(team, format, teamHas) {
			let sketches = {};
			for (const set of team) {
				// @ts-ignore
				if (set.sketchMove) {
					// @ts-ignore
					if (!sketches[set.sketchMove]) {
						// @ts-ignore
						sketches[set.sketchMove] = 1;
					} else {
						// @ts-ignore
						sketches[set.sketchMove]++;
					}
				}
			}
			let overSketched = Object.keys(sketches).filter(move => sketches[move] > 1);
			if (overSketched.length) return overSketched.map(move => `You are limited to 1 of ${this.getMove(move).name} by Sketch Clause. (You have sketched ${this.getMove(move).name} ${sketches[move]} times.)`);
		},
	},
	{
        name: "[Gen 7] Suicide Cup",
        desc: `Victory is obtained when all of your Pok&eacute;mon have fainted.`,
        threads: [
            `&bullet; <a href="https://www.smogon.com/forums/threads/3633603/">Suicide Cup</a>`,
        ],

        mod: 'gen7',
        forcedLevel: 100,
        ruleset: ['Suicide Cup Rule', 'Cancel Mod', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Moody Clause', 'Nickname Clause', 'Pokemon', 'Sleep Clause Mod', 'Species Clause', 'Team Preview'],
        banlist: [
            'Illegal', 'Unreleased', 'Shedinja', 'Infiltrator', 'Magic Guard', 'Misty Surge', 'Assault Vest', 'Choice Scarf', 'Explosion',
            'Final Gambit', 'Healing Wish', 'Lunar Dance', 'Magic Room', 'Memento', 'Misty Terrain', 'Self-Destruct',
        ],
        onValidateTeam: function (team) {
            let problems = [];
            if (team.length !== 6) problems.push(`Your team cannot have less than 6 Pok\u00e9mon.`);
            let families = {};
            for (const set of team) {
                let pokemon = this.getTemplate(set.species);
                if (pokemon.baseSpecies) pokemon = this.getTemplate(pokemon.baseSpecies);
                if (pokemon.prevo) {
                    pokemon = this.getTemplate(pokemon.prevo);
                    if (pokemon.prevo) {
                        pokemon = this.getTemplate(pokemon.prevo);
                    }
                }
                if (!families[pokemon.species]) families[pokemon.species] = [];
                families[pokemon.species].push(set.species);
            }
            for (const family in families) {
                if (families[family].length > 1) problems.push(`${Chat.toListString(families[family])} are in the same evolutionary family.`);
            }
            return problems;
        },
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
				let item = this.getItem(set.item);
				let template = this.getTemplate(set.species);
				if (!template.exists) return [`The Pok\u00e9mon "${set.name || set.species}" does not exist.`];
				if (i === 0) {
					types = template.types;
					if (template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz') types = ['Psychic'];
					if (item.megaStone && template.species === item.megaEvolves) {
						template = this.getTemplate(item.megaStone);
						let baseTemplate = this.getTemplate(item.megaEvolves);
						types = baseTemplate.types.filter(type => template.types.includes(type));
					}
					// 18/10/08 TrashChannel: Since this is already an ubers-based meta,
					// we shouldn't need to check the gods for any additional bans
				} else {
					// 18/10/08 TrashChannel: Avoid using OU validator as it interferes with mashups
					// followerbanlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass'],
					if ("Uber" == template.tier) { // Ban ubers
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
					let followerTypes = template.types;
					if (item.megaStone && template.species === item.megaEvolves) {
						template = this.getTemplate(item.megaStone);
						let baseTemplate = this.getTemplate(item.megaEvolves);
						if (baseTemplate.types.some(type => types.includes(type)) && template.types.some(type => types.includes(type))) {
							followerTypes = baseTemplate.types.concat(template.types).filter(type => template.types.concat(baseTemplate.types).includes(type));
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
		restrictedMoves: ['Bide', 'Chatter', 'Dynamic Punch', 'Fake Out', 'Frustration', 'Inferno', 'Power Trip', 'Power-Up Punch', 'Pursuit', 'Return', 'Stored Power', 'Zap Cannon'],
		validateSet(set, teamHas) {
			const restrictedMoves = this.format.restrictedMoves || [];
			let item = set.item;
			let move = this.dex.getMove(set.item);
			if (!move.exists || move.type === 'Status' || restrictedMoves.includes(move.name) || move.flags['charge'] || move.priority > 0) return this.validateSet(set, teamHas);
			set.item = '';
			let problems = this.validateSet(set, teamHas) || [];
			set.item = item;
			// @ts-ignore
			if (this.format.checkLearnset.call(this, move, this.dex.getTemplate(set.species))) problems.push(`${set.species} can't learn ${move.name}.`);
			// @ts-ignore
			if (move.secondaries && move.secondaries.some(secondary => secondary.boosts && secondary.boosts.accuracy < 0)) problems.push(`${set.name || set.species}'s move ${move.name} can't be used as an item.`);
			return problems.length ? problems : null;
		},
		checkLearnset(move, template, lsetData, set) {
			if (move.id === 'beatup' || move.id === 'fakeout' || move.damageCallback || move.multihit) return {type: 'invalid'};
			return this.checkLearnset(move, template, lsetData, set);
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
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Averagemons Rule'],
		banlist: [
			'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Smeargle',
			'Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Deep Sea Tooth', 'Eviolite', 'Light Ball', 'Thick Club', 'Baton Pass', 'Chatter',
		],
	},
	{
		name: "[Gen 7] Inheritance",
		desc: `Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.`,
		threads: [
			`&bullet; <a href="http://www.smogon.com/forums/threads/3592844/">Inheritance</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: [
			'Blacephalon', 'Cresselia', 'Hoopa-Unbound', 'Kartana', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Gyaradosite', 'Smeargle',
			'Huge Power', 'Imposter', 'Innards Out', 'Pure Power', 'Speed Boost', 'Water Bubble', 'Assist', 'Chatter', 'Shell Smash',
		],
		noChangeForme: true,
		noChangeAbility: true,
		// @ts-ignore
		getEvoFamily: function (species) {
			let template = Dex.getTemplate(species);
			while (template.prevo) {
				template = Dex.getTemplate(template.prevo);
			}
			return template.speciesid;
		},
		validateSet: function (set, teamHas) {
			const ruleTable = this.ruleTable;

			ruleTable.forEach((v, rule) => {
				console.log("Inheritance rule: " + rule);
			});

			// @ts-ignore
			if (!this.format.abilityMap) {
				let abilityMap = Object.create(null);
				for (let speciesid in Dex.data.Pokedex) {
					let pokemon = Dex.data.Pokedex[speciesid];
					if( ruleTable.has('-unreleased') ) {
						if (pokemon.num < 1) continue;
					}
					if( ruleTable.has('-pokemon:smeargle') ) {
						if (pokemon.species === 'Smeargle') continue;
					}
					if (Dex.data.FormatsData[speciesid].requiredItem || Dex.data.FormatsData[speciesid].requiredMove) continue;
					for (let key in pokemon.abilities) {
						// @ts-ignore
						let abilityId = toID(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				// @ts-ignore
				this.format.abilityMap = abilityMap;
			}

			this.format.noChangeForme = false;
			// @ts-ignore
			let problems = Dex.getFormat('Pokemon').onChangeSet.call(Dex, set, this.format) || [];
			this.format.noChangeForme = true;

			if (problems.length) return problems;

			let species = toID(set.species);
			let template = Dex.getTemplate(species);
			if (!template.exists) return [`The Pokemon "${set.species}" does not exist.`];
			if( ruleTable.has('-unreleased') ) {
				if (template.isUnreleased) return [`${template.species} is unreleased.`];
			}
			let megaTemplate = Dex.getTemplate(Dex.getItem(set.item).megaStone);
			if( ruleTable.has('-pokemontag:uber') ) {
				if (template.tier === 'Uber' || megaTemplate.tier === 'Uber') return [`${megaTemplate.tier === 'Uber' ? megaTemplate.species : template.species} is banned.`];
			}
			if( ruleTable.has('-pokemon:'+toID(template.species) ) ) {
				return [`${template.species} + 'is banned.`];
			}

			let name = set.name;

			let abilityId = toID(set.ability);

			if (!abilityId || !(abilityId in Dex.data.Abilities)) return [`${name} needs to have a valid ability.`];
			// @ts-ignore
			let pokemonWithAbility = this.format.abilityMap[abilityId];
			if (!pokemonWithAbility) return [`"${set.ability}" is not available on a legal Pokemon.`];

			let canonicalSource = ''; // Specific for the basic implementation of Donor Clause (see onValidateTeam).
			// @ts-ignore
			let validSources = set.abilitySources = []; // Evolution families
			for (const donor of pokemonWithAbility) {
				let donorTemplate = Dex.getTemplate(donor);
				// @ts-ignore
				let evoFamily = this.format.getEvoFamily(donorTemplate);

				if (validSources.indexOf(evoFamily) >= 0) continue;

				if (set.name === set.species) delete set.name;
				set.species = donorTemplate.species;
				problems = this.validateSet(set, teamHas) || [];

				if (!problems.length) {
					canonicalSource = donorTemplate.species;
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// Specific for the basic implementation of Donor Clause (see onValidateTeam).
					break;
				}
			}

			set.species = template.species;
			if (!validSources.length && pokemonWithAbility.length > 1) {
				return [`${template.species}'s set is illegal.`];
			}
			if (!validSources.length) {
				problems.unshift(`${template.species} has an illegal set with an ability from ${Dex.getTemplate(pokemonWithAbility[0]).name}.`);
				return problems;
			}

			// Protocol: Include the data of the donor species in the `ability` data slot.
			// Afterwards, we are going to reset the name to what the user intended. :]
			set.ability = `${set.ability}0${canonicalSource}`;
		},
		onValidateTeam: function (team, format) {
			// Donor Clause
			let evoFamilyLists = [];
			for (const set of team) {
				// @ts-ignore
				if (!set.abilitySources) continue;
				// @ts-ignore
				evoFamilyLists.push(set.abilitySources.map(format.getEvoFamily));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			let requiredFamilies = Object.create(null);
			for (const evoFamilies of evoFamilyLists) {
				if (evoFamilies.length !== 1) continue;
				let [familyId] = evoFamilies;
				if (!(familyId in requiredFamilies)) requiredFamilies[familyId] = 1;
				requiredFamilies[familyId]++;
				if (requiredFamilies[familyId] > 2) return [`You are limited to up to two inheritances from each evolution family by the Donor Clause.`, `(You inherit more than twice from ${this.getTemplate(familyId).species}).`];
			}
		},
		onBegin: function () {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.baseAbility.includes('0')) {
					let donor = pokemon.baseAbility.split('0')[1];
					// @ts-ignore
					pokemon.donor = toID(donor);
					pokemon.baseAbility = pokemon.baseAbility.split('0')[0];
					pokemon.ability = pokemon.baseAbility;
				}
			}
		},
		onSwitchIn: function (pokemon) {
			// @ts-ignore
			if (!pokemon.donor) return;
			// @ts-ignore
			let donorTemplate = this.getTemplate(pokemon.donor);
			if (!donorTemplate.exists) return;
			// Place volatiles on the Pokémon to show the donor details.
			this.add('-start', pokemon, donorTemplate.species, '[silent]');
		},
	},
	{
		name: "[Gen 7] Pokebilities",
		desc: `Pok&eacute;mon have all of their released Abilities simultaneously.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3588652/">Pok&eacute;bilities</a>`,
		],

		mod: 'pokebilities',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Bibarel', 'Bidoof', 'Diglett', 'Dugtrio', 'Excadrill', 'Glalie', 'Gothita', 'Gothitelle', 'Gothorita', 'Octillery', 'Porygon-Z', 'Remoraid', 'Smeargle', 'Snorunt', 'Trapinch', 'Wobbuffet', 'Wynaut'],
		onBegin() {
			let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
			for (let pokemon of allPokemon) {
				if (pokemon.ability === toID(pokemon.template.abilities['S'])) {
					continue;
				}
				// @ts-ignore
				pokemon.innates = Object.keys(pokemon.template.abilities).filter(key => key !== 'S' && (key !== 'H' || !pokemon.template.unreleasedHidden)).map(key => toID(pokemon.template.abilities[key])).filter(ability => ability !== pokemon.ability);
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
		name: "[Gen 7] Godly Gift",
		desc: `Each Pok&eacute;mon receives one base stat from your God depending on its position in your team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/3597618/">Godly Gift</a>`,
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] Ubers'],
		banlist: ['Uber > 1', 'Uber ++ Arena Trap', 'Uber ++ Power Construct', 'Blissey', 'Chansey', 'Deoxys-Attack', 'Gengar-Mega', 'Mawile-Mega', 'Medicham-Mega', 'Sableye-Mega', 'Toxapex', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Baton Pass'],
		onModifyTemplate(template, target, source, effect) {
			if (source || !target || !target.side) return;
			let uber = target.side.team.find(set => {
				let item = this.getItem(set.item);
				return set.ability === 'Arena Trap' || set.ability === 'Power Construct' || this.getTemplate(item.megaEvolves === set.species ? item.megaStone : set.species).tier === 'Uber';
			}) || target.side.team[0];
			let stat = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'][target.side.team.indexOf(target.set)];
			let pokemon = this.deepClone(template);
			// @ts-ignore
			pokemon.baseStats[stat] = this.getTemplate(uber.species).baseStats[stat];
			return pokemon;
		},
	},
//#endregion

//#region TrashChannel: Original Programming
	// TrashChannel Original Programming
	///////////////////////////////////////////////////////////////////

	{
		section: "TrashChannel Original Programming",
		column: 3,
	},
	{
		name: "[Gen 7] Mix and Meta",
		onDesc() {
			let descString = `<b>Are you ready, true believers? Mashups and Trash Channel have joined forces once again to bring you...MIX AND META!</b> <br>Pit sets from a variety of popular OMs against each other to see which is the strongest. Supported metas:-`;

			// Load MxM mod functions
			/**@type {{[k: string]: MixedMeta}} */
			let MMCollection;
			try {
				MMCollection = require(MMCOLLECTION).MixedMetaCollection;
			} catch (e) {
				console.log('e.code: ' + e.code);
				if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
					throw e;
				}
				MMCollection = null;
			}

			let ourFormat = Dex.getFormat('[Gen 7] Mix and Meta', true);
			if(undefined === ourFormat) return descString;

			for (const mixedMetaKey in MMCollection) {
				console.log("mixedMetaKey: " + mixedMetaKey);
				
				let mixedMetaValue = MMCollection[mixedMetaKey];
				let metaFormat = Dex.getFormat(MMCollection[mixedMetaKey].format, true);
				let metaBanned = (undefined !== mixedMetaValue.banReason );

				if(metaBanned) descString += `<s>`;

				descString += `<br><br><b>${metaFormat.name}</b>`;
				if(metaBanned) {
					descString += `</s>`;
					descString += ` <font color="red">BANNED!!</font>`;
					descString += `<s>`;
				}
				descString += `<br>Description: ${metaFormat.desc} <br>Tier limit: ${mixedMetaValue.weightTier}`;
				if(mixedMetaValue.bstLimit) {
					descString += `<br>BST Limit: ${mixedMetaValue.bstLimit.toString()}`;
				}

				if(metaBanned) {
					descString += `</s>`;
					descString += `<br>Ban Reasoning: ${mixedMetaValue.banReason}`;
				}
			}

			if(ourFormat.modValueNumberA) {
				descString += `<br><br>Meta clause limits you to <b>${ourFormat.modValueNumberA.toString()}</b> sets per meta on a single team.`;
			}

			return descString;
		},
		threads: [
			``,
		],

		mod: 'mixandmeta',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: [
		],
		modValueNumberA: 2,
		onValidateTeam(team) {
			let problems = [];

			// Load MxM mod functions
			/**@type {{[k: string]: MixedMeta}} */
			let MMCollection;
			try {
				MMCollection = require(MMCOLLECTION).MixedMetaCollection;
			} catch (e) {
				console.log('e.code: ' + e.code);
				if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
					throw e;
				}
				problems.push("MMCollection not found!");
				return problems;
			}

			let MMCollectionLength = Object.keys(MMCollection).length;

			let ourFormat = Dex.getFormat('[Gen 7] Mix and Meta', true);
			if(undefined === ourFormat) return;

			// @ts-ignore
			let perMetaUserCount = [];
			let perMetaMadeOnValidateTeamCheck = [];
			let perMetaIdToMixedMetaKey = [];

			for (const mixedMetaKey in MMCollection) {
				console.log("team mixedMetaKey: " + mixedMetaKey);
				
				const id = 'gen7'+mixedMetaKey;
				perMetaUserCount[id] = 0;
				perMetaIdToMixedMetaKey[id] = mixedMetaKey;
			}

			for (const set of team) {
				if(undefined === ourFormat.determineMeta) continue;
				let setMetaKey = ourFormat.determineMeta.call(this, set, null);
				let setMetaKeyId = toID(setMetaKey);

				console.log("setMetaKeyId: " + setMetaKeyId);

				perMetaUserCount[setMetaKeyId]++;

				console.log("team meta count: " + perMetaUserCount[setMetaKeyId]);

				if(ourFormat.modValueNumberA) {
					console.log("exists ");
					if(perMetaUserCount[setMetaKeyId] === (ourFormat.modValueNumberA+1) ) {
						problems.push(`Mix and Meta limits teams to ${ourFormat.modValueNumberA} users per meta, ` +
						`but you seem to have ${ourFormat.modValueNumberA}+ Pokemon intended as ${setMetaKey} users.`);
					}
				}

				// Check if we have already checked a Pokemon with this meta on the team
				if(!(setMetaKeyId in perMetaMadeOnValidateTeamCheck)) {
					let mixedMetaKey = perMetaIdToMixedMetaKey[setMetaKeyId];
					let metaFormat = Dex.getFormat(MMCollection[mixedMetaKey].format, true);
					if(metaFormat.onValidateTeam) { // Validate whole team by member's meta's onValidateTeam
						let metaTeamProblems = metaFormat.onValidateTeam.call(this, team);
						if(metaTeamProblems && metaTeamProblems.length > 0) {
							problems.push(`By including a Pokemon from ${MMCollection[mixedMetaKey].format} on your team, ` +
							`you subjected your whole team to its team validation, which found the following problems:-`);

							for(let nMtpItr=0; nMtpItr<metaTeamProblems.length; ++nMtpItr) {
								problems.push(metaTeamProblems[nMtpItr]);
							}
						}
					}
					perMetaMadeOnValidateTeamCheck[setMetaKeyId] = true;
				}
			}
			return problems;
		},
		validateSet(set, teamHas) {
			global.DexCalculator = require('../trashchannel/dex-calculator');

			// @ts-ignore
			let problems = [];

			// Calc set data
			let template = Dex.getTemplate(set.species || set.name);
			let isNativeMega = false;
			let item = Dex.getItem(set.item);
			if (set.item && item.megaStone && ( item.megaEvolves === template.baseSpecies)) {
				let bstMega = 0;
				template = Dex.getTemplate(item.megaStone);
				isNativeMega = true;
			}
			let setTierEnum = global.DexCalculator.calcTierEnumeration(template.tier);

			console.log("template.tier: " + template.tier);
			console.log("setTierEnum: " + setTierEnum.toString());
			let setBst = 0;
			for (let stat in template.baseStats) {
				// @ts-ignore
				setBst += template.baseStats[stat];
			}

			// Load MxM mod functions
			/**@type {{[k: string]: MixedMeta}} */
			let MMCollection;
			try {
				MMCollection = require(MMCOLLECTION).MixedMetaCollection;
			} catch (e) {
				console.log('e.code: ' + e.code);
				if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
					throw e;
				}
				problems.push("MMCollection not found!");
				return problems;
			}

			let MMCollectionLength = Object.keys(MMCollection).length;

			// @ts-ignore
			let metaIncurredRedFlagDict = [];

			// @ts-ignore
			let perMetaValidatorProblemsDict = [];
			let lowestValidatorProblemsMetaCount = Number.MAX_SAFE_INTEGER;
			let lowestValidatorProblemsMetaKey = 'None';

			// @ts-ignore
			let perMetaWeightingProblemsDict = [];
			let lowestWeightingProblemsMetaCount = Number.MAX_SAFE_INTEGER;
			let lowestWeightingProblemsMetaKey = 'None';
			let validatorPassMetaWithMinimalWeightingViolation = 'None';
			let minimalViolationTierDifference = Number.MAX_SAFE_INTEGER;

			let lowestTotalProblemsMetaCount = Number.MAX_SAFE_INTEGER;
			let lowestTotalProblemsMetaKey = 'None';

			// @ts-ignore
			let perMetaTotalProblemsCount = [];

			let agFormat = Dex.getFormat('[Gen 7] Anything Goes', true);
			let clearRuleTable = Dex.getRuleTable(agFormat);
			clearRuleTable.set("Illegal", "+illegal");
			clearRuleTable.set("Unreleased", "+unreleased");

			for (const mixedMetaKey in MMCollection) {
				console.log("mixedMetaKey: " + mixedMetaKey);
				
				let mixedMetaValue = MMCollection[mixedMetaKey];
				if(undefined !== mixedMetaValue.banReason ) continue;

				// Check for red flags
				metaIncurredRedFlagDict[mixedMetaKey] = undefined;
				if(MMCollection[mixedMetaKey].isSetRedFlag) {
					metaIncurredRedFlagDict[mixedMetaKey] = MMCollection[mixedMetaKey].isSetRedFlag.call(this, set);
				}

				// Regular validation problem for this OM
				let metaFormat = Dex.getFormat(MMCollection[mixedMetaKey].format, true);
				let metaRuleTable = Dex.getRuleTable(metaFormat);

				let validatorProblems = this.validateSetInternal(set, teamHas, metaFormat, metaRuleTable, true) || [];
				perMetaValidatorProblemsDict[mixedMetaKey] = validatorProblems;
				if(validatorProblems.length < lowestValidatorProblemsMetaCount) { // FIXME: Tie-break based on tier difference
					lowestValidatorProblemsMetaCount = validatorProblems.length;
					lowestValidatorProblemsMetaKey = mixedMetaKey;
				}

				console.log("validatorProblems.length: " + validatorProblems.length.toString());
				
				// MxM weighting restrictions
				// @ts-ignore
				let currentMetaWeightingProblems = [];
				let violationTierDifference = (0 == validatorProblems.length) ? 0 : DexCalculator.calcTierEnumeration("lc")+1;
				let metaTierEnum = global.DexCalculator.calcTierEnumeration(mixedMetaValue.weightTier);
				console.log("mixedMetaValue.weightTier: " + mixedMetaValue.weightTier);
				console.log("metaTierEnum: " + metaTierEnum.toString());
				if( metaTierEnum > setTierEnum ) {
					const problemText = 
					`${template.name} is in the tier ${template.tier}, `+
					`but the meta ${metaFormat.name} has a ${mixedMetaValue.weightTier} tier restriction.`
					currentMetaWeightingProblems.push( problemText );
					console.log(problemText);
					violationTierDifference += (metaTierEnum-setTierEnum);
				}

				if(mixedMetaValue.bstLimit) {
					console.log("mixedMetaValue.bstLimit: " + mixedMetaValue.bstLimit.toString());
					if( ( mixedMetaValue.bstLimit >= 0 ) && ( setBst > mixedMetaValue.bstLimit ) ) {
						const problemText = 
						`${template.name} has a BST of ${setBst}, `+
						`but the meta ${metaFormat.name} has a ${mixedMetaValue.bstLimit} BST limit.`
						currentMetaWeightingProblems.push(problemText);
						console.log(problemText);
						violationTierDifference += 0.5; // Offset between tiers as a tie-breaker
					}
				}

				if(validatorProblems.length === 0) {
					if(violationTierDifference < minimalViolationTierDifference) {
						minimalViolationTierDifference = violationTierDifference;
						validatorPassMetaWithMinimalWeightingViolation = mixedMetaKey;
					}
				}

				perMetaWeightingProblemsDict[mixedMetaKey] = currentMetaWeightingProblems;
				if(currentMetaWeightingProblems.length < lowestWeightingProblemsMetaCount) {
					lowestWeightingProblemsMetaCount = currentMetaWeightingProblems.length;
					lowestWeightingProblemsMetaKey = mixedMetaKey;
				}

				console.log("currentMetaWeightingProblems.length: " + currentMetaWeightingProblems.length.toString());

				// Total problems
				let totalProblemsCount = (validatorProblems.length + currentMetaWeightingProblems.length);
				if( totalProblemsCount < lowestTotalProblemsMetaCount) {
					lowestTotalProblemsMetaCount = totalProblemsCount;
					lowestTotalProblemsMetaKey = mixedMetaKey;
				}
				perMetaTotalProblemsCount[mixedMetaKey] = totalProblemsCount;

				// If any meta incurs a red flag check, assume it is ours
				if(metaIncurredRedFlagDict[mixedMetaKey]) {
					if(totalProblemsCount > 0) { // If red flag meta has any problems, we can't continue
						problems.push(`Due to ${set.name || set.species} ${metaIncurredRedFlagDict[mixedMetaKey]} ` +
						`it was forcibly validated as a ${metaFormat.name} user, and the following problems with it were found:- `);
						if(validatorProblems.length > 0) {
							problems = problems.concat(validatorProblems);
						}
						if(currentMetaWeightingProblems.length > 0) {
							problems = problems.concat(currentMetaWeightingProblems);
						}
					}
					return problems;
				}
			}

			// Check if any meta has no problems and that we can therefore use it
			for (const mixedMetaKey in MMCollection) {
				console.log("mixedMetaKey: " + mixedMetaKey);
				
				let mixedMetaValue = MMCollection[mixedMetaKey];
				if(undefined !== mixedMetaValue.banReason ) continue;

				let noProblemsIntersection = (0 === perMetaTotalProblemsCount[mixedMetaKey]);
				if(noProblemsIntersection) { // Determined legal, exit
					return problems;
				}
			}

			// We do have some problems if we reached this point,
			// we just have to determine what meta the set was probably intended for

			// Prioritise meta that has no inherent illegalities within an OM, but fails MxM tier/BST limits least severely
			if( ('None' !== validatorPassMetaWithMinimalWeightingViolation) &&
				(0 === perMetaValidatorProblemsDict[validatorPassMetaWithMinimalWeightingViolation].length) )
			{
				let metaFormat = Dex.getFormat(MMCollection[validatorPassMetaWithMinimalWeightingViolation].format, true);
				problems.push(`${set.name || set.species} is not supported by any Mix and Meta sub-format. ` +
				`Based on the set, it seems to be intended as a ${metaFormat.name} user. ` +
				`It would be legal in ${metaFormat.name}, but has the following weighting violations ` +
				`in Mix and Meta:-`);
				problems = problems.concat(perMetaWeightingProblemsDict[validatorPassMetaWithMinimalWeightingViolation]);
				return problems;
			}

			// If no such meta exists, prioritise meta with lowest number of inherent illegalities
			let metaFormat = Dex.getFormat(MMCollection[lowestValidatorProblemsMetaKey].format, true);
			problems.push(`${set.name || set.species} would not be legal in any Mix and Meta sub-format. ` +
				`The format that reports the fewest problems is ${metaFormat.name}, and those problems are:- `);
			problems = problems.concat(perMetaValidatorProblemsDict[lowestValidatorProblemsMetaKey]);
			return problems;
		},
		onBegin() {
			// Determine and cache the Pokemons' metas
			let format = this.getFormat();
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if(format.determineMeta) {
					pokemon.meta = format.determineMeta.call(this, pokemon.set, null);
				}

				if(undefined === pokemon.meta) continue;

				let metaFormat = this.getFormat(pokemon.meta);

				if(metaFormat.onBegin) {
					metaFormat.onBegin.call(this);
				}
			}
		},
		onModifyTemplate(template, pokemon, source) {
			let pokemonTemplate = this.deepClone(template);
			if(pokemon.meta) {
				let metaFormat = this.getFormat(pokemon.meta);
				if(metaFormat.onModifyTemplate) {
					pokemonTemplate = metaFormat.onModifyTemplate.call(this, pokemonTemplate, pokemon, source);
				}
			}
			return pokemonTemplate;
		},
		onSwitchIn(pokemon) {
			if(pokemon.meta) {
				// Place volatiles on the Pokémon to show its meta if defined
				this.add('-start', pokemon, toID(pokemon.meta), '[silent]');

				let metaFormat = this.getFormat(pokemon.meta);
				if(metaFormat.onSwitchIn) {
					metaFormat.onSwitchIn.call(this, pokemon);
				}
			}
		},
		onSwitchOut(pokemon) {
			if(pokemon.meta) {
				let metaFormat = this.getFormat(pokemon.meta);
				if(metaFormat.onSwitchOut) {
					metaFormat.onSwitchOut.call(this, pokemon);
				}
			}
		},
		onAfterMega(pokemon) {
			if(pokemon.meta) {
				let metaFormat = this.getFormat(pokemon.meta);

				if(metaFormat.onAfterMega) {
					metaFormat.onAfterMega.call(this, pokemon);
				}
			}
		},
		determineMeta(set, teamHas) {
			global.DexCalculator = require('../trashchannel/dex-calculator');

			console.log("running determineMeta for: " + set.species || set.name);

			// Calc set data
			let template = this.getTemplate(set.species || set.name);
			let isNativeMega = false;
			let item = this.getItem(set.item);
			if (set.item && item.megaStone && ( item.megaEvolves === template.baseSpecies)) {
				let bstMega = 0;
				template = this.getTemplate(item.megaStone);
				isNativeMega = true;
			}
			let setTierEnum = global.DexCalculator.calcTierEnumeration(template.tier);

			console.log("template.tier: " + template.tier);
			console.log("setTierEnum: " + setTierEnum.toString());
			let setBst = 0;
			for (let stat in template.baseStats) {
				// @ts-ignore
				setBst += template.baseStats[stat];
			}

			// Load MxM mod functions
			/**@type {{[k: string]: MixedMeta}} */
			let MMCollection;
			try {
				MMCollection = require(MMCOLLECTION).MixedMetaCollection;
			} catch (e) {
				console.log('e.code: ' + e.code);
				if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
					throw e;
				}
				return undefined;
			}

			let MMCollectionLength = Object.keys(MMCollection).length;

			// Do red flag checks first
			for (const mixedMetaKey in MMCollection) {
				console.log("Red flag check for mixedMetaKey: " + mixedMetaKey);
				
				let mixedMetaValue = MMCollection[mixedMetaKey];
				if(undefined !== mixedMetaValue.banReason ) continue;

				if(undefined === mixedMetaValue.isSetRedFlag) continue;

				if(mixedMetaValue.isSetRedFlag(set)) {
					return MMCollection[mixedMetaKey].format;
				}
			}

			// Use validator if we can't determine meta through red flags
			var TeamValidator = require('../.sim-dist/team-validator').TeamValidator;
			var validator = TeamValidator();

			for (const mixedMetaKey in MMCollection) {
				console.log("mixedMetaKey: " + mixedMetaKey);
				
				let mixedMetaValue = MMCollection[mixedMetaKey];
				if(undefined !== mixedMetaValue.banReason ) continue;

				// Regular validation problem for this OM
				let metaFormat = this.getFormat(MMCollection[mixedMetaKey].format, true);
				let metaRuleTable = this.getRuleTable(metaFormat);

				let validatorProblems = validator.validateSetInternal(set, teamHas, metaFormat, metaRuleTable, true) || [];
				console.log("validatorProblems.length: " + validatorProblems.length.toString());
				if(validatorProblems.length > 0) {
					for(let probItr=0; probItr<validatorProblems.length; ++probItr) {
						console.log("prob: " + validatorProblems[probItr]);
					}
					continue;
				}
				
				// MxM weighting restrictions
				// @ts-ignore
				let metaTierEnum = global.DexCalculator.calcTierEnumeration(mixedMetaValue.weightTier);
				console.log("mixedMetaValue.weightTier: " + mixedMetaValue.weightTier);
				console.log("metaTierEnum: " + metaTierEnum.toString());
				if( metaTierEnum > setTierEnum ) {
					continue;
				}

				if(mixedMetaValue.bstLimit) {
					console.log("mixedMetaValue.bstLimit: " + mixedMetaValue.bstLimit.toString());
					if( ( mixedMetaValue.bstLimit >= 0 ) && ( setBst > mixedMetaValue.bstLimit ) ) {
						continue;
					}
				}

				return MMCollection[mixedMetaKey].format;
			}

			return undefined;
		},
	},
	{
		name: "[Gen 7] Bitch and Beggar",
		onDesc() {
			let bstLimitString = this.modValueNumberA ? " (<=" + this.modValueNumberA.toString() + ")" : "";
			return "Pok&eacute;mon can 'Beggar-Evolve' using low" + bstLimitString + " BST Pok&eacute;mon as Stones.";
		},
		threads: [
			``,
		],

		mod: 'bitchandbeggar',
		ruleset: ['Pokemon', 'Standard', 'Bitch And Beggar Rule', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Baton Pass', 'Electrify'],
		cannotMega: [
			'Arceus', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Speed', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre',
			'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		restrictionlist: [
			'Huge Power', 'Pure Power', 'Wonder Guard', 
		],
		modValueNumberA: 300,
		onValidateTeam(team) {
			/**@type {{[k: string]: true}} */
			let itemTable = {};
			for (const set of team) {
				let bitchTemplate = this.getTemplate(set.item);
				if (!bitchTemplate.exists) continue;
				if (itemTable[bitchTemplate.id]) return ["You are limited to one of each Bitch.", "(You have more than one " + bitchTemplate.name + ")"];
				itemTable[bitchTemplate.id] = true;
			}
		},
		onValidateSet(set, format, setHas, teamHas, ruleTable) {
			//console.log('BnB: val ');
			//console.log('format.modValueNumberA: '+format.modValueNumberA.toString());

			let beggarTemplate = this.getTemplate(set.species || set.name);
			let bitchTemplate = this.getTemplate(set.item);
			//console.log('bitch: '+set.item);
			if(!bitchTemplate.exists) return;

			let problems = [];
			let bitchBST = this.calcBST(bitchTemplate.baseStats);
			//console.log('bitchBST: '+bitchBST.toString());
			if(format.modValueNumberA) {
				if(bitchBST > format.modValueNumberA) {
					problems.push("Bitches are limited to " + format.modValueNumberA.toString() + " BST, but " + bitchTemplate.name + " has " + bitchBST.toString() + "!");
				}
			}
			let uberBitches = format.restrictedStones || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(beggarTemplate.name) || set.ability === 'Power Construct' || uberBitches.includes(bitchTemplate.name)) return ["" + beggarTemplate.species + " is not allowed to hold " + bitchTemplate.name + "."];
			
			// Load BnB mod functions
			/**@type {ModdedBattleScriptsData | null} */
			let BnBMod = null;
			try {
				BnBMod = require(BITCHANDBEGGARMOD).BattleScripts;
			} catch (e) {
				console.log('e.code: ' + e.code);
				if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') {
					throw e;
				}
				problems.push("BnBMod not found!");
			}

			if(!BnBMod) {
				return problems;
			}

			const mixedTemplate = BnBMod.getMixedTemplate(beggarTemplate.name, bitchTemplate.baseSpecies);
			let oAbilitySlot = this.calcActiveAbilitySlot(beggarTemplate, set.ability);
			//console.log("oAbilitySlot: " + oAbilitySlot);
			// @ts-ignore
			let postBeggarAbilityName = mixedTemplate.abilities[oAbilitySlot];
			let postBeggarAbilityId = toID(postBeggarAbilityName);
			//console.log("postBeggarAbilityId: " + postBeggarAbilityId);
			let abilityTest = '-ability:'+postBeggarAbilityId;
			//console.log("abilityTest: " + abilityTest);
			ruleTable.forEach((v, rule) => {
				//console.log("BnB rule: " + rule);
				if( rule === abilityTest ) {
					//console.log("BnB rule IN ");
					problems.push("If "+set.name+" beggar-evolves with the ability "+ set.ability + ", it will gain the banned ability "
						+ postBeggarAbilityName + " from its bitch "+ bitchTemplate.name + ".");
				}
			});
			let restrictedAbilities = format.restrictedAbilities || [];
			if (restrictedAbilities.includes(postBeggarAbilityId)) {
				//console.log("BnB restriction IN ");
				problems.push("If "+set.name+" beggar-evolves with the ability "+ set.ability + ", it will gain the restricted ability "
					+ postBeggarAbilityName + " from its bitch "+ bitchTemplate.name + ".");
			}
			return problems;
		},
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseTemplate.species;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchTemplate = this.getTemplate(pokemon.item);
			if(!bitchTemplate.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.generateMegaStoneName(bitchSpecies), '[silent]');
				let oTemplate = this.getTemplate(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Bitch and Beggar: Hackmons Cup",
		desc: `Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, move, and bitch.`,
		threads: [
			``,
		],
		mod: 'bitchandbeggar',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
		team: 'randomHCBnB',
		onBegin() {
			for (const pokemon of this.getAllPokemon()) {
				pokemon.m.originalSpecies = pokemon.baseTemplate.species;
			}
		},
		onSwitchIn(pokemon) {
			// Take care of non-BnB case
			let bitchTemplate = this.getTemplate(pokemon.item);
			if(!bitchTemplate.exists) return;
			if (null === pokemon.canMegaEvo) {
				// Place volatiles on the Pokémon to show its beggar-evolved condition and details
				let bitchSpecies = pokemon.item;
				this.add('-start', pokemon, this.generateMegaStoneName(bitchSpecies), '[silent]');
				let oTemplate = this.getTemplate(pokemon.m.originalSpecies);
				if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut(pokemon) {
			// @ts-ignore
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.m.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] BEA5T M0D3",
		desc: `Pok&eacute;mon in this ZU-based meta can set other species as moves (including Ubers and Mega formes) to transform into them.`,
		threads: [
			``,
		],

		mod: 'beastmode',
		ruleset: ['Pokemon', 'Standard', 'Beast Mode Rule', 'Team Preview'],
		banlist: [
			'Uber', 'OU', 'UUBL', 'UU', 'RUBL', 'RU', 'NUBL', 'NU', 'PU',
			'Carracosta', 'Crabominable', 'Exeggutor-Base', 'Gorebyss', 'Jynx', 'Musharna', 'Raticate-Alola',
			'Raticate-Alola-Totem', 'Throh', 'Turtonator', 'Type: Null', 'Ursaring', 'Victreebel', 'Zangoose',
		],
	},
	{
		name: "[Gen 7] The Call of Pikacthulhu",
		desc: `Pok&eacute;mon get Perish status applied when entering battle.`,
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
//#endregion
];

exports.Formats = Formats;
