# NextGen Academy 🎓

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

## 🚢 Containerization and Kubernetes Deployment

### Docker Setup
The application is containerized using Docker:

```bash
# Build the backend image
cd backend
docker build -t nextgen-academy-backend .

# Build the frontend image
cd ../frontend
docker build -t nextgen-academy-frontend .

# Run the containers
docker run -d --name nextgen-backend -p 8081:8080 -e MONGODB_URI=mongodb://host.docker.internal:27017/nextgen-academy nextgen-academy-backend
docker run -d --name nextgen-frontend -p 3000:3000 -e REACT_APP_API_URL=http://localhost:8081/api nextgen-academy-frontend
```

### Kubernetes Deployment
The application is configured for Kubernetes deployment using Minikube:

1. Start Minikube:
```bash
minikube start
```

2. Deploy the application:
```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Deploy backend
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml

# Deploy frontend
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
```

3. Access the application:
```bash
minikube service nextgen-frontend-service -n nextgen-academy
```

See the `kubernetes/README.md` file for more detailed instructions and configuration options.
