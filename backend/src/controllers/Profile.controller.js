const Employee = require("../module/Employee.module");


const getProfile = (req, res) => {
  try {
    const session = req.session;

    
    const employee = Employee.findById(session.userId).select('-password');
    if (!employee) {
      return res.json({
        firstName: 'Admin',
        lastName: "",
        email: session.email, 

       });
    }
    return res.status(200).json({employee});
    
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// update profile
// put /api/profile
const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const employee = await Employee.findById(session.userId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if(Employee.isDeleted){
        return res.status(404).json({ message: "your account is deactivated " });
    }

    await Employee.findByIdAndUpdate(employee._id, req.body.bio, { new: true });
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }



}


module.exports = {
  getProfile,
    updateProfile,
};
