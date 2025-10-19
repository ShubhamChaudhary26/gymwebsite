// src/models/about.model.js (UPDATED)
import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Welcome to Our Gym",
    },
    description: {
      type: String,
      required: true,
      default: "Transform your life with us",
    },
    mission: {
      type: String,
      required: true,
      default:
        "Our mission is to empower individuals to achieve their fitness goals through personalized training, state-of-the-art equipment, and unwavering support.",
    },
    vision: {
      type: String,
      required: true,
      default:
        "Our vision is to create a healthier world where fitness is accessible to everyone, inspiring positive lifestyle changes that last a lifetime.",
    },
    // ✅ MULTIPLE VIDEOS ARRAY
    videos: [
      {
        youtubeLink: {
          type: String,
          required: true,
        },
        topic: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    stats: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
          enum: ["users", "dumbbell", "trophy", "award"],
        },
      },
    ],
    teamMembers: [
      {
        name: String,
        role: String,
        image: String,
        bio: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

export default About;