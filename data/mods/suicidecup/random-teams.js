'use strict';

const RandomTeams = require('./../../../data/random-teams');

class RandomSCTeams extends RandomTeams {
	randomSCTeam() {
		let team = this.suicideCupRandomTeam();
		return team;
	}
}

module.exports = RandomSCTeams;
