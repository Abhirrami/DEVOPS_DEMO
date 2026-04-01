pipeline {
  agent any

  stages {

    stage('Clone repo') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
        dir('frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Build frontend') {
      steps {
        dir('frontend') {
          sh '''
          npm install
          chmod +x node_modules/.bin/vite || true
          npm run build
          '''
        }
      }
    }

    stage('Run backend on VM') {
      steps {
        dir('backend') {
          sh '''
          # Stop old app if running
          pkill node || true

          # Start backend in background
          nohup node server.js > app.log 2>&1 &
          '''
        }
      }
    }

  }

  post {
    always {
      echo "App deployed successfully on Azure VM"
    }
  }
}
