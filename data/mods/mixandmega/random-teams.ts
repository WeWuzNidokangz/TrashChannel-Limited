import RandomTeams from '../../random-teams';
import {BattleItems} from './../../../.data-dist/items';

class RandomMnMTeams extends RandomTeams {
	randomHCMnMTeam() {
		let team = this.randomHCTeam();

		/**@type {string[]} */
		let itemPool = [];
		
		for( let item of Object.keys(BattleItems) ) {
			//console.log("BattleItems[item].name: " + BattleItems[item].name);
			if( (BattleItems[item].megaStone) &&
				("Crucibellite" !== BattleItems[item].name) )
			{
				//console.log("Push mega item: " + BattleItems[item].name);
				itemPool.push( toID(BattleItems[item].name) );
			}
		}
		
		/**@type {number} */
		let nMegaIndex;
		for (let i = 0; i < 6; i++) {
			nMegaIndex = this.random(itemPool.length);
			//console.log("nMegaIndex: " + nMegaIndex.toString());
			//console.log("itemPool[nMegaIndex]: " + itemPool[nMegaIndex]);
			//console.log("team[i]['item']: " + team[i]['item']);
			team[i]['item'] = itemPool[nMegaIndex];
		}

		return team;
	}
}

export default RandomMnMTeams;