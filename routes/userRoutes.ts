import express from "express";
import validate from "../middlewares/validator.js";
import { userCreation } from "../controllers/userController.js";
import { UserDTO } from "../dtos/user/index.js";

const router = express.Router();

router.post("/user/create", validate(UserDTO), userCreation);

export default router;
