const inquirer = require('inqirer');

function prompt(menu, action) {
    inquirer
    .prompt(menu)
    .then(answers => perpetuate(answers, menu, action))
    .catch(err => error(err));
}

function perpetuate(answers, menu, action) {
    action(answers);
    prompt(menu, action);
}

function error(err) {
    console.log(err);
    process.exit(1);
}