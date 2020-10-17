'use strict';

const RandomTeams = require('./../../../data/random-teams');
const ITEMS = require('./../../../data/items');

class RandomMnMTeams extends RandomTeams {
	randomHCMnMTeam() {
		let team = this.randomHCTeam();

		// Load items
		/**@type {{[k: string]: ItemData}} */
		let Items = ITEMS.Items;

		/**@type {string[]} */
		let itemPool = [];
		
		for( let item of Object.keys(Items) ) {
			//console.log("Items[item].name: " + Items[item].name);
			if( (Items[item].megaStone) ||
				("Blue Orb" == Items[item].name) || 
				("Red Orb" == Items[item].name) )
			{
				console.log("Push mega item: " + Items[item].name);
				itemPool.push( Items[item].id );
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
