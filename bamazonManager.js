var inquirer = require("inquirer");
var cli = require("pixl-cli");
var chalk = require("chalk");
var productInfo = [];


function managerPortal() {
    return inquirer.prompt({
            name: "action",
            type: "list",
            message: chalk.blue(
                "WELCOME TO THE CUSTOMER VIEW. \nChoose a option below:"
            ),
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit Submenu"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    inventoryView().then(() => managerPortal());
                    break;
                case "View Low Inventory":
                    inventoryLowView().then(() => managerPortal());
                    break;
                case "Add to Inventory":
                    invetoryAddView().then(() => managerPortal());
                    break;
                case "Add New Product":
                    createProduct().then(() => managerPortal());
                    break;
                case "Exit Submenu":
                    mainMenu();
            }
        });
}

function inventoryView() {
    return new Promise(resolve => connection.query("SELECT * FROM products", function (err, res) {
        ifThrow(err);

        // Log all results of the SELECT statement. By interating through this cleans the data for the cli.table package
        for (var i = 0; i < res.length; i++) {
            productInfo.push([
                res[i].id,
                res[i].product_name,
                res[i].department_name,
                "$" + res[i].price,
                res[i].stock_quantity
            ]);
        }
        // Defines the columns and rows of the table
        var rows = [
            ["ID", "Product", "Department", "Price", "Quantity"],
            ...productInfo
        ];
        // Prints the inventory in a table format.
        console.log("\n")
        cli.print(cli.table(rows) + "\n");
        console.log("\n")
        productInfo = [];
        resolve();
    }));
}

function inventoryLowView() {
    console.log("low inventory");
    return new Promise(resolve => connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        ifThrow(err);
        for (var i = 0; i < res.length; i++) {
            productInfo.push([
                res[i].id,
                res[i].product_name,
                res[i].department_name,
                "$" + res[i].price,
                res[i].stock_quantity
            ]);
        }
        // Defines the columns and rows of the table
        var rows = [
            ["ID", "Product", "Department", "Price", "Quantity"],
            ...productInfo
        ];
        // Prints the inventory in a table format.
        console.log("\n")
        cli.print(cli.table(rows) + "\n");
        console.log("\n")
        productInfo = [];
        resolve();
    }));
}

function invetoryAddView() {
    console.log("comming soon");
}

function createProduct() {
    return inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Product Name"
        },
        {
            name: "department",
            type: "input",
            message: "What Department?"
        },
        {
            name: "price",
            message: "What's the price of the product?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                console.log("\n")
                cli.print(cli.box("\n" + chalk.red.bold(" Price Must be a number") + "\n"));
                console.log("\n")
                return false;
            }
        },
        {
            name: "stock",
            message: "What's the quanity?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                console.log("\n")
                cli.print(cli.box("\n" + chalk.red.bold(" stock Must be a number") + "\n"));
                console.log("\n")
                return false;
            }
        },
    ]).then(function (answer) {
            return new Promise(resolve => connection.query("INSERT INTO products SET ?", {
                product_name: answer.item,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock
                // product_name: "rocky 1995",
                // department_name: "movies",
                // price: 5.95,
                // stock_quantity: 3,
            }, function (err) {
                ifThrow(err);           
                console.log("\n");
                cli.print(cli.box("\n" + answer.item + chalk.green(" Sucessfully Added") + "\n"));
                console.log("\n");
                resolve()
            }));
        });
    };
    module.exports = managerPortal;