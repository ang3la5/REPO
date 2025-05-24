const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const ContactController = {
  sendMessage: async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Required fields are missing.' });
    }

    const mail = {
      to: process.env.EMAIL_TO,                // Who receives the message
      from: process.env.EMAIL_FROM,            // Verified sender
      subject: subject || 'New CineVerse Contact Message',
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    };

    try {
      await sgMail.send(mail);
      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
      console.error('SendGrid error:', error.response?.body || error.message);
      res.status(500).json({ error: 'Failed to send email.' });
    }
  }
};

module.exports = ContactController;
