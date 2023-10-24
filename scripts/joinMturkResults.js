const fs = require('fs');
const path = require('path');
const NDDB = require('NDDB');

// DIRECTORIES.
/////////////// 

const exportDir = path.join(__dirname, '..', 'export');
console.log(exportDir);

const dataDir = path.join(
    __dirname, '..', '..', '..', 'node_modules', 'nodegame-mturk', 'data');
console.log(dataDir);

const resDir = path.join(dataDir, 'results');
console.log(resDir);


// APPROVE/REJECT.
//////////////////

const apprFile = 'approve_reject_1920Oct.csv';
const approveRejectFile = path.join(dataDir, apprFile);

const dbApprove = NDDB.db();

const rejectReason =
    "I am sorry, but you did not pass attention check/s or " +
    "entered nonsensical text in open input/s.";

const bonusReason = "Task completed successfully. Thank you!"

dbApprove.on('insert', item => {
    if (item.reject) {
        item.requesterFeedback = rejectReason;
        approve = 0;
    }
    else {
        item.approve = 1;
        item.reason = bonusReason;
    }
});

dbApprove.index('workerid');
dbApprove.loadSync(approveRejectFile);

console.log('Approve/Reject Db size:', dbApprove.size());

// RESULTS FROM MTURK: to get HITId and AssignmentId.
/////////////////////////////////////////////////////

const dbRes = NDDB.db();
// Would be nice to have the option to throw, if index is duplicated.
// dbRes.index('workerid');

let notFound = 0;
dbRes.on('insert', item => {
    let approve = dbApprove.workerid.get(item.WorkerId);
    if (!approve) {
        // console.log('Not found', item.WorkerId);
        notFound++;
    }
    else {
        // console.log('Found', approve.workerid);
        approve.hitid = item.HITId;
        approve.assignmentid = item.AssignmentId;
    }
});

dbRes.loadDirSync(resDir);

// Would be nice to have a mergeOn command.
// dbRes.loadDirSync(resDir, { mergeOn: 'workerid' });

console.log('AMT Results Db size:', dbRes.size());

console.log('not found', notFound);

notFound = 0;
dbApprove.each(item => {
    if (!item.assignmentid || !item.hitid) {
        // console.log('Not found 2', item.workerid);
        notFound++;
        // console.log(item);
    }
})

console.log('not found 2', notFound);


// BONUS.
/////////

const bonFile = 'bonus.csv';
const bonusFile = path.join(exportDir, bonFile);

const dbBonus = NDDB.db();

notFound = 0;
dbBonus.on('insert', item => {
    let approve = dbApprove.workerid.get(item.workerid);
    if (!approve) {
        // console.log('Not found', item.WorkerId);
        notFound++;
    }
    else {
        // console.log('Found', approve.workerid);
        approve.bonus = item.bonus;
    }
});

dbBonus.loadSync(bonusFile);

console.log('Bonus Db size:', dbBonus.size());


// SAVE.
////////


const outFileReject = path.join(dataDir, 'results_reject.csv');

dbApprove
    .select('assignmentid')
    .and('reject', '=', 1)
    .saveSync(outFileReject);

console.log('Saved:', outFileReject);


const outFileApprove = path.join(dataDir, 'results_approve.csv');

dbApprove
    .select('assignmentid')
    .and('approve', '=', 1)
    .saveSync(outFileApprove);

console.log('Saved:', outFileApprove);


const outFile = path.join(dataDir, 'results.csv');

dbApprove
    .select('assignmentid')
    .saveSync(outFile);

console.log('Saved:', outFile);



// Would be nice to have a static method to automatically load and merge.
// const db = NDDB.merge(resDir, approveRejectFile);

