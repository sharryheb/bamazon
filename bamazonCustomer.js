var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('easy-table')

var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "nodeuser",
        password: "",
        database: "bamazon"
    }
);

connection.connect(function(err)
{
    if (err) throw err;

    var query = 'select * from products';

    connection.query(query, function(err, products)
    {   
        if (err) throw err;

        else
        {
            console.log(table.print(products));
            promptUser(products);
        }
    });
});

function promptUser(products)
{
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "Enter the ID number of the product you would like to buy: "
        },
        {
            name: "howMany",
            type: "number",
            message: "How many would you like to buy?"
        }
    ]).then(function(answers) 
    {
        for (product in products)
        {
            if (products[product].item_id === answers.id)
            {
                if (products[product].stock_quantity >= answers.howMany)
                {
                    completePurchase(products[product], answers);
                }
                else
                {
                    console.log("Insufficient quantity!");
                    connection.end();
                }
            }
        }
    });
};

function completePurchase(productInfo, userAnswers)
{
    var quantityLeft = productInfo.stock_quantity - userAnswers.howMany;
    var totalCost = userAnswers.howMany * productInfo.price;
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [quantityLeft, productInfo.item_id], function(err)
    {
        if (err) throw err;
        else
        {
            console.log("Purchase complete! The total cost for your order is: " + totalCost);
        }
        connection.end();
    });
};
