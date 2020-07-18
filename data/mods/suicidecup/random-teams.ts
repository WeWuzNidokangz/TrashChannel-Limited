import RandomTeams from '../../random-teams';

export class RandomSCTeams extends RandomTeams {
	randomSCTeam() {
		let team = this.suicideCupRandomTeam();
		return team;
	}
}

export default RandomSCTeams;
