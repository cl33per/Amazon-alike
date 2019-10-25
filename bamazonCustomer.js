var  {connection ,mainMenu} = require("./amazonportal.js");
var mysql = require('mysql');
var inquirer = require('inquirer');
var cli = require('pixl-cli');
var chalk = require('chalk');
// Empty arry for product table view cli
var productInfo = [];


// Prompt for customerView Inventory menu
function inventoryPortal() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: chalk.green("WELCOME TO THE CUSTOMER VIEW. \nChoose a option below:"),
            choices: [
                "View Availible Products",
                "Place an Order",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Availible Products":
                    customerView();
                    break;
                case "Place an Order":
                    idSearch();
                    break;
                case "Exit":
                    return mainMenu();
                    // process.exit();
            }
        });
};

function customerView() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement. By interating through this cleans the data for the cli.table package
        for (var i = 0; i < res.length; i++) {
            // console.log(res[i].id);
            productInfo.push([
                res[i].id,
                res[i].product_name,
                res[i].department_name,
                "$" + res[i].price,
                res[i].stock_quantity,
            ]);
        };
        // Defines the columns and rows of the table
        var rows = [
            ["ID", "Product", "Department", "Price", "Quantity"],
            ...productInfo
        ];
        //Prints the inventory in a table format.
        cli.print(
            cli.table(rows) + "\n"
        );
        productInfo = []
        inventoryPortal();

    });
};

function idSearch() {
    inquirer.prompt([{
            name: 'id',
            message: 'Enter the ID:',
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
                    return true;
                }
                console.log(chalk.red.bold(" ID Must be a number"));
                return false;
            }
        },
        {
            name: 'stock_quantity',
            message: 'Enter the Quantity:',
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
                    return true;
                }
                console.log(chalk.red.bold(" Quantity Must be a number"));
                return false;
            }
        }
    ]).then(function (answers) {
        connection.query("SELECT * FROM products WHERE ?", {
            id: answers.id
        }, function (err, res) {
            if (err) throw err;
            updateProduct(answers, res);
        });
    });
};

function updateProduct(answers, res) {
    var oldStock = res[0].stock_quantity //10
    var newStock = oldStock - answers.stock_quantity; // 10 - 10 = 0
    // console.log(productInfo);
    if (newStock < 0) {
        console.log(chalk.red.bold("\n" + "Insufficient quantity!" + "\n"));
        inventoryPortal()
    } else {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                    stock_quantity: newStock
                },
                {
                    id: answers.id
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product updated!\n");
                productInfo = []
                customerView();
            }
        );
    };
};

module.exports = inventoryPortal;