# GitHub Actions Local Kubernetes Deployment

This workflow deploys your application to a local Kubernetes (Minikube) cluster.

## Prerequisites

1. Your self-hosted runner is properly set up
2. Docker is installed and running on your machine
3. Minikube is installed and started
4. kubectl is installed and configured to use your Minikube cluster

## Required Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

## How to Use This Workflow

1. **Start Minikube**: Make sure Minikube is running:
   ```
   minikube start
   ```

2. **Start the self-hosted runner**: Make sure your GitHub Actions runner is online.

3. **Run the workflow**: Go to Actions tab in your GitHub repository and run the workflow manually.

4. **Troubleshooting**:
   - Check that all tools (Docker, kubectl, Minikube) are in your PATH
   - Make sure Minikube is running when you start the workflow
   - Review logs for any error messages

## What This Workflow Does

1. **Checks prerequisites**: Verifies Docker, kubectl, and Minikube are installed
2. **Logs in to Docker Hub**: Authenticates with Docker Hub using your credentials
3. **Updates deployment files**: Replaces `${DOCKER_USERNAME}` placeholder in deployment YAML files
4. **Deploys to Kubernetes**: Applies the Kubernetes manifests to your local Minikube cluster
5. **Verifies deployment**: Shows running pods and services

## Note

This workflow now includes all elements required for Step 8 of the project, including Docker Hub authentication, but still focuses on the local Kubernetes deployment to ensure reliability. 