import { Schema } from "../utils/types";

const vehicleSchema: Schema = {
  type: "object",
  properties: {
    id_type: { type: "number", minLength: 1, required: true },
    id_brand: { type: "number", minLength: 1, required: true },
    id_model: { type: "number", minLength: 1, required: true },
    id_capacity: { type: "number" },
    id_box: { type: "number" },
    description: { type: "string", minLength: 6 },
    id_mass: { type: ["number", "null"] },
    id_bucket: { type: "number" },
    id_fuel: { type: "number" },
    id_power: { type: "number" },
  },
};

export default {
  vehicleSchema,
};
