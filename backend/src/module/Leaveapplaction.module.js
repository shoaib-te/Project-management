const mongoose = require("mongoose");

const LeaveApplicationSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
    }, 
    type: {
        type: String,
        enum: ["SICK", "CASUAL", "ANNUAL"], // Fixed typo "CASUSL"
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING" // Added default status for new submissions
    }
}, { timestamps: true });

const LeaveApplication = mongoose.model("LeaveApplication", LeaveApplicationSchema);

module.exports = LeaveApplication;
