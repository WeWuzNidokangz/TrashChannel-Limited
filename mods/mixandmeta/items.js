'use strict';

const fs = require('fs');
const path = require('path');

// Includes
const MNM_SCRIPTS = path.resolve(__dirname, '../mixandmega/scripts');

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = require(MNM_SCRIPTS).BattleItems;
// This should be OK as validator forces orb users to validate as MnM

exports.BattleItems = BattleItems;
