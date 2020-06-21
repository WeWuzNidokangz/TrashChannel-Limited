'use strict';

const RandomTeams = require('../../random-teams');
const POKEDEX = require('../../pokedex');

class RandomBnBTeams extends RandomTeams {
	randomHCBnBTeam() {
		let team = this.randomHCTeam();

		// Load pokedex
		/**@type {{[k: string]: SpeciesData}} */
		let BattlePokedex = POKEDEX.BattlePokedex;

		/**@type {string[]} */
		let bitchPool = [];
		
		for( let bitch of Object.keys(BattlePokedex) ) {
			bitchPool.push( BattlePokedex[bitch].name );
		}
		
		/**@type {number} */
		let nBeggarIndex;
		for (let i = 0; i < 6; i++) {
			nBeggarIndex = this.random(bitchPool.length);
			team[i]['item'] = bitchPool[nBeggarIndex];
		}

		return team;
	}
}

module.exports = RandomBnBTeams;
