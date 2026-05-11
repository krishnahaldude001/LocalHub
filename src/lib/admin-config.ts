// Admin contact information for shop activation
export const adminConfig = {
  contact: {
    email: 'admin@localhub.space',
    whatsapp: '',
    phone: '',
    businessName: 'LocalHub'
  },
  activation: {
    fee: 500, // Monthly fee in INR
    currency: "INR",
    paymentMethods: ["UPI", "Bank Transfer", "Cash"],
    activationTime: "24-48 hours" // Time to activate after payment
  },
  messages: {
    registrationSuccess: "Your shop registration is successful! To activate your account and start adding deals, please contact us for payment verification.",
    activationPending: "Your account is pending activation. Please complete the payment process to start using our platform.",
    activationRejected: "Your account activation was rejected. Please contact us for more information.",
    accountSuspended: "Your account has been suspended. Please contact us for reactivation."
  }
}

export default adminConfig
