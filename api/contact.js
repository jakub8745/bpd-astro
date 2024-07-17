import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: 'eu-west-2' });

export async function get() {
  return new Response(JSON.stringify({ message: 'This endpoint is for POST requests only.' }), { status: 405 });
}

export async function post({ request }) {
  const { name, email, subject, message } = await request.json();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Name, email, and message are required.' }), { status: 400 });
  }

  const params = {
    Destination: {
      ToAddresses: ['info@bluepointart.uk'], // Replace with your email address
    },
    Message: {
      Body: {
        Text: { Data: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}` },
      },
      Subject: { Data: `Contact Form Submission: ${subject || 'No Subject'}` },
    },
    Source: 'info@bluepointart.uk', // Replace with your verified SES email address
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
  }
}
