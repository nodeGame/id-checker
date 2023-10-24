/**
* # Logic type implementation of the game stages
* Copyright(c) 2023 Anca Balietti <anca.balietti@gmail.com>
* MIT Licensed
*
* http://www.nodegame.org
* ---
*/

"use strict";


// Or with a custom config file
// var ngmt = require('nodegame-mturk')({ config: 'path/to/config.js' });

// Connect, fetch last HIT Id (async), and then assign it to a worker.

const path = require('path');
const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    let node = gameRoom.node;
    let channel = gameRoom.channel;
    let memory = node.game.memory;

    // Make the logic independent from players position in the game.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Must implement the stages here.

    stager.setOnInit(function() {



        // Saves worker id and adds Exit Code.
        node.on.data('id_checker', msg => {
            // console.log(msg);
            let wid = msg.data;
            if (!wid) return;

            wid = wid.toUpperCase();

            // console.log(wid);
            let client = setup.previousWorkers.id.get(wid);

            if (client) {
                node.say('already_did_it', msg.from);
            }
            else {
                // channel.registry.updateClient(msg.from, { 
                //     ExitCode: 'AOU74boyu2',
                //     WorkerId: wid 
                // });
                node.say('id_ok', msg.from);

                // setup.previousWorkers.insert({ workerid: wid });

                // // AMT.

                // if (setup.amt) {
                //     try {
                //         setup.ngmt.modules.qualification.assign({
                //             WorkerId: wid,
                //             QualificationTypeId: setup.QualificationTypeId,
                //             IntegerValue: 1
                //         });
                //     }
                //     catch(e) {
                //         console.log('An error occurred assigning ' +
                //         'qualification for worker ' + wid);
                //     }
                // }
            }
            
        });

    });
};
