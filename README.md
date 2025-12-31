# 🎓 KIRA - Personal AI Learning Companion

[KIRA Banner](https://via.placeholder.com/1200x400?text=KIRA+Personal+AI+Learning+Companion)

> Transforming static study materials into interactive learning experiences using the power of Google Gemini AI.

[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

## 📖 About The Project

**KIRA**  is a **Mobile Web** application designed to help students overcome *information overload*.

KIRA goes beyond simple summarization. Powered by **Google Gemini AI**, it reads lecture documents (PDFs/Photos), breaks them down into tiered summaries (Basic/Intermediate/Advanced), automatically generates adaptive quizzes, and provides a personal AI Tutor ready to answer contextual questions 24/7.

Built specifically for the **2025 Hackathon**.

## ✨ Key Features

### 🧠 1. Smart Summarizer
* **Multi-Level Summary:** Choose the depth of the material according to your needs (Basic, Intermediate, or Advanced).
* **Document Parsing:** Supports PDF file uploads and text documents.
* **Cloud Storage:** Secure material storage using **Cloudinary**.

### 🎯 2. Quiz Generator
 **Instant Assessment:** Turn study material into 10-20 multiple-choice questions in seconds.
 **Real-time Scoring:** Get immediate scores and explanations for right/wrong answers.
 **Progress Tracking:** Monitor your learning development.

### 💬 3. AI Tutor (Contextual Chatbot)
 **RAG Technology:** Ask specific questions based on the uploaded material, avoiding generic internet answers.
 **24/7 Mentor:** Request re-explanations, simple analogies, or case studies anytime.

## 🛠️ Tech Stack

This application is built using modern technologies for high performance on mobile devices:

 **Frontend:** HTML5, CSS3, JavaScript (Responsive Web Mobile)
 **AI Engine:** Google Gemini API (Generative AI)
 **Authentication & Database:** Google Firebase (Auth & Firestore)
 **File Storage:** Cloudinary (Optimized Media Management)

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### Prerequisites
* Node.js & NPM installed
* Google Cloud Account (for Gemini & Firebase API Keys)
* Cloudinary Account

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/andikaPalian/project-hackathon.git](https://github.com/andikaPalian/project-hackathon.git)
    cd project-hackathon
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment (.env)**
    Create a `.env` file in the root folder and fill it with your credentials:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_firebase_key
    REACT_APP_GEMINI_API_KEY=your_gemini_key
    REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
    ```

4.  **Run the Application**
    ```bash
    npm start
    ```
    Open `https://kirahackathon.vercel.app/ ` in your browser.

## 🗺️ Roadmap

Future features currently under development:

* [ ] **KIRA Pro Subscription:** Unlimited uploads & increased file size capacity.
* [ ] **Snap & Learn (OCR):** Photo of handwritten notes/whiteboard -> Instant Quiz conversion.
* [ ] **Turbo Mode:** Optimized backend queries for <500ms AI response time.

## 🤝 Contribution

Contributions are welcome! Please fork this repository and create a Pull Request for new features or bug fixes.

1.  Fork Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request