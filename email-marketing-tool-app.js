const express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Global variable to track active sending processes
const activeSendingJobs = new Map();

// Ensure upload directories exist
const dirs = ['uploads', 'uploads/excel', 'uploads/html'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'excel' ? 'uploads/excel/' : 'uploads/html/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'email-marketing-tool-html.html'));
});

app.post('/preview-excel', upload.single('excel'), (req, res) => {
  try {
    const excelPath = req.file.path;
    const workbook = xlsx.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    // Get headers/columns
    const headers = Object.keys(data[0] || {});
    
    // Return first few rows and headers
    res.json({
      success: true,
      headers,
      sample: data.slice(0, 5),
      totalRows: data.length,
      filePath: excelPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error processing Excel file', error: err.message });
  }
});

app.post('/upload-template', upload.single('template'), (req, res) => {
  try {
    const htmlPath = req.file.path;
    const template = fs.readFileSync(htmlPath, 'utf8');
    
    res.json({
      success: true,
      filePath: htmlPath,
      template
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error processing HTML template', error: err.message });
  }
});

app.post('/test-connection', async (req, res) => {
  const { smtpServer, smtpPort, emailUser, emailPass } = req.body;
  
  try {
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: parseInt(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: emailUser,
        pass: emailPass
      },
      pool: true,                   // Use pooled connections
      maxConnections: 1,            // Reduce to just 1 connection
      maxMessages: 20,              // Limit messages per connection
      // rateDelta: delayBetweenEmails,
      rateLimit: 3,                 // Maximum number of messages per rateDelta
      connectionTimeout: 10000,
      socketTimeout: 30000,
      debug: true                   // Enable debug logging
    });
    
    // Verify connection
    await transporter.verify();
    
    res.json({ success: true, message: 'SMTP connection successful!' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'SMTP connection failed', error: err.message });
  }
});

app.post('/stop-sending', (req, res) => {
  const { jobId } = req.body;
  
  if (jobId && activeSendingJobs.has(jobId)) {
    // Set the shouldStop flag to true
    const jobData = activeSendingJobs.get(jobId);
    jobData.shouldStop = true;
    
    res.json({ 
      success: true, 
      message: 'Stop signal sent. Email sending will stop after the current email completes.' 
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid job ID or no active sending process found' 
    });
  }
});

// Replace the entire '/send' endpoint with this:
app.post('/send', async (req, res) => {
  const { 
    excelPath, 
    htmlPath, 
    emailColumn,
    nameColumn,
    subjectLine,
    smtpServer,
    smtpPort,
    emailUser,
    emailPass,
    senderName,
    variables,
    delayBetweenEmails = 2000
  } = req.body;
  
  try {
    // Validate inputs
    if (!excelPath || !htmlPath || !emailColumn || !smtpServer || !emailUser || !emailPass) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required parameters' 
      });
    }
    
    // Create a unique job ID for this sending process
    const jobId = Date.now().toString();
    
    // Initialize job data in the map
    activeSendingJobs.set(jobId, {
      shouldStop: false,
      startTime: new Date(),
      totalEmails: 0,
      sentEmails: 0,
      failedEmails: 0
    });
    
    // Read the data files
    const workbook = xlsx.readFile(excelPath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const template = fs.readFileSync(htmlPath, 'utf8');
    
    // Validate email list
    const validRecipients = data.filter(row => {
      const email = row[emailColumn];
      return email && typeof email === 'string' && email.includes('@');
    });
    
    if (validRecipients.length === 0) {
      // Clean up the job data
      activeSendingJobs.delete(jobId);
      
      return res.status(400).json({
        success: false,
        message: 'No valid email addresses found in the selected column'
      });
    }
    
    // Enforce email sending limit
    const MAX_EMAILS = 500;
    const recipientsToProcess = validRecipients.slice(0, MAX_EMAILS);
    
    // Update job data with total emails
    const jobData = activeSendingJobs.get(jobId);
    jobData.totalEmails = recipientsToProcess.length;
    
    // Send initial response with job ID
    res.json({
      success: true,
      jobId,
      total: recipientsToProcess.length,
      limit: MAX_EMAILS,
      skipped: validRecipients.length > MAX_EMAILS ? validRecipients.length - MAX_EMAILS : 0
    });
    
    // Configure email transporter with improved timeouts and connection pool
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: parseInt(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: emailUser,
        pass: emailPass
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: delayBetweenEmails,
      rateLimit: 5,
      connectionTimeout: 10000,
      socketTimeout: 30000
    });
    
    // Process and send emails in the background
    (async () => {
      let success = 0;
      let failed = 0;
      
      for (let i = 0; i < recipientsToProcess.length; i++) {
        // Check if should stop
        if (activeSendingJobs.get(jobId).shouldStop) {
          // Update job data
          jobData.sentEmails = success;
          jobData.failedEmails = failed;
          jobData.stopped = true;
          break;
        }
        
        const row = recipientsToProcess[i];
        const email = row[emailColumn];
        const name = nameColumn ? row[nameColumn] || '' : '';
        
        try {
          // Personalize the email
          let personalized = template;
          
          // Replace all variables based on mappings
          if (Array.isArray(variables)) {
            variables.forEach(variable => {
              if (variable.placeholder && variable.column) {
                const value = row[variable.column] || '';
                const regex = new RegExp(`{{${variable.placeholder}}}`, 'g');
                personalized = personalized.replace(regex, value);
              }
            });
          }
          
          // Send email with retry logic
          let retries = 3;
          let sent = false;
          
          while (retries > 0 && !sent) {
            try {
              await transporter.sendMail({
                from: `"${senderName || 'Email Marketing Tool'}" <${emailUser}>`,
                to: email,
                subject: subjectLine.replace(/{{name}}/gi, name),
                html: personalized,
              });
              
              sent = true;
              success++;
              jobData.sentEmails = success;
              
            } catch (sendErr) {
              retries--;
              
              if (retries === 0) {
                throw sendErr; // Re-throw if no more retries
              }
              
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (err) {
          failed++;
          jobData.failedEmails = failed;
        }
        
        // Add a delay between emails
        await new Promise(resolve => setTimeout(resolve, delayBetweenEmails));
      }
      
      // Update job as complete
      jobData.completed = true;
      
      // Keep job data for 1 hour, then clean up
      setTimeout(() => {
        activeSendingJobs.delete(jobId);
      }, 3600000);
      
    })().catch(err => {
      console.error('Background email sending error:', err);
      const jobData = activeSendingJobs.get(jobId);
      if (jobData) {
        jobData.error = err.message;
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing request', 
      error: err.message 
    });
  }
});

// Add this new endpoint for status checks
app.get('/send-status/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  if (!jobId || !activeSendingJobs.has(jobId)) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  
  const jobData = activeSendingJobs.get(jobId);
  
  res.json({
    success: true,
    jobId,
    total: jobData.totalEmails,
    sent: jobData.sentEmails,
    failed: jobData.failedEmails,
    completed: !!jobData.completed,
    stopped: !!jobData.stopped,
    error: jobData.error || null
  });
});

// New endpoint to check server health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));