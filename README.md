# NextGen Academy 🎓

A comprehensive MERN Stack Learning Management System (LMS) designed to provide an interactive and engaging educational experience.

## 🌟 Features

### For Students
- **Course Management**
  - Browse and enroll in courses
  - Track course progress
  - Access course content (videos, quizzes)
  - Rate and review courses
  - View course completion status
  - Course completion certificates

- **Interactive Learning**
  - Watch educational videos (YouTube/Uploaded)
  - Take quizzes and assessments
  - Track quiz scores and performance
  - Real-time progress tracking
  - Resume course from last position

- **Discussion Forums**
  - Participate in course-specific discussions
  - Interact with instructors and peers
  - Post questions and comments
  - Reply to discussions
  - Real-time updates

- **AI-Powered Chatbot**
  - Get instant assistance using Google's Gemini AI
  - Ask course-related questions
  - Receive personalized recommendations
  - Chat history tracking
  - Context-aware responses

### For Instructors
- **Course Creation**
  - Create and manage courses
  - Upload and organize course content
  - Add videos (Upload/YouTube)
  - Create and manage quizzes
  - Monitor student progress

- **Content Management**
  - Video upload to Cloudinary
  - YouTube video integration
  - Quiz creation with multiple types
  - Course material organization
  - Content sequencing

- **Student Management**
  - Track student progress
  - View enrollment statistics
  - Monitor course ratings and feedback
  - Manage forum discussions
  - View student performance analytics

## 🛠️ Technology Stack

### Frontend
- React.js 18
- TailwindCSS for styling
- Context API for state management
- Axios for API requests
- React Icons
- React Router v6
- Date-fns for date formatting
- React Player for video playback

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Passport.js for OAuth
- Google AI (Gemini) for Chatbot
- Cloudinary for media storage
- Nodemailer for emails

### External APIs
- **Cloudinary API**
  - Video and image storage
  - Media optimization
  - Secure content delivery

- **YouTube Data API**
  - Video integration
  - Video metadata fetching
  - Playlist management

- **Google OAuth 2.0**
  - Social login
  - User authentication
  - Profile information

- **GitHub OAuth**
  - Social login integration
  - User authentication
  - Profile information

- **Google Gemini AI**
  - Chatbot functionality
  - Natural language processing
  - Context-aware responses

### Authentication Methods
- JWT-based authentication
- Email/Password login
- Google OAuth login
- GitHub OAuth login
- Password reset functionality
- Email verification

### Security Features
- JWT token authentication
- Role-based access control
- Protected API routes
- Input validation
- XSS protection
- Rate limiting
- Secure password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- API keys for external services

### Installation

1. Clone the repository

```bash
git clone https://github.com/hassanrehman01398/NextGen-Academy.git
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd frontend
npm install
```

4. Set up environment variables

Backend `.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/NextGenAcademy

# Authentication
JWT_SECRET=your_jwt_secret

# Server
PORT=8080

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_FROM=your_email@gmail.com
FRONTEND_URL=http://localhost:3000

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# API Keys
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key
```

Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_key
```

5. Start the application

```bash
# Start backend server
cd backend
npm start

# Start frontend application
cd frontend
npm start
```

## 👥 Authors
- Hassan Rehman - [GitHub](https://github.com/hassanrehman01398)
- Hafsa Waqar - [GitHub](https://github.com/hafsawaqar)

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
