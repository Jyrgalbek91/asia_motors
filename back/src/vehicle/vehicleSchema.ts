import { Schema } from "../utils/types";

const vehicleSchema: Schema = {
  type: "object",
  properties: {
    id_type: { type: "string", minLength: 1, required: true },
    id_brand: { type: "string", minLength: 1, required: true },
    id_model: { type: "string", minLength: 1, required: true },
    id_capacity: { type: "string" },
    id_box: { type: "string" },
    description: { type: "string", minLength: 6 },
    images: { type: "array", items: { type: "string" } },
    pdf_file: { type: "string" },
    id_mass: { type: "string" },
    id_bucket: { type: "string" },
  },
};

export default {
  vehicleSchema,
};
