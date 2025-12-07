'use client'

import { useState, FormEvent } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Option 1: Formspree (replace with your form ID)
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Name field */}
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors"
          placeholder="Your name"
        />
      </div>
      
      {/* Email field */}
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors"
          placeholder="your@email.com"
        />
      </div>
      
      {/* Message field */}
      <div>
        <label 
          htmlFor="message" 
          className="block text-sm font-mono text-[var(--tungsten-gray)] mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-[var(--void-black)] border border-[var(--tungsten-gray)]/30 text-[var(--photon-white)] focus:border-[var(--terminal-cyan)] focus:outline-none transition-colors resize-none"
          placeholder="Your message..."
        />
      </div>
      
      {/* Submit button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--terminal-cyan)] text-[var(--void-black)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={20} />
            Send Message
          </>
        )}
      </button>
      
      {/* Status messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle size={20} />
          Message sent successfully!
        </div>
      )}
      
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          Failed to send. Please try again.
        </div>
      )}
    </form>
  );
}