# Kubernetes Project Implementation Guide

## Introduction

This guide will walk you through implementing a Kubernetes cluster setup project using Minikube, Docker, and GitHub Actions. Follow each step carefully and document your progress for your project report.

## Project Timeline

- **Form Submission Deadline**: May 7, 2025 (Wednesday)
- **Project Report Submission**: May 12, 2025 (Monday)
- **Viva Date**: To be announced

## Step 1: Environment Setup

### Choose Your Operating System
- Select an operating system (Windows, macOS, or Linux)
- Document your reasoning for this choice (required for report)
- Consider factors like compatibility, performance, and ease of use

### Install Docker
- Go to the Docker website and download Docker Desktop for your OS
- Follow the installation instructions
- After installation, open terminal/command prompt and run `docker --version` to verify
- Test with `docker run hello-world` to ensure it works properly

### Install Minikube
- Visit the Minikube website and download the appropriate version
- Follow the installation instructions for your OS
- After installation, run `minikube version` to verify
- Note: Minikube requires virtualization support (VT-x/AMD-v)

### Install kubectl
- Visit the Kubernetes website and download kubectl
- Follow the installation instructions for your OS
- After installation, run `kubectl version --client` to verify
- Make sure it's in your PATH for easy access

### Document Environment Details
- Record your OS version and reason for selection
- Note Docker, Minikube, and kubectl versions
- Take screenshots of successful installations
- This will be included in your project report

## Step 2: Web Application Selection

### Choose Your Application
- Option 1: Use an existing MERN application from a previous semester
- Option 2: Create a new web application with frontend, backend, and database
- Requirement: Application must be more complex than a single page or to-do list

### Organize Your Project Structure
- Create a main project folder
- Set up directories for your application code
- Ensure proper separation of frontend and backend components
- Test your application locally before proceeding

## Step 3: Containerization

### Create Separate Dockerfiles for Frontend and Backend
- Create two separate Dockerfiles:
  - `frontend/Dockerfile` for your frontend application
  - `backend/Dockerfile` for your backend application
- For each Dockerfile:
  - Define appropriate base image (e.g., node:18 for Node.js, python:3.9 for Python)
  - Set up working directory
  - Copy application files
  - Install dependencies
  - Specify how to run each component
- This separation follows microservices best practices
- Document your Dockerfile creation process with screenshots for both

### Build and Test Containers
- Build frontend image: `docker build -t my-frontend:latest ./frontend`
- Build backend image: `docker build -t my-backend:latest ./backend`
- Run frontend container: `docker run -p FRONTEND_PORT:FRONTEND_PORT my-frontend:latest`
- Run backend container: `docker run -p BACKEND_PORT:BACKEND_PORT my-backend:latest`
- Verify both containers work correctly
- Test communication between containers if applicable
- Document this process with screenshots

## Step 4: Version Control Setup

### Create GitHub Repository
- Go to GitHub and create a new repository
- Give it a descriptive name related to your project
- Make it public for easy access

### Initialize Git Repository
- Open terminal in your project directory
- Initialize git with `git init`
- Add your files with `git add .`
- Commit with `git commit -m "Initial commit"`
- Link to your GitHub repository with `git remote add origin URL`
- Push to GitHub with `git push -u origin main`

### Create README.md
- Create a comprehensive README.md file
- Include project description
- List technologies used
- Provide setup and running instructions
- Add team member information
- Push this to GitHub

## Step 5: Docker Hub Setup

### Create Docker Hub Account
- Go to Docker Hub website and create an account
- Verify your email

### Create Repositories
- Create two repositories on Docker Hub:
  - One for frontend (e.g., my-frontend)
  - One for backend (e.g., my-backend)
- Set visibility (public or private) for both

### Push Images to Docker Hub
- Login to Docker Hub from terminal: `docker login`
- Tag your frontend image: `docker tag my-frontend:latest username/my-frontend:latest`
- Tag your backend image: `docker tag my-backend:latest username/my-backend:latest`
- Push frontend image: `docker push username/my-frontend:latest`
- Push backend image: `docker push username/my-backend:latest`
- Verify both images appear in your Docker Hub repositories
- Document this entire process with screenshots

## Step 6: Kubernetes Configuration Files

### Create namespace.yaml
- Create a file named `namespace.yaml`
- Define a new namespace for your project
- This namespace will isolate your resources from others
- Document this file creation

### Create Separate Deployment Files
- Create two deployment files:
  - `frontend-deployment.yaml` for frontend
  - `backend-deployment.yaml` for backend
- For each deployment file:
  - Define how each component should be deployed
  - Specify number of replicas (e.g., 2)
  - Reference the corresponding Docker Hub image
  - Specify appropriate container ports
  - Use your custom namespace
  - Set resource limits if necessary
- Document the creation of both files with screenshots

### Create Separate Service Files
- Create two service files:
  - `frontend-service.yaml` for frontend
  - `backend-service.yaml` for backend
- For frontend service:
  - Use NodePort type for external access
  - Specify port mappings
  - Reference your frontend deployment
  - Use your custom namespace
- For backend service:
  - Use ClusterIP type (internal access) or NodePort as needed
  - Specify port mappings
  - Reference your backend deployment
  - Use your custom namespace
- Document the creation of both files with screenshots

## Step 7: Minikube Deployment

### Start Minikube
- Run `minikube start` to initialize your local Kubernetes cluster
- Wait for it to complete
- Document this process with screenshots

### Configure Docker to Use Minikube
- Run `eval $(minikube docker-env)` to point Docker to Minikube's daemon
- Document this step

### Create Namespace
- Run `kubectl apply -f namespace.yaml` to create your namespace
- Verify with `kubectl get namespaces`
- Document this step

### Deploy Application
- Run `kubectl apply -f frontend-deployment.yaml` to create your frontend deployment
- Run `kubectl apply -f backend-deployment.yaml` to create your backend deployment
- Run `kubectl apply -f frontend-service.yaml` to create your frontend service
- Run `kubectl apply -f backend-service.yaml` to create your backend service
- Document these commands with screenshots

### Verify Deployment
- Run `kubectl get pods -n your-namespace -o wide` to see your pods
- Run `kubectl get services -n your-namespace -o wide` to see your services
- Run `kubectl get deployments -n your-namespace -o wide` to see your deployments
- Run `kubectl get nodes -o wide` to see your nodes
- Document all outputs with screenshots

### Access Your Application
- Run `minikube service service-name -n your-namespace` to access your application
- This will open your application in a browser
- Document this step with screenshots

## Step 8: GitHub Actions CI/CD Setup

### Set Up GitHub Secrets
- Go to your repository on GitHub
- Navigate to Settings > Secrets and variables > Actions
- Add Docker Hub credentials as secrets:
  - DOCKER_USERNAME
  - DOCKER_PASSWORD

### Set Up Self-Hosted Runner
- Go to your repository on GitHub
- Navigate to Settings > Actions > Runners
- Click "New self-hosted runner"
- Follow the instructions to set up on your machine
- Keep the runner running during development
- Document this process with screenshots

### Create GitHub Actions Workflow
- Create a directory `.github/workflows` in your project
- Create a file `deploy.yml` in this directory
- Define triggers (e.g., push to main branch)
- Define jobs and steps:
  - Checkout code
  - Configure Docker with Minikube
  - Build both frontend and backend Docker images
  - Push both images to Docker Hub
  - Deploy all Kubernetes manifests to Minikube
  - Verify deployment of all components
- Make sure your workflow handles both frontend and backend components
- Document this process with screenshots

### Test CI/CD Pipeline
- Make a small change to your application
- Commit and push to GitHub
- Watch the GitHub Actions workflow run
- Verify the deployment happens automatically
- Document this process with screenshots

## Step 9: Document Issues and Solutions

### Document At Least 5 Issues
For each issue:
- Clearly describe the problem
- Include screenshots showing the error
- Explain your approach to solving it
- Document the final solution
- Include commands used to resolve the issue

Possible issues to document:
1. Docker installation or permission issues
2. Minikube resource limitations
3. Kubernetes deployment errors
4. GitHub Actions configuration problems
5. Container networking issues
6. Application configuration in Kubernetes
7. Self-hosted runner connectivity issues

## Step 10: Prepare Project Report

### Include All Required Sections
- Step-by-step explanation of all project steps
- Environment details (OS, versions)
- Screenshots for all major steps
- Commands used with explanations
- At least 5 issues faced and solutions
- Project running instructions
- OS choice justification

### Format Report Professionally
- Use clear section headings
- Include a table of contents
- Number steps and sections
- Include team member information
- Use proper formatting for commands and file contents

## Step 11: Project Submission

### Submit Google Form
- Fill in the required Google Form by May 7, 2025
- Form link: [Project Submission Form](https://docs.google.com/forms/d/e/1FAIpQLSdsyQK29lKDeZ1iK3WiLKYCZRxm23w8RUCIx9VT-izB3VrmOQ/viewform?usp=sharing)

### Submit Project Report
- Submit your project report by May 12, 2025
- Follow the submission instructions provided by your instructor

### Prepare for Viva
- Be ready to demonstrate your project
- Review all steps and concepts
- Ensure your application and CI/CD pipeline are working
- Be prepared to answer questions about your implementation

## Final Project Structure

Your project should have the following structure:
```
├── frontend/ (frontend application code)
│   └── Dockerfile
├── backend/ (backend application code)
│   └── Dockerfile
├── kubernetes/
│   ├── namespace.yaml
│   ├── frontend-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-service.yaml
│   └── backend-service.yaml
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

## Conclusion

Following this implementation guide will help you successfully complete your Kubernetes project. Remember to document every step thoroughly with screenshots and explanations for your project report. Good luck!