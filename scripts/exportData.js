const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// Bin directory of nodegame installation.
const binDir = path.resolve(__dirname, '..', '..', '..');
console.log(binDir);

const exportDir = path.join(__dirname, '..', 'export');
console.log(exportDir);

const pkgJSON = require(path.resolve(__dirname, '..', 'package.json'));

const gameName = pkgJSON.name;

let args = [ 'nodegame', 'export-data', gameName ];

// For Data.
const dataArgs = [
    
    // Files to process.
    '--files', 'memo.ndjson',
    
    // Script pre-processing items, e.g.:

    // module.exports = function(item) {
    //     if (item.stepId === 'step_x') {
    //         delete item.propertyToRemove;
    //     }
    // };

    // '--on-insert', path.join(__dirname, 'preprocess.js'),

    // Looks inside every folder in data/
    '--recursive',

    // Where is the exported data saved.
    '--export-dir', exportDir,

    // Room filters.
    // '--rooms', '4',
    '--from-room', '4',
    '--to-room', '6',

    // CSV export options:
    '--out-format', 'csv',
    
    // One row per player.
    '--out-csv-flatten', 'player',

    // JSON objects are expanded until X nested levels.
    '--out-csv-obj-level', '5',
    
    // General options.
    '--verbose',

    // If there is an error reading a file, it will stop the export. 
    '--throw',

    // What to do if the exported file is already existing.
    '--on-duplicated-names', 'rename'
];

// let userArgs = bonusArgs;
let userArgs = dataArgs;

args = [ ...args, ...userArgs ];
// console.log(args.join(' '));

// Execute export.
execFile(process.execPath, args, { cwd: binDir }, (error, stdout, stderr) => {
    console.log(stdout);
    if (error) console.log('Error:', error);
    else console.log('Data export successful');
});


