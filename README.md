# Sahayak AI: Your AI Teaching Companion

Sahayak AI is a generative AI-powered teaching companion designed specifically to support teachers, with a special focus on the unique challenges faced by educators in rural and multi-grade classrooms. It acts as an intelligent assistant, automating time-consuming tasks, generating customized educational content, and providing instant support.

## Core Problem It Solves

*   **Teacher Burnout:** Drastically reduces administrative workload by automating lesson planning, worksheet creation, and grading.
*   **Resource Scarcity:** Provides an infinite well of custom teaching materials, stories, and visual aids.
*   **Educational Inequality:** Empowers teachers in underserved areas with high-quality, AI-driven tools.
*   **Student Engagement:** Makes learning more relatable and effective through localized and creative content.

## Features

Sahayak AI offers a comprehensive suite of tools to assist educators:

*   **Local Content Generator:** Creates lesson materials in any specified local language, tailored to a topic and grade level.
*   **Lesson Planner:** Generates comprehensive lesson plans, including objectives, activities, and assessment questions.
*   **Differentiated Worksheets:** Generates multiple worksheets for different grade levels from a single photo of a textbook page.
*   **Instant Knowledge Base:** Provides simple, analogy-based explanations for complex student questions.
*   **Visual Aid Designer:** Creates simple, blackboard-friendly line drawings and charts from text descriptions.
*   **Storybook Illustrator:** Weaves engaging children's stories and illustrates them with multiple images, complete with a text-to-speech "read aloud" feature.
*   **Assessment Generator:** Creates quizzes with various question types for any topic and grade.
*   **AI Paper Grader:** Grades student answer sheets from an uploaded image, using either a provided answer key or its own subject matter expertise.
*   **Oral Presentation Grader:** Upload a video of a student's presentation to get a full transcript, analysis, and grade.
*   **Live Practice Coach:** Allows students to practice presentations in real-time using their webcam and get instant AI feedback.
*   **Step-by-Step Problem Solver:** Solves complex problems in Math, Physics, and Chemistry with detailed, step-by-step explanations.

## Technologies Used

*   **Framework:** [Next.js](https://nextjs.org/) (with React)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **AI Toolkit:** [Genkit](https://firebase.google.com/docs/genkit)
*   **UI:** [ShadCN UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)

## Google / GCP Resources Used

This project leverages the following Google Cloud services:

*   **Firebase App Hosting:** Securely hosts the Next.js frontend and backend server actions.
*   **Google AI (via Genkit):** Provides access to the powerful Gemini family of models for all generative AI tasks:
    *   **Gemini Pro Models:** Used for text generation, reasoning, and complex analysis across most features.
    *   **Gemini Vision Models:** Used for processing images (Paper Grader, Worksheet Generator) and videos (Presentation Grader).
    *   **Gemini Image Generation Models:** Used to create illustrations for the Storybook Illustrator and Visual Aid Designer.
    *   **Gemini Text-to-Speech (TTS) Models:** Used to generate audio for the Story Weaver's "read aloud" feature.

---
*This application was prototyped with Firebase Studio.*
