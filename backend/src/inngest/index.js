import sendEmail from '../config/Nodemailer.js';
import Attendance from '../module/Attendances.module.js';
import Employee from '../module/Employee.module.js';
import LeaveApplication from '../module/Leaveapplaction.module.js';
import dotenv from 'dotenv';

dotenv.config();

import { Inngest } from 'inngest';

// Create a client to send and receive events
const inngest = new Inngest({
  id: 'fullstacksystem',
  eventKey: process.env.DEFAULT_INGEST_KEY,
});

// 1. Auto Check-out Function
const outocheckout = inngest.createFunction(
  {
    id: 'outo-check-out',
    triggers: [{ event: 'employee/check-out' }], // Triggers placed back in the first argument
  },
  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // Sleep for 9 hours relative duration
    await step.sleep('wait-for-the-9-hours', '9h');

    // Wrap Mongoose queries inside step.run blocks to prevent re-execution and state desync
    let attendance = await step.run('fetch-attendance-initial', async () => {
      return await Attendance.findById(attendanceId).lean();
    });

    if (attendance && !attendance.checkout) {
      const employee = await step.run('fetch-employee', async () => {
        return await Employee.findById(employeeId).lean();
      });

      if (employee) {
        const checkInTime = new Date(attendance.checkIn).toLocaleTimeString();

        await step.run('send-checkout-reminder-email', async () => {
          await sendEmail({
            to: employee.email,
            subject: 'Attendance Check-Out Reminder',
            body: `<div style="max-width: 600px;">
              <h2>Hi ${employee.firstName}, 👋🏼</h2>
              <p style="font-size: 16px;">You have an active check-in session for ${employee.department} today:</p>
              <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${checkInTime}</p>
              <p style="font-size: 16px;">Please make sure to check-out within the next hour.</p>
              <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
              <br />
              <p style="font-size: 16px;">Best Regards,</p>
              <p style="font-size: 16px;">EMS</p>
            </div>`,
          });
        });
      }

      await step.sleep('wait-for-the-1-hours', '1h');

      // Re-fetch and update attendance if still not checked out
      await step.run('process-auto-checkout', async () => {
        const currentAttendance = await Attendance.findById(attendanceId);

        if (currentAttendance && !currentAttendance.checkout) {
          currentAttendance.checkout =
            new Date(currentAttendance.checkIn).getTime() + 4 * 60 * 60 * 1000;
          currentAttendance.workingHours = 4;
          currentAttendance.dayType = 'Half Day';
          currentAttendance.status = 'LATE';
          await currentAttendance.save();
        }
      });
    }
  },
);

// 2. Admin Leave Application Reminder Function
const leaveapplectionReminder = inngest.createFunction(
  {
    id: 'leave-applection-reminder',
    triggers: [{ event: 'leave/pending' }], // Triggers placed back in the first argument
  },
  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    await step.sleep('wait-for-the-24-hours', '24h');

    const leaveApplication = await step.run('fetch-leave-application', async () => {
      return await LeaveApplication.findById(leaveApplicationId).lean();
    });

    if (leaveApplication && leaveApplication.status === 'PENDING') {
      const employee = await step.run('fetch-leave-employee', async () => {
        return await Employee.findById(leaveApplication.employeeId).lean();
      });

      const startDateFormatted = new Date(leaveApplication.startDate).toLocaleDateString();

      await step.run('send-admin-reminder-email', async () => {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `Leave Application Reminder`,
          body: `<div style="max-width: 600px;">
            <h2>Hi Admin, 👋🏼</h2>
            <p style="font-size: 16px;">You have a pending leave application from the ${employee?.department || 'N/A'} department today:</p>
            <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">Start Date: ${startDateFormatted}</p>
            <p style="font-size: 16px;">Please make sure to take action on this leave application.</p>
            <br />
            <p style="font-size: 16px;">Best Regards,</p>
            <p style="font-size: 16px;">EMS</p>
          </div>`,
        });
      });
    }
  },
);

// 3. Cron: Check attendance at 11:30 AM IST (06:00 UTC) and email absent employees
const attendenceRemindercron = inngest.createFunction(
  {
    id: 'attendence-reminder-cron',
    triggers: [{ cron: '0 0 6 * * *' }], // Triggers placed back in the first argument
  },
  async ({ step }) => {
    // Step 1: Compute absolute boundary ranges
    const today = await step.run('get-today-date', () => {
      const startUTC = new Date(
        new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) + 'T00:00:00+05:30',
      );
      const endUTC = new Date(startUTC.getTime() + 24 * 60 * 60 * 1000);
      return {
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      };
    });

    // Step 2: Query active records
    const activeEmployees = await step.run('get-active-employee', async () => {
      const employees = await Employee.find({
        isDeleted: false,
        employmentStatus: 'ACTIVE',
      }).lean();
      return employees.map((e) => ({
        _id: e._id.toString(),
        name: `${e.firstName || ''} ${e.lastName || ''}`.trim(),
        email: e.email,
        department: e.department,
      }));
    });

    // Step 3: Fetch active approved leave scopes
    const onLeaveIds = await step.run('get-on-leave-ids', async () => {
      const leaves = await LeaveApplication.find({
        status: 'APPROVED',
        startDate: { $lte: new Date(today.endUTC) },
        endDate: { $gte: new Date(today.startUTC) },
      }).lean();
      return leaves.map((l) => l.employeeId.toString());
    });

    // Step 4: Fetch verified daily attendance IDs
    const checkedInIds = await step.run('get-checked-in-ids', async () => {
      const checkedIn = await Attendance.distinct('employeeId', {
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

    // Step 6: Dispatch emails concurrently in chunks
    if (absentEmployees.length > 0) {
      await step.run('send-reminder-emails', async () => {
        const chunkSize = 10;
        for (let i = 0; i < absentEmployees.length; i += chunkSize) {
          const chunk = absentEmployees.slice(i, i + chunkSize);
          const emailPromises = chunk.map((emp) => {
            return sendEmail({
              to: emp.email,
              subject: `Attendance Reminder – Please Mark Your Attendance`,
              body: `<div style="max-width: 600px;">
                <h2>Hi ${emp.name || 'Team Member'}, 👋🏼</h2>
                <p style="font-size: 16px;">We noticed you haven't checked in or marked your attendance for today yet.</p>
                <p style="font-size: 16px;">Please make sure to log into the portal and mark your attendance as soon as possible to keep your records updated.</p>
                <br />
                <p style="font-size: 16px;">Best Regards,</p>
                <p style="font-size: 16px;">EMS Team</p>
              </div>`,
            });
          });
          await Promise.all(emailPromises);
        }
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

const functions = [outocheckout, leaveapplectionReminder, attendenceRemindercron];

export { inngest, functions };
