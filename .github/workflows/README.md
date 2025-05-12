# GitHub Actions Workflow Setup

This directory contains GitHub Actions workflow configuration for CI/CD deployment to a local Kubernetes cluster.

## Setting Up the Self-Hosted Runner

1. Go to your GitHub repository, click on Settings > Actions > Runners
2. Click on "New self-hosted runner"
3. Follow the instructions to download and configure the runner on your local machine where Minikube is running

## Setting Up Required Secrets

Before the workflow can run successfully, add the following secrets to your GitHub repository:

1. Go to Settings > Secrets and variables > Actions
2. Click on "New repository secret"
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## Workflow Overview

The `deploy.yml` workflow performs the following steps:

1. Checks out the repository code
2. Sets up Docker Buildx for multi-platform builds
3. Logs in to Docker Hub using the provided secrets
4. Builds and pushes the backend Docker image
5. Builds and pushes the frontend Docker image
6. Updates the Kubernetes deployment files with your Docker Hub username
7. Deploys the application to your local Kubernetes cluster
8. Verifies the deployment status

## Triggering the Workflow

The workflow can be triggered in two ways:
- Automatically when code is pushed to the `main` branch
- Manually through the "Actions" tab in your GitHub repository (workflow_dispatch)

## Troubleshooting

If the workflow fails, check the following:
- Ensure your self-hosted runner is online and connected
- Verify that your Docker Hub credentials are correct
- Make sure Minikube is running on the machine where the self-hosted runner is installed
- Check that kubectl is properly configured to use your Minikube cluster 