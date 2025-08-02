import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is required");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormEmailData {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

interface DemoRequestEmailData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  useCase: string;
  submittedAt: string;
}

export async function sendContactFormNotification(data: ContactFormEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "WASPY <noreply@unquest.ai>",
      to: ["rakesh@unquest.ai"],
      subject: `New Contact Form Submission - ${data.name}`,
      html: generateContactFormEmailHTML(data),
    });

    if (error) {
      console.error("Failed to send contact form notification:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    return result;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

export async function sendDemoRequestNotification(data: DemoRequestEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "WASPY <noreply@unquest.ai>",
      to: ["rakesh@unquest.ai"],
      subject: `New Demo Request - ${data.company} (${data.name})`,
      html: generateDemoRequestEmailHTML(data),
    });

    if (error) {
      console.error("Failed to send demo request notification:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    return result;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

export async function sendContactFormConfirmation(data: ContactFormEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "WASPY <hello@unquest.ai>",
      to: [data.email],
      subject: "Thank you for contacting WASPY - We'll be in touch soon!",
      html: generateContactConfirmationEmailHTML(data),
    });

    if (error) {
      console.error("Failed to send contact confirmation:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    return result;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

export async function sendDemoRequestConfirmation(data: DemoRequestEmailData) {
  try {
    const { data: result, error } = await resend.emails.send({
      from: "WASPY <hello@unquest.ai>",
      to: [data.email],
      subject: "Demo Request Confirmed - WASPY AI Platform",
      html: generateDemoRequestConfirmationEmailHTML(data),
    });

    if (error) {
      console.error("Failed to send demo request confirmation:", error);
      throw new Error(`Email sending failed: ${error.message}`);
    }

    return result;
  } catch (error) {
    console.error("Email service error:", error);
    throw error;
  }
}

function generateContactFormEmailHTML(data: ContactFormEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: center;
        }
        .field {
          margin-bottom: 20px;
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        .label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        .value {
          color: #6b7280;
        }
        .message-box {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .timestamp {
          background-color: #eff6ff;
          color: #1d4ed8;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Someone has submitted a contact form on WASPY</p>
        </div>

        <div class="field">
          <div class="label">👤 Name:</div>
          <div class="value">${data.name}</div>
        </div>

        <div class="field">
          <div class="label">📧 Email:</div>
          <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>

        <div class="field">
          <div class="label">💬 Message:</div>
          <div class="message-box">${data.message}</div>
        </div>

        <div class="field">
          <div class="label">🕒 Submitted At:</div>
          <div class="timestamp">${data.submittedAt}</div>
        </div>

        <div class="footer">
          <p>This notification was automatically generated by WASPY</p>
          <p><strong>Reply directly to this email to respond to the contact inquiry</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateDemoRequestEmailHTML(data: DemoRequestEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Demo Request</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 24px;
          text-align: center;
        }
        .field {
          margin-bottom: 20px;
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 8px;
          border-left: 4px solid #059669;
        }
        .label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 4px;
        }
        .value {
          color: #6b7280;
        }
        .use-case-box {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .timestamp {
          background-color: #ecfdf5;
          color: #065f46;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          display: inline-block;
        }
        .priority-tag {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .action-buttons {
          margin-top: 24px;
          text-align: center;
        }
        .btn {
          display: inline-block;
          padding: 12px 24px;
          margin: 0 8px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
        }
        .btn-primary {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
        }
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Demo Request</h1>
          <div class="priority-tag">High Priority Lead</div>
          <p>A potential enterprise client has requested a demo</p>
        </div>

        <div class="field">
          <div class="label">👤 Contact Person:</div>
          <div class="value">${data.name}</div>
        </div>

        <div class="field">
          <div class="label">📧 Email:</div>
          <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>

        <div class="field">
          <div class="label">🏢 Company:</div>
          <div class="value">${data.company}</div>
        </div>

        ${
          data.phone
            ? `
        <div class="field">
          <div class="label">📞 Phone:</div>
          <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
        </div>
        `
            : ""
        }

        <div class="field">
          <div class="label">💡 Use Case:</div>
          <div class="use-case-box">${data.useCase}</div>
        </div>

        <div class="field">
          <div class="label">🕒 Requested At:</div>
          <div class="timestamp">${data.submittedAt}</div>
        </div>

        <div class="action-buttons">
          <a href="mailto:${data.email}?subject=Re: Demo Request - WASPY AI Platform&body=Hi ${data.name},%0D%0A%0D%0AThank you for your interest in WASPY! I'd be happy to schedule a personalized demo for ${data.company}.%0D%0A%0D%0ABest regards,%0D%0ARakesh" class="btn btn-primary">
            📧 Reply to Lead
          </a>
          <a href="https://calendly.com/your-calendar-link" class="btn btn-secondary">
            📅 Schedule Demo
          </a>
        </div>

        <div class="footer">
          <p><strong>⚡ Action Required: This is a qualified lead requesting a demo</strong></p>
          <p>Recommended response time: Within 2 hours for best conversion</p>
          <p>This notification was automatically generated by WASPY</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateContactConfirmationEmailHTML(
  data: ContactFormEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting WASPY</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 32px 24px;
          border-radius: 8px;
          margin-bottom: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
        }
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          text-align: center;
          margin-bottom: 32px;
        }
        .content h2 {
          color: #1f2937;
          margin-bottom: 16px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 16px;
        }
        .message-preview {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
          text-align: left;
        }
        .message-preview h3 {
          margin-top: 0;
          color: #374151;
          font-size: 16px;
        }
        .message-content {
          color: #6b7280;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .cta-section {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin: 32px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 8px 8px 8px;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-1px);
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }
        .feature {
          text-align: center;
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
        }
        .feature-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .footer a {
          color: #3b82f6;
          text-decoration: none;
        }
        .contact-info {
          background-color: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .contact-info h3 {
          color: #1e40af;
          margin-top: 0;
        }
        .contact-info p {
          color: #1e40af;
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You, ${data.name}! 🙏</h1>
          <p>We've received your message and will get back to you soon</p>
        </div>

        <div class="content">
          <h2>What happens next?</h2>
          <p>Our team will review your message and respond within <strong>24 hours</strong> during business days.</p>
          
          <div class="message-preview">
            <h3>📝 Your Message (for your records):</h3>
            <div class="message-content">${data.message}</div>
          </div>
        </div>

        <div class="cta-section">
          <h3>While you wait, explore WASPY's capabilities:</h3>
          <a href="https://waspy.unquest.ai/demo.mp4" class="cta-button">
            🎥 Watch Demo Video
          </a>
          <a href="https://waspy.unquest.ai/" class="cta-button">
            🚀 Explore Platform
          </a>
        </div>

        <div class="features">
          <div class="feature">
            <div class="feature-icon">🤖</div>
            <h4>AI-Powered Automation</h4>
            <p>24/7 intelligent customer support</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📊</div>
            <h4>Advanced Analytics</h4>
            <p>Real-time insights and reporting</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🔒</div>
            <h4>Enterprise Security</h4>
            <p>Bank-grade security & compliance</p>
          </div>
        </div>

        <div class="contact-info">
          <h3>Need immediate assistance?</h3>
          <p>📧 Email: rakesh@unquest.ai</p>
          <p>🌐 Website: waspy.unquest.ai</p>
          <p>⏰ Response time: Within 24 hours</p>
        </div>

        <div class="footer">
          <p>This email was sent because you contacted us through our website.</p>
          <p>
            <a href="https://waspy.unquest.ai/privacy">Privacy Policy</a> |
            <a href="https://waspy.unquest.ai/terms">Terms of Service</a>
          </p>
          <p>© 2025 WASPY. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateDemoRequestConfirmationEmailHTML(
  data: DemoRequestEmailData
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Demo Request Confirmed - WASPY</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 32px 24px;
          border-radius: 8px;
          margin-bottom: 32px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
        }
        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .success-badge {
          background: #d1fae5;
          color: #065f46;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 16px;
        }
        .content {
          text-align: center;
          margin-bottom: 32px;
        }
        .content h2 {
          color: #1f2937;
          margin-bottom: 16px;
        }
        .content p {
          color: #6b7280;
          margin-bottom: 16px;
        }
        .request-summary {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          text-align: left;
        }
        .request-summary h3 {
          margin-top: 0;
          color: #374151;
          font-size: 16px;
        }
        .summary-field {
          margin-bottom: 12px;
        }
        .summary-label {
          font-weight: 600;
          color: #374151;
        }
        .summary-value {
          color: #6b7280;
        }
        .use-case-content {
          background-color: #f3f4f6;
          border-radius: 6px;
          padding: 12px;
          margin-top: 8px;
          white-space: pre-wrap;
          font-family: inherit;
        }
        .next-steps {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 12px;
          padding: 24px;
          margin: 32px 0;
        }
        .next-steps h3 {
          color: #92400e;
          margin-top: 0;
        }
        .next-steps ul {
          color: #92400e;
          margin: 16px 0;
          padding-left: 20px;
        }
        .next-steps li {
          margin-bottom: 8px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 8px 8px 8px;
          transition: transform 0.2s;
        }
        .cta-button:hover {
          transform: translateY(-1px);
        }
        .secondary-button {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        .benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 32px 0;
        }
        .benefit {
          text-align: center;
          padding: 20px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .benefit-icon {
          font-size: 24px;
          margin-bottom: 12px;
        }
        .footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .footer a {
          color: #059669;
          text-decoration: none;
        }
        .contact-info {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 8px;
          padding: 20px;
          margin: 24px 0;
        }
        .contact-info h3 {
          color: #065f46;
          margin-top: 0;
        }
        .contact-info p {
          color: #065f46;
          margin: 8px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-badge">✅ Demo Request Confirmed</div>
          <h1>We're excited to show you WASPY! 🚀</h1>
          <p>Your demo request has been received and prioritized</p>
        </div>

        <div class="content">
          <h2>Thank you, ${data.name}!</h2>
          <p>We'll reach out within <strong>2 hours</strong> to schedule your personalized demo for <strong>${data.company}</strong>.</p>
        </div>

        <div class="request-summary">
          <h3>📋 Your Demo Request Summary:</h3>
          <div class="summary-field">
            <span class="summary-label">Company:</span>
            <span class="summary-value">${data.company}</span>
          </div>
          <div class="summary-field">
            <span class="summary-label">Contact:</span>
            <span class="summary-value">${data.name} (${data.email})</span>
          </div>
          ${
            data.phone
              ? `
          <div class="summary-field">
            <span class="summary-label">Phone:</span>
            <span class="summary-value">${data.phone}</span>
          </div>
          `
              : ""
          }
          <div class="summary-field">
            <span class="summary-label">Use Case:</span>
            <div class="use-case-content">${data.useCase}</div>
          </div>
        </div>

        <div class="next-steps">
          <h3>🎯 What Happens Next?</h3>
          <ul>
            <li><strong>Within 2 hours:</strong> Our team will contact you to schedule the demo</li>
            <li><strong>Demo Duration:</strong> 30-45 minutes tailored to your use case</li>
            <li><strong>What You'll See:</strong> Live platform walkthrough, use case scenarios, Q&A session</li>
            <li><strong>Follow-up:</strong> Custom proposal and implementation timeline</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://waspy.unquest.ai/demo.mp4" class="cta-button">
            🎥 Watch Preview Demo
          </a>
          <a href="https://waspy.unquest.ai/" class="cta-button secondary-button">
            📚 Explore Platform
          </a>
        </div>

        <div class="benefits">
          <div class="benefit">
            <div class="benefit-icon">⚡</div>
            <h4>Instant Setup</h4>
            <p>Get started in minutes, not months</p>
          </div>
          <div class="benefit">
            <div class="benefit-icon">💰</div>
            <h4>ROI Focused</h4>
            <p>Reduce support costs by up to 60%</p>
          </div>
          <div class="benefit">
            <div class="benefit-icon">🏢</div>
            <h4>Enterprise Ready</h4>
            <p>99.9% uptime with enterprise security</p>
          </div>
        </div>

        <div class="contact-info">
          <h3>Questions before the demo?</h3>
          <p>📧 Email: rakesh@unquest.ai</p>
          <p>🌐 Website: waspy.unquest.ai</p>
          <p>⏰ We'll contact you within 2 hours during business hours</p>
        </div>

        <div class="footer">
          <p><strong>Thank you for choosing WASPY for your WhatsApp automation needs!</strong></p>
          <p>
            <a href="https://waspy.unquest.ai/privacy">Privacy Policy</a> |
            <a href="https://waspy.unquest.ai/terms">Terms of Service</a>
          </p>
          <p>© 2025 WASPY. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
