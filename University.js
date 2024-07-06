import mongoose, { Mongoose, Types } from "mongoose";

const UniversitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UniversityModel = mongoose.model("university", UniversitySchema);
export default UniversityModel;
