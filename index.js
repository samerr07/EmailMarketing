const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Read Excel File
const readExcelFile = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
};

// Read HTML Email Template
const readEmailTemplate = () => {
    const templatePath = path.join(__dirname, 'Template.html');
    return fs.readFileSync(templatePath, 'utf8');
};

// Email Transporter (Gmail SMTP)
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_SERVER || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send Email
const sendEmail = async (transporter, to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: `"Naraway" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent,
            attachments: [
                {
                  filename: 'poster.png',
                  path: './poster.png', // Path to your poster image
                  cid: 'poster' // must match the cid used in <img src="cid:poster">
                },
                {
                    filename: 'logo.png',
                    path: './logo.png', // Path to your poster image
                    cid: 'logo' // must match the cid used in <img src="cid:poster">
                }
              ]
        });
        console.log(`✅ Email sent to: ${to}`);
    } catch (err) {
        console.error(`❌ Failed to send to ${to}: ${err.message}`);
    }
};

// Main Function
const sendDynamicEmails = async (filePath) => {
    const data = readExcelFile(filePath);
    const template = readEmailTemplate();
    const transporter = createTransporter();

    for (const row of data) {
        const email = row['email'];
        const name = row['contact_person'] || 'there';
        const designation = row['designation'] || '';
        const company = row['name'] || '';

        if (!email) {
            console.warn('⚠️ Skipping row due to missing email:', row);
            continue;
        }

        const personalizedHTML = template
            .replace(/{{name}}/g, name)
            .replace(/{{designation}}/g, designation)
            .replace(/{{company}}/g, company);

        const subject = `Hi ${company}, Here is Your one stop solution for Funding of upto 70 lakhs, Company Registration, IT Solutions in AI, Video For your brand, Logo Designing, Digital Marketing and Recruitment`;
        await sendEmail(transporter, email, subject, personalizedHTML);
    }
};

// Set your Excel file path here
const excelFilePath = path.join(__dirname, 'Shuffled_.xlsx');
sendDynamicEmails(excelFilePath);
