import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'yahoo',
    auth: {
        user: "adrianateodorasarb@yahoo.com", 
        pass: "qeqb iwhf hoqv bhwt",
    },
});

/**
 * Send an email with subject and HTML content.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {void}
 */
export const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: '"AgroUtilaj Service" adrianateodorasarb@yahoo.com' ,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
