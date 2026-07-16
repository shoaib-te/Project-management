
const Attendance = require("../module/Attendances.module");
const Employee = require("../module/Employee.module");
// get attendance by employee and checkout date


// post /api/attendances
const clockinoutcontroller = async (req, res) => {
  try {
    const session = req.session;
    const employee = Employee.findOne({userId:session.userId}).select('_id');
  if(!employee){
    return res.status(404).json({ message: "Employee not found" });
  }

  if(employee.isDeleted){
    return res.status(404).json({ message: "your account is deactivated " });
  }
const today = new Date();
  
today.setHours(0, 0, 0, 0); // Set to the start of the day
    
const attendance = await Attendance.findOne({
  employeeId: employee._id,
  date: today,
})

const now = new Date();
if (!attendance) {
 const isLate = now.getHours() >= 9 && now.getMinutes() > 0; 

    const newAttendance = await Attendance.create({
      employeeId: employee._id,
      date: today,
      CheckIn: now,
      status: isLate ? "LATE" : "PRESENT",
    });
    return res.status(201).json({ message: "Check-in successful", attendance: newAttendance });
  } else if (attendance.checkOut) {
      const checkInTime = new Date(attendance.checkIn).getTime();
      const checkOutTime = now.getTime();
      const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
      attendance.checkOut = now;

      const workingHoursRounded = Math.round(workingHours * 100) / 100; // Round to 2 decimal places


      const dayType = workingHoursRounded >= 8 ? "Full Day" : workingHoursRounded >= 6 ? "Three Quarter Day" : 

      workingHoursRounded >= 4 ? "Half Day" : "Short Day";

      attendance.workingHours = workingHoursRounded;

      attendance.dayType = dayType;

      await attendance.save();

      return res.status(200).json({ message: "Check-out successful", attendance });
    }  else {
      return res.status(200).json({ message: "Check-out successful", attendance });
  
}

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



// get attendance by employeeId 
// get /api/attendances

const getAttendanceByEmployee = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({userId:session.userId}).select('_id');
    if(!employee){
      return res.status(404).json({ message: "Employee not found" });
    }

    const limit = parseInt(req.query.limit) || 30; // Default limit is 30
    
    const history = await Attendance.find({ employeeId: employee._id })
    .sort({ date: -1 }) // Sort by date in descending order
    .limit(limit); // Limit the number of records returned


    return res.status(200).json({ 
      data:history ,
      employeeId: employee.isDeleted,
      message: "Attendance history retrieved successfully"

    });
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
} 



module.exports = {
  clockinoutcontroller,
  getAttendanceByEmployee,
};