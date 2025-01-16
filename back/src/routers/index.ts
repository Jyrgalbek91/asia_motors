import { Request, Response, Router } from "express";
import userRoute from "../user";
import PostRoute from "../post";
import VehicleRoute from "../vehicle";
import sharedRoute from "../shared";
import storageRoute from "../storage";

const api = Router()
  .use("/user", userRoute)
  .use("/shared", sharedRoute)
  .use("/post", PostRoute)
  .use("/vehicle", VehicleRoute)
  .use("/storage", storageRoute);

api.use((_: Request, res: Response) => {
  res.status(404).json({ error: "API not found" });
});

export default Router().use("/asia_motors/api", api);

