import RandomTeams from '../../random-teams';

export class RandomPokebilitiesTeams extends RandomTeams {
	randomPokebilitiesTeam() {
		let team = this.randomTeam();
		return team;
	}
}

export default RandomPokebilitiesTeams;