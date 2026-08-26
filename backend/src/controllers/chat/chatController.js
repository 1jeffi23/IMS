import {
  getUserConversations,
  getConversationById,
  getConversationMessages,
  createDirectConversation,
  createGroupConversation,
  addParticipant,
  removeParticipant,
} from "./chatService.js";


/*
| GET USER CONVERSATIONS
| GET /api/chat/conversations
*/

export const getConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await getUserConversations(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch conversations",
    });
  }
};


/*
| GET SINGLE CONVERSATION
| GET /api/chat/conversations/:id
*/

export const getConversation = async (
  req,
  res
) => {
  try {
    const conversationId =
      Number(req.params.id);

    if (Number.isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid conversation ID",
      });
    }

    const conversation =
      await getConversationById(
        conversationId,
        req.user.id
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message:
          "Conversation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error(
      "Get conversation error:",
      error
    );

    if (
      error.message.includes(
        "not a participant"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch conversation",
    });
  }
};


/*
| GET CONVERSATION MESSAGES
| GET /api/chat/conversations/:id/messages
*/

export const getMessages = async (
  req,
  res
) => {
  try {
    const conversationId =
      Number(req.params.id);

    if (Number.isNaN(conversationId)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid conversation ID",
      });
    }

    const messages =
      await getConversationMessages(
        conversationId,
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    if (
      error.message.includes(
        "not a participant"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch messages",
    });
  }
};


/*

| CREATE CONVERSATION
| POST /api/chat/conversations
| Direct:
| {
|   type: "direct",
|   participantIds: ["userId"]
| }
| Group:
| {
|   type: "group",
|   name: "Store Team",
|   participantIds: ["userId1", "userId2"]
| }
*/

export const createConversation = async (
  req,
  res
) => {
  try {
    const {
      type,
      name,
      participantIds,
    } = req.body;

    if (
      type !== "direct" &&
      type !== "group"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Conversation type must be direct or group",
      });
    }

    if (
      !Array.isArray(participantIds)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "participantIds must be an array",
      });
    }

    /*
  
    | DIRECT
  
    */

    if (type === "direct") {
      if (
        participantIds.length !== 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Direct conversation requires exactly one other user",
        });
      }

      const conversation =
        await createDirectConversation(
          req.user.id,
          participantIds[0]
        );

      return res.status(201).json({
        success: true,
        data: conversation,
      });
    }

    /*
  
    | GROUP
  
    */

    const conversation =
      await createGroupConversation(
        req.user.id,
        name,
        participantIds
      );

    return res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error(
      "Create conversation error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/*
| ADD PARTICIPANT
| POST /api/chat/conversations/:id/participants
*/

export const addConversationParticipant =
  async (req, res) => {
    try {
      const conversationId =
        Number(req.params.id);

      const { userId } = req.body;

      if (Number.isNaN(conversationId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conversation ID",
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const participant =
        await addParticipant(
          conversationId,
          req.user.id,
          userId
        );

      res.status(201).json({
        success: true,
        message:
          "Participant added successfully",
        data: participant,
      });
    } catch (error) {
      console.error(
        "Add participant error:",
        error
      );

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


/*
| REMOVE PARTICIPANT
| DELETE /api/chat/conversations/:id/participants/:userId
*/

export const removeConversationParticipant =
  async (req, res) => {
    try {
      const conversationId =
        Number(req.params.id);

      const { userId } = req.params;

      if (Number.isNaN(conversationId)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid conversation ID",
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "User ID is required",
        });
      }

      const participant =
        await removeParticipant(
          conversationId,
          req.user.id,
          userId
        );

      res.status(200).json({
        success: true,
        message:
          "Participant removed successfully",
        data: participant,
      });
    } catch (error) {
      console.error(
        "Remove participant error:",
        error
      );

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };