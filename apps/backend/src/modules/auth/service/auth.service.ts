import { db } from "../../core/database";
import { users, workspaces } from "../../core/database/schema";
import { eq } from "drizzle-orm";
import passwordLib from "../utility/password";
import Cookie from "../utility/cookie"; // <-- Import your custom Cookie library
import {
  RegisterTenantAdminInput,
  LoginInput,
  RegisterAgentInput,
} from "../validation/auth.validation";
import { BadRequestError } from "../../core/errors/http.errors";

class AuthService {
  async registerTenant(data: RegisterTenantAdminInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      throw new BadRequestError("User with this email already exists");
    }

    return await db.transaction(async (tx: any) => {
      const [newWorkspace] = await tx
        .insert(workspaces)
        .values({
          name: data.companyName,
        })
        .returning();

      const hashedPassword = await passwordLib.hashPassword(data.password);

      const [newUser] = await tx
        .insert(users)
        .values({
          name: data.adminName,
          email: data.email,
          password: hashedPassword,
          role: "courier_admin",
          workspaceId: newWorkspace.id,
        })
        .returning();

      const { password: _, ...safeUser } = newUser;

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
}

export const authService = new AuthService();
