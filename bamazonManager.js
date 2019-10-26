var inquirer = require("inquirer");
var cli = require("pixl-cli");
var chalk = require("chalk");
var productInfo = [];


function managerPortal() {
    return inquirer.prompt({
            name: "action",
            type: "list",
        message: cli.print(cli.box(cli.center(chalk.yellow.bold("Welcome to the Amazon-alike: \MANAGER MENU."))) + "\n"),
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
                    return inventoryView().then(() => managerPortal());
                    break;
                case "View Low Inventory":
                    return inventoryLowView().then(() => managerPortal());
                    break;
                case "Add to Inventory":
                    return idSearch().then(() => managerPortal());
                    break;
                case "Add New Product":
                    return departmentrView().then(() => managerPortal());
                    break;
                case "Exit Submenu":
                    return mainMenu();
            }
        });
}

function inventoryView() {
    return new Promise(resolve => connection.query("SELECT products.id,products.product_name, departments.department_name,products.price,products.stock_quantity FROM products LEFT JOIN departments ON departments.department_id = products.dep_id", function (err, res) {
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
function departmentrView() {
    cli.print(cli.box("Department Lengend:"))
    return new Promise(resolve => connection.query("SELECT * from departments", function (err, res) {
        ifThrow(err);
        // Log all results of the SELECT statement. By interating through this cleans the data for the cli.table package
        for (var i = 0; i < res.length; i++) {
            productInfo.push([
                res[i].department_id,
                res[i].department_name
            ]);
        };
        // Defines the columns and rows of the table
        var rows = [
            [
                "ID", "Department Name"
            ],
            ...productInfo
        ];
        // Prints the inventory in a table format.
        console.log("\n")
        cli.print(cli.table(rows) + "\n");
        console.log("\n")
        productInfo = []
        createProduct().then(() => resolve());
    }));
};
function inventoryLowView() {
    console.log("low inventory");
    return new Promise(resolve => connection.query("SELECT products.id,products.product_name, departments.department_name,products.price,products.stock_quantity FROM products LEFT JOIN departments ON departments.department_id = products.dep_id WHERE products.stock_quantity < 30", function (err, res) {
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

function idSearch() {
    return inquirer.prompt([
        {
            name: 'id',
            message: 'Enter the ID:',
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10000) {
                    return true;
                }
                console.log("\n")
                cli.print(cli.box("\n" + chalk.red.bold(" ID Must be a number") + "\n"));
                console.log("\n")
                return false;
            }
        }, {
            name: 'stock_quantity',
            message: 'Enter the Quantity:',
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10000) {
                    return true;
                }
                console.log("\n")
                cli.print(cli.box("\n" + chalk.red.bold(" Quantity Must be a number") + "\n"));
                console.log("\n")
                return false;
            }
        }
    ]).then(function (answers) {
        return new Promise(resolve => connection.query("SELECT * FROM products WHERE ?", {
            id: answers.id
        }, function (err, res) {
            ifThrow(err);
            updateProduct(answers, res).then(() => resolve());
        }));
    });
};

function updateProduct(answers, res) {
    var oldStock = res[0].stock_quantity;
    var newStock = parseInt(answers.stock_quantity) + parseInt(oldStock);
    var productName = res[0].product_name;
        return new Promise(resolve => connection.query("UPDATE products SET ? WHERE ?", [
            {
                stock_quantity: newStock
            }, {
                id: answers.id
            }
        ], function (err, res) {
            ifThrow(err);
                cli.print(cli.box(chalk.blue("Product: " + productName + " Old QTY: " + oldStock + " New QTY: " + newStock)) + "\n");
                cli.print(cli.box(chalk.green("Sucessfully Updated! Returing to MANAGER MENU")) + "\n");
            productInfo = []
            resolve();
        }));
};
function createProduct() {
    return inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Product Name"
        },
        {
            name: "department",
            type: "number",
            message: "Department ID:"
        },
        {
            name: "price",
            message: "What's the price of the product?",
            validate: function (value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10000) {
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
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10000) {
                    return true;
                }
                console.log("\n")
                cli.print(cli.box("\n" + chalk.red.bold(" Stock Must be a number") + "\n"));
                console.log("\n")
                return false;
            }
        },
    ]).then(function (answer) {
        return new Promise(resolve => connection.query("INSERT INTO products SET ?", {
            product_name: answer.item,
            dep_id: answer.department,
            price: answer.price,
            stock_quantity: answer.stock
        }, function (err) {
            ifThrow(err);
            console.log("\n");
                cli.print(cli.box(answer.item + chalk.green(" \n Sucessfully Added \n Returing to MANAGER MENU"))) + "\n";
            console.log("\n");
            resolve()   
        }));
    });
};

module.exports = managerPortal;