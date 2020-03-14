'use strict';

const RandomTeams = require('./../../../data/random-teams');
const ITEMS = require('./../../../data/items');

class RandomMnMTeams extends RandomTeams {
	randomHCMnMTeam() {
		let team = this.randomHCTeam();

		// Load items
		/**@type {{[k: string]: ItemData}} */
		let BattleItems = ITEMS.BattleItems;

		/**@type {string[]} */
		let itemPool = [];
		
		for( let item of Object.keys(BattleItems) ) {
			//console.log("BattleItems[item].name: " + BattleItems[item].name);
			if( (BattleItems[item].megaStone) &&
				("Crucibellite" !== BattleItems[item].name) )
			{
				console.log("Push mega item: " + BattleItems[item].name);
				itemPool.push( BattleItems[item].id );
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

module.exports = RandomMnMTeams;
