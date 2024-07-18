import type { APIRoute } from "astro";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Create an instance of the SESClient using environment variables
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export const POST: APIRoute = async ({ request }) => {
    const contentType = request.headers.get("Content-Type");
    if (!contentType || !(contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded"))) {
        return new Response(
            JSON.stringify({
                message: "Invalid Content-Type",
            }),
            { status: 400 }
        );
    }

    const data = await request.formData();
    const name = data.get("name");
    const email = data.get("email");
    const feedbackMessage = data.get("message");

    console.log({ name, email, feedbackMessage });

    // Validate the data
    if (!name || !email || !feedbackMessage) {
        return new Response(
            JSON.stringify({
                message: "Missing required fields",
            }),
            { status: 400 }
        );
    }

    // Construct the success message with the received data
    const successMessage = {
        message: "Success!",
        name,
        email,
        feedback: feedbackMessage
    };

    // Log the data
    console.log("Data received:", { name, email, feedbackMessage });

    // Set the parameters for the email
    const params = {
        Destination: {
            ToAddresses: ['info@bluepointart.uk'], // Set the recipient email
        },
        Message: {
            Body: {
                Text: {
                    Data: `Name: ${name}\nEmail: ${email}\nFeedback: ${feedbackMessage}`,
                },
            },
            Subject: {
                Data: 'Feedback Form Submission',
            },
        },
        Source: 'info@bluepointart.uk', // Set the sender email
    };

    // Send the email
    const sendEmailCommand = new SendEmailCommand(params);
    try {
        await sesClient.send(sendEmailCommand);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({
                message: "Error sending email",
            }),
            { status: 500 }
        );
    }

    // Return the success response with the data
    return new Response(
        JSON.stringify(successMessage),
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
};

