const {
  getUserProfile,
  createOrUpdateProfile,
} = require("../models/userModel");

// Get profile
async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const profile = await getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
}

// Update profile
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;

    const updatedProfile = await createOrUpdateProfile(
      userId,
      req.body
    );

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};