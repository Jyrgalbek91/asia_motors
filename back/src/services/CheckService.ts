import { NextFunction, Response, Request } from "express";
import { sendError } from "../utils/send";
import Config from "../utils/config";
import JWT from "../utils/jwt";

const returnMessage = (res: Response, message: string) =>
  sendError(res, message, false, 401);

const isAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await checkToken(req, res, next, [1]);
};

const checkIntersection = async (
  array1: number[],
  array2: number[]
): Promise<boolean> => {
  const set1 = new Set(array1);
  for (let element of array2) {
    if (set1.has(element)) return true;
  }
  return false;
};

const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
  roles: number[]
) => {
  try {
    const token =
      req.headers["authorization"];

    if (Config.NODE_ENV === "development") {
      console.log("token: ", token);
    }

    if (!token) {
      return returnMessage(res, req.t("token.notFound"));
    }

    const decodedData = JWT.getTokenData(token);

    if (!decodedData) {
      return returnMessage(res, req.t("token.invalid"));
    }

    const currentTimestamp = Date.now();

    if (Config.NODE_ENV === "development") {
      console.log({ ...decodedData });
      console.log("Token expiration: ", new Date(decodedData.exp));
      console.log("Current timestamp: ", new Date(currentTimestamp));
      console.log("Is token valid: ", decodedData.exp > currentTimestamp);
    }

    if (decodedData.exp <= currentTimestamp) {
      return returnMessage(res, req.t("token.expired"));
    }

    const decodedRoles = decodedData.r.map((roleObj) => roleObj.id_role);
    const hasRequiredRole = await checkIntersection(decodedRoles, roles);

    if (hasRequiredRole) {
      req.user = decodedData;
      return next();
    }

    return returnMessage(res, req.t("token.permission"));
  } catch (err) {
    console.error("CheckToken error:", err.message);
    return returnMessage(res, req.t("token.invalid"));
  }
};

const CheckService = {
  isAdminToken,
};

export default CheckService;
