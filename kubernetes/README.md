# NextGen Academy Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the NextGen Academy application.

## Prerequisites

- Minikube installed and running
- kubectl installed and configured to use Minikube
- Docker Hub account with the images pushed

## Deployment Instructions

1. Start Minikube:
   ```
   minikube start
   ```

2. Configure your terminal to use Minikube's Docker daemon:
   ```
   eval $(minikube docker-env)
   ```

3. Before applying the Kubernetes manifests, replace `${DOCKER_USERNAME}` in the deployment files with your Docker Hub username:
   ```
   sed -i 's/${DOCKER_USERNAME}/your-docker-username/g' *-deployment.yaml
   ```
   On Windows PowerShell, use:
   ```
   (Get-Content *-deployment.yaml) | ForEach-Object {$_ -replace '\${DOCKER_USERNAME}', 'your-docker-username'} | Set-Content *-deployment.yaml
   ```

4. Create the namespace:
   ```
   kubectl apply -f namespace.yaml
   ```

5. Apply all resources using kustomization:
   ```
   kubectl apply -k .
   ```

6. Verify the deployment:
   ```
   kubectl get all -n nextgen-academy
   ```

7. Access the application:
   ```
   minikube service frontend -n nextgen-academy
   ```

## Resource Overview

- **namespace.yaml**: Creates a Kubernetes namespace for the application
- **backend-deployment.yaml**: Deploys the backend application
- **backend-service.yaml**: Exposes the backend application
- **frontend-deployment.yaml**: Deploys the frontend application
- **frontend-service.yaml**: Exposes the frontend application
- **mongodb-deployment.yaml**: Deploys MongoDB
- **mongodb-service.yaml**: Exposes MongoDB internally
- **kustomization.yaml**: Configures Kustomize for deployment management

## Notes

- The MongoDB data is stored in an emptyDir volume, which means it will be lost if the pod is deleted. For production, consider using a persistent volume.
- The frontend is configured to access the backend via the backend service.
- All services are exposed through NodePort for easier access during development. 