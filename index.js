var program = require('commander'),
    util = require('utils/util.js');

var ERR_MULTIPLE_COMMANDS = 'You can\'t use multiple commands at once. Scrub.';

program
    .version('0.0.1')
    .option('use [repo]', 'Don\'t revert dotfiles at the end of the session')
    .option('revert', 'Reverts back to the initial dotfiles')
    .option('status', 'Reverts back to the initial dotfiles')
    .parse(process.argv);

if (program.use) {
    if (program.revert || program.status) {
        console.error(ERR_MULTIPLE_COMMANDS);
        process.exit(1);
    }

    console.log('use', program.use);
} else if (program.revert) {
    if (program.use || program.status) {
        console.error(ERR_MULTIPLE_COMMANDS);
        process.exit(1);
    }

    console.log('revert');
} else if (program.status) {
    if (program.use || program.revert) {
        console.error(ERR_MULTIPLE_COMMANDS);
        process.exit(1);
    }

    console.log('status');
} else {
    program.help();
}
