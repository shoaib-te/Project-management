import mongoose from 'mongoose';
import Employee from '../module/Employee.module.js';

const getProfile = async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userIdObj = new mongoose.Types.ObjectId(session.userId);

    const employee = await Employee.findOne({ userId: userIdObj }).select('-password');
    console.log(employee, userIdObj);
    if (!employee) {
      return res.json({
        firstName: 'Admain',
        lastName: '',
        email: session.email,
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
    console.log(error);
  }
};

// update profile
// put /api/profile
const updateProfile = async (req, res) => {
  const { bio } = req.body;

  try {
    const session = req.session;
    console.log(req.session.userId);

    if (!session || !session.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.isDeleted) {
      return res.status(404).json({ message: 'Your account is deactivated' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(employee._id, { bio }, { new: true });

    return res.status(200).json({
      message: 'Profile updated successfully',
      employee: updatedEmployee,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { getProfile, updateProfile };
