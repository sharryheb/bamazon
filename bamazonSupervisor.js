
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
    supervisorPrompt();
});

function supervisorPrompt()
{
    inquirer.prompt([
    {
        name: "option",
        type: "list",
        message: "What do you want to do?",
        choices: 
            [{value: 1, name: "View Product Sales by Department"}, 
            { value: 2, name: "Create New Department"}, 
            { value: 3, name: "Exit"}]
    }
]).then(function (answers)
    {
        switch(answers.option)
        {
            case 1:
                viewProductSales();
                break;
            
            case 2:
                createNewDepartment();
                break;

            case 3:
                console.log("Exiting....");
                connection.end();
                return;

            default:
                console.log("That is not a valid selection. Please choose again.");
                supervisorPrompt();
        }
    });
};


function viewProductSales()
{
    var query = 'SELECT department_id, departments.department_name, over_head_costs, sum(product_sales) product_sales, (sum(product_sales) - over_head_costs) total_profit FROM departments JOIN products on departments.department_name = products.department_name GROUP BY department_id';

    connection.query(query, function(err, productSales)
    {   
        if (err) throw err;

        else
        {
            console.log(table.print(productSales));
            supervisorPrompt();
        }
    });
}

function createNewDepartment()
{
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "Department Name: "
        },
        {
            name: "overhead",
            type: "number",
            message: "Overhead Costs: $"
        }
    ]).then(function(answers)
        {
            connection.query('INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)', 
            [answers.department, answers.overhead], function(err)
            {   
                if (err) throw err;

                else
                {
                    console.log("Department Added.")
                    supervisorPrompt();
                }
            });
        });
}