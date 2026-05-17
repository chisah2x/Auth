
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
}

// Escapes HTML special characters to prevent XSS if OTP ever contains <, >, ", &
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function getOtpHtml(otp, expiryMinutes = 10) {
    if (!otp) {
        throw new Error("OTP is required");
    }

    const safeOtp = escapeHtml(otp); // Prevent XSS in email body

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" style="padding-bottom: 24px;">
                            <h1 style="margin: 0; font-size: 22px; color: #333333;">Verify Your Identity</h1>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <p style="margin: 0; font-size: 15px; color: #555555;">Use the OTP below to complete your request.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 24px 0;">
                            <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; background-color: #f0f4ff; padding: 16px 32px; border-radius: 8px;">
                                ${safeOtp}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 8px;">
                            <p style="margin: 0; font-size: 13px; color: #999999;">This code expires in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
