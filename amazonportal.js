//Used to connect to the sql database and queries
var mysql = require('mysql');
//Used to asking questions and take in input
var inquirer = require('inquirer');
//Packages used to for better UI on terminal  
var cli = require('pixl-cli');
const chalk = require('chalk');



function amazonPortalStart(){
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: chalk.green("Welcome to the Amazon-alike Iventory Portal. \nChoose a option below:"),
            choices: [
                "Customer View",
                "Manager View",
                "Supervisor View",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "Customer View":
                    var Connection = require('./bamazonCustomer.js');
                Connection;
                    break;

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
    amazonPortalStart();
    module.exports = amazonPortalStart;
    