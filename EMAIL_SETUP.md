# Email Notification Setup for WASPY

This guide explains how to set up email notifications for contact form and demo request submissions that will be sent to `rakesh@unquest.ai`.

## 🚀 Quick Setup

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (includes 3,000 emails/month free)
3. Go to **API Keys** in your dashboard
4. Click **Create API Key**
5. Give it a name like "WASPY Production"
6. Copy the API key (starts with `re_`)

### 2. Domain Verification

**Important**: For production emails to work reliably, you need to verify your domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain `unquest.ai`
3. Follow the DNS verification steps
4. Wait for verification (usually 5-10 minutes)

> **Note**: Without domain verification, emails may be marked as spam or not delivered.

### 3. Environment Variables

Add the following to your environment:

**Local Development** (`.env.local`):

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

**Vercel Production**:

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_your_actual_api_key_here`
   - **Environment**: Production, Preview, Development

## 📧 How It Works

### Contact Form Submissions

When someone submits the contact form:

- ✅ Data is saved to database
- ✅ **Admin notification** sent to `rakesh@unquest.ai`
- ✅ **User confirmation** sent to the submitter
- ✅ Beautiful HTML templates for both emails
- ✅ Direct reply functionality

### Demo Request Submissions

When someone requests a demo:

- ✅ Data is saved to database
- ✅ **Priority admin notification** sent to `rakesh@unquest.ai`
- ✅ **User confirmation** sent to the requester
- ✅ Includes company details and use case
- ✅ Quick action buttons for admin response
- ✅ Professional confirmation for user

## 🛠️ Email Templates

The system includes four professional email templates:

### Admin Notification Templates

1. **Contact Form Notification**

   - Clean design with contact details
   - Message content preserved with formatting
   - Direct reply capability
   - Timestamp information

2. **Demo Request Notification**
   - High-priority styling
   - Company and use case details
   - Quick action buttons
   - Lead scoring context
   - Phone number (if provided)

### User Confirmation Templates

1. **Contact Form Confirmation**

   - Thank you message
   - Copy of submitted message
   - Next steps and response time
   - Links to explore platform
   - Professional branding

2. **Demo Request Confirmation**
   - Confirmation badge
   - Request summary
   - What happens next timeline
   - Call-to-action buttons
   - Platform benefits overview

## 📱 Production Deployment

### Vercel Deployment Steps

1. **Set Environment Variable**:

   ```bash
   vercel env add RESEND_API_KEY
   # Enter your API key when prompted
   ```

2. **Deploy**:

   ```bash
   vercel --prod
   ```

3. **Verify**:
   - Test contact form on production
   - Check email delivery
   - Monitor Vercel logs for any errors

### Environment Variable Verification

Check if the variable is set correctly:

```bash
vercel env ls
```

## 🔧 Troubleshooting

### Common Issues

1. **"RESEND_API_KEY environment variable is required"**

   - Ensure the environment variable is set in Vercel
   - Redeploy after adding the variable

2. **Emails not being delivered**

   - Verify your domain in Resend dashboard
   - Check Resend logs for delivery status
   - Ensure API key has sending permissions

3. **Emails going to spam**
   - Complete domain verification
   - Set up SPF/DKIM records (handled by Resend)
   - Use verified sender domain

### Debug Mode

To check email functionality locally:

```bash
# In client directory
npm run dev

# Check console logs for email success/failure
# Test both contact form and demo request
```

### Monitoring

1. **Resend Dashboard**: Monitor email delivery, opens, clicks
2. **Vercel Logs**: Check for API errors
3. **Database**: Verify form submissions are saved

## 🎯 Testing

### Local Testing

```bash
cd client
npm run dev
```

1. Go to contact form
2. Submit a test message
3. Check console for "Contact form notification sent successfully"
4. Check Resend dashboard for delivery

### Production Testing

1. Submit real form on production site
2. Check email delivery to `rakesh@unquest.ai`
3. Verify email formatting and links work

## 💰 Pricing

### Resend Pricing (2024)

- **Free**: 3,000 emails/month
- **Pro**: $20/month for 50,000 emails
- **Business**: $80/month for 200,000 emails

For WASPY's expected volume, the free tier should be sufficient initially.

## 🔐 Security

- ✅ API key stored securely in environment variables
- ✅ Email sending doesn't block form submission
- ✅ Error handling prevents API failures
- ✅ No sensitive data logged
- ✅ Rate limiting handled by Resend

## 📊 Analytics

Resend provides built-in analytics:

- Delivery rates
- Open rates
- Click tracking
- Bounce handling
- Spam reporting

## 🚀 Next Steps

After setup:

1. Test both forms thoroughly
2. Monitor initial email delivery
3. Set up email templates customization if needed
4. Consider adding auto-responders for form submissions
5. Implement email notification preferences

---

**Support**: If you encounter any issues, check Resend documentation or contact their support team.
