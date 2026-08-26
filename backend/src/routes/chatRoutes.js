import express from "express";

import {
  getConversations,
  getConversation,
  getMessages,
  createConversation,
  addConversationParticipant,
  removeConversationParticipant,
} from "../controllers/chat/chatController.js";

import { requireAuth } from "../../middlewares/authMiddleware.js";
import { requireRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();

/*
| All Chat Routes Require Authentication
*/

router.use(requireAuth);


/*
| Get All Conversations
| GET /api/chat/conversations
| Admin, Manager and Cashier can access their own conversations.
*/

router.get(
  "/conversations",
  requireRole("admin", "manager", "cashier"),
  getConversations
);


/*
| Get Single Conversation
| GET /api/chat/conversations/:id
*/

router.get(
  "/conversations/:id",
  requireRole("admin", "manager", "cashier"),
  getConversation
);


/*
| Get Conversation Messages
| GET /api/chat/conversations/:id/messages
*/

router.get(
  "/conversations/:id/messages",
  requireRole("admin", "manager", "cashier"),
  getMessages
);


/*
| Create Direct / Group Conversation
| POST /api/chat/conversations
| All authenticated chat users can create conversations.
*/

router.post(
  "/conversations",
  requireRole("admin", "manager", "cashier"),
  createConversation
);


/*
| Add Participant
| POST /api/chat/conversations/:id/participants
| Service layer additionally verifies that the requester
| is the group creator.
*/

router.post(
  "/conversations/:id/participants",
  requireRole("admin", "manager", "cashier"),
  addConversationParticipant
);


/*
| Remove Participant
| DELETE /api/chat/conversations/:id/participants/:userId
| Service layer verifies that the requester is allowed
| to remove the participant.
*/

router.delete(
  "/conversations/:id/participants/:userId",
  requireRole("admin", "manager", "cashier"),
  removeConversationParticipant
);

export default router;