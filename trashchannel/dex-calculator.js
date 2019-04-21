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

		tier = toId(tier);

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
}

module.exports = DexCalculator;
