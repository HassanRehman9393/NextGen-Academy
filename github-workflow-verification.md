# How to Verify Your GitHub Actions Workflow is Correctly Done

To confirm that your GitHub Actions workflow for Kubernetes deployment is configured properly and working as expected, follow these verification steps:

## 1. Verify Syntax and Structure

- **YAML Indentation**: GitHub Actions workflows are YAML files where indentation is critical. All steps should be properly indented.
- **Required Steps**: Ensure your workflow includes all necessary steps - checkout, Docker setup, image building, and Kubernetes deployment.
- **Step Dependencies**: Steps should be in logical order (e.g., checkout → build → deploy).

## 2. Check GitHub Repository Settings

- **Verify Runner Status**: Go to Settings → Actions → Runners to confirm your self-hosted runner is online and available.
- **Verify Secrets**: Go to Settings → Secrets and variables → Actions to ensure `DOCKER_USERNAME` and `DOCKER_PASSWORD` are properly set.

## 3. Watch the Workflow Run in Real-Time

When you push changes to trigger a workflow:

1. Go to the "Actions" tab in your GitHub repository
2. Click on the running workflow to see detailed logs
3. Look for green checkmarks (✓) for successful steps
4. Expand any step with a red X (❌) to see error details

## 4. Check for Specific Success Indicators

Your workflow is working correctly when:

- **Docker Image Building**: You see "Successfully built" and "Successfully tagged" messages
- **Docker Hub Push**: You see "Pushed" messages for your images
- **Kubernetes Deployment**: The deploy step shows:
   - `namespace/nextgen-academy created` or `unchanged`
   - `deployment.apps/nextgen-frontend created` or `configured`
   - `service/nextgen-frontend-service created` or `unchanged`
   - `deployment.apps/nextgen-backend created` or `configured`
   - `service/nextgen-backend-service created` or `unchanged`
- **Pod Status**: All pods show `READY 1/1` and `STATUS Running`
- **Final URL**: The workflow outputs a URL for accessing your frontend service

## 5. Common Issues and Solutions

### Docker Issues:
- **Error**: "Docker daemon not running"
  - **Solution**: Ensure Docker Desktop is running before starting the workflow

### Kubernetes Issues:
- **Error**: "YAML parsing error" or "block sequences not allowed in this context"
  - **Solution**: Fix indentation in your Kubernetes YAML files
  
- **Error**: "InvalidImageName"
  - **Solution**: Check image name format and Docker Hub credentials
  
- **Error**: "deployment exceeded its progress deadline"
  - **Solution**: Check pod logs for startup issues with `kubectl logs [pod-name] -n nextgen-academy`

### GitHub Actions Issues:
- **Error**: "Workflow is not triggered"
  - **Solution**: Verify the workflow file is in the correct location (.github/workflows/) and the trigger events are properly configured

## 6. Validate Locally Before GitHub

Before relying on GitHub Actions, you can test your deployment process locally:

```powershell
# 1. Export your Docker Hub username as an environment variable
$env:DOCKER_USERNAME = "your-dockerhub-username"

# 2. Replace the placeholder in your Kubernetes files
$files = @("./kubernetes/frontend-deployment.yaml", "./kubernetes/backend-deployment.yaml")
foreach ($file in $files) {
  (Get-Content $file) -replace 'hassangill', $env:DOCKER_USERNAME | Set-Content $file
}

# 3. Build and push Docker images
docker build -t $env:DOCKER_USERNAME/nextgen-academy-frontend:latest ./frontend
docker build -t $env:DOCKER_USERNAME/nextgen-academy-backend:latest ./backend
docker push $env:DOCKER_USERNAME/nextgen-academy-frontend:latest
docker push $env:DOCKER_USERNAME/nextgen-academy-backend:latest

# 4. Apply deployments
kubectl apply -f ./kubernetes/namespace.yaml
kubectl apply -f ./kubernetes/backend-deployment.yaml
kubectl apply -f ./kubernetes/backend-service.yaml
kubectl apply -f ./kubernetes/frontend-deployment.yaml
kubectl apply -f ./kubernetes/frontend-service.yaml

# 5. Check pods
kubectl get pods -n nextgen-academy
```

If your manual deployment works, the GitHub workflow should work too!

## 7. Documentation for Submissions

For your project submission, capture screenshots of:

- The GitHub Actions workflow run page showing successful completion
- The expanded logs for key steps (Docker build, Kubernetes deployment)
- The resulting pods in `Running` state
- The application running in a browser

These will serve as proof of your successful CI/CD implementation!
