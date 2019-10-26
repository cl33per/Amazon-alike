var inquirer = require('inquirer');
var cli = require('pixl-cli');
var chalk = require('chalk');
// Empty arry for product table view cli
var productInfo = [];

// Prompt for customerView Inventory menu
function inventoryPortal() {
    return inquirer.prompt({
        name: "action",
        type: "list",
        message: cli.print(cli.box(cli.center(chalk.blue.bold("Welcome to the Amazon-alike: \nCUSTOMER MENU."))) + "\n"),
        choices: ["View Availible Products", "Place an Order", "Exit Submenu"]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Availible Products":
                return customerView().then(() => inventoryPortal())
                break;
            case "Place an Order":
                return idSearch().then(() => inventoryPortal());
                break;
            case "Exit Submenu":
                return mainMenu();
                break;
        }
    });
};


function customerView() {
    return new Promise(resolve => connection.query("SELECT products.id,products.product_name, departments.department_name,products.price,products.stock_quantity FROM products LEFT JOIN departments ON departments.department_id = products.dep_id", function (err, res) {
        ifThrow(err);
        // Log all results of the SELECT statement. By interating through this cleans the data for the cli.table package
        for (var i = 0; i < res.length; i++) {
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
            [
                "ID", "Product", "Department", "Price", "Quantity"
            ],
            ...productInfo
        ];
        // Prints the inventory in a table format.
        console.log("\n")
        cli.print(cli.table(rows) + "\n");
        console.log("\n")
        productInfo = []
        resolve();
    }));
};

function idSearch() {
    return inquirer.prompt([{
        name: 'id',
        message: 'Enter the ID:',
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
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
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
                return true;
            }
            console.log("\n")
            cli.print(cli.box("\n" + chalk.red.bold(" Quantity Must be a number") + "\n"));
            console.log("\n")
            return false;
        }
    }]).then(function (answers) {
        return new Promise(resolve => connection.query("SELECT * FROM products WHERE ?", {
            id: answers.id
        }, function (err, res) {
            ifThrow(err);
            updateProduct(answers, res).then(() => resolve());
        }));
    });
};

function updateProduct(answers, res) {
    var oldStock = res[0].stock_quantity // 10
    var newStock = oldStock - answers.stock_quantity;
    var productSales = answers.stock_quantity * res[0].price;

    if (newStock < 0) {
        cli.print(cli.box(chalk.red.bold("Insufficient quantity!\n Product not updated \n Returing to CUSTOMER MENU")) + "\n");
        return emptyPromise();
    } else {
        return new Promise(resolve => connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: newStock,
            product_sales: productSales
        }, {
            id: answers.id
        }], function (err, res) {
            ifThrow(err);
            cli.print(cli.box(cli.center(chalk.green.bold("Product updated!\n Returning to CUSTOMER MENU"))) + "\n");
                customerView().then(()=>resolve());
        }));
    };
};

module.exports = inventoryPortal;