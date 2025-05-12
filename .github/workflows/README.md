# GitHub Actions Local Kubernetes Deployment

This simplified workflow deploys your application to a local Kubernetes (Minikube) cluster.

## Prerequisites

Before running this workflow, ensure:

1. Your self-hosted runner is properly set up
2. Docker is installed and running on your machine
3. Minikube is installed and started
4. kubectl is installed and configured to use your Minikube cluster

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
2. **Updates deployment files**: Replaces `${DOCKER_USERNAME}` placeholder in deployment YAML files
3. **Deploys to Kubernetes**: Applies the Kubernetes manifests to your local Minikube cluster
4. **Verifies deployment**: Shows running pods and services

## Note

This workflow is optimized for local Kubernetes deployment only. It doesn't build or push Docker images to Docker Hub, so make sure your Kubernetes manifests are configured to use the correct images. 