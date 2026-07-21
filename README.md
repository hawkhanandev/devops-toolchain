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
- Start the full toolchain: docker compose -f expense-tracker/docker-compose.yml up --build -d
- Open the frontend at http://localhost:8080
- Open the backend at http://localhost:5000/api/health
- Open SonarQube at http://localhost:9000
- Open Jenkins at http://localhost:8080

## CI/CD setup
1. Start the shared services: docker compose -f expense-tracker/docker-compose.yml up -d mongo jenkins sonarqube
2. Open Jenkins and SonarQube, then sign in with the defaults if prompted.
3. In SonarQube, create a project named expense-tracker and generate a token. Store that token in Jenkins as a secret credential named sonarqube-token.
4. In Jenkins, create a new Pipeline job pointing to this repository and use the included Jenkinsfile.
5. Run the pipeline to install dependencies, lint and build the frontend, scan code with SonarQube, build Docker images, and deploy the app stack.
