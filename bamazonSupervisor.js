var inquirer = require("inquirer");
var cli = require("pixl-cli");
var chalk = require("chalk");
var productInfo = [];
function supervisorPortal() {
    return inquirer.prompt({
        name: "action",
        type: "list",
        message: cli.print(cli.box(cli.center(chalk.yellow.bold("Welcome to the Amazon-alike: \nSUPERVISOR MENU."))) + "\n"),
        choices: [
            "View Product Sales by Department",
            "Create New Department",
            "Exit Submenu"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales by Department":
                    return salesByDepartment().then(() => supervisorPortal());
                    break;
                case "Create New Department":
                    return departmentrView().then(() => supervisorPortal());
                    break;
                case "Exit Submenu":
                    return mainMenu();
            }
        });
}
function departmentrView() {
    cli.print(cli.box("Active Departments:"))
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
        createNewDepartment().then(() => resolve());
    }));
};
function salesByDepartment(){
    return new Promise(resolve => connection.query("SELECT department_id,department_name,over_head_costs, SUM(product_sales) as product_sales FROM products LEFT JOIN departments ON departments.department_id = products.dep_id GROUP BY dep_id", function (err, res) {
        ifThrow(err);
        // Log all results of the SELECT statement. By interating through this cleans the data for the cli.table package
        for (var i = 0; i < res.length; i++) {
            var totalProfit = res[i].product_sales - res[i].over_head_costs;
            var totalProfitFix = totalProfit.toFixed(2)
            productInfo.push([
                res[i].department_id,
                res[i].department_name,
                "$ " + res[i].over_head_costs,
                "$ " + res[i].product_sales,
                "$ " + totalProfitFix
            ]);
        };
        // Defines the columns and rows of the table
        var rows = [
            [
                "ID", "Department", "Over Head Costs", "Product Sales","Total Profit"
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

function createNewDepartment() {
    return inquirer.prompt([{
        name: "item",
        type: "input",
        message: "Department Name"
    },
    {
        name: "costs",
        message: "Department Over Head Costs:",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100000) {
                return true;
            }
            console.log("\n")
            cli.print(cli.box("\n" + chalk.red.bold(" Must be a number") + "\n"));
            console.log("\n")
            return false;
        }
    },
    ]).then(function (answer) {
        return new Promise(resolve => connection.query("INSERT INTO departments SET ?", {
            department_name: answer.item,
            over_head_costs: answer.costs,
        }, function (err) {
            ifThrow(err);
            console.log("\n");
            cli.print(cli.box(answer.item + chalk.green(" \n Sucessfully Added \n Returing to MANAGER MENU"))) + "\n";
            console.log("\n");
            resolve()
        }));
    });
};
module.exports = supervisorPortal;