pipeline {
  agent any

  environment {
    PROJECT_DIR = 'expense-tracker'
    SONAR_HOST_URL = 'http://sonarqube:9000'
    SONAR_LOGIN = credentials('sonarqube-token')
  }

  options {
    timestamps()
    timeout(time: 45, unit: 'MINUTES')
    skipDefaultCheckout(true)        // we do checkout manually in stage 1
  }

  triggers {
    // Poll GitHub every minute for new commits on the configured branch.
    // Jenkins checks → if new commit found → auto-runs the pipeline.
    // (Use GitHub Webhook instead if Jenkins is publicly reachable)
    pollSCM('* * * * *')
  }


  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh '''
          cd "$PROJECT_DIR"
          npm install --prefix server
          npm install --prefix client
        '''
      }
    }

    stage('Lint and build frontend') {
      steps {
        sh '''
          cd "$PROJECT_DIR/client"
          npm run lint
          npm run build
        '''
      }
    }

    stage('SonarQube Analysis') {
      steps {
        sh '''
            cd "$PROJECT_DIR"

            sonar-scanner \
              -Dsonar.host.url="$SONAR_HOST_URL" \
              -Dsonar.login="$SONAR_LOGIN" \
              -Dsonar.projectKey=expense-tracker \
              -Dsonar.projectName="Expense Tracker" \
              -Dsonar.projectVersion=1.0 \
              -Dsonar.sources=client/src,server \
              -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/** \
              -Dsonar.sourceEncoding=UTF-8
        '''
      }
    }

    stage('Build Docker images') {
      steps {
        sh '''
          cd "$PROJECT_DIR"
          docker-compose -f docker-compose.app.yml build server client
        '''
      }
    }

    stage('Deploy locally with Docker Compose') {
      steps {
        sh '''
          cd "$PROJECT_DIR"
          docker-compose -f docker-compose.app.yml up -d
        '''
      }
    }
  }

  post {
    success {
      echo 'CI/CD pipeline completed successfully.'
    }
    failure {
      echo 'CI/CD pipeline failed. Review the Jenkins console output and SonarQube results.'
    }
  }
}
