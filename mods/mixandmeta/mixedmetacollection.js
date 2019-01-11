'use strict';

const DexCalculator = require('../../sim/dex-calculator');
global.Dex = require('../../sim/dex').includeData();

/**@type {{[k: string]: MixedMeta}} */
let MixedMetaCollection = {
	almostanyability: {
		format: "[Gen 7] Almost Any Ability",
		weightTier: "OU",
	},
	stabmons: {
		format: "[Gen 7] STABmons",
		weightTier: "OU",
	},
	mixandmega: {
		format: "[Gen 7] Mix and Mega",
		weightTier: "NU",
		isSetRedFlag: function(set) {
			// Dragon ascent red flags MnM
			if(set.moves.includes('dragonascent')) {
				return `having the Mega evolution move Dragon Ascent`;
			}

			// Check item-based mega evos
			let template = global.Dex.getTemplate(set.species || set.name);
			let item = global.Dex.getItem(set.item);
			if (!item.megaEvolves && !['blueorb', 'redorb', 'ultranecroziumz'].includes(item.id)) return undefined; // Native mega-evos
			if (template.baseSpecies === item.megaEvolves ||
				(template.baseSpecies === 'Groudon' && item.id === 'redorb') ||
				(template.baseSpecies === 'Kyogre' && item.id === 'blueorb') ||
				(template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz')) return undefined;
			return `holding the non-native Mega item ${set.item}`; // Item-based mega-evo
		},
	},
	camomons: {
		format: "[Gen 7] Camomons",
		weightTier: "OU",
		isSetRedFlag: function(set) {
			// Check if OU validator passes us
			var TeamValidator = require('../../sim/team-validator');
			var validator = TeamValidator();

			let metaFormat = global.Dex.getFormat("[Gen 7] OU", true);
			let metaRuleTable = global.Dex.getRuleTable(metaFormat);
			let metaRestrictionTable = global.Dex.getRestrictionTable(metaFormat);

			let validatorProblems = validator.validateSetInternal(set, undefined, metaFormat, metaRuleTable, metaRestrictionTable, true) || [];
			console.log("validatorProblems.length: " + validatorProblems.length.toString());
			if(validatorProblems.length === 0) {
				return `having an [Gen 7] OU legal set`;
			}
		},
	},
	balancedhackmons: {
		format: "[Gen 7] Balanced Hackmons",
		weightTier: "LC",
	},
	purehackmons: {
		format: "[Gen 7] Pure Hackmons",
		weightTier: "PU",
		bstLimit: 200,
		banReason: "Magikarp 2 stronk ;_;"
	},
}

exports.MixedMetaCollection = MixedMetaCollection;