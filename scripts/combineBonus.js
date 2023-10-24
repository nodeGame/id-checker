const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

// nodegame installation directory (to launch nodegame cli).
const binDir = path.resolve(__dirname, '..', '..', '..');
console.log(binDir);

// Where to export 
const exportDir = path.join(__dirname, '..', 'export');
console.log(exportDir);

// Game name.
const pkgJSON = require(path.join(__dirname, '..', 'package.json'));
const gameName = pkgJSON.name;

// Parameters to launch nodegame-cli with.

let args = [ 'nodegame', 'export-data', gameName ];


// For Bonuses.
const bonusArgs = [

    // File names.
    '--files', 'bonus.csv',

    // Columns of csv header in and out.
    // '--in-csv-header', 'pid,bonus',
    // '--out-csv-header', 'pid,bonus',

    // '--in-csv-header', 'workerid',
    '--out-csv-header', 'workerid,bonus',


    // Looks inside every folder in data/
    '--recursive',

    // Where is the exported data saved.
    '--export-dir', exportDir,

    // Room filters.
    // '--from-room', '4',
    // '--to-room', '9',

    // General options.
    '--verbose',

    // If there is an error reading a file, it will stop the export. 
    '--throw',

    // What to do if the exported file is already existing.
    '--on-duplicated-names', 'rename'
];

let userArgs = bonusArgs;

args = [ ...args, ...userArgs ];
// console.log(args.join(' '));

// Execute export.
execFile(process.execPath, args, { cwd: binDir }, (error, stdout, stderr) => {
    console.log(stdout);
    if (error) console.log('Error:', error);
    else console.log('Bonus export successful');
});


