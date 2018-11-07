'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Weather Ball', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change type when used as a Z-move in weather', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Castform", item: 'normaliumz', moves: ['weatherball']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash']},
		]);
		battle.makeChoices('move weatherball zmove', 'move splash');
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not change type when called by a Z-move in weather', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Castform", item: 'normaliumz', moves: ['shadowball', 'assist']},
			{species: "Castform", moves: ['weatherball']},
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Gastly", level: 2, ability: 'drought', item: 'focussash', moves: ['splash']},
		]);
		battle.makeChoices('move shadowball', 'move splash');
		battle.makeChoices('move assist zmove', 'move splash');
		assert(!battle.p2.active[0].fainted);
	});
});
