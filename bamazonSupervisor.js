var inquirer = require("inquirer");
var cli = require("pixl-cli");
var chalk = require("chalk");
function supervisorPortal() {
    return inquirer.prompt({
        name: "action",
        type: "list",
        message: cli.print(cli.box(cli.center(chalk.yellow.bold("Welcome to the Amazon-alike: \nSUPERVISOR MENU."))) + "\n"),
        choices: [
            "View Product Sales by Department",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit Submenu"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    return salesByDepartment().then(() => supervisorPortal());
                    break;
                case "Create New Department":
                    return createNewDepartment().then(() => supervisorPortal());
                    break;
                case "Exit Submenu":
                    return mainMenu();
            }
        });
}

function salesByDepartment(){
    return new Promise(resolve => connection.query("SELECT * FROM products", function (err, res) {
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

function createNewDepartment(){

};
module.exports = supervisorPortal;