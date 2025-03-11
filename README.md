# NextGen Academy 🎓
HAFSA WAQAR
LAB 7
this is a change to create conflict

A modern Learning Management System (LMS) built with the MERN stack, featuring AI integration and interactive learning experiences.

## ✨ Key Features

### 👨‍🏫 Instructor Features
- Course Management (Create, Edit, Delete)
- Video Management (Upload, YouTube Integration)
- Quiz Creation & Management
- Discussion Forums
- Course Analytics & Reports
- Student Feedback Management
- Progress Tracking

### 👨‍🎓 Student Features
- Course Enrollment & Progress Tracking
- Video Learning with Progress Tracking
- Quiz Participation
- Discussion Forum Interaction
- Course Ratings & Reviews
- AI-Powered Learning Assistant
- Progress Analytics

## 🛠️ Tech Stack

### Frontend
- React.js 18
- TailwindCSS
- Context API
- React Router v6
- Framer Motion
- React Particles

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Passport.js
- Express Rate Limit

## 🔌 Integrations
- Cloudinary (Media Storage)
- YouTube Data API
- Google OAuth 2.0
- GitHub OAuth
- Google Gemini AI
- Gmail SMTP

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm/yarn

### Installation

1. Clone & Install
```bash
git clone https://github.com/yourusername/NextGen-Academy.git
cd NextGen-Academy

# Install dependencies
cd backend && npm install
cd frontend && npm install
```

2. Environment Setup

Backend `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/NextGenAcademy
JWT_SECRET=your_secret
PORT=8080
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_pass
GOOGLE_CLIENT_ID=your_id
GITHUB_CLIENT_ID=your_id
YOUTUBE_API_KEY=your_key
GOOGLE_AI_API_KEY=your_key
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_name
REACT_APP_CLOUDINARY_API_KEY=your_key
```

3. Start Application
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start
```

## 📄 License
MIT License - see [LICENSE](LICENSE)
