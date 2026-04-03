const sendMail = require("../utils/sendMail");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    //  Send mail to admin
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: "New Contact Message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-top: 0;">New Contact Inquiry</h2>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <p style="margin: 0 0 12px 0; color: #334155;"><strong>👤 Name:</strong> ${name}</p>
            <p style="margin: 0 0 12px 0; color: #334155;"><strong>✉️ Email:</strong> <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></p>
            <div style="margin-top: 25px;">
              <p style="margin: 0 0 8px 0; color: #334155;"><strong>📝 Message:</strong></p>
              <div style="background-color: #f1f5f9; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0; font-style: italic; color: #475569; line-height: 1.5;">
                ${message}
              </div>
            </div>
          </div>
          <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 25px;">This is an automated notification from your application.</p>
        </div>
      `,
    });

    // 📩 Auto reply
    await sendMail({
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #334155;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f172a; margin: 0; font-size: 26px;">Thank You for Reaching Out!</h1>
          </div>
          <div style="font-size: 16px; line-height: 1.6;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We've successfully received your message and our team is already looking into it. We strive to reply to all inquiries as quickly as possible.</p>
            <p style="margin-top: 25px; font-weight: bold;">For your records, here is a copy of your message:</p>
            <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 15px 0;">
              <p style="margin: 0; font-style: italic; color: #475569;">"${message}"</p>
            </div>
            <p style="margin-top: 30px;">Best regards,<br><strong>Our Team</strong></p>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 35px 0 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">This is an automated response, please do not reply directly to this email.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
