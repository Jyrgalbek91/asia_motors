import { Request, Response, Router } from "express";
import userRoute from "../user";
import PostRoute from "../post";
import storageRoute from "../storage";
import sharedRoute from "../shared";

const api = Router()
  .use("/user", userRoute)
  .use("/post", PostRoute)
  .use("/storage", storageRoute)
  .use("/shared", sharedRoute);

api.use((_: Request, res: Response) => {
  res.status(404).json({ error: "API not found" });
});

export default Router().use("/hyundai/api", api);
