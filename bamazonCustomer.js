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

    viewProducts();
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
                }
            }
        }
    });
};

function viewProducts(products)
{
    var query = 'select * from products';

    connection.query(query, function(err, products)
    {   
        if (err) throw err;
        else
        {
            console.log();
            console.log(table.print(products));
            console.log("\nPress Ctrl-C at any time to exit.\n".toUpperCase());
            promptUser(products);
        }
    });
}

function completePurchase(productInfo, userAnswers)
{
    var quantityPurchased = parseInt(userAnswers.howMany);
    var totalCost = quantityPurchased * parseFloat(productInfo.price);

    connection.query('UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ?', [quantityPurchased, totalCost, productInfo.item_id], function(err)
    {
        if (err) throw err;
        else
        {
            console.log("Purchase complete! The total cost for your order is: " + totalCost);
            viewProducts();
        }
    });

};
