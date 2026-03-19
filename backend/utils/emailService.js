const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send enrollment confirmation + invoice email to student
 */
exports.sendEnrollmentInvoice = async ({ studentName, studentEmail, className, chefName, price, paymentId, enrolledAt }) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Georgia', serif; background: #FAF7F4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(107,79,58,0.08); }
        .header { background: #6B4F3A; padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header p  { color: rgba(255,255,255,0.6); margin: 8px 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #6B4F3A; margin-bottom: 8px; }
        .sub { color: #8B7355; font-size: 14px; margin-bottom: 32px; }
        .invoice-box { background: #FAF7F4; border-radius: 16px; padding: 28px; margin-bottom: 28px; }
        .invoice-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8B7355; margin-bottom: 20px; font-weight: bold; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1EDE9; }
        .row:last-child { border-bottom: none; }
        .key   { color: #8B7355; font-size: 13px; }
        .value { color: #6B4F3A; font-size: 13px; font-weight: bold; }
        .total-row { background: #6B4F3A; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; margin-top: 20px; }
        .total-key   { color: rgba(255,255,255,0.7); font-size: 13px; }
        .total-value { color: #fff; font-size: 18px; font-weight: bold; }
        .footer { background: #FAF7F4; padding: 28px 40px; text-align: center; }
        .footer p { color: #8B7355; font-size: 12px; margin: 0; }
        .badge { display: inline-block; background: #8FBF9F20; color: #3D8B5E; padding: 6px 18px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; border: 1px solid #8FBF9F40; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍳 Poonam Cooking Classes</h1>
          <p>Enrollment Confirmation & Invoice</p>
        </div>
        <div class="body">
          <span class="badge">✓ Payment Confirmed</span>
          <p class="greeting">Dear ${studentName},</p>
          <p class="sub">Thank you for enrolling! Here's your payment receipt and enrollment confirmation.</p>

          <div class="invoice-box">
            <p class="invoice-title">Invoice Details</p>
            <div class="row">
              <span class="key">Class</span>
              <span class="value">${className}</span>
            </div>
            <div class="row">
              <span class="key">Chef / Instructor</span>
              <span class="value">${chefName}</span>
            </div>
            <div class="row">
              <span class="key">Payment ID</span>
              <span class="value">${paymentId}</span>
            </div>
            <div class="row">
              <span class="key">Enrolled On</span>
              <span class="value">${new Date(enrolledAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="total-row">
              <span class="total-key">Amount Paid</span>
              <span class="total-value">₹${price}</span>
            </div>
          </div>

          <p style="color: #8B7355; font-size: 13px;">
            You can now access your class materials from your <strong>Student Dashboard</strong>. 
            If you have any questions, please reply to this email.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Poonam Cooking Classes. All rights reserved.</p>
          <p style="margin-top: 6px;">This is an auto-generated invoice. Please keep it for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Poonam Cooking Classes" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `✅ Enrollment Confirmed — ${className}`,
    html: htmlContent,
  });
};

/**
 * Send note/resource notification to student
 */
exports.sendNoteNotification = async ({ studentName, studentEmail, noteTitle, className, fileURL }) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Georgia', serif; background: #FAF7F4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(107,79,58,0.08); }
        .header { background: #8FBF9F; padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: 2px; }
        .body { padding: 40px; }
        .btn { display: inline-block; background: #6B4F3A; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; font-weight: bold; letter-spacing: 1px; margin-top: 24px; }
        .footer { background: #FAF7F4; padding: 20px 40px; text-align: center; }
        .footer p { color: #8B7355; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 New Study Material</h1>
        </div>
        <div class="body">
          <p style="font-size: 18px; color: #6B4F3A;">Hello ${studentName},</p>
          <p style="color: #8B7355; font-size: 14px;">
            A new study material has been uploaded for your class <strong>${className}</strong>.
          </p>
          <p style="color: #6B4F3A;"><strong>📝 ${noteTitle}</strong></p>
          <a href="${fileURL}" class="btn">Download Material</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Poonam Cooking Classes. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Poonam Cooking Classes" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `📄 New Study Material: ${noteTitle} — ${className}`,
    html: htmlContent,
  });
};

/**
 * Send certificate email to student
 */
exports.sendCertificateEmail = async ({ studentName, studentEmail, className, certificateURL, issuedAt }) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Georgia', serif; background: #FAF7F4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(107,79,58,0.08); }
        .header { background: linear-gradient(135deg, #6B4F3A, #8B7355); padding: 50px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header .icon { font-size: 48px; margin-bottom: 16px; }
        .body { padding: 40px; text-align: center; }
        .congrats { font-size: 24px; color: #6B4F3A; margin-bottom: 8px; }
        .sub { color: #8B7355; font-size: 14px; margin-bottom: 32px; }
        .highlight { background: #FAF7F4; border-radius: 16px; padding: 24px; margin-bottom: 28px; border-left: 4px solid #6B4F3A; text-align: left; }
        .btn { display: inline-block; background: #6B4F3A; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 14px; font-weight: bold; letter-spacing: 1px; }
        .footer { background: #FAF7F4; padding: 24px 40px; text-align: center; }
        .footer p { color: #8B7355; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">🏆</div>
          <h1>Certificate of Completion</h1>
        </div>
        <div class="body">
          <p class="congrats">Congratulations, ${studentName}!</p>
          <p class="sub">You have successfully completed the course and earned your certificate.</p>
          <div class="highlight">
            <p style="margin:0; color:#8B7355; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Course Completed</p>
            <p style="margin:0; color:#6B4F3A; font-size:18px; font-weight:bold;">${className}</p>
            <p style="margin:8px 0 0; color:#8B7355; font-size:12px;">Issued on ${new Date(issuedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <a href="${certificateURL}" class="btn">Download Certificate</a>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Poonam Cooking Classes. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Poonam Cooking Classes" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `🏆 Your Certificate — ${className}`,
    html: htmlContent,
  });
};

/**
 * Send catering order confirmation email
 */
exports.sendCateringConfirmation = async (order) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Georgia', serif; background: #FAF7F4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(107,79,58,0.08); }
        .header { background: #D4A574; padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header p  { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #6B4F3A; margin-bottom: 8px; }
        .sub { color: #8B7355; font-size: 14px; margin-bottom: 32px; }
        .order-box { background: #FAF7F4; border-radius: 16px; padding: 28px; margin-bottom: 28px; }
        .order-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8B7355; margin-bottom: 20px; font-weight: bold; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1EDE9; }
        .row:last-child { border-bottom: none; }
        .key   { color: #8B7355; font-size: 13px; }
        .value { color: #6B4F3A; font-size: 13px; font-weight: bold; }
        .total-row { background: #D4A574; border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; margin-top: 20px; }
        .total-key   { color: rgba(255,255,255,0.9); font-size: 13px; }
        .total-value { color: #fff; font-size: 18px; font-weight: bold; }
        .badge { display: inline-block; background: #D4A57420; color: #8B6F47; padding: 6px 18px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; border: 1px solid #D4A57440; }
        .footer { background: #FAF7F4; padding: 28px 40px; text-align: center; }
        .footer p { color: #8B7355; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ Catering Service</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="body">
          <span class="badge">✓ Order Received</span>
          <p class="greeting">Dear ${order.customerId.name},</p>
          <p class="sub">Thank you for choosing our catering service! Your order has been received and is being processed.</p>

          <div class="order-box">
            <p class="order-title">Order Details</p>
            <div class="row">
              <span class="key">Order Number</span>
              <span class="value">${order.orderNumber}</span>
            </div>
            <div class="row">
              <span class="key">Event Type</span>
              <span class="value">${order.eventType}</span>
            </div>
            <div class="row">
              <span class="key">Event Date</span>
              <span class="value">${new Date(order.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div class="row">
              <span class="key">Event Time</span>
              <span class="value">${order.eventTime}</span>
            </div>
            <div class="row">
              <span class="key">Number of Guests</span>
              <span class="value">${order.guestCount}</span>
            </div>
            <div class="row">
              <span class="key">Venue</span>
              <span class="value">${order.venue.name}</span>
            </div>
            <div class="row">
              <span class="key">Serving Style</span>
              <span class="value">${order.servingStyle}</span>
            </div>
            <div class="total-row">
              <span class="total-key">Total Amount</span>
              <span class="total-value">₹${order.pricing.totalAmount}</span>
            </div>
            <div class="row" style="margin-top: 12px;">
              <span class="key">Advance Payment Required</span>
              <span class="value" style="color: #D4A574;">₹${order.pricing.advanceAmount} (50%)</span>
            </div>
          </div>

          <p style="color: #8B7355; font-size: 13px;">
            Please complete the advance payment to confirm your order. You will receive a payment link shortly.
            For any queries, please reply to this email or call us at the venue number provided.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Poonam Cooking Classes Catering. All rights reserved.</p>
          <p style="margin-top: 6px;">This is an auto-generated confirmation. Please keep it for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Poonam Cooking Classes Catering" <${process.env.EMAIL_USER}>`,
    to: order.customerId.email,
    subject: `🍽️ Catering Order Confirmed — ${order.orderNumber}`,
    html: htmlContent,
  });
};

/**
 * Send catering order update email
 */
exports.sendCateringUpdate = async (order, updateType) => {
  const transporter = createTransporter();

  let subject, headerText, badgeText, badgeColor;

  switch (updateType) {
    case 'payment_confirmed':
      subject = `💳 Payment Confirmed — ${order.orderNumber}`;
      headerText = 'Payment Confirmed';
      badgeText = '✓ Advance Payment Received';
      badgeColor = '#8FBF9F';
      break;
    case 'status_update':
      subject = `📋 Order Update — ${order.orderNumber}`;
      headerText = 'Order Status Update';
      badgeText = `Status: ${order.status}`;
      badgeColor = '#D4A574';
      break;
    case 'cancelled':
      subject = `❌ Order Cancelled — ${order.orderNumber}`;
      headerText = 'Order Cancelled';
      badgeText = 'Order Cancelled';
      badgeColor = '#E74C3C';
      break;
    default:
      subject = `📋 Order Update — ${order.orderNumber}`;
      headerText = 'Order Update';
      badgeText = 'Update';
      badgeColor = '#D4A574';
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: 'Georgia', serif; background: #FAF7F4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 40px rgba(107,79,58,0.08); }
        .header { background: ${badgeColor}; padding: 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 28px; letter-spacing: 2px; }
        .header p  { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #6B4F3A; margin-bottom: 8px; }
        .sub { color: #8B7355; font-size: 14px; margin-bottom: 32px; }
        .update-box { background: #FAF7F4; border-radius: 16px; padding: 28px; margin-bottom: 28px; }
        .timeline-item { padding: 12px 0; border-left: 3px solid ${badgeColor}; padding-left: 20px; margin-bottom: 12px; }
        .timeline-status { font-weight: bold; color: #6B4F3A; font-size: 14px; }
        .timeline-time { color: #8B7355; font-size: 12px; }
        .timeline-notes { color: #8B7355; font-size: 13px; margin-top: 4px; }
        .badge { display: inline-block; background: ${badgeColor}20; color: ${badgeColor}; padding: 6px 18px; border-radius: 50px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px; border: 1px solid ${badgeColor}40; }
        .footer { background: #FAF7F4; padding: 28px 40px; text-align: center; }
        .footer p { color: #8B7355; font-size: 12px; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ Catering Service</h1>
          <p>${headerText}</p>
        </div>
        <div class="body">
          <span class="badge">${badgeText}</span>
          <p class="greeting">Dear ${order.customerId.name},</p>
          <p class="sub">Your catering order has been updated. Here are the latest details:</p>

          <div class="update-box">
            <p style="margin:0; color:#8B7355; font-size:11px; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px;">Order ${order.orderNumber}</p>
            
            ${order.timeline.slice(-3).map(item => `
              <div class="timeline-item">
                <div class="timeline-status">${item.status}</div>
                <div class="timeline-time">${new Date(item.timestamp).toLocaleString('en-IN', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
                ${item.notes ? `<div class="timeline-notes">${item.notes}</div>` : ''}
              </div>
            `).join('')}
          </div>

          ${updateType === 'payment_confirmed' ? `
            <p style="color: #8B7355; font-size: 13px;">
              Your advance payment of ₹${order.pricing.advanceAmount} has been received successfully. 
              Your order is now confirmed and our team will start preparation as per the schedule.
            </p>
          ` : ''}

          ${updateType === 'cancelled' ? `
            <p style="color: #8B7355; font-size: 13px;">
              ${order.cancellationReason ? `Reason: ${order.cancellationReason}` : ''}
              ${order.paymentStatus === 'Refunded' ? 'A refund has been initiated and will be processed within 5-7 business days.' : ''}
            </p>
          ` : ''}

          <p style="color: #8B7355; font-size: 13px;">
            For any queries, please reply to this email or call us at ${order.venue.contactNumber}.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Poonam Cooking Classes Catering. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Poonam Cooking Classes Catering" <${process.env.EMAIL_USER}>`,
    to: order.customerId.email,
    subject,
    html: htmlContent,
  });
};
