import * as authService from '../services/authService.js';
import * as authDao from '../Dao/authDao.js';
import bcrypt from 'bcryptjs';

/**
 * Handle user login
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = await authService.login(username, password, ipAddress, userAgent);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle access token refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required.'
      });
    }

    const tokens = await authService.refreshToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully.',
      data: tokens
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle password changes
 */
export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    await authService.changePassword(userId, oldPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user logout
 */
export const logout = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logout successful.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset token (forgot password)
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await authDao.findUserByUsername(username);
    
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If the user exists, a password reset link has been simulated.'
      });
    }

    const mockResetToken = `RESET-${user.UserID}-${Date.now()}`;
    console.log(`[PASSWORD RESET SIMULATION] Reset token for ${username}: ${mockResetToken}`);

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions have been outputted to the server logs. Use reset-password API.',
      debugToken: mockResetToken
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Execute password reset
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    const tokenParts = token.split('-');
    if (tokenParts.length < 3 || tokenParts[0] !== 'RESET') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or corrupt reset token.'
      });
    }

    const userId = parseInt(tokenParts[1], 10);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await authDao.updatePassword(userId, hashedPassword);

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (error) {
    next(error);
  }
};
