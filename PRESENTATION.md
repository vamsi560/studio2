# Sahayak AI: Presentation

## 1. Brief About the Idea

**Sahayak AI** is a generative AI-powered teaching companion designed specifically to support teachers, with a special focus on the unique challenges faced by educators in rural and multi-grade classrooms. It acts as an intelligent assistant, automating time-consuming tasks, generating customized educational content, and providing instant support, thereby freeing up teachers to focus on what they do best: teaching and connecting with their students.

## 2. Differentiation & Unique Selling Proposition (USP)

### How is it different?

While many ed-tech tools exist, Sahayak AI is uniquely positioned by its sharp focus on the "last-mile" educator. Unlike generic platforms, every feature is built to address the specific pain points of teachers in resource-constrained environments:

*   **Hyper-Localization:** It goes beyond simple translation, generating content that is culturally and contextually relevant to students in specific regions (e.g., using local landmarks in a math problem).
*   **Multi-Grade, Single-Source:** The Differentiated Worksheet generator is a standout feature that creates multiple grade-appropriate materials from a single source (like a textbook photo), a direct solution for the common multi-grade classroom challenge.
*   **Low-Tech Classroom Friendly:** Features like the Visual Aid Generator are designed to create simple drawings that can be easily replicated on a physical blackboard, acknowledging that digital whiteboards aren't always available.
*   **All-in-One Companion:** It consolidates multiple tools (content creation, assessment, planning, grading) into one simple, intuitive interface, reducing the need for teachers to learn and juggle multiple apps.

### How will it solve the problem?

Sahayak AI directly tackles the core problems of:
*   **Teacher Burnout:** By automating tasks like lesson planning, worksheet creation, and grading, it drastically reduces administrative workload.
*   **Resource Scarcity:** It provides an infinite well of custom teaching materials, stories, and visual aids, eliminating the need for expensive physical resources.
*   **Educational Inequality:** It empowers teachers in underserved areas with the same high-quality, AI-driven tools available in more affluent districts, helping to bridge the educational gap.
*   **Student Engagement:** Through localized content and creative tools like Story Weaver, it makes learning more relatable, fun, and effective for students.

### Unique Selling Proposition (USP)

**"Sahayak AI is the hyper-local, all-in-one AI teaching companion that empowers teachers in the most demanding classrooms to create personalized and engaging learning experiences with ease."**

## 3. List of Features Offered

1.  **Hyper-Local Content Generator:** Creates lesson materials in any specified local language, tailored to a topic and grade level.
2.  **Lesson Planner:** Generates comprehensive, interactive lesson plans, including objectives, activities, materials, and assessment questions.
3.  **Differentiated Worksheet Generator:** Generates multiple worksheets for different grade levels from a single photo of a textbook page.
4.  **Instant Knowledge Base:** Provides simple, analogy-based explanations for complex student questions in the local language.
5.  **Visual Aid Design:** Creates simple, blackboard-friendly line drawings and charts from a text description.
6.  **Story Weaver with TTS:** Weaves engaging children's stories from prompts and converts the text to audible speech.
7.  **Assessment Generator:** Creates quizzes and tests with various question types (Multiple Choice, Short Answer, etc.) for any topic and grade.
8.  **AI Paper Grader:** Automatically grades student answer sheets from an uploaded image, either using a provided answer key or its own subject matter expertise.

## 4. Process Flow Diagram (Use-Case)

This diagram illustrates a typical user (teacher) journey through the app.

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
[ Selects a Feature from Dropdown ]
  |
  |---[ Use Case: Generate Worksheet ]
  |      |
  |      V
  |      1. Uploads Textbook Photo
  |      2. Enters Grade Levels (e.g., "3rd, 5th")
  |      3. Clicks "Generate"
  |      |
  |      V
  |   ( System: AI Flow Processes Image & Text )
  |      |
  |      V
  |      4. Receives Differentiated Worksheets
  |
  |---[ Use Case: Grade Paper ]
  |      |
  |      V
  |      1. Uploads Student Answer Sheet Image
  |      2. Selects Grading Mode (Key vs. AI)
  |      3. Provides Answer Key or Topic
  |      4. Clicks "Grade"
  |      |
  |      V
  |   ( System: AI Flow Grades Paper )
  |      |
  |      V
  |      5. Receives Graded Report with Score
  |
  |---[ (Other Features Follow Similar Flow) ]
```

## 5. Technologies Used

*   **Frontend Framework:** Next.js (with React)
*   **UI Components:** ShadCN UI, Radix UI
*   **Styling:** Tailwind CSS
*   **Animation:** Framer Motion
*   **Generative AI Toolkit:** Google's Genkit
*   **AI Models:** Google's Gemini family of models (including Vision, Pro, and TTS)
*   **Language:** TypeScript
*   **Deployment:** Firebase App Hosting

## 6. Architecture Diagram

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
