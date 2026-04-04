import { Router } from "express";

import { queryChatbot } from "../controllers/chatbot.controller.js";

const router = Router({ mergeParams: true });

router.post("/query", queryChatbot);

export default router;
