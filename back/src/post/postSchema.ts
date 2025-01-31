import { Schema } from "../utils/types";

const postSchema: Schema = {
  type: "object",
  properties: {
    id_type: { type: "string", minLength: 1, required: true },
    title: { type: "string", minLength: 6 },
    description: { type: "string", minLength: 6 },
    images: { type: "array", items: { type: "string" } },
    date: { type: "string" },
  },
};

export default {
  postSchema,
};
