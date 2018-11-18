'use strict';

const RandomTeams = require('./../../data/random-teams');
const POKEDEX = require('./../../data/pokedex');

class RandomBnBTeams extends RandomTeams {
	randomHCBnBTeam() {
		let team = this.randomHCTeam();

		// Load pokedex
		/**@type {{[k: string]: TemplateData}} */
		let BattlePokedex = POKEDEX.BattlePokedex;

		/**@type {string[]} */
		let bitchPool = [];
		
		for( let bitch of Object.keys(BattlePokedex) ) {
			bitchPool.push( BattlePokedex[bitch].species );
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
