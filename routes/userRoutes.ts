import express from "express";
import validate from "../middlewares/validator.js";
import { getUser, userCreation } from "../controllers/userController.js";
import { UserDTO } from "../dtos/user/index.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/user/create", validate(UserDTO), userCreation);

router.use(authMiddleware);
router.route("/user/:userId").get(getUser).patch().delete()

export default router;
