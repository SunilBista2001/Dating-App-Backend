import User from "../models/userModel.js";
import AppError from "../lib/appError.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return next(new AppError("Passwords do not match", 400));
    }

    const user = await User.findOne({ email });

    if (user) {
      return next(new AppError("User already exists", 400));
    }

    let profilePicture;
    if (req.body.profilePic === "") {
      profilePicture = `https://avatar.iran.liara.run/public/${
        req.body.gender === "male" ? "boy" : "girl"
      }?username=${req.body.username}`;
    }

    await User.create({
      role: "customer",
      profilePic: profilePicture,
      ...req.body,
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return next(new AppError("Invalid credentials", 400));
    }

    // Check if the user's trial period has expired
    if (new Date() > user.trialEndDate) {
      user.isTrialExpired = true;
      await user.save();
    }

    // Check if the user's subscription has expired
    if (new Date() > user.subscriptionEndDate) {
      user.subscriptionStatus = "expired";
      await user.save();
    }

    if (user.isTrialExpired === true && user.subscriptionStatus === "expired") {
      return next(
        new AppError("Your trial period or subscription has expired", 401)
      );
    }

    const token = generateToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id);

    if (!currentUser) {
      return next(new AppError("The user does not exist", 401));
    }

    if (
      currentUser.isTrialExpired === true &&
      currentUser.subscriptionStatus === "expired"
    ) {
      return next(
        new AppError("Your trial period or subscription has expired", 401)
      );
    }

    console.log(currentUser);

    req.user = currentUser;

    next();
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      {
        subscriptionEndDate: new Date() + 30 * 24 * 60 * 60 * 1000,
        subscriptionStatus: "active",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "User approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(
        new AppError("You are not authorized to perform this action", 403)
      );
    }

    next();
  };
};
