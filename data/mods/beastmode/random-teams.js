'use strict';

const RandomTeams = require('./../../data/random-teams');
const POKEDEX = require('./../../data/pokedex');

class BeastModeTeams extends RandomTeams {
	
	/**
	 * @param {string | Template} beastTemplate
	 * @param {Pokemon} userPokemon
	 * @param {boolean} [isDoubles]
	 * @return {RandomTeamsTypes["RandomSet"]}
	 */
	beastModeTransformation(beastTemplate, userPokemon, isDoubles = false) {
		beastTemplate = this.getTemplate(beastTemplate);
		let baseTemplate = beastTemplate;
		let species = beastTemplate.species;

		if (!beastTemplate.exists || ((!isDoubles || !beastTemplate.randomDoubleBattleMoves) && !beastTemplate.randomBattleMoves && !beastTemplate.learnset)) {
			let err = new Error('Template incompatible with random battles: ' + species);
			require('../../lib/crashlogger')(err, 'The randbat set generator');
		}

		let battleForme = this.checkBattleForme(beastTemplate);
		if (battleForme && battleForme.randomBattleMoves && beastTemplate.otherFormes) {
			beastTemplate = this.getTemplate(beastTemplate.otherFormes.length >= 2 ? this.sample(beastTemplate.otherFormes) : beastTemplate.otherFormes[0]);
		}

		const randMoves = !isDoubles ? beastTemplate.randomBattleMoves : beastTemplate.randomDoubleBattleMoves || beastTemplate.randomBattleMoves;
		let movePool = (randMoves ? randMoves.slice() : beastTemplate.learnset ? Object.keys(beastTemplate.learnset) : []);
		/**@type {string[]} */
		let moves = [];
		let ability = '';
		let item = '';

		// Random EVs
		let evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		let s = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
		if (this.gen === 6) {
			let evpool = 510;
			do {
				let x = this.sample(s);
				// @ts-ignore
				let y = this.random(Math.min(256 - evs[x], evpool + 1));
				// @ts-ignore
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);
		} else {
			for (const x of s) {
				// @ts-ignore
				evs[x] = this.random(256);
			}
		}

		// Random IVs
		let ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

		// Random nature
		let naturePool = Object.keys(this.data.Natures);
		let nature = this.sample(naturePool);

		// Random happiness
		let happiness = this.random(256);

		// Random shininess
		let shiny = this.randomChance(1, 1024);

		/**@type {{[k: string]: true}} */
		let hasType = {};
		hasType[beastTemplate.types[0]] = true;
		if (beastTemplate.types[1]) {
			hasType[beastTemplate.types[1]] = true;
		}
		/**@type {{[k: string]: true}} */
		let hasAbility = {};
		hasAbility[beastTemplate.abilities[0]] = true;
		if (beastTemplate.abilities[1]) {
			// @ts-ignore
			hasAbility[beastTemplate.abilities[1]] = true;
		}
		if (beastTemplate.abilities['H']) {
			// @ts-ignore
			hasAbility[beastTemplate.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['closecombat', 'extremespeed', 'superpower', 'clangingscales', 'dracometeor', 'leafstorm', 'overheat'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link'];
		let ateAbilities = ['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				// Remove rejected moves from the move list
				if (rejected && (movePool.length - availableHP || availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && movePool.length);

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (beastTemplate.id === 'celesteela') {
				moves[moves.indexOf('heavyslam')] = 'flashcannon';
			} else {
				moves[moves.indexOf('autotomize')] = 'rockpolish';
			}
		}
		if (moves[0] === 'conversion') {
			moves[0] = moves[3];
			moves[3] = 'conversion';
		}

		/**@type {[string, string | undefined, string | undefined]} */
		// @ts-ignore
		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		let ability2 = this.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.randomChance(1, 2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(2, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2] && ability2.rating > 1) {
						ability = ability2.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);
		} else {
			ability = ability0.name;
		}

		if (beastTemplate.requiredItems) {
			// @ts-ignore
			if (beastTemplate.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[beastTemplate.types[0]])) {
				// Judgment doesn't change type with Z-Crystals
				item = beastTemplate.requiredItems[0];
			} else {
				item = this.sample(beastTemplate.requiredItems);
			}
		}
		let level = userPokemon.level;
		let gender = userPokemon.gender;
		item = userPokemon.item; // Not sure about this but...

		return {
			name: beastTemplate.baseSpecies,
			species: species,
			gender: gender,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			nature: nature,
			item: item,
			level: level,
			happiness: happiness,
			shiny: shiny,
		};
	}
}

module.exports = BeastModeTeams;
