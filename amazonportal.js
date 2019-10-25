var inventoryPortal = require('./bamazonCustomer.js');
var mysql = require('mysql');
var inquirer = require('inquirer');
var cli = require('pixl-cli');
const chalk = require('chalk');
// Connection variable with settings -- change password localhost root if testing on different envirorment

var connection = mysql.createConnection({host: "localhost", port: 3306, user: "root", password: "hokxan9Mysql", database: "bamazon"});

connection.connect(function (err) {
    if (err) {
        throw err
    }
    mainMenu(connection)
});
function mainMenu(connection) {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: chalk.green("Welcome to the Amazon-alike: MAIN MENU. \nChoose a option below:"),
        choices: ["Customer View", "Manager View", "Supervisor View", "Exit"]
    }).then(function (answer) {
        switch (answer.action) {
            case "Customer View": inventoryPortal(connection, mainMenu);
                break;
            case "Manager View": mainMenu(connection);
                break;
            case "Supervisor View": mainMenu(connection);
                break;
            case "Exit":
                process.exit();
                break;
        }
    });
};
// Start the fucntion to start the primary memu of the amazaon-alike interface
module.exports = mainMenu;
