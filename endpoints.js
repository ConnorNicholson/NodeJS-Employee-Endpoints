// ENDPOINTS:

// GET::http://localhost:3000/employees
// GET::http://localhost:3000/employees/1   (or any other employee id)
// POST::http://localhost:3000/employees
// PUT::http://localhost:3000/employees/1   (or any other employee id)
// DELETE::http://localhost:3000/employees/1    (or any other employee id)

// INSTRUCTIONS:

// HARD: Add the remaining CRUD functionality to your medium problem.
// Make sure you return the proper HTTP status codes based on the outcome of the request. Be sure to implement error checking here.
// If an invalid request is made, we want to return some sort of error message and the correct HTTP status code for the situation.
// HTTP Status Codes: http://www.restapitutorial.com/httpstatuscodes.html
// POST::myendpointname.com/employees  =  Inserts new employee into your data.
// GET::myendpointname.com/employees = Returns json with information from all employees.
// GET::myendpointname.com/employees/<employeeID>  =  Returns json with the information from that specific employee.
// PUT::myendpointname.com/employees/<employeeID>  =  Updates information for specified employee.
// DELETE::myendpointname.com/employees/<employeeID>  =  Removes the employee with that ID from the data.

// CODE STARTS HERE

// Required modules
const Joi = require('joi'); // Used for request validation
const express = require('express');
const data = require('./employees.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Request all employees
app.get('/employees', (req, res) => res.status(200).send(data));    

// Request a specific employee by id
app.get('/employees/:employeeID', (req, res) => {

// Find employee in server data. If not found return status code 404 and show error message
    const employee = data.find(e => e.employeeID === parseInt(req.params.employeeID));
    if (!employee) return res.status(404).send('Employee Not Found');

// Return status code 200 and requested employee
    res.status(200).send(employee);
});

// Create a new employee
app.post('/employees', (req, res) => {

// Run validation to validate request. Return status code 400 if it's a bad request and show error message
    const {error} = validateEmployee(req.body);
    if (error) return res.status(400).send(error.details[0].message);

// Dynamically enter employee information
    const employee = {
        employeeID: data.length + 1,
        employeeName: req.body.employeeName,
        salary: req.body.salary,
        departmentName: req.body.departmentName,
    };

// Add new employee to data array and return status code 200
    data.push(employee);
    res.status(200).send(employee);
});

// Update existing employee by id
app.put('/employees/:employeeID', (req, res) => {

// Run validation to validate request. Return status code 400 if it's a bad request and show error message
    const {error} = validateEmployee(req.body);
    if (error) return res.status(400).send(error.details[0].message);

// Find employee in server data. If not found return status code 404 and show error message, else enter in updated data
    const employee = data.find(e => e.employeeID === parseInt(req.params.employeeID));
    if (!employee) {
        return res.status(404).send('Employee Not Found')
    } else {

// Update employee
        employee.employeeName = req.body.employeeName;
        employee.salary = req.body.salary;
        employee.departmentName = req.body.departmentName;
    };

// Return status code 200 and updated employee
    res.status(200).send(employee);
});

// Delete specific employee by id
app.delete('/employees/:employeeID', (req, res) => {

// Find employee in server data. If not found return status code 404 and show error message
    const employee = data.find(e => e.employeeID === parseInt(req.params.employeeID));
    if (!employee) return res.status(404).send('Employee Not Found');

// Delete employee
    const index = data.indexOf(employee);
    data.splice(index, 1);
    res.status(200).send(employee);
});

// Request validation using the 'joi' module. Function takes a parameter (employee)
function validateEmployee(employee) {
    const schema = {
        employeeName: Joi.string().min(1).max(20).required(),   // employeeName must be a string, with min of 1 character and max of 20. It is required
        salary: Joi.number().integer().min(10000).max(1000000).required(),  // salary must be an integer with a min value of 10000 and max of 1000000. It is required
        departmentName: Joi.string().min(2).required()  // departmentName must be a string, with a min of 2. It is required
    };

// Return joi validation function with two parameters (employee, schema)
    return Joi.validate(employee, schema);
}

// Server is currently running on port 3000
app.listen(3000, () => console.log(`Express server currently running on port 3000`));