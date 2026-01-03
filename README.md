# 🎓 KIRA - Personal AI Learning Companion

<p align="center">
  <img src="./frontend/src/image/kira.svg" alt="KIRA Logo" width="120" />
</p>

<p align="center">
  <strong>Transforming static study materials into interactive learning experiences using the power of Google Gemini AI.</strong>
  <br />
  <em>"Learning Made Directional, Not Just Answered."</em>
</p>

<p align="center">
  <a href="https://deepmind.google/technologies/gemini/"><img src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google" alt="Gemini AI"></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase" alt="Firebase"></a>
  <a href="https://cloudinary.com/"><img src="https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary" alt="Cloudinary"></a>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 📖 About The Project

**KIRA** is a high-performance **Mobile Web** application designed to help students overcome _information overload_. Built specifically for the **2025 Hackathon**, KIRA goes beyond simple summarization.

Powered by **Google Gemini 2.5 Flash**, it analyzes lecture documents (PDFs/Photos), breaks them down into tiered summaries, generates adaptive quizzes, and provides a personal AI Tutor ready to answer contextual questions 24/7.

## ✨ Key Features

### 🧠 1. Smart Summarizer (Exam Ready)

- **Multi-Level Summary:** Choose the depth of the material according to your needs: Basic, Intermediate, or Advanced.
- **Document Parsing:** Advanced extraction from PDFs and text documents using **OfficeParser**.
- **Smart Checklists:** Automatically generates study checklists to ensure all exam topics are covered.

### 🎯 2. Quiz Generator

- **Instant Assessment:** Turn long study materials into 10-20 multiple-choice questions in seconds.
- **Real-time Scoring:** Get immediate feedback and explanations for every answer.
- **Total Mastery Tracking:** Monitor your learning development with an intuitive progress dashboard.

### 💬 3. AI Tutor & Discussion

- **Contextual RAG Chatbot:** Ask specific questions based on your uploaded material, avoiding generic internet answers.
- **Gemini Live Integration:** Interact with your materials via real-time voice and screen sharing through your mobile device.
- **24/7 Mentor:** Request re-explanations, simple analogies, or case studies anytime.

## 🛠️ Tech Stack

### Frontend

- **React.js (Vite)** & **TypeScript**
- **Tailwind CSS** & **Shadcn UI** (Radix UI)
- **Lucide React** (Icons)

### Backend & AI

- **Node.js** & **Express**
- **Google Gemini 2.5 Flash API**: The core model for high-fidelity text and media generation.
- **Cloudinary**: Secure and optimized cloud media storage.

### Infrastructure

- **Firebase Authentication**: Secure Google & Email Login integration.
- **Vercel**: High-performance deployment with Single Page Application (SPA) routing support.

## 🏗️ Architecture Design

The system utilizes a modern cloud-based architecture:

1. **User Input**: Uploads files or shares screen/camera via Gemini Live.
2. **Processing**: Backend parses data and leverages Gemini 2.5 Flash for synthesis.
3. **Storage**: Cloudinary handles media while Firebase manages users and authentication.

## 🚀 Getting Started

### Prerequisites

- Node.js & NPM installed
- Google Cloud Account (Gemini API Key)
- Firebase & Cloudinary Credentials

### Installation

1. **Clone the Repository**

   ```bash
   git clone [https://github.com/andikaPalian/project-hackathon.git](https://github.com/andikaPalian/project-hackathon.git)
   cd project-hackathon
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment (.env)**
   Create a `.env` file in the root folder and fill it with your credentials:

   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_key
   REACT_APP_GEMINI_API_KEY=your_gemini_key
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

4. **Run the Application**
   ```bash
   npm start
   ```
   Open `https://kirahackathon.vercel.app/ ` in your browser.

## 🗺️ Roadmap

Future features currently under development:

- [ ] **KIRA Pro Subscription:** Unlimited uploads & increased file size capacity.
- [ ] **Snap & Learn (OCR):** Photo of handwritten notes/whiteboard -> Instant Quiz conversion.
- [ ] **Turbo Mode:** Optimized backend queries for <500ms AI response time.

## 🤝 Contribution

Contributions are welcome! Please fork this repository and create a Pull Request for new features or bug fixes.

1.  Fork Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

