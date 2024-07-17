import React, { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus('Email sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      setStatus('Error sending email.');
    }
  };

  return (
    <form className="contact-form row gy-2 justify-center" onSubmit={handleSubmit}>
      <div className="lg:col-6">
        <label className="mb-2 block" htmlFor="name">Name <span className="text-red-600">*</span></label>
        <input className="form-input w-full" name="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="lg:col-6">
        <label className="mb-2 block" htmlFor="email">Email <span className="text-red-600">*</span></label>
        <input className="form-input w-full" name="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="col-12">
        <label className="mb-2 block" htmlFor="subject">Subject</label>
        <input className="form-input w-full" name="subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </div>
      <div className="col-12">
        <label className="mb-2 block" htmlFor="message">Message <span className="text-red-600">*</span></label>
        <textarea className="form-textarea w-full" rows="4" name="message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}></textarea>
      </div>
      <div className="col-12">
        <button className="btn btn-primary mt-2" type="submit">Submit Now</button>
      </div>
      {status && <p>{status}</p>}
    </form>
  );
}
