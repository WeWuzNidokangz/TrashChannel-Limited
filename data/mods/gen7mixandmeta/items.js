'use strict';

const fs = require('fs');
const path = require('path');

// Includes
const MNM_ITEMS = path.resolve(__dirname, '../mixandmega/items');

/**@type {{[k: string]: ModdedItemData}} */
let Items = require(MNM_ITEMS).Items;
// This should be OK as validator forces orb users to validate as MnM

exports.Items = Items;