/**
 * Dex Calculator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * 18/10/13 TrashChannel:
 * Base class for Dex that encapsulates calculation functionality like Clamp
 * that we want to be able to include in chat commands, etc also
 *
 * @license MIT license
 */

'use strict';

//const fs = require('fs');
//const path = require('path');

class DexCalculator {
	constructor() {

	}

	/**
	 * Forces num to be an integer (between min and max).
	 * @param {any} num
	 * @param {number=} min
	 * @param {number=} max
	 * @return {number}
	 */
	static clampIntRange(num, min, max) {
		if (typeof num !== 'number') num = 0;
		num = Math.floor(num);
		if (min !== undefined && num < min) num = min;
		if (max !== undefined && num > max) num = max;
		return num;
	}

	/**
	 * @param {any} obj
	 * @return {any}
	 */
	static deepClone(obj) {
		if (obj === null || typeof obj !== 'object') return obj;
		// @ts-ignore
		if (Array.isArray(obj)) return obj.map(prop => DexCalculator.deepClone(prop));
		const clone = Object.create(Object.getPrototypeOf(obj));
		for (const key of Object.keys(obj)) {
			// @ts-ignore
			clone[key] = DexCalculator.deepClone(obj[key]);
		}
		return clone;
	}

	/**
	 * @param {string} character
	 * @return {boolean}
	 */
	static isVowel(character) {
		switch(character) {
			case 'a':
			case 'e':
			case 'i':
			case 'o':
			case 'u':
				return true;
		}

		return false;
	}

	/**
	 * @param {number} length
	 * @return {any[]}
	 */
	static createArray(length) {
		var arr = new Array(length || 0),
			i = length;
	
		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			while(i--) arr[length-1 - i] = DexCalculator.createArray.apply(this, args);
		}
	
		return arr;
	}

	/**
	 * @param {string} tier
	 * @return {number}
	 */
	static calcTierEnumeration(tier) {
		const tierEnums = {
			'ag': 0,
			'uber': 1,
			'ou' : 2,
			'uubl' : 3,
			'uu' : 4,
			'rubl' : 5,
			'ru' : 6,
			'nubl' : 7,
			'nu' : 8,
			'publ' : 9,
			'pu' : 10,
			'zubl' : 11,
			'zu' : 12,
			'nfe' : 13,
			'lcuber' : 14,
			'lc' : 15,
		};

		tier = toID(tier);

		// @ts-ignore
		let tierEnum = (tier in tierEnums) ? tierEnums[tier] : 0;
		return tierEnum;
	}

	/**
	 * @param {string} tierA
	 * @param {string} tierB
	 * @return {boolean}
	 */
	static tierALessThanOrEqualToB(tierA, tierB) {
		return (DexCalculator.calcTierEnumeration(tierA) < DexCalculator.calcTierEnumeration(tierB));
	}

	/**
	 * @param {Array} array
	 */
	static shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	/**
	 * @param {Species} species
	 * @return {Set<string>}
	 */
	static getFullLearnsetOfPokemon(species) {
		if (!species.learnset) {
			species = Dex.getSpecies(species.baseSpecies);
			// @ts-ignore
			species.learnset = species.learnset || {};
		}
		const lsetData = new Set(Object.keys(species.learnset));

		while (species.prevo) {
			species = Dex.getSpecies(species.prevo);
			for (const move in species.learnset) {
				lsetData.add(move);
			}
		}

		return lsetData;
	};

	/**
	 * @param {Species} species
	 * @param {String} type
	 * @return {Array} array
	 */
	static getMovesPokemonLearnsOfType(species, type) {
		const lsetData = DexCalculator.getFullLearnsetOfPokemon(species);

		// Get full move data for learnset moves
		/**@type {Move[]} */
		// @ts-ignore
		let dex = {};
		for (const move of lsetData) {
			// @ts-ignore
			dex[move] = Dex.getMove(move);
		}

		// Get those that match the specified type
		let results = [];
		for (const move in dex) {
			if (type !== dex[move].type) continue;
			results.push(dex[move].name);
		}

		return results;
	};

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 *
	 * @param {any[]} list
	 * @param {number} index
	 */
	static fastPop(list, index) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		let length = list.length;
		let element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * @param {any[]} list
	 * @param {any} value
	 */
	static arrayRemove(list, value) {
		// @ts-ignore
		return list.filter(function(ele) {
			return ele != value;
		});
	}

	/**
	 * Takes an array and turns it into a sentence string by adding commas and the word "and"
	 * * @param {string[]} arr
	 */
	static toListString(arr) {
		if (!arr.length) return '';
		if (arr.length === 1) return arr[0];
		if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
		return `${arr.slice(0, -1).join(", ")}, and ${arr.slice(-1)[0]}`;
	}
}

module.exports = DexCalculator;
