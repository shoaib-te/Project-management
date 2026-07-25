const DEPARTMENTS = require("../constants/department");
const Attendance = require("../module/Attendances.module");
const Employee = require("../module/Employee.module");
const LeaveApplication = require("../module/Leaveapplaction.module");
const PayslipsModule = require("../module/Payslips.module");

// controller in admin and employee dashbord

const dashbordcontroller = async () => {
  try {
    const session = res.session;
    if (session.role === "admin") {
      const [totalEmployee, todayAttendances, pendingleave] = await Promise.all(
        [
          Employee.countDocuments({ isDeleted: { $ne: true } }),
          Attendance.countDocuments({
            data: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lt: new Date(new Date().setHours(24, 0, 0, 0)),
            },
          }),
          LeaveApplication.countDocuments({ status: "PENDING" }),
        ],
      );
      return res.json({
        role:'admin',
        totalEmployee,
        todayAttendances,
        pendingleave,
        totalDepartments: DEPARTMENTS.length,
      });
    } else {
        const employee=Employee.findOne({
          userId:session.userId
        }).lean();
        if(!employee){
                return res.status(404).json({ message: "Employee not found" });

        }
        const today= new Date();
        const [CurrentMonthAttendance,PendingLeaves,LatestPayslip]=await Promise.all([
          Attendance.countDocuments({
            employeeId:employee._id,
            data: {
              $gte: new Date(today.getFullYear(),today.getMonth(),1),
              $lt: new Date(today.getFullYear(),today.getMonth()+1,1),
            },
          }),
          LeaveApplication.countDocuments({
             employeeId:employee._id,
             status: "PENDING" }),
           
          PayslipsModule.findOne({
              employeeId:employee._id,


          }).sort({  createdAt:-1}).lean()
        ]),

        return res.json({
          role='employee',
          employee={
            ...employee,
            id:employee._id.toString()
          },
          CurrentMonthAttendance,
          PendingLeaves,
          LatestPayslip:LatestPayslip?{...LatestPayslip,id:LatestPayslip._id.toString()}:null
        })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports=dashbordcontroller