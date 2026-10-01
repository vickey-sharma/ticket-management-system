export const sanitizeUserResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  isVerified: user.isVerified,
  isActive: user.isActive,
  isRegistrationComplete: user.isRegistrationComplete,
  companyName: user.companyName,
  canLogin: user.canLogin,
  fullAddress: user.fullAddress,
  city: user.city,
  state: user.state,
  pincode: user.pincode
});