import { useState } from "react";
import type { FormEvent } from "react";

export default function Form() {
    const [responseMessage, setResponseMessage] = useState("");

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const response = await fetch("/api/feedback", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (data.message) {
            setResponseMessage(data.message);
        }
    }

    return (
        <form onSubmit={submit}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                <input type="text" id="name" name="name" autoComplete="name" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
            </label>
            <br/>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                <input type="email" id="email" name="email" autoComplete="email" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
            </label>
            <br/>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
                <textarea id="message" name="message" autoComplete="off" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required />
            </label>
            <br/>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Submit</button>
            {responseMessage && <p>{responseMessage}</p>}
        </form>
    );
}