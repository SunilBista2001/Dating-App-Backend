import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 5,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
    },

    likes: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    location: {
      type: String,
    },

    age: {
      type: Number,
    },

    trialStartDate: {
      type: Date,
    },

    trialEndDate: {
      type: Date,
    },

    isTrialExpired: {
      type: Boolean,
      default: false,
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "expired"],
      default: "expired",
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// 3 days trial period
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.trialStartDate = Date.now();
    // 30 mins trial period
    this.trialEndDate = Date.now() + 5 * 60 * 1000;
    // this.trialEndDate = Date.now() + 3 * 24 * 60 * 60 * 1000;
  }

  next();
});

// check if the trial period has expired or not
userSchema.methods.checkTrialPeriod = function () {
  if (Date.now() > this.trialEndDate) {
    this.isTrialExpired = true;
  }
};

// storing the hashed password in the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// check if the subscriptionStatus is expired or not
userSchema.pre("save", function (next) {
  if (Date.now() > this.subscriptionEndDate) {
    this.subscriptionStatus = "expired";
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
