import { inngest } from '../inngest/index.js';
import Attendance from '../module/Attendances.module.js';
import Employee from '../module/Employee.module.js';

// POST /api/attendances
const clockinoutcontroller = async (req, res) => {
  try {
    const session = req.session;

    // Select only needed fields to optimize DB memory footprint
    const employee = await Employee.findOne({ userId: session.userId }).select('_id isDeleted');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.isDeleted) {
      return res.status(403).json({ message: 'Your account is deactivated' });
    }

    // Fix: Clear time boundaries safely using UTC or your target timezone
    const now = new Date();
    const today = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );

    // Search using the unified date boundary
    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: today,
    });

    // CASE 1: No attendance record today -> Clock In
    if (!attendance) {
      // Calculate minutes since midnight relative to the employee's timezone
      // Example targets 09:00 AM local time boundary
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const isLate = currentMinutes > 9 * 60;

      const newAttendance = await Attendance.create({
        employeeId: employee._id,
        date: today,
        checkIn: now,
        status: isLate ? 'LATE' : 'PRESENT',
      });

      // Send background event safely
      await inngest.send({
        name: 'employee/check-out',
        data: {
          employeeId: employee._id,
          attendenceId: newAttendance._id,
        },
      });

      return res.status(201).json({ message: 'Check-in successful', attendance: newAttendance });
    }

    // CASE 2: Attendance exists AND user already checked out today
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'You have already checked out for today' });
    }

    // CASE 3: Attendance exists and checkOut is empty -> Clock Out Now
    const checkInTime = new Date(attendance.checkIn).getTime();
    const checkOutTime = now.getTime();

    // Ensure negative time differences don't happen due to server clock drifts
    const workingHours = Math.max(0, (checkOutTime - checkInTime) / (1000 * 60 * 60));
    const workingHoursRounded = Math.round(workingHours * 100) / 100;

    // Determine Day Type classifications
    let dayType = 'Short Day';
    if (workingHoursRounded >= 8) {
      dayType = 'Full Day';
    } else if (workingHoursRounded >= 6) {
      dayType = 'Three Quarter Day';
    } else if (workingHoursRounded >= 4) {
      dayType = 'Half Day';
    }

    // Mutate and save to MongoDB
    attendance.checkout = now;
    attendance.workingHours = workingHoursRounded;
    attendance.dayType = dayType;

    await attendance.save();

    return res.status(200).json({ message: 'Check-out successful', attendance });
  } catch (error) {
    console.error('Clock In/Out Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/attendances
const getAttendanceByEmployee = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId }).select('_id isDeleted');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const limit = parseInt(req.query.limit) || 30;

    const history = await Attendance.find({ employeeId: employee._id })
      .sort({ date: -1 })
      .limit(limit);

    return res.status(200).json({
      data: history,
      employeeId: employee._id, // Fixed: Returning the ID instead of deletion status variable
      message: 'Attendance history retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { clockinoutcontroller, getAttendanceByEmployee };
