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

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
      type: String,
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

    isVerified: {
      type: Boolean,
      default: false,
    },

    // esewa remarks
    remarks: {
      type: String,
      default: "",
    },

    agreementToTerms: {
      type: Boolean,
      required: true,
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
    this.trialEndDate = Date.now() + 3 * 24 * 60 * 60 * 1000;
  }

  next();
});

// storing the hashed password in the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
