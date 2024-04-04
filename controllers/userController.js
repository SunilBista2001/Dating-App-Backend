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
      subscriptionStatus: "expired",
    }).select("username age subscriptionStartDate subscriptionEndDate remarks");

    res.status(200).json({
      status: "success",
      data: expiredUsers,
    });
  } catch (error) {
    next(error);
  }
};
