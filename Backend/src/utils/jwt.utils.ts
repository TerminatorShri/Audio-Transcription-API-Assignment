import jwt, { SignOptions, Secret } from "jsonwebtoken";
import envConfig from "./envConfig";

const JWT_SECRET: Secret = envConfig.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined in the environment configuration."
  );
}

export const signToken = (
  payload: string | object | Buffer,
  expiresIn: string | number = "7d"
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
