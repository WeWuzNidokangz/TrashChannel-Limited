import RandomTeams from '../../random-teams';

export class RandomPiCTeams extends RandomTeams {
	randomHCPiCTeam() {
		let team = this.randomHCTeam();
		return team;
	}
}

export default RandomPiCTeams;