/**
 * # Player type implementation of the game stages
 * Copyright(c) 2023 Anca <anca.balietti@gmail.com>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

//////////////////////////////////////////////////////////////////////
////// SETUP
/////////////////////////////////////////////////////////////////////
"use strict";
const ngc = require("nodegame-client");
const J = ngc.JSUS;

//var req = false;

module.exports = function (treatmentName, settings, stager, setup, gameRoom) {


    // Configure init for single-player experiment.
    gameRoom.use({
        initSinglePlayer: {
            stager: stager
        }
    });

    stager.extendStep("id_checker", {
        init: function() {
            node.on.data('already_did_it', function() {
                node.game.doneButton.disable();
                node.widgets.last.disable();
                W.writeln('<br>WorkerId <strong>' + node.game.id + 
                          '</strong> is already ' +
                          'in our database. <em><br><br>Please do not ' + 
                          'accept this task.</em><br><br>' + 
                          'If you input the wrong code ' +
                          'you may refresh the page and try again.<br><br>' +
                          'If you think this is a mistake, please contact ' +
                          'the requester.');
            });
            node.on.data('id_ok', function() {
                node.game.doneButton.disable();
                node.widgets.last.disable();
                W.writeln('<br>WorkerId <strong>' + node.game.id + 
                          '</strong> is <em>NOT</em> in our database.' +
                          '<br><br>' +
                          '<em>You may accept this task.</em>' +
                          '<br><br>' + 
                          'If you input the wrong code ' +
                          'you may refresh the page and try again.<br><br>' +
                          'If you think this is a mistake, please contact ' +
                          'the requester.');
            });
        },
        donebutton: {
            text: 'Check Worker Id',
            onclick: function() {
                let id = node.widgets.last.getValues().idChecker.value;
                if (id && id.trim() !== '') {
                    node.game.id = id;
                    node.say('id_checker', 'SERVER', id);
                }
                return false;
            }
        },
        widget: {
            simplify: true,
            forms: [
                {
                    displayRequired: false,
                    id: 'idChecker',
                    requiredChoice: true,
                    name: 'CustomInput',
                    mainText: 'Please enter your <em>Worker ID</em> below.',
                    hint: 'Here you can check whether you have taken our ' +
                          'task already.'
                }
            ]
        }
    });
    
   
};
