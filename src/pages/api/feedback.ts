import type { APIRoute } from "astro";
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'eu-west-2' });

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

    // Validate the data - you'll probably want to do more than this
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

    // Return the success response with the data
    return new Response(
        JSON.stringify(successMessage),
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
};