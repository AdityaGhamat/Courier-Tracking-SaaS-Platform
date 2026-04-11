export const emailTemplates = {
  shipmentCreated: (data: {
    recipientName: string;
    trackingNumber: string;
    senderName: string;
  }) => ({
    subject: `Shipment Created — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01696f;">Shipment Label Created</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>A shipment has been created for you by <strong>${data.senderName}</strong>.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;">Tracking Number:</p>
          <h3 style="margin: 4px 0; color: #01696f; letter-spacing: 2px;">${data.trackingNumber}</h3>
        </div>
        <p>You can track your shipment anytime using the tracking number above.</p>
      </div>
    `,
  }),

  statusUpdated: (data: {
    recipientName: string;
    trackingNumber: string;
    status: string;
    location: string;
    description: string;
    timestamp: Date;
  }) => ({
    subject: `Shipment Update — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01696f;">Shipment Status Updated</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>Your shipment <strong>${data.trackingNumber}</strong> has been updated.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Status:</strong> ${data.status.replace(/_/g, " ").toUpperCase()}</p>
          <p style="margin: 0 0 8px;"><strong>Location:</strong> ${data.location}</p>
          <p style="margin: 0 0 8px;"><strong>Details:</strong> ${data.description}</p>
          <p style="margin: 0; color: #7a7974; font-size: 13px;">${data.timestamp.toUTCString()}</p>
        </div>
      </div>
    `,
  }),

  agentAssigned: (data: {
    recipientName: string;
    trackingNumber: string;
    agentName: string;
  }) => ({
    subject: `Delivery Agent Assigned — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01696f;">Delivery Agent Assigned</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>A delivery agent has been assigned to your shipment <strong>${data.trackingNumber}</strong>.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Agent:</strong> ${data.agentName}</p>
        </div>
        <p>Your shipment is on its way to being delivered!</p>
      </div>
    `,
  }),

  outForDelivery: (data: {
    recipientName: string;
    trackingNumber: string;
    agentName: string;
    estimatedDelivery?: Date;
  }) => ({
    subject: `Out for Delivery — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01696f;">🚚 Your Shipment Is Out for Delivery!</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>Your shipment <strong>${data.trackingNumber}</strong> is out for delivery today.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Delivery Agent:</strong> ${data.agentName}</p>
          ${
            data.estimatedDelivery
              ? `<p style="margin: 0;"><strong>Expected By:</strong> ${data.estimatedDelivery.toDateString()}</p>`
              : ""
          }
        </div>
        <p>Please ensure someone is available to receive the package.</p>
      </div>
    `,
  }),

  delivered: (data: {
    recipientName: string;
    trackingNumber: string;
    timestamp: Date;
  }) => ({
    subject: `Delivered ✅ — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #437a22;">✅ Shipment Delivered!</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>Your shipment <strong>${data.trackingNumber}</strong> has been successfully delivered.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Delivered at:</strong> ${data.timestamp.toUTCString()}</p>
        </div>
        <p>Thank you for using our service!</p>
      </div>
    `,
  }),

  deliveryFailed: (data: {
    recipientName: string;
    trackingNumber: string;
    reason: string;
    timestamp: Date;
  }) => ({
    subject: `Delivery Failed — ${data.trackingNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a12c7b;">⚠️ Delivery Attempt Failed</h2>
        <p>Hi <strong>${data.recipientName}</strong>,</p>
        <p>We were unable to deliver your shipment <strong>${data.trackingNumber}</strong>.</p>
        <div style="background: #f7f6f2; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 8px;"><strong>Reason:</strong> ${data.reason}</p>
          <p style="margin: 0; color: #7a7974; font-size: 13px;">${data.timestamp.toUTCString()}</p>
        </div>
        <p>Our team will attempt redelivery. Please ensure someone is available.</p>
      </div>
    `,
  }),
};
