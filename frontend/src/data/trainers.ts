// data/trainers.ts
// export const trainers = [
//   {
//     slug: "john-carter",
//     name: "John Carter",
//     role: "Gym Trainer",
//     img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "John is a certified gym trainer with 5+ years of experience. He specializes in strength training, bodybuilding, and personalized workout plans.",
//     experience: "5 years",
//     specialties: ["Strength Training", "Bodybuilding", "Personalized Workouts"],
//     certifications: ["Certified Gym Trainer", "Nutrition Expert"],
//     content: [
//       "Customized strength programs",
//       "Diet and nutrition planning",
//       "Body transformation challenges",
//     ],
//     social: {
//       instagram: "https://instagram.com/johnfit",
//       linkedin: "https://linkedin.com/in/johncarter",
//     },
//   },
//   {
//     slug: "emily-johnson",
//     name: "Emily Johnson",
//     role: "Fitness Coach",
//     img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Emily is a fitness coach passionate about nutrition and holistic wellness. She focuses on HIIT, weight loss, and endurance training.",
//     experience: "6 years",
//     specialties: ["HIIT", "Weight Loss", "Endurance Training"],
//     certifications: ["Fitness Coach Certified", "Holistic Nutrition Expert"],
//     content: [
//       "HIIT bootcamps",
//       "Weight management programs",
//       "Endurance & stamina building",
//     ],
//     social: {
//       instagram: "https://instagram.com/emilyfit",
//       linkedin: "https://linkedin.com/in/emilyjohnson",
//     },
//   },
//   {
//     slug: "michael-smith",
//     name: "Michael Smith",
//     role: "Personal Trainer",
//     img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Michael helps clients achieve personal fitness goals with tailored workout routines. Expert in functional training and mobility improvement.",
//     experience: "7 years",
//     specialties: ["Functional Training", "Mobility Improvement", "Weight Management"],
//     certifications: ["Certified Personal Trainer (CPT)", "Functional Training Specialist"],
//     content: [
//       "Functional training routines",
//       "Joint mobility programs",
//       "Personalized weight management",
//     ],
//     social: {
//       instagram: "https://instagram.com/michaelfit",
//       linkedin: "https://linkedin.com/in/michaelsmith",
//     },
//   },
//   {
//     slug: "sophia-williams",
//     name: "Sophia Williams",
//     role: "Yoga & Fitness",
//     img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Sophia is a yoga and fitness trainer blending mindfulness with exercise. She teaches yoga, pilates, and meditation for mind-body balance.",
//     experience: "4 years",
//     specialties: ["Yoga", "Pilates", "Meditation"],
//     certifications: ["Yoga Alliance Certified", "Pilates Instructor"],
//     content: [
//       "Mindfulness yoga sessions",
//       "Pilates & flexibility training",
//       "Meditation for stress relief",
//     ],
//     social: {
//       instagram: "https://instagram.com/sophia_yoga",
//       linkedin: "https://linkedin.com/in/sophiawilliams",
//     },
//   },

//   // Indian Trainers
//   {
//     slug: "rajesh-verma",
//     name: "Rajesh Verma",
//     role: "Gym & Strength Trainer",
//     img: "https://images.unsplash.com/photo-1603415526960-f7e0328e7c96?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Rajesh is an experienced gym trainer from India focusing on strength training and functional workouts for men and women.",
//     experience: "8 years",
//     specialties: ["Strength Training", "Functional Fitness", "Weight Management"],
//     certifications: ["Indian Fitness Academy Certified", "Nutrition Consultant"],
//     content: [
//       "Custom strength programs",
//       "Weight and muscle management",
//       "Functional fitness for all ages",
//     ],
//     social: {
//       instagram: "https://instagram.com/rajeshfit",
//       linkedin: "https://linkedin.com/in/rajeshverma",
//     },
//   },
//   {
//     slug: "anita-sharma",
//     name: "Anita Sharma",
//     role: "Yoga & Wellness Coach",
//     img: "https://images.unsplash.com/photo-1588776814546-1a8ebfe1b2fa?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Anita is a certified yoga trainer from India. She specializes in Hatha and Vinyasa yoga, along with holistic wellness programs.",
//     experience: "6 years",
//     specialties: ["Hatha Yoga", "Vinyasa Yoga", "Meditation", "Wellness Programs"],
//     certifications: ["Yoga Alliance Certified", "Holistic Wellness Coach"],
//     content: [
//       "Yoga & meditation sessions",
//       "Holistic wellness programs",
//       "Stress management techniques",
//     ],
//     social: {
//       instagram: "https://instagram.com/anita_yoga",
//       linkedin: "https://linkedin.com/in/anitasharma",
//     },
//   },
//   {
//     slug: "vikram-singh",
//     name: "Vikram Singh",
//     role: "Fitness & Strength Trainer",
//     img: "https://images.unsplash.com/photo-1587740896331-7c1f79b2b899?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Vikram is a professional fitness trainer from India, helping clients build strength, stamina, and maintain a healthy lifestyle.",
//     experience: "10 years",
//     specialties: ["Strength Training", "Endurance", "Body Conditioning"],
//     certifications: ["Certified Personal Trainer (CPT)", "Indian Fitness Academy"],
//     content: [
//       "Strength and conditioning programs",
//       "Endurance and stamina training",
//       "Personalized fitness plans",
//     ],
//     social: {
//       instagram: "https://instagram.com/vikramfit",
//       linkedin: "https://linkedin.com/in/vikramsingh",
//     },
//   },
//   {
//     slug: "neha-kapoor",
//     name: "Neha Kapoor",
//     role: "Yoga & Fitness Trainer",
//     img: "https://images.unsplash.com/photo-1584467735850-b5c832b50e6a?q=80&w=1000&auto=format&fit=crop",
//     description:
//       "Neha is an Indian yoga and fitness trainer focusing on flexibility, core strength, and overall wellness.",
//     experience: "5 years",
//     specialties: ["Yoga", "Pilates", "Flexibility", "Core Strength"],
//     certifications: ["Yoga Alliance Certified", "Fitness Coach"],
//     content: [
//       "Yoga and pilates sessions",
//       "Core strengthening programs",
//       "Flexibility and wellness routines",
//     ],
//     social: {
//       instagram: "https://instagram.com/neha_yoga",
//       linkedin: "https://linkedin.com/in/nehakapoor",
//     },
//   },
// ];
// data/trainers.ts
export const trainers = [
  {
    slug: "john-carter",
    name: "John Carter",
    role: "Gym Trainer",
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
    description:
      "John is a certified gym trainer with 5+ years of experience. He specializes in strength training, bodybuilding, and personalized workout plans.",
    experience: "5 years",
    specialties: ["Strength Training", "Bodybuilding", "Personalized Workouts"],
    certifications: ["Certified Gym Trainer", "Nutrition Expert"],
    content: [
      "Customized strength programs",
      "Diet and nutrition planning",
      "Body transformation challenges",
    ],
    social: {
      instagram: "https://instagram.com/johnfit",
      linkedin: "https://linkedin.com/in/johncarter",
    },
  },
  {
    slug: "emily-johnson",
    name: "Emily Johnson",
    role: "Fitness Coach",
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1000&auto=format&fit=crop",
    description:
      "Emily is a fitness coach passionate about nutrition and holistic wellness. She focuses on HIIT, weight loss, and endurance training.",
    experience: "6 years",
    specialties: ["HIIT", "Weight Loss", "Endurance Training"],
    certifications: ["Fitness Coach Certified", "Holistic Nutrition Expert"],
    content: [
      "HIIT bootcamps",
      "Weight management programs",
      "Endurance & stamina building",
    ],
    social: {
      instagram: "https://instagram.com/emilyfit",
      linkedin: "https://linkedin.com/in/emilyjohnson",
    },
  },
  {
    slug: "michael-smith",
    name: "Michael Smith",
    role: "Personal Trainer",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
    description:
      "Michael helps clients achieve personal fitness goals with tailored workout routines. Expert in functional training and mobility improvement.",
    experience: "7 years",
    specialties: ["Functional Training", "Mobility Improvement", "Weight Management"],
    certifications: ["Certified Personal Trainer (CPT)", "Functional Training Specialist"],
    content: [
      "Functional training routines",
      "Joint mobility programs",
      "Personalized weight management",
    ],
    social: {
      instagram: "https://instagram.com/michaelfit",
      linkedin: "https://linkedin.com/in/michaelsmith",
    },
  },
  {
    slug: "sophia-williams",
    name: "Sophia Williams",
    role: "Yoga & Fitness",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1000&auto=format&fit=crop",
    description:
      "Sophia is a yoga and fitness trainer blending mindfulness with exercise. She teaches yoga, pilates, and meditation for mind-body balance.",
    experience: "4 years",
    specialties: ["Yoga", "Pilates", "Meditation"],
    certifications: ["Yoga Alliance Certified", "Pilates Instructor"],
    content: [
      "Mindfulness yoga sessions",
      "Pilates & flexibility training",
      "Meditation for stress relief",
    ],
    social: {
      instagram: "https://instagram.com/sophia_yoga",
      linkedin: "https://linkedin.com/in/sophiawilliams",
    },
  },

  // Indian Trainers
  {
    slug: "rajesh-verma",
    name: "Rajesh Verma",
    role: "Gym & Strength Trainer",
    img: "https://images.unsplash.com/photo-1603415526960-f7e0328e7c96?q=80&w=1000&auto=format&fit=crop",
    description:
      "Rajesh is an experienced gym trainer from India focusing on strength training and functional workouts for men and women.",
    experience: "8 years",
    specialties: ["Strength Training", "Functional Fitness", "Weight Management"],
    certifications: ["Indian Fitness Academy Certified", "Nutrition Consultant"],
    content: [
      "Custom strength programs",
      "Weight and muscle management",
      "Functional fitness for all ages",
    ],
    social: {
      instagram: "https://instagram.com/rajeshfit",
      linkedin: "https://linkedin.com/in/rajeshverma",
    },
  },
  {
    slug: "anita-sharma",
    name: "Anita Sharma",
    role: "Yoga & Wellness Coach",
    img: "https://images.unsplash.com/photo-1588776814546-1a8ebfe1b2fa?q=80&w=1000&auto=format&fit=crop",
    description:
      "Anita is a certified yoga trainer from India. She specializes in Hatha and Vinyasa yoga, along with holistic wellness programs.",
    experience: "6 years",
    specialties: ["Hatha Yoga", "Vinyasa Yoga", "Meditation", "Wellness Programs"],
    certifications: ["Yoga Alliance Certified", "Holistic Wellness Coach"],
    content: [
      "Yoga & meditation sessions",
      "Holistic wellness programs",
      "Stress management techniques",
    ],
    social: {
      instagram: "https://instagram.com/anita_yoga",
      linkedin: "https://linkedin.com/in/anitasharma",
    },
  },
  {
    slug: "vikram-singh",
    name: "Vikram Singh",
    role: "Fitness & Strength Trainer",
    img: "https://images.unsplash.com/photo-1587740896331-7c1f79b2b899?q=80&w=1000&auto=format&fit=crop",
    description:
      "Vikram is a professional fitness trainer from India, helping clients build strength, stamina, and maintain a healthy lifestyle.",
    experience: "10 years",
    specialties: ["Strength Training", "Endurance", "Body Conditioning"],
    certifications: ["Certified Personal Trainer (CPT)", "Indian Fitness Academy"],
    content: [
      "Strength and conditioning programs",
      "Endurance and stamina training",
      "Personalized fitness plans",
    ],
    social: {
      instagram: "https://instagram.com/vikramfit",
      linkedin: "https://linkedin.com/in/vikramsingh",
    },
  },
  {
    slug: "neha-kapoor",
    name: "Neha Kapoor",
    role: "Yoga & Fitness Trainer",
    img: "https://images.unsplash.com/photo-1584467735850-b5c832b50e6a?q=80&w=1000&auto=format&fit=crop",
    description:
      "Neha is an Indian yoga and fitness trainer focusing on flexibility, core strength, and overall wellness.",
    experience: "5 years",
    specialties: ["Yoga", "Pilates", "Flexibility", "Core Strength"],
    certifications: ["Yoga Alliance Certified", "Fitness Coach"],
    content: [
      "Yoga and pilates sessions",
      "Core strengthening programs",
      "Flexibility and wellness routines",
    ],
    social: {
      instagram: "https://instagram.com/neha_yoga",
      linkedin: "https://linkedin.com/in/nehakapoor",
    },
  },
];
