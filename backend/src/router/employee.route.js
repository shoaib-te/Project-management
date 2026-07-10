const express = require('express');
const router = express.Router();
const emplayeeController = require('../controllers/employee.controller');

// Employee Routes
// get /api/employees
router.get('/', employeeController.getAllEmployees);
// get /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);
// post /api/employees
router.post('/', employeeController.createEmployee);
// put /api/employees/:id
router.put('/:id', employeeController.updateEmployee);
// delete /api/employees/:id
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
