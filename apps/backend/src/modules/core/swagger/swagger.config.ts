import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Change Networks API",
      version: "1.0.0",
      description: "Logistics & Shipment Management Platform API",
    },
    servers: [
      {
        url: process.env.API_URL ?? "http://localhost:5000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session_key",
        },
      },
      schemas: {
        // =====================
        // Auth
        // =====================
        RegisterTenantInput: {
          type: "object",
          required: ["name", "email", "password", "workspaceName"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "StrongPass123!" },
            workspaceName: { type: "string", example: "Acme Logistics" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "StrongPass123!" },
          },
        },
        // =====================
        // Shipment
        // =====================
        CreateShipmentInput: {
          type: "object",
          required: [
            "recipientName",
            "recipientAddress",
            "recipientPhone",
            "weight",
          ],
          properties: {
            recipientName: { type: "string", example: "Jane Smith" },
            recipientAddress: {
              type: "string",
              example: "123 Main St, Mumbai",
            },
            recipientPhone: { type: "string", example: "+919876543210" },
            recipientEmail: { type: "string", example: "jane@example.com" },
            weight: { type: "number", example: 2.5 },
            estimatedDelivery: { type: "string", example: "2026-04-20" },
          },
        },
        UpdateShipmentStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: [
                "label_created",
                "in_transit",
                "out_for_delivery",
                "delivered",
                "failed",
              ],
            },
            location: { type: "string", example: "Mumbai Hub" },
            description: { type: "string", example: "Package arrived at hub" },
          },
        },
        AssignAgentInput: {
          type: "object",
          required: ["agentId"],
          properties: {
            agentId: { type: "string", example: "uuid-of-agent" },
          },
        },
        // =====================
        // Common
        // =====================
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            statusCode: { type: "number", example: 200 },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            statusCode: { type: "number", example: 400 },
            message: { type: "string", example: "Bad Request" },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/modules/**/*.router.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
