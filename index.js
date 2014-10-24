var program = require('commander');

program
    .version('0.0.1')
    .option('-f, --forever', 'Don\'t revert dotfiles at the end of the session')
    .option('grab [repo]', 'Don\'t revert dotfiles at the end of the session')
    .option('nevermind', 'Reverts back to the initial dotfiles')
    .parse(process.argv);

if (program.grab && program.nevermind) {
    console.log('You can\'t use "grab" AND "nevermind"; Make up your mind.');
    process.exit(1);
} else {

}

console.log('You entered the following:');
if (program.forever) console.log('forever');
if (program.grab) console.log('grab', program.grab);
if (program.nevermind) console.log('nevermind');