import { Schema } from "../utils/types";

const carSchema: Schema = {
  type: "object",
  properties: {
    id_vehicle: { type: "string" },
    id_color: { type: "string" },
    id_size: { type: "string" },
    images: { type: "array", items: { type: "string" } },
  },
};

export default {
  carSchema,
};
