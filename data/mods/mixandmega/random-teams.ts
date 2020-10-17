import RandomTeams from '../../random-teams';
import {Items} from './../../../.data-dist/items';
import {toID} from './../../../sim/dex';

class RandomMnMTeams extends RandomTeams {
	randomHCMnMTeam() {
		let team = this.randomHCTeam();

		/**@type {string[]} */
		let itemPool = [];
		
		for( let item of Object.keys(Items) ) {
			//console.log("Items[item].name: " + Items[item].name);
			if( (Items[item].megaStone) &&
				("Crucibellite" !== Items[item].name) )
			{
				//console.log("Push mega item: " + Items[item].name);
				itemPool.push( toID(Items[item].name) );
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