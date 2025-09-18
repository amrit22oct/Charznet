import express from "express";
import { deleteUser, getAllUsers, getUserDetails, updateUser, updateUserRole } from "../Controllers/superAdminController.js";
import { authMiddleware, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware,isSuperAdmin);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);
router.patch("/users/edit/:id", isSuperAdmin, updateUserRole);
router.patch("/users/:id", isSuperAdmin, updateUser);
router.delete("/users/:id", isSuperAdmin, deleteUser);

export default router;