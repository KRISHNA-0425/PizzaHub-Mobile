import { Customer, DeliveryPartner } from "../../models/user.model.js";
import bcrypt from 'bcryptjs';

export const updateUser = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const updateData = req.body;

        // Prevent updating sensitive fields
        delete updateData.password;
        delete updateData.role;
        delete updateData._id;
        delete updateData.email;  // Usually emails shouldn't be changed

        // Determine model based on role from token (more efficient)
        const UserModel = role === "customer" ? Customer : DeliveryPartner;

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Separate controller for password update
export const updatePassword = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required"
            });
        }

        const UserModel = role === "customer" ? Customer : DeliveryPartner;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error('Update password error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};