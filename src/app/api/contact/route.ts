import { NextRequest, NextResponse } from 'next/server';

// Contact form API route
// Option 1: Use Web3Forms (free, no backend needed)
// Option 2: Use Resend, SendGrid, or other email service
// Option 3: Store in database

const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || '';
const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'your-email@example.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Option 1: Web3Forms (free service, no backend needed)
    if (WEB3FORMS_ACCESS_KEY) {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
          subject: `Portfolio Contact: ${name}`,
          from_name: 'Portfolio Website',
        }),
      });

      const result = await response.json();

      if (result.success) {
        return NextResponse.json({ success: true, message: 'Message sent successfully!' });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    }

    // Option 2: If no Web3Forms key, log to console (for development)
    // In production, you should use a proper email service
    console.log('=== New Contact Form Submission ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('================================');

    // For demo purposes, we'll return success
    // In production, integrate with your preferred email service
    return NextResponse.json({ 
      success: true, 
      message: 'Message received! (Demo mode - configure email service for production)' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
