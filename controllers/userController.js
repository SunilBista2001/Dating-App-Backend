import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getMaleUsers = async (req, res, next) => {
  try {
    const maleUsers = await User.find({
      gender: "male",
      _id: { $ne: req.user._id },
    })
      .select("username email age profilePic gender")
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
      .select("username email age profilePic gender")
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
    }).select("username age subscriptionStartDate subscriptionEndDate remarks");

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
      .select("username email age profilePic gender")
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
      .select("username email age profilePic gender likes")
      .exec();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getSidebarUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } })
      .select("username profilePic gender age createdAt")
      .exec();

    const allUserInfo = await Promise.all(
      allUsers?.map(async (user) => {
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
          .select("-updatedAt")
          .exec();

        return {
          user,
          lastMessage: lastMessage
            ? {
                ...lastMessage.toJSON(),
                senderId: lastMessage.senderId,
                receiverId: lastMessage.receiverId,
              }
            : null,
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

    user.likes.map((id) => console.log("like gareko id =>", id.toString()));

    console.log("my id=>", authUserId);

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
