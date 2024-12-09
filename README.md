# NextGen Academy 🎓

A comprehensive MERN Stack Learning Management System (LMS) designed to provide an interactive and engaging educational experience.

## 🌟 Features

### For Instructors
- **Course Management**
  - Create and manage courses
  - Organize course content
  - Set course difficulty levels
  - Track student enrollments
  - Monitor course completion rates
  - Manage course sequence
  - Add/remove course content

- **Video Management**
  - Upload videos directly
  - Integrate YouTube videos
  - Organize video content
  - Track video views
  - Monitor video completion rates
  - Video analytics

- **Quiz Management**
  - Create interactive quizzes
  - Multiple question types
  - Set quiz parameters
  - Track student performance
  - Quiz analytics
  - Auto-grading system

- **Discussion Management**
  - Create discussion forums
  - Moderate discussions
  - Reply to student comments
  - Track forum engagement
  - Forum analytics

- **Course Analytics**
  - Enrollment statistics
  - Completion rates
  - Student progress tracking
  - Performance metrics
  - Downloadable reports (PDF/Excel)
  - Visual analytics dashboard

- **Feedback Management**
  - View course ratings
  - Respond to student feedback
  - Track rating metrics
  - Rating analytics
  - Manage student reviews

### For Students
- **Course Access**
  - Browse available courses
  - Search and filter courses
  - Course recommendations
  - Track course progress
  - Resume from last position
  - Course completion certificates

- **Learning Experience**
  - Watch educational videos
  - Track video progress
  - Interactive video player
  - Course progress tracking
  - Visual progress indicators
  - Seamless content navigation

- **Assessment System**
  - Take course quizzes
  - View quiz results
  - Track quiz performance
  - Progress tracking
  - Performance analytics
  - Instant feedback

- **Interactive Features**
  - Participate in discussions
  - Rate and review courses
  - Comment on forums
  - Interact with instructors
  - Community engagement
  - Real-time updates

- **NextGen AI Chatbot**
  - AI-powered assistance
  - Course-related queries
  - Learning recommendations
  - 24/7 support
  - Context-aware responses
  - Chat history tracking

- **Progress Tracking**
  - Course progress bars
  - Video completion tracking
  - Quiz performance metrics
  - Overall learning progress
  - Achievement tracking
  - Learning analytics

## 🛠️ Technical Features
- JWT Authentication
- Role-based access control
- Email verification
- Password reset functionality
- File upload to Cloudinary
- Responsive design
- Real-time updates
- Advanced search and filtering
- Data visualization
- PDF/Excel report generation

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/NextGen-Academy.git
cd NextGen-Academy
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Set up environment variables

Backend `.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
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

4. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend application
cd frontend
npm start
```

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
