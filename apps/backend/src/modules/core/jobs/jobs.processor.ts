import { Worker, Job } from "bullmq";
import { redisConnection } from "./queue/jobs.queue";
import { notificationService } from "../../notification/notification.service";
import { JobName, JobPayloadMap } from "./types/jobs.types";

const worker = new Worker(
  "notifications",
  async (job: Job<JobPayloadMap[JobName]>) => {
    const { name, data } = job;

    switch (name as JobName) {
      case "send.shipment_created":
        await notificationService.notifyShipmentCreated(
          data.recipientEmail,
          data as JobPayloadMap["send.shipment_created"],
        );
        break;

      case "send.status_updated":
        await notificationService.notifyStatusUpdated(data.recipientEmail, {
          ...(data as JobPayloadMap["send.status_updated"]),
          location:
            (data as JobPayloadMap["send.status_updated"]).location ?? "",
          description:
            (data as JobPayloadMap["send.status_updated"]).description ?? "",
        });
        break;

      case "send.out_for_delivery":
        await notificationService.notifyOutForDelivery(
          data.recipientEmail,
          data as JobPayloadMap["send.out_for_delivery"],
        );
        break;

      case "send.delivered":
        await notificationService.notifyDelivered(
          data.recipientEmail,
          data as JobPayloadMap["send.delivered"],
        );
        break;

      case "send.delivery_failed":
        await notificationService.notifyDeliveryFailed(
          data.recipientEmail,
          data as JobPayloadMap["send.delivery_failed"],
        );
        break;

      case "send.agent_assigned":
        await notificationService.notifyAgentAssigned(
          data.recipientEmail,
          data as JobPayloadMap["send.agent_assigned"],
        );
        break;

      default:
        console.warn(`[BullMQ] Unknown job: ${name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`[BullMQ] ✅ Job ${job.name} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[BullMQ] ❌ Job ${job?.name} failed:`, err.message);
});

export default worker;
