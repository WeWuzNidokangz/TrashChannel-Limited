import RandomTeams from '../../random-teams';

export class RandomLaLTeams extends RandomTeams {
	randomLaLTeam() {
		let team = this.randomTeam();
		return team;
	}
}

export default RandomLaLTeams;