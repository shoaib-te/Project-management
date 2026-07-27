const sendEmail = require("../config/Nodemailer")
const Attendance = require("../module/Attendances.module");
const Employee = require("../module/Employee.module");
const LeaveApplication = require("../module/Leaveapplaction.module");

// Unified Modern SDK CommonJS require format
const { Inngest } = require("inngest");

// Create a client to send and receive events
const inngest = new Inngest({ id: "fullstacksystem" });

// 1. Auto Check-out Function
const outocheckout = inngest.createFunction(
  {
    id: "outo-check-out",
    // Configured modern v3/v4 triggers syntax array
    triggers: [{ event: "employee/check-out" }],
  },
  async ({ event, step }) => {
    const { employeeId, attendenceId } = event.data;

    // Using robust relative string durations instead of unstable moving new Date() targets
    await step.sleep("wait-for-the-9-hours", "9h");

    // Fetch and type evaluate attendance records
    let attendence = await Attendance.findById(attendenceId);
    if (!attendence?.checkout) {
      const employee = await Employee.findById(employeeId);

      // TODO: Implement actual user notification engine dispatch here
      await sendEmail({
        to: employee.email,
        subject: "Attendance Check-Out Reminder",
        body: `<div style="max-width: 600px;">
    <h2>Hi ${employee.firstName}, 👋🏼</h2>
    <p style="font-size: 16px;">You have an active check-in session for ${employee.department} today:</p>
    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${attendance?.checkIn?.toLocaleTimeString()}</p>
    <p style="font-size: 16px;">Please make sure to check-out within the next hour.</p>
    <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
    <br />
    <p style="font-size: 16px;">Best Regards,</p>
    <p style="font-size: 16px;">EMS</p>
  </div>`,
      });

      await step.sleep("wait-for-the-1-hours", "1h");

      // Re-fetch and check attendance again (Removed duplicate blocking const keyword)
      attendence = await Attendance.findById(attendenceId);
      if (!attendence?.checkout) {
        attendence.checkout =
          new Date(attendence.checkIn).getTime() + 4 * 60 * 60 * 1000;
        attendence.workingHours = 4;
        attendence.dayType = "Half Day";
        attendence.status = "LATE";
        await attendence.save();
      }
    }
  },
);

// 2. Admin Leave Application Reminder Function
const leaveapplectionReminder = inngest.createFunction(
  {
    id: "leave-applection-reminder",
    triggers: [{ event: "leave/pending" }],
  },
  async ({ event, step }) => {
    const { leaveapplactionId } = event.data;

    await step.sleep("wait-for-the-24-hours", "24h");

    const leaveapplaction = await LeaveApplication.findById(leaveapplactionId);
    if (leaveapplaction && leaveapplaction.status === "PENDING") {
      const employee = await Employee.findById(leaveapplaction.employeeId);
      // TODO: Add notification handler targeting admin profile

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `Leave Application Reminder`,
        body: `<div style="max-width: 600px;">
    <h2>Hi Admin, 👋🏼</h2>
    <p style="font-size: 16px;">You have a pending leave application from the ${employee.department} department today:</p>
    <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">Start Date: ${leaveapplaction?.startDate?.toLocaleDateString()}</p>
    <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
    <br />
    <p style="font-size: 16px;">Best Regards,</p>
    <p style="font-size: 16px;">EMS</p>
  </div>`,
      });
    }
  },
);

// 3. Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employees
const attendenceRemindercron = inngest.createFunction(
  {
    id: "attendence-reminder-cron",
    triggers: [{ cron: "0 0 6 * * *" }], // Modern configuration syntax mapping
  },
  async ({ step }) => {
    // Step 1: Compute absolute boundary ranges mapping target timezones safely
    const today = await step.run("get-today-date", () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }) +
          "T00:00:00+05:30",
      );
      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
      return {
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      };
    });

    // Step 2: Query active records
    const activeEmployees = await step.run("get-active-employee", async () => {
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: "ACTIVE",
      }).lean();

      return employees.map((e) => ({
        _id: e._id.toString(),
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Fetch active approved leave scopes (Safely flattened outside Step 2 block)
    const onLeaveIds = await step.run("get-on-leave-ids", async () => {
      const leaves = await LeaveApplication.find({
        status: "APPROVED",
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();
      return leaves.map((l) => l.employeeId.toString());
    });

    // Step 4: Fetch verified daily attendance IDs
    const checkedInIds = await step.run("get-checked-in-ids", async () => {
      const checkedIn = await Attendance.distinct("employeeId", {
        date: {
          $gte: new Date(today.startUTC),
          $lt: new Date(today.endUTC),
        },
      });
      return checkedIn.map((id) => id.toString());
    });

    // Step 5: Process filter algorithm identifying valid absent metrics
    const absentEmployees = activeEmployees.filter((emp) => {
      const isCheckedIn = checkedInIds.includes(emp._id);
      const isOnLeave = onLeaveIds.includes(emp._id);
      return !isCheckedIn && !isOnLeave;
    });

    // Step 6: Dispatch async loop resolving promise operations concurrently
    if (absentEmployees.length > 0) {
      await step.run("send-reminder-emails", async () => {
        const emailPromises = absentEmployees.map((emp) => {
          // TODO: Wrap with your configured corporate mail dispatcher function
          return sendEmail({
            to: emp.email,
            subject: `Attendance Reminder – Please Mark Your Attendance`,
            body: `<div style="max-width: 600px;">
      <h2>Hi ${emp.name || "Team Member"}, 👋🏼</h2>
      <p style="font-size: 16px;">We noticed you haven't checked in or marked your attendance for today yet.</p>
      <p style="font-size: 16px;">Please make sure to log into the portal and mark your attendance as soon as possible to keep your records updated.</p>
      <br />
      <p style="font-size: 16px;">Best Regards,</p>
      <p style="font-size: 16px;">EMS Team</p>
    </div>`,
          });
        });
        
        // Wait for all mail actions inside the step to execute
        await Promise.all(emailPromises);
      });
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  },
);

// Unified output mapping internal function objects via CommonJS exports
module.exports = {
  inngest,
  functions: [
    outocheckout,
    leaveapplectionReminder,
    attendenceRemindercron,
  ]
};
