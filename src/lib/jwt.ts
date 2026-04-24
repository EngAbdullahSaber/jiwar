import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: number;
  roleId: number;
  userType: string;
  iat: number;
  exp: number;
  role?: {
    name: string;
    description: string;
  };
}

export const decodeAuthToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getTokenDescription = (token: string) => {
  const decoded = decodeAuthToken(token);
  if (!decoded) return "Invalid or malformed token.";

  const expiryDate = new Date(decoded.exp * 1000);
  const issuedDate = new Date(decoded.iat * 1000);

  return {
    userId: decoded.id,
    userType: decoded.userType,
    role: decoded.role?.name || "N/A",
    roleDescription: decoded.role?.description || "N/A",
    issuedAt: issuedDate.toLocaleString(),
    expiresAt: expiryDate.toLocaleString(),
    isExpired: expiryDate < new Date(),
    remainingTime: Math.max(0, Math.floor((expiryDate.getTime() - Date.now()) / 1000 / 60)) + " minutes",
  };
};
