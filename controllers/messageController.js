import AppError from "../lib/appError.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;

    const { content } = req.body;

    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
    });

    if (newMessage) {
      conversation.messages.push(newMessage?._id);
    }

    await Promise.all([newMessage.save(), conversation.save()]);

    // integrating socket io functionality
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    console.log("receiverSocketId", receiverSocketId);

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    }).populate("messages");

    // .populate({
    //   path: "participants",
    //   select: "username email age profilePic gender",
    // });

    if (!conversation) {
      return res.status(200).json({
        status: "success",
        data: [],
      });
    }

    const messages = conversation.messages;

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    const isConversationExists = await Conversation.exists({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!isConversationExists) {
      return next(new AppError("No conversation found", 404));
    }

    await Message.deleteMany({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    });

    res.status(200).json({
      status: "success",
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const markAsSeen = async (req, res, next) => {
  try {
    const { id: receiverId } = req?.params;

    const authUserId = req?.user?._id?.toString();

    const conversation = await Conversation.findOne({
      participants: {
        $all: [authUserId, receiverId],
      },
    })
      .sort({
        timestamps: -1,
      })
      .populate("messages");

    const messages = conversation?.messages;

    const messageSenderId =
      messages[messages?.length - 1]?.senderId?.toString();

    // if the last message sender is not the authenticated user
    if (messageSenderId !== authUserId) {
      messages.forEach(async (message) => {
        await Message.findByIdAndUpdate(message, {
          opened: true,
        });
      });
    }

    res.status(200).json({
      status: "success",
      message:
        authUserId === messageSenderId
          ? "You are the sender"
          : "Messages marked as seen successfully",
    });
  } catch (error) {
    next(error);
  }
};
