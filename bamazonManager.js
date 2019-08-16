
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require('easy-table');

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
    managerPrompt();
});

function managerPrompt()
{
    inquirer.prompt([
    {
        name: "option",
        type: "list",
        message: "What do you want to do?",
        choices: 
            [{value: 1, name: "View Products for Sale"}, 
            { value: 2, name: "View Low Inventory"}, 
            { value: 3, name: "Add to Inventory"}, 
            { value: 4, name: "Add New Product"},
            { value: 5, name: "Exit"}]
    }
]).then(function (answers)
    {
        switch(answers.option)
        {
            case 1:
                viewProducts();
                break;
            
            case 2:
                viewLowInventory();
                break;
            
            case 3: 
                addToInventory();
                break;
            
            case 4:
                addNewProduct();
                break;

            case 5:
                console.log("Exiting....");
                connection.end();
                return;

            default:
                console.log("That is not a valid selection. Please choose again.");
                managerPrompt();
        }
    });
};

function viewProducts()
{
    var query = 'select * from products';

    connection.query(query, function(err, products)
    {   
        if (err) throw err;

        else
        {
            console.log(table.print(products));
            managerPrompt();
        }
    });
};

function viewLowInventory()
{
    var query = 'select * from products WHERE stock_quantity < 5';

    connection.query(query, function(err, products)
    {   
        if (err) throw err;

        else
        {
            console.log(table.print(products));
            managerPrompt();
        }
    });
};

// your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addToInventory()
{
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "ID of the product for which you want to increase the quantity: "
        },
        {
            name: "addQuantity",
            type: "number",
            message: "How many do you want to add? "
        }
    ]).then(function(answers)
        {
            connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?', 
            [answers.addQuantity, answers.id], function(err)
            {   
                if (err) throw err;

                else
                {
                    console.log("Quantity Updated.")
                    managerPrompt();
                }
            });
        });
};

function addNewProduct()
{
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Product Name: "
        },
        {
            name: "department",
            type: "input",
            message: "Department: "
        },
        {
            name: "price",
            type: "number",
            message: "Retail Price: "
        },
        {
            name: "stock_quantity",
            type: "number",
            message: "Quantity in stock: "
        }
    ]).then(function(answers)
        {
            connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', 
            [answers.name, answers.department, answers.price, answers.stock_quantity], function(err)
            {   
                if (err) throw err;

                else
                {
                    console.log("Product Added.")
                    managerPrompt();
                }
            });
        });
};