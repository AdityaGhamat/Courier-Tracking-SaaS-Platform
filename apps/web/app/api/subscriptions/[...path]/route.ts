import { createProxy } from "@/lib/proxy";
export const { GET, POST, PUT, PATCH, DELETE } = createProxy("subscriptions");
