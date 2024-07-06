import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  CreateUniversity,
  GetUniversities,
  DeleteUniversity,
  UpdateUniversity,
} from "./controller/University.js";
import {
  CreateDepartment,
  DeleteDepartment,
  GetDepartmentsByUniversityId,
  UpdateDepartment,
} from "./controller/Department.js";
import {
  CreateProduct,
  DeleteProduct,
  GetProductsByDepartmentId,
  GetProductDetail,
  UpdataProductQty,
  UpdateProduct,
} from "./controller/Product.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

//University Module
const storageUniv = multer.diskStorage({
  destination: "uploadsUni/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}---${file.originalname}`);
  },
});

const uploadUni = multer({
  storage: storageUniv,
});

//http://localhost:8081/university

app.post("/university", uploadUni.single("image"), CreateUniversity);
app.put("/university", uploadUni.single("image"), UpdateUniversity);
app.delete("/university", DeleteUniversity);
app.get("/university", GetUniversities);

//department Module
const storagedep = multer.diskStorage({
  destination: "uploadsDep/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const uploadDep = multer({
  storage: storagedep,
});

app.post("/department", uploadDep.single("image"), CreateDepartment);
app.put("/department", uploadDep.single("image"), UpdateDepartment);
app.delete("/department", DeleteDepartment);
app.get("/department", GetDepartmentsByUniversityId);

// product module
const storagePrd = multer.diskStorage({
  destination: "uploadsPrd/",
  filename: (req, file, cb) => {
    cb(null, `${date.now()}--${file.originalname}`);
  },
});
const uploadPrd = multer({
  storage: storagePrd,
});

app.post("/product", uploadPrd.array("images"), CreateProduct);
app.put("/product", uploadPrd.array("image"), UpdateProduct);
app.delete("/product", DeleteProduct);
app.get("/product", GetProductsByDepartmentId);
app.get("/productDetail", GetProductDetail);
app.put("/UpdataProductQty", UpdataProductQty);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("database connected");
    app.listen(process.env.PORT, () => {
      console.log("Server running at port : " + process.env.PORT);
    });
  })
  .catch(() => {
    console.log("database connection error");
  });
