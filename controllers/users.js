import UserModel from "../models/UserModel.js"
import bcrypt from 'bcryptjs'
import ResetPassword from "./ResetPassword.js"


const forgotPassword = async (req, res) => {
     const { email } = req.body;
   
     try {

       const user = await UserModel.findOne({ email });
       if (!user) {
         return res.status(404).json({ error: 'User not found' });
       }
   
       const resetToken = Math.random().toString(36).substring(7);
       const hashedResetToken = await bcrypt.hash(resetToken, 10);
       user.resetPasswordToken = hashedResetToken;
       user.resetPasswordExpires = Date.now() + 3600000;
       await user.save();
     //   console.log(`Reset token for ${email}: ${resetToken}`);
       
       ResetPassword({email, resetToken})
   

       res.status(200).json({ message: 'Reset token generated successfully' });
    
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   };

const resetPassword =  async (req, res) => {
     const { email, token, newPassword } = req.body;
   
     try {
       const user = await UserModel.findOne({ email });
       if (!user) {
         return res.status(404).json({ error: 'User not found' });
       }
   

       if (user.resetPasswordExpires < Date.now()) {
         return res.status(400).json({ error: 'Reset token has expired' });
       }
   

       const tokenMatch = await bcrypt.compare(token, user.resetPasswordToken);
       if (!tokenMatch) {
         return res.status(400).json({ error: 'Invalid reset token' });
       }
       const hashedPassword = await bcrypt.hash(newPassword, 10);
       user.password = hashedPassword;
       user.resetPasswordToken = undefined;
       user.resetPasswordExpires = undefined;
       await user.save();

       res.status(200).json({ message: 'Password reset successfully' });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: 'Internal Server Error' });
     }
   };



export default {
     forgotPassword,
     resetPassword
}