import { Router } from "express";

import { login } from "./auth.controller.js";

const router = Router({ mergeParams: true });

router.post("/login", login);

export default router;


