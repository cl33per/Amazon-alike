var inventoryPortal = require('./bamazonCustomer.js')
var mysql = require('mysql');
var inquirer = require('inquirer');
var cli = require('pixl-cli');
var chalk = require('chalk');
// Connection variable with settings -- change password localhost root if testing on different envirorment

console.log("\n\n\n\n\n\n\n\n\n");

var connection = mysql.createConnection({ host: "localhost", port: 3306, user: "root", password: "hokxan9Mysql", database: "bamazon" });
connection.connect(function (err) {
    ifThrow(err);
    return mainMenu(connection)
});


function mainMenu() {
    return inquirer.prompt({
        name: "action",
        type: "list",
        message: chalk.green("Welcome to the Amazon-alike: MAIN MENU. \nChoose a option below:"),
        choices: ["Customer View", "Manager View", "Supervisor View", "Exit"]
    }).then(function (answer) {
        switch (answer.action) {
            case "Customer View":
                return inventoryPortal().then(mainMenu);
            case "Manager View":
                return mainMenu();
            case "Supervisor View":
                return mainMenu();
            case "Exit":
                process.exit();
            default:
                return mainMenu();
        }
    });
};

function emptyPromise() {
    return new Promise((resolve, reject) => resolve());
}

function ifThrow(err) {
    if (err) {
        throw err;
    }
}

// Start the fucntion to start the primary memu of the amazaon-alike interface
module.exports = mainMenu;

// Global variables to make life fun
global.connection = connection;
global.mainMenu = mainMenu;
global.emptyPromise = emptyPromise;
global.ifThrow = ifThrow;
