import { notificationQueue } from "../queue/jobs.queue";
import { JobName, JobPayloadMap } from "../types/jobs.types";

class JobService {
  async enqueue<T extends JobName>(name: T, payload: JobPayloadMap[T]) {
    await notificationQueue.add(name, payload);
  }
}

export const jobService = new JobService();
