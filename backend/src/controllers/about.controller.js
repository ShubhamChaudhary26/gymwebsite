// src/controllers/about.controller.js (UPDATED)
import About from "../models/about.model.js";

// @desc    Get About page data
// @route   GET /api/v1/about
// @access  Public
export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create({
        title: "Welcome to Our Gym",
        description:
          "Transform your body, mind, and spirit with our world-class fitness facilities and expert trainers",
        mission:
          "Our mission is to empower individuals to achieve their fitness goals through personalized training, state-of-the-art equipment, and unwavering support.",
        vision:
          "Our vision is to create a healthier world where fitness is accessible to everyone, inspiring positive lifestyle changes that last a lifetime.",
        videos: [
          {
            youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            topic: "Gym Tour",
            description: "Take a virtual tour of our state-of-the-art facility",
            order: 1,
          },
        ],
        stats: [
          { label: "Happy Members", value: "12000+", icon: "users" },
          { label: "Expert Trainers", value: "50+", icon: "dumbbell" },
          { label: "Success Stories", value: "5000+", icon: "trophy" },
          { label: "Years Experience", value: "15+", icon: "award" },
        ],
      });
    }

    // Sort videos by order
    if (about.videos && about.videos.length > 0) {
      about.videos.sort((a, b) => a.order - b.order);
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("❌ Error fetching about:", error);
    next(error);
  }
};

// @desc    Update About page
// @route   PUT /api/v1/about
// @access  Private/Admin
export const updateAbout = async (req, res, next) => {
  try {
    const { title, description, mission, vision, videos, stats, teamMembers } =
      req.body;

    console.log("📝 Updating About page with data:", req.body);

    // Validate YouTube links in videos array
    if (videos && Array.isArray(videos)) {
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;

      for (let i = 0; i < videos.length; i++) {
        if (videos[i].youtubeLink && !youtubeRegex.test(videos[i].youtubeLink)) {
          return res.status(400).json({
            success: false,
            message: `Invalid YouTube URL format for video ${i + 1}`,
          });
        }
        
        if (!videos[i].topic || videos[i].topic.trim() === "") {
          return res.status(400).json({
            success: false,
            message: `Topic is required for video ${i + 1}`,
          });
        }
      }
    }

    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
      console.log("✅ Created new About page");
    } else {
      if (title !== undefined) about.title = title;
      if (description !== undefined) about.description = description;
      if (mission !== undefined) about.mission = mission;
      if (vision !== undefined) about.vision = vision;
      if (videos !== undefined) about.videos = videos;
      if (stats !== undefined) about.stats = stats;
      if (teamMembers !== undefined) about.teamMembers = teamMembers;

      await about.save();
      console.log("✅ Updated existing About page");
    }

    res.status(200).json({
      success: true,
      message: "About page updated successfully",
      data: about,
    });
  } catch (error) {
    console.error("❌ Error updating about:", error);
    next(error);
  }
};

// @desc    Delete About page (Reset to default)
// @route   DELETE /api/v1/about
// @access  Private/Admin
export const resetAbout = async (req, res, next) => {
  try {
    await About.deleteMany({});
    console.log("🗑️ Deleted existing About page");

    const about = await About.create({
      title: "Welcome to Our Gym",
      description: "Transform your life with us",
      mission:
        "Our mission is to empower individuals to achieve their fitness goals",
      vision: "Our vision is to create a healthier world",
      videos: [
        {
          youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          topic: "Gym Tour",
          description: "Virtual tour of our facility",
          order: 1,
        },
      ],
      stats: [
        { label: "Happy Members", value: "12000+", icon: "users" },
        { label: "Expert Trainers", value: "50+", icon: "dumbbell" },
        { label: "Success Stories", value: "5000+", icon: "trophy" },
        { label: "Years Experience", value: "15+", icon: "award" },
      ],
    });

    console.log("✅ Reset About page to default");

    res.status(200).json({
      success: true,
      message: "About page reset to default",
      data: about,
    });
  } catch (error) {
    console.error("❌ Error resetting about:", error);
    next(error);
  }
};