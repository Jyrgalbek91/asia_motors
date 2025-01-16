import { Request, Response, Router } from "express";
import userRoute from "../user";
import PostRoute from "../post";
<<<<<<< HEAD
import VehicleRoute from "../vehicle";
import sharedRoute from "../shared";

const api = Router()
  .use("/user", userRoute)
  .use("/shared", sharedRoute)
  .use("/post", PostRoute)
  .use("/vehicle", VehicleRoute);
=======
import storageRoute from "../storage";

const api = Router()
  .use("/user", userRoute)
  .use("/post", PostRoute)
  .use("/storage", storageRoute);
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c

api.use((_: Request, res: Response) => {
  res.status(404).json({ error: "API not found" });
});

<<<<<<< HEAD
export default Router().use("/asia_motors/api", api);
=======
export default Router().use("/hyundai/api", api);
>>>>>>> da1adc4818c7c1b2b4d8a755e22524c4f2dac49c
