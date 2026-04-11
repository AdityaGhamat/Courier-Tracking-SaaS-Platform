import { resend, FROM_EMAIL } from "./provider/resend.provider";
import { emailTemplates } from "./templates/index";

class NotificationService {
  private async sendEmail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      });

      if (error) {
        console.error(`[Notification] Failed to send email to ${to}:`, error);
        return null;
      }

      return data;
    } catch (err) {
      console.error(`[Notification] Unexpected error sending to ${to}:`, err);
      return null;
    }
  }

  async notifyShipmentCreated(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      senderName: string;
    },
  ) {
    const { subject, html } = emailTemplates.shipmentCreated(data);
    return this.sendEmail(to, subject, html);
  }

  async notifyStatusUpdated(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      status: string;
      location: string;
      description: string;
      timestamp: Date;
    },
  ) {
    const { subject, html } = emailTemplates.statusUpdated(data);
    return this.sendEmail(to, subject, html);
  }

  async notifyAgentAssigned(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      agentName: string;
    },
  ) {
    const { subject, html } = emailTemplates.agentAssigned(data);
    return this.sendEmail(to, subject, html);
  }

  async notifyOutForDelivery(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      agentName: string;
      estimatedDelivery?: Date;
    },
  ) {
    const { subject, html } = emailTemplates.outForDelivery(data);
    return this.sendEmail(to, subject, html);
  }

  async notifyDelivered(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      timestamp: Date;
    },
  ) {
    const { subject, html } = emailTemplates.delivered(data);
    return this.sendEmail(to, subject, html);
  }

  async notifyDeliveryFailed(
    to: string,
    data: {
      recipientName: string;
      trackingNumber: string;
      reason: string;
      timestamp: Date;
    },
  ) {
    const { subject, html } = emailTemplates.deliveryFailed(data);
    return this.sendEmail(to, subject, html);
  }
}

export const notificationService = new NotificationService();
