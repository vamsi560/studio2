# Sahayak AI: Your AI Teaching Companion

## 1. Brief About the Idea

**Sahayak AI** is a generative AI-powered teaching companion designed specifically to support teachers, with a special focus on the unique challenges faced by educators in rural and multi-grade classrooms. It acts as an intelligent assistant, automating time-consuming tasks, generating customized educational content, and providing instant, multi-modal support, thereby freeing up teachers to focus on what they do best: teaching and connecting with their students.

## 2. Differentiation & Unique Selling Proposition (USP)

### How is it different from other tools?

While many ed-tech tools exist, Sahayak AI is uniquely positioned by its sharp focus on the "last-mile" educator. Unlike generic platforms, every feature is built to address the specific pain points of teachers in resource-constrained environments:

*   **Hyper-Localization:** It goes beyond simple translation. Sahayak AI generates content that is culturally and contextually relevant (e.g., using local landmarks in math problems) and can do so in numerous regional languages, making learning relatable.
*   **Multi-Modal AI Integration:** It doesn't just process text. It understands and analyzes **images** (for grading papers and creating worksheets from photos), **video**, and **audio** (for grading oral presentations and providing live coaching), making it a truly versatile assistant.
*   **All-in-One Workflow Consolidation:** It's not a single-trick pony. It consolidates multiple, time-consuming tasks—lesson planning, content creation, assessment generation, worksheet differentiation, grading, and even creative storytelling—into one simple, intuitive interface. This reduces the cognitive load on teachers, who no longer need to learn and juggle multiple disparate apps.
*   **Designed for Resource-Constrained Classrooms:** The core philosophy is to create practical outputs. The Visual Aid generator creates simple line drawings that can be easily replicated on a physical blackboard, acknowledging that digital whiteboards are not a given.

### How will it solve the problem?

Sahayak AI directly tackles the core problems of:
*   **Teacher Burnout:** By automating tasks like lesson planning, differentiated worksheet creation, and grading both written and oral work, it drastically reduces the administrative workload that consumes a teacher's valuable time.
*   **Resource Scarcity:** It provides a virtually infinite well of custom teaching materials, stories, and visual aids, eliminating the need for expensive physical resources or time spent searching for them online.
*   **Educational Inequality:** It empowers teachers in underserved areas with the same high-quality, AI-driven tools that are typically only available in more affluent districts, helping to bridge the educational gap.
*   **Student Engagement:** Through localized content, creative tools like the Storybook Illustrator, and interactive feedback mechanisms like the Live Practice Coach, it makes learning more personalized, relatable, and effective.

### Our Unique Selling Proposition (USP)

**"Sahayak AI is the hyper-local, all-in-one AI teaching companion that empowers teachers in the most demanding classrooms to create personalized and engaging multi-modal learning experiences with unprecedented ease."**

## 3. Unique & Advanced Features

These are some of the standout features that make Sahayak AI truly innovative:

*   **AI Paper Grader (Dual Mode):** Upload an image of a student's answer sheet. The AI can grade it either by comparing it to a provided answer key or by using its own subject matter expertise for a given topic—offering unparalleled flexibility.
*   **Oral Presentation Grader & Live Coach (Video Analysis):** This feature leverages powerful multi-modal AI (Gemini 1.5 Pro) to analyze video. Teachers can upload a recording for asynchronous grading, or students can use their webcam to get real-time, private feedback on their public speaking skills.
*   **Storybook Illustrator (Generative Creativity):** A unique tool that doesn't just write a story. It also generates a series of beautiful, original illustrations for key scenes and can convert the entire story to audio with a text-to-speech "read aloud" feature, creating a complete digital storybook from a simple prompt.
*   **Differentiated Worksheet Generator (from a Photo):** Addresses a key pain point for multi-grade classrooms. A teacher can simply take a photo of a single textbook page, and the AI will automatically generate multiple, grade-appropriate worksheets from that content.

## 4. Complete List of Features Offered

1.  **Hyper-Local Content Generator:** Creates lesson materials in any specified local language, tailored to a topic and grade level.
2.  **Lesson Planner:** Generates comprehensive, interactive lesson plans, including objectives, activities, materials, and assessment questions.
3.  **Differentiated Worksheet Generator:** Generates multiple worksheets for different grade levels from a single photo of a textbook page.
4.  **Instant Knowledge Base:** Provides simple, analogy-based explanations for complex student questions in the local language.
5.  **Visual Aid Design:** Creates simple, blackboard-friendly line drawings and charts from a text description.
6.  **Storybook Illustrator with TTS:** Weaves engaging children's stories, illustrates them with unique images, and converts the text to audible speech.
7.  **Assessment Generator:** Creates quizzes and tests with various question types (Multiple Choice, Short Answer, etc.) for any topic and grade.
8.  **AI Paper Grader:** Automatically grades student answer sheets from an uploaded image, either using a provided answer key or its own subject matter expertise.
9.  **Oral Presentation Grader:** Grades a student's presentation by analyzing an uploaded video for content, clarity, and engagement.
10. **Live Practice Coach:** Allows students to practice presentations in real-time using their webcam and get instant AI feedback.
11. **Step-by-Step Problem Solver:** Solves complex problems in Math, Physics, and Chemistry with detailed, step-by-step explanations.

## 5. Process Flow Diagram (Use-Case)

This diagram illustrates a typical user (teacher) journey through the app, highlighting an advanced feature.

```
(User: Teacher)
       |
       V
[ Enters App / Login Page ]
       |
       V
[ Authenticates ]
       |
       V
[ Lands on Dashboard ]
       |
       V
[ Selects 'Paper Grader' ]
       |
       V
       1. Uploads Student Answer Sheet Image
       2. Selects Grading Mode: "AI-Assisted"
       3. Enters Topic: "The Solar System"
       4. Clicks "Grade"
       |
       V
   ( System: AI Flow Reads Image, Acts as Subject Expert )
       |
       V
       5. Receives Graded Report with Score, Correct Answers, and Reasoning
```

## 6. Technologies Used

*   **Frontend Framework:** Next.js (with React)
*   **UI Components:** ShadCN UI, Radix UI
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion
*   **Generative AI Toolkit:** Google's Genkit
*   **AI Models:** Google's Gemini family of models (including Gemini Pro, Gemini 1.5 Pro with Vision, Image Generation, and TTS)
*   **Language:** TypeScript
*   **Deployment:** Firebase App Hosting

## 7. Architecture Diagram

The application follows a modern, serverless architecture leveraging Next.js on Firebase.

```
+-------------------+      +-------------------------+      +---------------------+
|   User's Browser  | ---- |   Firebase App Hosting  | ---- |    Google Cloud     |
| (Next.js Client)  |      | (Next.js Server)        |      | (Genkit AI Services)|
+-------------------+      +-------------------------+      +---------------------+
         |                          |                                |
         | Renders UI,              |                                |
         | Handles User Input       |                                |
         |                          |                                |
         |------------------------->| 1. User action triggers        |
         | (e.g., Form Submission)  |    Server Action               |
         |                          |                                |
         |                          | 2. Server Action calls         |
         |                          |    the relevant AI flow        |
         |                          |    (e.g., paperGrader)         |
         |                          |------------------------------->| 3. Genkit flow executes
         |                          |                                |    - Formats prompt
         |                          |                                |    - Calls Gemini API
         |                          |                                |
         |                          |<-------------------------------| 4. Gemini returns structured
         |                          |                                |    JSON/Image/Audio data
         |                          |                                |
         |                          | 5. Flow returns result to      |
         |                          |    Server Action               |
         |                          |                                |
         |<-------------------------| 6. Server Action returns       |
         | (Renders Result)         |    data to the client          |
         |                          |                                |

```

**Explanation:**
1.  **Client-Side (Browser):** The user interacts with the React components built with Next.js and ShadCN. The UI is interactive and responsive.
2.  **Server-Side (Firebase App Hosting):** When a user triggers an AI feature, it calls a **Next.js Server Action**. This keeps the AI logic securely on the server.
3.  **AI Logic (Genkit Flows):** The Server Action invokes a specific **Genkit Flow**. These flows are TypeScript functions that orchestrate the interaction with the AI model. They define the input/output schemas, construct the prompt, and call the Gemini model.
4.  **Google Cloud (AI Models):** Genkit communicates securely with Google's AI services to get the result from the powerful Gemini models.
5.  **Data Flow Back:** The result (e.g., JSON data for a lesson plan, an image data URI for a visual aid) flows back through Genkit to the Server Action, and finally to the client, where it is rendered in the UI.

This architecture is robust, scalable, and secure, as all sensitive API calls and business logic are handled on the server, not exposed in the user's browser.
