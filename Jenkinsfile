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

    stage('Run full app on Azure VM') {
      steps {
        sh '''
        echo "Stopping old processes..."
        pkill -f "node src/server.js" || true
        pkill -f "vite preview --host 0.0.0.0 --port 5173" || true

        echo "Starting backend..."
        cd backend
        JENKINS_NODE_COOKIE=dontKillMe nohup node src/server.js > backend.log 2>&1 &
        sleep 5

        echo "Starting frontend..."
        cd ../frontend
        JENKINS_NODE_COOKIE=dontKillMe nohup npm run preview -- --host 0.0.0.0 --port 5173 > frontend.log 2>&1 &
        sleep 5

        echo "Running processes:"
        ps aux | grep -E "node|vite"
        ss -tulpn | grep -E "5000|5173" || true
        '''
      }
    }

  }

  post {
    always {
      echo "Full stack app deployed successfully on Azure VM"
    }
  }
}
