# devops-toolchain
A complete DevOps toolchain demonstrating Git workflow, Docker, Docker Compose, Jenkins CI pipeline, SonarQube code analysis, and automated Docker image builds.

## Project structure
- expense-tracker/client: React + Vite frontend
- expense-tracker/server: Express + MongoDB backend
- Jenkinsfile: CI/CD pipeline definition for Jenkins
- docker-compose.yml: local orchestration for app, Jenkins, and SonarQube services
- sonar-project.properties: SonarQube scan configuration

## CI/CD flow
1. Jenkins checks out the repository.
2. It installs frontend/backend dependencies and builds the frontend.
3. It runs linting and sends the code to SonarQube.
4. It builds Docker images for the client and server.
5. It deploys the stack locally with Docker Compose.

## Run locally
- Start the app stack: docker compose up --build
- Open the frontend at http://localhost:5173
- Open the backend at http://localhost:5000/api/health
- Open SonarQube at http://localhost:9000
- Open Jenkins at http://localhost:8080
