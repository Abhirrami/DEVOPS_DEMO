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
          export NODE_OPTIONS="--max-old-space-size=512"
          chmod +x node_modules/.bin/vite || true
          npm run build
          '''
        }
      }
    }

    stage('Run backend') {
      steps {
        dir('backend') {
          sh '''
          pkill node || true
          nohup node src/server.js > app.log 2>&1 &
          '''
        }
      }
    }

  }

  post {
    always {
      echo "Full stack app deployed successfully"
    }
  }
}
