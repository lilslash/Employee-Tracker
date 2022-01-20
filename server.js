const inquirer = require('inquirer');
const mysql = require('mysql2')



const connection = mysql.createConnection({
    host: 'localhost',

  
    port: 3001,

  
    user: 'root',


    password: 'PASSWORD',
    database: 'employee_tracker',
});

const init = () => {
    console.log(`
    _______ __   __ _______ ___     _______ __   __ _______ _______    _______ ______   _______ _______ ___   _ _______ ______   
    |       |  |_|  |       |   |   |       |  | |  |       |       |  |       |    _ | |   _   |       |   | | |       |    _ |  
    |    ___|       |    _  |   |   |   _   |  |_|  |    ___|    ___|  |_     _|   | || |  |_|  |       |   |_| |    ___|   | ||  
    |   |___|       |   |_| |   |   |  | |  |       |   |___|   |___     |   | |   |_||_|       |       |      _|   |___|   |_||_ 
    |    ___|       |    ___|   |___|  |_|  |_     _|    ___|    ___|    |   | |    __  |       |      _|     |_|    ___|    __  |
    |   |___| ||_|| |   |   |       |       | |   | |   |___|   |___     |   | |   |  | |   _   |     |_|    _  |   |___|   |  | |
    |_______|_|   |_|___|   |_______|_______| |___| |_______|_______|    |___| |___|  |_|__| |__|_______|___| |_|_______|___|  |_|`)

    starter()
}
const starter = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "start",
                message: "Pick an action to run",
                choices: ["View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee", "EXIT"]
            }
        ]).then((result) => {
            switch (result.start) {
                case "View Departments":
                    viewDepartment()
                    break;
                case "View Roles":
                    viewRole()
                    break;
                case "View Employees":
                    viewEmployee()
                    break;
                case "Add Department":
                    addDepartment()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "Update Employee":
                    updateEmployee()
                    break;
                case "EXIT":
                    connection.end()
                break;

            }
        })
}
const viewEmployee = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, COALESCE(CONCAT(manager.first_name, " ", manager.last_name), 'None')  AS Manager_Name
    FROM employee
    LEFT JOIN role 
    ON employee.role_id = role.id
    LEFT JOIN department 
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id
    ORDER BY employee.id;`
    connection.query(query, (err, data) => {
        if (err) throw err
        console.table(data)
        starter()
    })
}
const viewDepartment = () => {
    const query = "SELECT * FROM employee_tracker.department"
    connection.query(query, (err, data) => {
        if (err) throw err
        console.table(data)
        starter()
    }
    )
}
const viewRole = () => {
    const query = `SELECT role.title, role.salary, department.department_name FROM department 
    LEFT JOIN role ON department.id = role.id`
    connection.query(query, (err, data) => {
        if (err) throw err
        console.table(data)
        starter()
    }
    )
}

const addRole = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err
        const Choices = data.map(dept => {
            return {
                name: dept.department_name,
                value: dept.id
            };
        })

        inquirer
            .prompt([
                {
                    name: "name",
                    type: "input",
                    message: "What would you like to name this new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the annual salary for this role (USD)?"
                },
                {
                    name: "assign",
                    type: "list",
                    message: "Which department does this role belong to?",
                    choices: Choices
                }
            ])
            .then(result => {
                connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                    [result.name, result.salary, result.assign], (err, data) => {
                        if (err) throw err
                        console.log(result.name, "has been added to roles")
                        starter()
                    })
            })
    })
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                name: 'dept',
                message: 'Name new department'
            }
        ]).then(result => {
            connection.query("INSERT INTO department (department_name) VALUE (?)", result.dept,
                (err, data) => {
                    if (err) throw (err)
                    console.log(result.dept, "has been added to departments")
                    starter()
                }
            )
        })
}

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err
        const roleChoices = data.map((role) => {
            return {name: role.title,
            value: role.id}
        })
    connection.query("SELECT * FROM employee", (err,data) => {
        if (err) throw err
        const mgrChoices = data.map((employee) => {
            return {name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id}
        })
        mgrChoices.push("none")
    inquirer
    .prompt([
        {
            type: "input",
            name: 'firstName',
            message: 'what is the first name of new employee'
        },
        {
            type: "input",
            name: 'lastName',
            message: 'what is the last name of new employee'
        },
        {
            type: "list",
            choices: roleChoices,
            name: 'role',
            message: "what is the new employee's role"
        },
        {
            type: "list",
            choices: mgrChoices,
            name: 'manager',
            message: "who is the new employee's manager"
        },
    ]).then (result => {
        if (result.manager === "none"){
            connection.query("INSERT INTO employee (first_name,last_name,role_id) VALUE (?,?,?)",
            [result.firstName,result.lastName,result.role], (err,data) => {
                if (err) throw (err)
                console.log(result.firstName,result.lastName, "has been added as an employee")
                return starter()
            })
        } else {connection.query("INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUE (?,?,?,?)",
        [result.firstName,result.lastName,result.role,result.manager], (err,data) => {
            if (err) throw (err)
            console.log(result.firstName,result.lastName, "has been added as an employee")
            starter()
    })}
        })
    })
})
}

const updateEmployee = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        if (err) throw err
        const roleChoices = data.map((role) => {
            return {name: role.title,
            value: role.id};
        })
    connection.query("SELECT * FROM employee", (err,data) => {
        if (err) throw err
        const empChoices = data.map((employee) => {
            return {name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id};
        })
        inquirer
        .prompt ([
            {
                type:"list",
                name:"employee",
                message:"choose employee",
                choices: empChoices
            },
            {
                type:"list",
                name:"role",
                message:"choose new role",
                choices: roleChoices
            },
        ]).then(result => {
            connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
            [result.employee, result.role],(err,data) => {
                if (err) throw (err)
                console.log(result.employee, "role was successfully updated to", result.role);
                starter()
            })
        })
    })
})
}
    
init()