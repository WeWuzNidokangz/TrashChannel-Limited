'use strict';

const RandomTeams = require('./../../../data/random-teams');

class RandomPiCTeams extends RandomTeams {
	randomHCPiCTeam() {
		let team = this.randomHCTeam();
		return team;
	}
}

module.exports = RandomPiCTeams;