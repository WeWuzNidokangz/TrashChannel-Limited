import RandomTeams from '../../random-teams';
import {Pokedex} from '../../pokedex';

class RandomBnBTeams extends RandomTeams {
	randomHCBnBTeam() {
		let team = this.randomHCTeam();

		/**@type {string[]} */
		let bitchPool = [];
		
		for( let bitch of Object.keys(Pokedex) ) {
			bitchPool.push( Pokedex[bitch].name );
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

export default RandomBnBTeams;