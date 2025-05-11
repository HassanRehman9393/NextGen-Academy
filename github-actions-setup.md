# Setting Up GitHub Actions Self-Hosted Runner

Follow these instructions to set up a self-hosted GitHub Actions runner on your local machine for CI/CD with Minikube.

## Steps to Set Up GitHub Actions Runner

1. **Go to your GitHub Repository**
   - Navigate to your repository on GitHub
   - Click on "Settings" (usually a tab at the top of your repository page)
   - In the left sidebar, click on "Actions" > "Runners"
   - Click on "New self-hosted runner"

2. **Select Windows as the Runner Image**
   - Select "Windows" as your operating system

3. **Download and Configure the Runner**
   - You'll see a page with instructions to download and configure the runner
   - Open PowerShell as Administrator on your local machine where Minikube is running
   - Follow the instructions provided by GitHub:

   ```powershell
   # Create a folder for the runner
   mkdir C:\actions-runner; cd C:\actions-runner

   # Download the runner package
   Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.x.y/actions-runner-win-x64-2.x.y.zip -OutFile actions-runner-win-x64-2.x.y.zip

   # Extract the installer
   Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64-2.x.y.zip", "$PWD")

   # Configure the runner
   ./config.cmd --url https://github.com/YOUR_USERNAME/NextGen-Academy --token YOUR_TOKEN
   ```

   Replace:
   - `2.x.y` with the current version number
   - `YOUR_USERNAME` with your GitHub username
   - `YOUR_TOKEN` with the token provided by GitHub

4. **Install and Run the Runner as a Service**
   ```powershell
   ./svc.ps1 install
   ./svc.ps1 start
   ```

5. **Verify Installation**
   - Return to your GitHub repository
   - Go to Settings > Actions > Runners
   - Your runner should appear as "Online"

## Setting Up GitHub Secrets

To securely use Docker Hub credentials in your workflow, add them as GitHub Secrets:

1. In your GitHub repository, go to Settings > Secrets and variables > Actions
2. Click "New repository secret"
3. Add the following secrets:
   - Name: `DOCKER_USERNAME`
     - Value: Your Docker Hub username
   - Name: `DOCKER_PASSWORD`
     - Value: Your Docker Hub password or access token (recommended)

## Troubleshooting

If you encounter any issues:

- **Runner Not Starting**:
  - Verify that the runner service is running: `Get-Service "actions.runner.*"`
  - Check the logs: `Get-Content C:\actions-runner\_diag\*.log`

- **Deployment Failures**:
  - Ensure Minikube is running: `minikube status`
  - Check if kubectl is properly configured: `kubectl config current-context`
  - Verify Docker Hub login works: `docker login`

- **Workflow Not Triggering**:
  - Make sure you're pushing to the 'main' branch
  - Check the Actions tab in GitHub for workflow run details
