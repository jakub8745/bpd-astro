const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

// Set up AWS SES
AWS.config.update({ region: process.env.AWS_REGION });
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Request body:', req.body);  // Log request body
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    console.error('Missing required fields');  // Log missing fields error
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = {
    Destination: {
      ToAddresses: ['info@bluepointart.uk'], // Replace with your verified email
    },
    Message: {
      Body: {
        Text: { Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` },
      },
      Subject: { Data: subject || 'New Contact Form Submission' },
    },
    Source: 'info@bluepointart.uk', // Replace with your verified email
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result);  // Log success message
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);  // Log error details
    res.status(500).json({ error: 'Error sending email', details: error.message });
  }
};

// Middleware to parse URL-encoded bodies
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Export the handler with middleware applied
const handleContactForm = (req, res) => {
  urlencodedParser(req, res, () => handler(req, res));
};

module.exports = handleContactForm;