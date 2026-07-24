const LeaveApplication = require("../module/Leaveapplaction.module"); 
const Employee = require("../module/Employee.module");

// Create a new leave application
const createLeaveApplication = async (req, res) => {
    try {
        const session= req.session
        const {type, startDate, endDate, reason } = req.body;

        if(!type || !startDate || !endDate ||!reason){
            return res.status(400).json({ message: "missing fields ." });
        }

        const employee= await Employee.findOne({userId:session.userId})

        if(!employee){
            return res.status(400).json({ message: "Employee is not found ." });
        }

        if(employee.isDeleted ){
        return res.status(400).json({ message: " your account is deactivated ." });
  
        }

        // Validation: Check if end date is before start date

        const today = new Date()
        today.setHours(0,0,0,0);

        if (new Date(startDate) <= today ||  new Date(endDate) <=  today) {
            return res.status(400).json({ message: "Leave dates must be in the future." });
        }
        if (new Date(startDate) <new Date(endDate) ) {
            return res.status(400).json({ message: "End date cannot be before start date." });
        }



        const newApplication = new LeaveApplication({
            employeeId:employee._id,
            type,
            startDate=new Date(startDate),
            endDate=new Date(endDate),
            reason,
            status:"PENDING",

            // Status defaults to PENDING automatically via schema
        });

        await newApplication.save();
        res.status(201).json({ message: "Leave application submitted successfully.", data: newApplication });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Get all leave applications (For HR/Admin)
const getAllApplications = async (req, res) => {
    try {
             const session= req.session
             const isAdmin=  req.session.role === "admin"

             if(isAdmin){
                const status = req.query.status;

                const where= status ?{status}:{}
                const applications = await LeaveApplication.find(where)
                       .populate("employeeId", "name email")
                    .sort({ createdAt: -1 }); // Corrected field name and colon syntax


                    const data = applications.map((l)=>{
                       const obj= l.toObject()
                       return {
                           ...obj,
                           id:obj._id.toString(),
                           employee:obj.employeId,
                           employeeId:obj.employeId?._id?.toString(),
       
                       }
                       return res.json({data})
                    })
             }else {
                const employee = await Employee.findOne({
                    userId:session.userId 
                }).lean()

                if(!employee){
                               return res.status(400).json({ message: "Employee is not found ." });

                }
                const leaves= LeaveApplication.find({
                    employeeId: employee._id
                }).sort({createdAt:-1})

                return res.json({
                    data:leaves,
                    employee:{...employee,id:employee._id.toString()}
                })
             }



        res.status(200).json({ data: applications });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Update leave application status (Approve / Reject)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validation: Check if the provided status is valid
        const validStatuses = [  "PENDING", "APPROVED", "REJECTED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedApplication = await LeaveApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ message: "Leave application not found." });
        }

        res.status(200).json({ message: `Application status updated to ${status}.`, data: updatedApplication });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};



module.exports={
  createLeaveApplication,
  updateApplicationStatus,
  getAllApplications

}