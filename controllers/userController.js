import AppError from "../lib/appError.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Conversation from "../models/conversationModel.js";

export const getMaleUsers = async (req, res, next) => {
  try {
    const maleUsers = await User.find({
      gender: "male",
      _id: { $ne: req.user._id },
    })
      .select("username email age avatar gender")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      status: "success",
      data: maleUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getFemaleUsers = async (req, res, next) => {
  try {
    const femaleUsers = await User.find({
      gender: "female",
      _id: { $ne: req.user._id },
    })
      .select("username email age avatar gender")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      status: "success",
      data: femaleUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const expiredUsers = async (req, res, next) => {
  try {
    const expiredUsers = await User.find({
      $and: [
        {
          subscriptionStatus: "expired",
          isTrialExpired: true,
        },
      ],
    }).select(
      "username age avatar subscriptionStartDate subscriptionEndDate remarks isVerified"
    );

    res.status(200).json({
      status: "success",
      data: expiredUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username email age avatar gender likes createdAt isVerified")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.id)
      .select(
        "username email age avatar gender likes location bio createdAt isVerified"
      )
      .exec();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const isProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("username email age avatar location bio createdAt")
      .exec();

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { age, location, bio } = user;

    if (!age || !location || !bio) {
      return next(new AppError("Profile is incomplete", 400));
    }

    res.status(200).json({
      status: "success",
      message: "Profile is complete",
    });
  } catch (error) {
    next(error);
  }
};

export const getSidebarUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } })
      .select("username avatar gender age likes createdAt isVerified")
      .exec();

    const userWithConversation = await Promise.all(
      allUsers?.map(async (user) => {
        const conversation = await Conversation.findOne({
          participants: { $all: [req.user._id, user._id] },
        });

        // Only return the user if a conversation exists
        if (conversation) {
          return user;
        }

        // Return null for users without conversation
        return null;
      })
    );

    // Filter out null values (users without conversation)
    const usersWithNonNullConversation = userWithConversation.filter(
      (user) => user !== null
    );

    const allUserInfo = await Promise.all(
      usersWithNonNullConversation?.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            {
              senderId: req.user._id,
              receiverId: user._id,
            },
            {
              senderId: user._id,
              receiverId: req.user._id,
            },
          ],
        })
          .sort({ createdAt: -1 })
          .exec();

        return {
          user,
          lastMessage: lastMessage && {
            ...lastMessage.toJSON(),
            senderId: lastMessage.senderId,
            receiverId: lastMessage.receiverId,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      data: allUserInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const likeUser = async (req, res, next) => {
  try {
    const authUserId = req.user._id.toString();
    const { userId } = req.params;

    const user = await User.findById(userId).select("likes").exec();

    const index = user.likes.findIndex((id) => id.toString() === authUserId);

    if (index === -1) {
      user.likes.push(req.user._id);
    } else {
      user.likes.splice(index, 1);
    }

    await User.findByIdAndUpdate(userId, user, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      message: `User ${index === -1 ? "liked" : "unliked"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).exec();

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const searchUsers = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Find users whose username contains the search term
    const users = await User.find({
      username,
    })
      .select("username avatar gender age likes createdAt isVerified")
      .exec();

    if (!users) {
      return next(new AppError("User not found", 404));
    }

    // Respond with the found users
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error); // Pass any caught error to the error-handling middleware
  }
};
