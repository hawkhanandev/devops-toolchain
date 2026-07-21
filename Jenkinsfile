pipeline {
  agent any

  environment {
    SONAR_HOST_URL = 'http://sonarqube:9000'
    SONAR_LOGIN = credentials('sonarqube-token')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'cd expense-tracker && npm install --prefix server && npm install --prefix client'
      }
    }

    stage('Build frontend') {
      steps {
        sh 'cd expense-tracker/client && npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        sh '''cd expense-tracker && \
        sonar-scanner \
          -Dsonar.projectKey=expense-tracker \
          -Dsonar.sources=. \
          -Dsonar.host.url=$SONAR_HOST_URL \
          -Dsonar.login=$SONAR_LOGIN'''
      }
    }

    stage('Build Docker images') {
      steps {
        sh 'cd expense-tracker && docker compose build server client'
      }
    }

    stage('Deploy locally with Docker Compose') {
      steps {
        sh 'cd expense-tracker && docker compose up -d'
      }
    }
  }
}
