var mysql = require('mysql');
var inquirer = require('inquirer');

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
    customerView();
});

function customerView() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
        idSearch();

    });
};

function idSearch() {
    inquirer.prompt([
    {
        name: 'id',
        type: 'number',
        message: 'Enter the ID:'
    },
    // {
    //     name: 'stock_quantity',
    //     type: 'number',
    //     message: 'Enter the Quantity:'
    // }
    ]).then(function (answers) {
        // console.log(answers.id);
        // console.log(answers.stock_quantity);
        connection.query("SELECT * FROM products WHERE ?", { id: answers.id }, function(err, res) {
            if (err) throw err;
            console.log(
              "id: " +
                res[0].id +
                " || Product: " +
                res[0].product_name +
                " || Department: " +
                res[0].department_name +
                " || Price: $" +
                res[0].price+
                " || QTY: " +
                res[0]. stock_quantity
            );
            connection.end();
          });
        });
    };