var mysql = require('mysql');
var inquirer = require('inquirer');
var cli = require('pixl-cli');

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
var productInfo = [];

function customerView() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i< res.length; i++){
            // console.log(res[i].id);
            productInfo.push([
                res[i].id,
                res[i].product_name,
                res[i].department_name,
                "$"+res[i].price,
                res[i].stock_quantity,
            ]);
        };
        cli.print(
            cli.box("Welcome to amazon-alike!") + "\n"
        );

            var rows = [
                ["ID", "Product", "Department", "Price", "Quantity"],
                ...productInfo
            ];
            cli.print(
                cli.table(rows) + "\n"
            );
        idSearch();
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
                return false;
            }
        },
        {
            name: 'stock_quantity',
            type: 'number',
            message: 'Enter the Quantity:'
        }
    ]).then(function (answers) {
        // console.log(answers.id);
        // console.log(answers.stock_quantity);
        connection.query("SELECT * FROM products WHERE ?", {
            id: answers.id
        }, function (err, res) {
            if (err) throw err;
            // console.log(
            //     "id: " +
            //     res[0].id +
            //     " || Product: " +
            //     res[0].product_name +
            //     " || Department: " +
            //     res[0].department_name +
            //     " || Price: $" +
            //     res[0].price +
            //     " || QTY: " +
            //     res[0].stock_quantity
            //);
            updateProduct(answers,res);
        });
    });
};
function updateProduct(answers,res) {
    var oldStock = res[0].stock_quantity //10
    var newStock = oldStock - answers.stock_quantity; // 10 - 10 = 0
     // console.log(productInfo);
    if (newStock <= 0 ){
        console.log("Insufficient quantity!");
        connection.end();
    }else{
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
            cli.print(
                cli.box("Welcome to amazon-alike!") + "\n"
            );

            var rows = [
                ["ID", "Product", "Department", "Price", "Quantity"],
                ...productInfo
            ];
            cli.print(
                cli.table(rows) + "\n"
            );
            // console.log(newStock)
            connection.end();
            // Call deleteProduct AFTER the UPDATE completes
        }
    );
};
};