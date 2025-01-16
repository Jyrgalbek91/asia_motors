import { Schema } from "../utils/types";

const loginSchema: Schema = {
  type: "object",
  properties: {
    login: { type: ["string", "number"], required: true, minLength: 1 },
    password: { type: "string", required: true, minLength: 1 },
  },
};

export default {
  loginSchema,
};
