import { JwtPayload } from "jsonwebtoken";

export interface IToken extends JwtPayload {
  [key: string]: any;
}
