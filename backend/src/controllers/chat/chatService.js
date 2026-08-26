import { eq, and, desc } from "drizzle-orm";

import { db } from "../../../db/index.js";

import {
  conversation,
  conversationParticipant,
  chatMessage,
} from "../../models/chatModel.js";

import { user } from "../../models/authModel.js";

/*
| Helper: Check User Exists
*/

export const userExists = async (userId) => {
  const result = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  return result.length > 0;
};


/*
| Check Conversation Participant
| This is one of the most important functions in the chat system.
| We NEVER trust the frontend to tell us whether a user belongs
| to a conversation.
*/

export const isConversationParticipant = async (
  conversationId,
  userId
) => {
  const result = await db
    .select({
      id: conversationParticipant.id,
    })
    .from(conversationParticipant)
    .where(
      and(
        eq(
          conversationParticipant.conversationId,
          conversationId
        ),
        eq(
          conversationParticipant.userId,
          userId
        )
      )
    )
    .limit(1);

  return result.length > 0;
};


/*
| Get User Conversations
*/

export const getUserConversations = async (userId) => {
  const conversations = await db
    .select({
      id: conversation.id,
      type: conversation.type,
      name: conversation.name,
      createdBy: conversation.createdBy,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    })
    .from(conversation)
    .innerJoin(
      conversationParticipant,
      eq(
        conversationParticipant.conversationId,
        conversation.id
      )
    )
    .where(
      eq(
        conversationParticipant.userId,
        userId
      )
    )
    .orderBy(desc(conversation.updatedAt));

  const conversationsWithDetails =
    await Promise.all(
      conversations.map(async (item) => {

        /*
        | Get conversation participants
        | Include name + role
        */

        const participants = await db
          .select({
            id: user.id,
            name: user.name,
            role: user.role,
          })
          .from(conversationParticipant)
          .innerJoin(
            user,
            eq(
              conversationParticipant.userId,
              user.id
            )
          )
          .where(
            eq(
              conversationParticipant.conversationId,
              item.id
            )
          );

        /*
        | Get last message
        */

        const [lastMessage] = await db
          .select({
            id: chatMessage.id,
            senderId: chatMessage.senderId,
            content: chatMessage.content,
            createdAt: chatMessage.createdAt,
          })
          .from(chatMessage)
          .where(
            eq(
              chatMessage.conversationId,
              item.id
            )
          )
          .orderBy(
            desc(chatMessage.createdAt)
          )
          .limit(1);

        /*
        | Attach sender information
        */

        const formattedLastMessage =
          lastMessage
            ? {
                ...lastMessage,

                sender:
                  participants.find(
                    (participant) =>
                      participant.id ===
                      lastMessage.senderId
                  ) || null,
              }
            : null;

        return {
          ...item,

          participants,

          lastMessage:
            formattedLastMessage,
        };
      })
    );

  return conversationsWithDetails;
};


/*
| Get Conversation By ID
| User must be a participant.
*/

export const getConversationById = async (
  conversationId,
  userId
) => {
  const participant =
    await isConversationParticipant(
      conversationId,
      userId
    );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation"
    );
  }

  const result = await db
    .select({
      id: conversation.id,
      type: conversation.type,
      name: conversation.name,
      createdBy: conversation.createdBy,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    })
    .from(conversation)
    .where(
      eq(
        conversation.id,
        conversationId
      )
    )
    .limit(1);

  return result[0] || null;
};


/*
| Get Conversation Messages
| Only participants can access message history.
*/

export const getConversationMessages = async (
  conversationId,
  userId
) => {
  const participant =
    await isConversationParticipant(
      conversationId,
      userId
    );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation"
    );
  }

  const messages = await db
    .select({
      id: chatMessage.id,
      conversationId: chatMessage.conversationId,
      senderId: chatMessage.senderId,
      content: chatMessage.content,
      createdAt: chatMessage.createdAt,
      updatedAt: chatMessage.updatedAt,

      senderUserId: user.id,
      senderName: user.name,
      senderRole: user.role,
    })
    .from(chatMessage)
    .innerJoin(
      user,
      eq(
        chatMessage.senderId,
        user.id
      )
    )
    .where(
      eq(
        chatMessage.conversationId,
        conversationId
      )
    )
    .orderBy(chatMessage.createdAt);

  /*
  | Return sender as nested object
  | so frontend can use:
  |
  | message.sender.name
  | message.sender.role
  */

  return messages.map((message) => ({
    id: message.id,
    conversationId:
      message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,

    sender: {
      id: message.senderUserId,
      name: message.senderName,
      role: message.senderRole,
    },
  }));
};


/*
| Create Direct Conversation
| Direct conversation:
| User A <----> User B
*/

export const createDirectConversation = async (
  createdBy,
  otherUserId
) => {
  if (!otherUserId) {
    throw new Error(
      "Other user ID is required"
    );
  }

  if (createdBy === otherUserId) {
    throw new Error(
      "You cannot create a conversation with yourself"
    );
  }

  /*
  | Check Other User
  */

  const otherUserExists =
    await userExists(otherUserId);

  if (!otherUserExists) {
    throw new Error(
      "Other user does not exist"
    );
  }

  /*
  | Find existing direct conversation
  */

  const existingConversations =
    await db
      .select({
        conversationId:
          conversation.id,
      })
      .from(conversation)
      .innerJoin(
        conversationParticipant,
        eq(
          conversationParticipant.conversationId,
          conversation.id
        )
      )
      .where(
        and(
          eq(
            conversation.type,
            "direct"
          ),
          eq(
            conversationParticipant.userId,
            createdBy
          )
        )
      );

  /*
  | Check whether both users belong
  | to the same conversation
  */

  for (const existing of existingConversations) {
    const participants = await db
      .select({
        userId:
          conversationParticipant.userId,
      })
      .from(conversationParticipant)
      .where(
        eq(
          conversationParticipant.conversationId,
          existing.conversationId
        )
      );

    const participantIds =
      participants.map(
        (participant) =>
          participant.userId
      );

    if (
      participantIds.length === 2 &&
      participantIds.includes(createdBy) &&
      participantIds.includes(otherUserId)
    ) {
      const existingConversation =
        await getConversationById(
          existing.conversationId,
          createdBy
        );

      return existingConversation;
    }
  }

  /*
  | Create conversation
  */

  const [newConversation] =
    await db
      .insert(conversation)
      .values({
        type: "direct",
        createdBy,
      })
      .returning();

  /*
  | Add both participants
  */

  await db
    .insert(conversationParticipant)
    .values([
      {
        conversationId:
          newConversation.id,
        userId: createdBy,
      },
      {
        conversationId:
          newConversation.id,
        userId: otherUserId,
      },
    ]);

  return newConversation;
};


/*
| Create Group Conversation
*/
export const createGroupConversation = async (
  createdBy,
  name,
  participantIds
) => {
  if (!name?.trim()) {
    throw new Error(
      "Group name is required"
    );
  }

  if (
    !Array.isArray(participantIds) ||
    participantIds.length === 0
  ) {
    throw new Error(
      "At least one participant is required"
    );
  }

  const groupName = name.trim();

  // Check unique group name
  const existingGroup = await db
    .select({
      id: conversation.id,
    })
    .from(conversation)
    .where(
      and(
        eq(conversation.type, "group"),
        eq(conversation.name, groupName)
      )
    )
    .limit(1);

  if (existingGroup.length > 0) {
    throw new Error(
      "A group with this name already exists"
    );
  }

  const uniqueParticipantIds = [
    ...new Set([
      createdBy,
      ...participantIds,
    ]),
  ];

  for (const participantId of uniqueParticipantIds) {
    const exists =
      await userExists(participantId);

    if (!exists) {
      throw new Error(
        `User ${participantId} does not exist`
      );
    }
  }

  const [newConversation] =
    await db
      .insert(conversation)
      .values({
        type: "group",
        name: groupName,
        createdBy,
      })
      .returning();

  await db
    .insert(conversationParticipant)
    .values(
      uniqueParticipantIds.map(
        (userId) => ({
          conversationId:
            newConversation.id,
          userId,
        })
      )
    );

  return newConversation;
};


/*
|------------------------------------------------------------------
| Add Participant
|------------------------------------------------------------------
|
| Currently group creator manages participants.
|
*/

export const addParticipant = async (
  conversationId,
  requesterId,
  userId
) => {
  /*
  | Check requester belongs to conversation
  */

  const conversationData =
    await getConversationById(
      conversationId,
      requesterId
    );

  if (!conversationData) {
    throw new Error(
      "Conversation not found"
    );
  }

  /*
  | Only groups support participants
  */

  if (
    conversationData.type !== "group"
  ) {
    throw new Error(
      "Participants can only be added to group conversations"
    );
  }

  /*
  | Only creator can manage participants
  */

  if (
    conversationData.createdBy !==
    requesterId
  ) {
    throw new Error(
      "Only the group creator can add participants"
    );
  }

  /*
  | Check user exists
  */

  const exists =
    await userExists(userId);

  if (!exists) {
    throw new Error(
      "User does not exist"
    );
  }

  /*
  | Check duplicate participant
  */

  const alreadyParticipant =
    await isConversationParticipant(
      conversationId,
      userId
    );

  if (alreadyParticipant) {
    throw new Error(
      "User is already a participant"
    );
  }

  /*
  | Add participant
  */

  const [participant] =
    await db
      .insert(conversationParticipant)
      .values({
        conversationId,
        userId,
      })
      .returning();

  return participant;
};


export const removeParticipant = async (
  conversationId,
  requesterId,
  userId
) => {
  const conversationData =
    await getConversationById(
      conversationId,
      requesterId
    );

  if (!conversationData) {
    throw new Error(
      "Conversation not found"
    );
  }

  if (conversationData.type !== "group") {
    throw new Error(
      "Participants can only be removed from group conversations"
    );
  }

  const isCreator =
    conversationData.createdBy === requesterId;

  const isRemovingSelf =
    requesterId === userId;

  // Creator cannot leave the group
  if (isCreator && isRemovingSelf) {
    throw new Error(
      "Group creator cannot leave the group"
    );
  }

  // Normal member can only remove themselves
  if (!isCreator && !isRemovingSelf) {
    throw new Error(
      "You can only leave the group yourself"
    );
  }

  const deleted =
    await db
      .delete(conversationParticipant)
      .where(
        and(
          eq(
            conversationParticipant.conversationId,
            conversationId
          ),
          eq(
            conversationParticipant.userId,
            userId
          )
        )
      )
      .returning();

  if (deleted.length === 0) {
    throw new Error(
      "Participant not found"
    );
  }

  return deleted[0];
};


/*
| Save Message
| This will later be reused by Socket.IO.
*/

export const saveMessage = async (
  conversationId,
  senderId,
  content
) => {
  /*
  | Verify participant
  */

  const participant =
    await isConversationParticipant(
      conversationId,
      senderId
    );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation"
    );
  }

  /*
  | Validate content
  */

  const trimmedContent =
    content?.trim();

  if (!trimmedContent) {
    throw new Error(
      "Message cannot be empty"
    );
  }

  /*
  | Save message
  */

  const [message] =
    await db
      .insert(chatMessage)
      .values({
        conversationId,
        senderId,
        content: trimmedContent,
      })
      .returning();

  /*
  | Update conversation activity
  */

  await db
    .update(conversation)
    .set({
      updatedAt: new Date(),
    })
    .where(
      eq(
        conversation.id,
        conversationId
      )
    );

  return message;
};


/*
| Mark Conversation As Read
|
| Updates the current user's lastReadAt timestamp
| in conversation_participant.
|
| This means:
| "This user has read everything in this conversation
| up to this point."
*/

export const markConversationAsRead = async (
  conversationId,
  userId
) => {
  /*
  | Verify participant
  */

  const participant =
    await isConversationParticipant(
      conversationId,
      userId
    );

  if (!participant) {
    throw new Error(
      "You are not a participant of this conversation"
    );
  }

  /*
  | Set lastReadAt to current time
  */

  const now = new Date();

  const [updatedParticipant] =
    await db
      .update(conversationParticipant)
      .set({
        lastReadAt: now,
      })
      .where(
        and(
          eq(
            conversationParticipant.conversationId,
            conversationId
          ),
          eq(
            conversationParticipant.userId,
            userId
          )
        )
      )
      .returning({
        lastReadAt:
          conversationParticipant.lastReadAt,
      });

  if (!updatedParticipant) {
    throw new Error(
      "Failed to update read status"
    );
  }

  return updatedParticipant.lastReadAt;
};