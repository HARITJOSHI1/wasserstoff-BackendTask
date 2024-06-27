import express from "express";
import validate from "../middlewares/validator.js";
import {
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
  userCreation,
} from "../controllers/userController.js";
import { UserDTO } from "../dtos/user/index.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/user/create", validate(UserDTO), userCreation);

router.use(authMiddleware);
router
  .route("/user/:userId")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
router.get("/users", getAllUser);

export default router;
