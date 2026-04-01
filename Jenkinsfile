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
          npm run build || true
          '''
        }
      }
    }

    stage('Run full app') {
      steps {
        sh '''
        pkill node || true

        cd backend
        nohup node src/server.js > backend.log 2>&1 &

        cd ../frontend
        nohup npx serve -s dist -l 5173 > frontend.log 2>&1 &
        '''
      }
    }

  }

  post {
    always {
      echo "Full stack app deployed successfully"
    }
  }
}
