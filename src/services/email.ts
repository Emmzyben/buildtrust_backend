import crypto from "crypto";

// Generate secure verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Reusable function to send emails through external PHP API
const sendExternalEmail = async (toEmail: string, subject: string, message: string) => {
  try {
    const response = await fetch(
      "https://gitaalliedtech.com/clocklyApp/clockly_email.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: toEmail,
          subject,
          message,
        }),
      }
    );

    const result = await response.json();

    if (
      result.status === "success" ||
      (result.message && result.message.includes("sent successfully"))
    ) {
      console.log("Email sent successfully:", result.message);
      return true;
    } else {
      console.error("Failed to send email:", result.message);
      return false;
    }
  } catch (err) {
    console.error("Network error occurred while sending email.", err);
    return false;
  }
};

// ------------------------------------------------------------
// SEND VERIFICATION EMAIL
// ------------------------------------------------------------

export const sendVerificationEmail = async (
  toEmail: string,
  verificationToken: string
) => {
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}`;

  const htmlMessage = `
      <h2>Welcome to BuildTrust Africa</h2>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify My Email</a>
      <br><br>
      If the button doesn't work, use this link:<br>
      ${verificationUrl}
  `;

  return await sendExternalEmail(
    toEmail,
    "Verify Your Email - BuildTrust Africa",
    htmlMessage
  );
};

// ------------------------------------------------------------
// SEND PASSWORD RESET EMAIL
// ------------------------------------------------------------

export const sendPasswordResetEmail = async (
  toEmail: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;

  const htmlMessage = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetUrl}">Reset Password</a>
      <br><br>
      If the button doesn't work, use this link:<br>
      ${resetUrl}
  `;

  return await sendExternalEmail(
    toEmail,
    "Reset Your Password - BuildTrust Africa",
    htmlMessage
  );
};
