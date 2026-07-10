
const Employee = require("../module/Employee.module");
const UserModule = require("../module/User.module");

// get all employees


// get /api/employees
const getAllEmployees = async (req, res) => {
    try {
         const { department} = req.query;
         const where={};
         if (department) where.department = department;

         const employees = await (await Employee.find(where)).toSorted({createdAt:-1}).populate('userId', 'email role').lean();

         const result = await employees.map(employee => {
            return {
                ...employee,
                id: employee._id.toString(),
                user: employee.userId ?{email: employee.userId.email, role: employee.userId.role} : null,
                
            };
         });
         return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



// create a new employee
// post /api/employees
const createEmployee = async (req, res) => {
    try {
        const {  firstName, lastName, email, phone, department, position, basicSalary, allowances, deductions, joiningDate, bio,password } = req.body;
         if(!userId || !firstName || !lastName || !email || !phone || !department || !position) {
            return res.status(400).json({ message: "Missing required fields" });
         }
        
      
        const hashedPassword = await bcrypt.hash(password, 10); 

        const user = await UserModule.create({
            email,
            password: hashedPassword,
            role: role || "employee"
        })

        const newEmployee = await new Employee.create({
            userId: user._id,
            firstName,
            lastName,
            email,
            phone,
            department: department || "Engineering",
            position,
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions)  || 0,
            joiningDate:  new Date( joiningDate) || new Date(),
            bio: bio || ""
        });  
         
        return res.status(201).json( newEmployee);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// update an employee
// put /api/employees/:id
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, department, position, basicSalary, allowances, deductions, employmentStatus, bio,password } = req.body;
         if(!userId || !firstName || !lastName || !email || !phone || !department || !position) {
            return res.status(400).json({ message: "Missing required fields" });
         }
        // Check if the userId already exists in the Employee collection
        const existingEmployee = await Employee.findOne(id );
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this user ID already exists" });
        }
      
       

         await Employee.findByIdAndUpdate(id,{
            firstName,
            lastName,
            email,
            phone,
            position,
            department: department || "Engineering",
            basicSalary: Number(basicSalary) || 0,
            allowances: Number(allowances) || 0,
            deductions: Number(deductions)  || 0,
            employmentStatus: employmentStatus || "active",
            bio: bio || ""
        });  
        // update the user's email and password in the User collection
        const userUpdateData = { email };
        if(role) userUpdateData.role = role;
        if(password) userUpdateData.password = await bcrypt.hash(password, 10);
        await UserModule.findByIdAndUpdate(existingEmployee.userId, userUpdateData);
         
        return res.status(201).json( newEmployee);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Delete an employee
// delete /api/employees/:id
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        employee.isDeleted = true;
        employee.employmentStatus = "INACTIVE"; // Optionally set employment status to INACTIVE
        await employee.save();
        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
