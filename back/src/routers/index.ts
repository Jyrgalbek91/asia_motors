import { Request, Response, Router } from "express";
import userRoute from "../user";
import PostRoute from "../post";
import sharedRoute from "../shared";
import storageRoute from "../storage";
import carRoute from "../car";

const api = Router()
  .use("/user", userRoute)
  .use("/shared", sharedRoute)
  .use("/post", PostRoute)
  .use("/storage", storageRoute)
  .use("/car", carRoute);

api.use((_: Request, res: Response) => {
  res.status(404).json({ error: "API not found" });
});

export default Router().use("/hyundai/api", api);
