// Challenge #1: Customer View (Minimum Requirement)


//First display all of the items available for sale. Include the ids, names, and prices of products for sale.
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "nodeuser",
        password: "",
        database: "bamazon"
    }
)

connection.connect(function(err)
{
    if (err) throw err;

    var query = 'select * from products';

    connection.query(query, function(err, response)
    {
        if (err) throw err;

        else
        {
            for (product in response)
            {
                console.log(response.product);
            }
        }
        
        connection.end();
    });
});

// The app should then prompt users with two messages:
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.
