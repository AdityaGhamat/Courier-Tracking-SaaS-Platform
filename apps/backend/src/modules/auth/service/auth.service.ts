import { db } from "../../core/database";
import { users, workspaces } from "../../core/database/schema";
import { eq } from "drizzle-orm";
import passwordLib from "../utility/password";
import Cookie from "../utility/cookie"; // <-- Import your custom Cookie library
import {
  RegisterTenantAdminInput,
  LoginInput,
  RegisterAgentInput,
  RegisterCustomerInput,
} from "../validation/auth.validation";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../core/errors/http.errors";
import cookie from "../utility/cookie";

class AuthService {
  async registerTenant(data: RegisterTenantAdminInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    return await db.transaction(async (tx: any) => {
      const hashedPassword = await passwordLib.hashPassword(data.password);

      const [newUser] = await tx
        .insert(users)
        .values({
          name: data.adminName,
          email: data.email,
          password: hashedPassword,
          role: "admin",
        })
        .returning();

      const [newWorkspace] = await tx
        .insert(workspaces)
        .values({
          name: data.companyName,
          ownerId: newUser.id,
        })
        .returning();

      await tx
        .update(users)
        .set({ workspaceId: newWorkspace.id })
        .where(eq(users.id, newUser.id));

      const { password: _, ...safeUser } = newUser;
      safeUser.workspaceId = newWorkspace.id;

      const payload = {
        id: safeUser.id,
        role: safeUser.role,
        workspaceId: safeUser.workspaceId,
      };

      const tokens = await Cookie.generateCookie(payload as any);

      return { tokens, user: safeUser, workspace: newWorkspace };
    });
  }

  async login(data: LoginInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isMatch = await passwordLib.verifyPassword(
      data.password,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestError("Invalid email or password");
    }

    const payload = {
      id: user.id,
      role: user.role,
      workspaceId: user.workspaceId,
    };

    const tokens = await Cookie.generateCookie(payload as any);

    const { password: _, ...safeUser } = user;

    return { tokens, user: safeUser };
  }

  async registerCustomer(data: RegisterCustomerInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    const hashedPassword = await passwordLib.hashPassword(data.password);

    const [newCustomer] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "customer",
      })
      .returning();

    const { password: _, ...safeCustomer } = newCustomer;

    const payload = {
      id: safeCustomer.id,
      role: safeCustomer.role,
      workspaceId: safeCustomer.workspaceId,
    };

    const tokens = await cookie.generateCookie(payload as any);

    return { tokens, user: safeCustomer };
  }

  async registerAgent(data: RegisterAgentInput, adminWorkspaceId: string) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    const hashedPassword = await passwordLib.hashPassword(data.password);

    const [newAgent] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "delivery_agent",
        workspaceId: adminWorkspaceId,
      })
      .returning();
    const { password: _, ...safeAgent } = newAgent;
    return safeAgent;
  }

  async refreshSession(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required");
    }

    try {
      const decoded = cookie.verifyRefreshCookie(refreshToken) as any;

      const payload = {
        id: decoded.id,
        role: decoded.role,
        workspaceId: decoded.workspaceId,
      };

      const tokens = await cookie.generateCookie(payload as any);

      return tokens;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }
}

export const authService = new AuthService();
