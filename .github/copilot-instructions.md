# Kubernetes Cluster Setup with Minikube/GitHub Actions/Jenkins

## Project Overview
This guide will walk you through setting up a local Kubernetes cluster using Minikube, deploying a web application, and implementing a CI/CD pipeline with GitHub Actions. This project will help you understand core Kubernetes concepts including pods, services, and deployments.

## Project Requirements
- Groups of exactly 2 students
- Submit the registration form by May 7th, 2025
- Complete project report detailing all steps with instructions
- Only one student needs to submit the final report

## Step 1: Installation of Minikube and Kubectl
### Setting Up Your Local Kubernetes Environment

**Installing Minikube**
1. Visit the [Minikube documentation](https://minikube.sigs.k8s.io/docs/start/) for installation instructions specific to your OS
2. Follow the provided steps to install Minikube on your system
3. Verify installation with `minikube version`

**Installing kubectl**
1. Visit the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/) for kubectl installation
2. Install kubectl using the instructions for your OS
3. Verify installation with `kubectl version --client`

**Important Note**: Minikube requires a container runtime like Docker. Ensure Docker is installed and running on your system before proceeding.

## Step 2: Develop a Web Application
### Creating or Selecting Your Application

1. Choose an existing MERN application from a previous semester or create a new one
2. Your application should have frontend, backend, and database components
3. Complex applications are preferred over simple ones (avoid basic to-do lists or single page apps)
4. Organize your application code under an `/app` folder for better management

**Best Practices**:
- Test your application locally before containerization
- Ensure all dependencies are properly documented
- Create a clear project structure for your application

## Step 3: Containerize Your Application
### Creating a Docker Environment

1. Create a Dockerfile in the root directory of your project
2. Define the base image (e.g., Node.js for a MERN application)
3. Set up the working directory and copy necessary files
4. Install dependencies and define how to run your application
5. Build and test your container locally before proceeding

**Testing Your Container**:
- Build your image with a tag that includes your Docker Hub username
- Run the container locally and verify it works as expected
- Troubleshoot any issues before proceeding to the next step

## Step 4: Push Code to GitHub
### Setting Up Version Control

1. Initialize a Git repository in your project directory (if not done already)
2. Add your files and make an initial commit
3. Create a repository on GitHub
4. Push your code to the GitHub repository
5. Verify all necessary files are available in the repository

**Required Repository Content**:
- Application code
- Dockerfile
- README.md with project description and running instructions
- Any additional necessary files for your application

## Step 5: Create Kubernetes Manifest Files
### Defining Your Kubernetes Resources

1. Create `deployment.yaml` to define how Kubernetes should run your application
   - Set replica count
   - Define container specifications
   - Configure ports and resource requests

2. Create `service.yaml` to expose your application
   - Define service type (e.g., NodePort)
   - Configure port mapping
   - Link to your deployment using selectors

**Best Practices**:
- Place Kubernetes manifest files in the root directory of your project
- Use meaningful names and labels for your resources
- Include comments explaining the purpose of each section

## Step 6: Start the Kubernetes Cluster
### Launching Your Local Environment

1. Start Minikube with `minikube start`
2. Configure your terminal to use Minikube's Docker daemon with `eval $(minikube docker-env)`
3. Verify Minikube is running with `minikube status`

## Step 7: Set Up Docker Hub
### Preparing for Image Distribution

1. Create an account on [Docker Hub](https://hub.docker.com/) if you don't have one
2. Create a new repository for your application
3. Push your locally built image to Docker Hub
4. Verify your image is available in your Docker Hub repository

## Step 8: Set Up GitHub Actions Workflow
### Automating Deployment

1. Set up a self-hosted GitHub Actions runner on your local machine
   - Follow the instructions at GitHub repository settings > Actions > Runners
   - Install and configure the runner on the same machine where Minikube is running

2. Create a `.github/workflows` directory in your repository
3. Create a `deploy.yml` file to define your workflow
   - Configure workflow to trigger on push to main branch
   - Define steps for checkout, building, and deploying your application
   - Add secrets for Docker Hub authentication

**Important**: Add your Docker Hub credentials as GitHub secrets to ensure secure authentication.

## Step 9: Trigger Local Deployment
### Deploying to Kubernetes

1. Ensure your Kubernetes manifest files reference your Docker Hub image
2. Apply your Kubernetes manifest files to your Minikube cluster
3. Verify your application is deployed successfully

**Deployment Commands**:
- Apply deployment with `kubectl apply -f deployment.yaml`
- Apply service with `kubectl apply -f service.yaml`
- Check status with `kubectl get all`

## Step 10: Verify the Deployment
### Testing Your Kubernetes Resources

1. Create a new namespace for your application
2. Check the status of your pods, services, and deployments
3. Ensure everything is running as expected
4. Troubleshoot any issues that arise

**Verification Commands**:
- Create namespace: `kubectl create namespace your-namespace`
- View resources: `kubectl get pods,services,deployments -n your-namespace -o wide`

## Step 11: Access the Application
### Accessing Your Deployed Service

1. Use Minikube's service command to access your application
2. Test the functionality of your deployed application
3. Verify that your CI/CD pipeline works by making changes to your code and pushing them

**Access Command**:
- Access service: `minikube service your-service-name -n your-namespace`

## Project Structure
```

```

## Project Report Requirements
Your final project report should include:

1. **Step-by-Step Explanation**
   - Detailed walkthrough of each project step
   - Environment setup details (OS and version, Minikube version, Docker version, kubectl version)
   - Resource information (pods, services, deployments, nodes)

2. **Screenshots**
   - Visual documentation of each major step
   - Include screenshots of Minikube installation, Docker image building, GitHub repository, GitHub Actions setup, and Kubernetes deployment

3. **Commands and Descriptions**
   - List all important commands used
   - Brief explanation of what each command does

4. **Issue Handling**
   - Document at least 5 issues faced during implementation
   - Include screenshots of each issue
   - Explain how you resolved each issue

5. **Running Instructions**
   - How to start the application from scratch
   - How to deploy locally using Minikube
   - How to view the running application
   - OS details and justification for your choice

## OS Selection Justification
Clearly explain your choice of operating system (Linux, Windows, or VM) with:
- Reasons for selection
- Advantages and challenges encountered
- Impact on development or deployment workflow

## Marks Distribution
- Report Submission: 40 marks
- Implementation: 60 marks (+ 5 bonus marks possible)

## Important Dates
- Registration Form Submission: May 7th, 2025
- Report Submission Deadline: May 12th, 2025
- Project Demonstration & Viva: To be announced

---

## Rubrics

### 1. Project Report (40 Marks)
| Criteria | Marks | Description |
|----------|-------|-------------|
| Step-by-step documentation | 10 | Clear explanation of all steps from installation to deployment |
| Environment details | 5 | OS, Docker, Minikube, kubectl versions included |
| Screenshots provided | 10 | Visuals for setup, deployment, and troubleshooting |
| Commands and descriptions | 5 | All important commands used are listed and explained |
| Issue handling | 10 | At least 5 problems faced + solutions, each with screenshots |

### 2. Implementation (60 Marks + 5 Bonus Marks)
| Criteria | Marks | Description |
|----------|-------|-------------|
| Web application working | 5 | Simple app is running and tested locally |
| Dockerized correctly | 10 | Dockerfile builds and container runs the app successfully |
| GitHub repository setup | 5 | Contains all code, Dockerfile, README, and Kubernetes files |
| Kubernetes files present and correct | 15 | deployment.yaml and service.yaml are correctly written |
| Minikube deployment working | 10 | App deployed locally via Minikube and accessible |
| Docker Hub usage | 5 | Docker image is pushed and pulled from Docker Hub |
| GitHub Actions CI/CD | 10 | Automated workflow builds and deploys the app |