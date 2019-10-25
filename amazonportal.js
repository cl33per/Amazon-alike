var inventoryPortal = require('./bamazonCustomer.js')
var mysql = require('mysql');
var inquirer = require('inquirer');
var cli = require('pixl-cli');
var chalk = require('chalk');
// Connection variable with settings -- change password localhost root if testing on different envirorment

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "ADU6pyNJ",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    mainMenu(connection)
});
function mainMenu(connection){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: chalk.green("Welcome to the Amazon-alike: MAIN MENU. \nChoose a option below:"),
            choices: [
                "Customer View",
                "Manager View",
                "Supervisor View",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Customer View":
                return inventoryPortal(connection);
                case "Manager View":  
                    break;
                case "Supervisor View": 
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        });
    };
    //Start the fucntion to start the primary memu of the amazaon-alike interface
    module.exports = mainMenu;
    