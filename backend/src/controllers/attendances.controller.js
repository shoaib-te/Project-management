const { inngest } = require("../inngest");
const Attendance = require("../module/Attendances.module");
const Employee = require("../module/Employee.module");

// POST /api/attendances
const clockinoutcontroller = async (req, res) => {
  try {
    const session = req.session;
    // CRITICAL FIX: Make sure to select 'isDeleted' so your conditional check works
    const employee = await Employee.findOne({ userId: session.userId }).select('_id isDeleted');
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.isDeleted) {
      return res.status(403).json({ message: "Your account is deactivated" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    const now = new Date();

    // CASE 1: No attendance record today -> Clock In
    if (!attendance) {
      const isLate = (now.getHours() * 60 + now.getMinutes()) > (9 * 60); 

      const newAttendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
      });

      await inngest.send({
        name: "employee/check-out",
        data: {
          employeeId: employee._id, 
          attendenceId: newAttendance._id
        }
      });
      
      return res.status(201).json({ message: "Check-in successful", attendance: newAttendance });
    } 
    
    // CASE 2: Attendance exists AND user already checked out today
    if (attendance.checkOut) {
      return res.status(400).json({ message: "You have already checked out for today" });
    }

    // CASE 3: Attendance exists and checkOut is empty -> Clock Out Now (FIXED LOGIC)
    const checkInTime = new Date(attendance.checkIn).getTime();
    const checkOutTime = now.getTime();
    const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
  
    attendance.checkOut = now;
    const workingHoursRounded = Math.round(workingHours * 100) / 100; 

    const dayType = workingHoursRounded >= 8 ? "Full Day" 
                  : workingHoursRounded >= 6 ? "Three Quarter Day" 
                  : workingHoursRounded >= 4 ? "Half Day" 
                  : "Short Day";

    attendance.workingHours = workingHoursRounded;
    attendance.dayType = dayType;

    await attendance.save();

    return res.status(200).json({ message: "Check-out successful", attendance });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/attendances
const getAttendanceByEmployee = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId }).select('_id isDeleted');
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const limit = parseInt(req.query.limit) || 30; 
    
    const history = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 }) 
      .limit(limit); 

    return res.status(200).json({ 
      data: history,
      employeeId: employee._id, // Fixed: Returning the ID instead of deletion status variable
      message: "Attendance history retrieved successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; 

module.exports = {
  clockinoutcontroller,
  getAttendanceByEmployee,
};
