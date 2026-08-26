import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";

import { socketAuth } from "./socketAuth.js";

import {
    isConversationParticipant,
    saveMessage,
    markConversationAsRead,
} from "../../src/controllers/chat/chatService.js";

import {
    conversationParticipant,
} from "../../src/models/chatModel.js";

export const setupSocketServer = (io) => {
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        console.log(
            `Authenticated user: ${socket.user.name} (${socket.user.id})`
        );

        socket.join(`user_${socket.user.id}`);

        // =====================================================
        // JOIN CONVERSATION
        // =====================================================

        socket.on(
            "conversation:join",
            async ({ conversationId }) => {
                try {
                    if (!conversationId) {
                        return socket.emit("chat:error", {
                            message:
                                "Conversation ID is required",
                        });
                    }

                    const isParticipant =
                        await isConversationParticipant(
                            conversationId,
                            socket.user.id
                        );

                    if (!isParticipant) {
                        return socket.emit("chat:error", {
                            message:
                                "You are not a participant of this conversation",
                        });
                    }

                    const room =
                        `conversation_${conversationId}`;

                    socket.join(room);

                    socket.emit(
                        "conversation:joined",
                        {
                            conversationId,
                            room,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Conversation join error:",
                        error
                    );

                    socket.emit("chat:error", {
                        message:
                            "Failed to join conversation",
                    });
                }
            }
        );

        // =====================================================
        // LEAVE CONVERSATION
        // =====================================================

        socket.on(
            "conversation:leave",
            ({ conversationId }) => {
                if (!conversationId) {
                    return;
                }

                const room =
                    `conversation_${conversationId}`;

                socket.leave(room);

                socket.emit(
                    "conversation:left",
                    {
                        conversationId,
                        room,
                    }
                );
            }
        );

        // =====================================================
        // SEND MESSAGE
        // =====================================================

        socket.on(
            "message:send",
            async ({ conversationId, message }) => {
                try {
                    if (!conversationId) {
                        return socket.emit("chat:error", {
                            message:
                                "Conversation ID is required",
                        });
                    }

                    if (
                        typeof message !== "string" ||
                        !message.trim()
                    ) {
                        return socket.emit("chat:error", {
                            message:
                                "Message cannot be empty",
                        });
                    }

                    const isParticipant =
                        await isConversationParticipant(
                            conversationId,
                            socket.user.id
                        );

                    if (!isParticipant) {
                        return socket.emit("chat:error", {
                            message:
                                "You are not a participant of this conversation",
                        });
                    }

                    const savedMessage =
                        await saveMessage(
                            conversationId,
                            socket.user.id,
                            message
                        );

                    const room =
                        `conversation_${conversationId}`;

                    const messageWithSender = {
                        ...savedMessage,

                        sender: {
                            id: socket.user.id,
                            name: socket.user.name,
                            role: socket.user.role,
                        },
                    };

                    io.to(room).emit(
                        "message:receive",
                        messageWithSender
                    );

                    const participants =
                        await db
                            .select({
                                userId:
                                    conversationParticipant.userId,
                            })
                            .from(
                                conversationParticipant
                            )
                            .where(
                                eq(
                                    conversationParticipant.conversationId,
                                    conversationId
                                )
                            );

                    participants.forEach(
                        ({ userId }) => {
                            if (
                                userId !==
                                socket.user.id
                            ) {
                                io.to(
                                    `user_${userId}`
                                ).emit(
                                    "conversation:message",
                                    messageWithSender
                                );
                            }
                        }
                    );
                } catch (error) {
                    console.error(
                        "Message send error:",
                        error
                    );

                    socket.emit("chat:error", {
                        message:
                            error.message ||
                            "Failed to send message",
                    });
                }
            }
        );

        // =====================================================
        // MARK CONVERSATION AS READ
        // =====================================================

        socket.on(
            "conversation:read",
            async ({ conversationId }) => {
                try {
                    if (!conversationId) {
                        return socket.emit("chat:error", {
                            message:
                                "Conversation ID is required",
                        });
                    }

                    const isParticipant =
                        await isConversationParticipant(
                            conversationId,
                            socket.user.id
                        );

                    if (!isParticipant) {
                        return socket.emit("chat:error", {
                            message:
                                "You are not a participant of this conversation",
                        });
                    }

                    const lastReadAt =
                        await markConversationAsRead(
                            conversationId,
                            socket.user.id
                        );

                    const room =
                        `conversation_${conversationId}`;

                    io.to(room).emit(
                        "conversation:read",
                        {
                            conversationId,
                            userId: socket.user.id,
                            lastReadAt,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Conversation read error:",
                        error
                    );

                    socket.emit("chat:error", {
                        message:
                            error.message ||
                            "Failed to mark conversation as read",
                    });
                }
            }
        );

        // =====================================================
        // START TYPING
        // =====================================================

        socket.on(
            "typing:start",
            async ({ conversationId }) => {
                try {
                    if (!conversationId) {
                        return;
                    }

                    const isParticipant =
                        await isConversationParticipant(
                            conversationId,
                            socket.user.id
                        );

                    if (!isParticipant) {
                        return;
                    }

                    const room =
                        `conversation_${conversationId}`;

                    socket.to(room).emit(
                        "typing:start",
                        {
                            conversationId,
                            userId: socket.user.id,
                            userName: socket.user.name,
                            userRole: socket.user.role,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Typing start error:",
                        error
                    );
                }
            }
        );

        // =====================================================
        // STOP TYPING
        // =====================================================

        socket.on(
            "typing:stop",
            async ({ conversationId }) => {
                try {
                    if (!conversationId) {
                        return;
                    }

                    const isParticipant =
                        await isConversationParticipant(
                            conversationId,
                            socket.user.id
                        );

                    if (!isParticipant) {
                        return;
                    }

                    const room =
                        `conversation_${conversationId}`;

                    socket.to(room).emit(
                        "typing:stop",
                        {
                            conversationId,
                            userId: socket.user.id,
                        }
                    );
                } catch (error) {
                    console.error(
                        "Typing stop error:",
                        error
                    );
                }
            }
        );

        // =====================================================
        // DISCONNECT
        // =====================================================

        socket.on(
            "disconnect",
            (reason) => {
                console.log(
                    `Socket disconnected: ${socket.id}`
                );

                console.log(
                    `Reason: ${reason}`
                );
            }
        );
    });
};