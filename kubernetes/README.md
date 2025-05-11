# Kubernetes Configuration for NextGen Academy

This directory contains Kubernetes manifest files for deploying the NextGen Academy application in a Kubernetes cluster using Minikube.

## Files Overview

1. `namespace.yaml` - Creates a dedicated Kubernetes namespace for the application
2. `frontend-deployment.yaml` - Deploys the frontend React application with 2 replicas
3. `backend-deployment.yaml` - Deploys the backend Node.js API with 2 replicas
4. `frontend-service.yaml` - Creates a NodePort service to expose the frontend externally
5. `backend-service.yaml` - Creates a ClusterIP service for internal access to the backend

## Prerequisites

Before applying these configurations, make sure to:

1. Install Minikube and kubectl on your local machine
2. Build and push your Docker images to Docker Hub
3. Replace `${hassangill}` in the deployment files with your actual Docker Hub username

## Application Architecture

```
                         ┌─────────────────────┐
                         │   Minikube Cluster  │
                         │                     │
┌──────────┐             │  ┌───────────────┐  │             ┌────────────┐
│          │             │  │  Frontend     │  │             │            │
│   User   │◄────────────┼──┤  Service      │  │             │  MongoDB   │
│          ├────────────►│  │  (NodePort)   │  │             │  Database  │
└──────────┘             │  │               │  │             │            │
                         │  └──────┬────────┘  │             └─────▲──────┘
                         │         │           │                   │
                         │         ▼           │                   │
                         │  ┌───────────────┐  │                   │
                         │  │  Frontend     │  │                   │
                         │  │  Deployment   │  │                   │
                         │  │  (2 replicas) │  │                   │
                         │  └──────┬────────┘  │                   │
                         │         │           │                   │
                         │         ▼           │                   │
                         │  ┌───────────────┐  │                   │
                         │  │  Backend      │  │                   │
                         │  │  Service      │  │                   │
                         │  │  (ClusterIP)  │  │                   │
                         │  └──────┬────────┘  │                   │
                         │         │           │                   │
                         │         ▼           │                   │
                         │  ┌───────────────┐  │                   │
                         │  │  Backend      │  │                   │
                         │  │  Deployment   ├──┼───────────────────┘
                         │  │  (2 replicas) │  │
                         │  └───────────────┘  │
                         │                     │
                         └─────────────────────┘
```

## Deployment Steps

1. Create the namespace:
   ```
   kubectl apply -f namespace.yaml
   ```

2. Deploy the backend:
   ```
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f backend-service.yaml
   ```

3. Deploy the frontend:
   ```
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   ```

4. Verify your deployment:
   ```
   kubectl get all -n nextgen-academy
   ```

5. Access your application:
   ```
   minikube service nextgen-frontend-service -n nextgen-academy
   ```

## Configuration Notes

1. **Environment Variables**: The backend deployment is configured to connect to MongoDB using `host.minikube.internal`, which allows connecting to a MongoDB instance running on your host machine. For production, you should deploy MongoDB in the cluster or use a managed database service.

2. **Resource Limits**: Each deployment has CPU and memory requests and limits defined to ensure resource management and prevent resource starvation.

3. **Health Checks**: Both deployments include readiness and liveness probes to ensure container health monitoring.

4. **Scaling**: The deployment is configured with 2 replicas for both frontend and backend to provide high availability. You can scale up or down as needed:
   ```
   kubectl scale deployment/nextgen-frontend -n nextgen-academy --replicas=3
   ```
