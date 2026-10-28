
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        IMAGE_NAME = 'campuscare'
        CONTAINER_NAME = 'campuscare'
        APP_PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

       
stage('Test') {
    steps {
        sh '''
            docker run --rm \
              -v "$WORKSPACE:/app" \
              -w /app/client \
              node:22-alpine sh -c "npm ci && npm run build"

            docker run --rm \
              -v "$WORKSPACE:/app" \
              -w /app \
              node:22-alpine npm test
        '''
    }
}



        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t "$IMAGE_NAME:$BUILD_NUMBER" \
                      -t "$IMAGE_NAME:latest" .
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    docker rm -f "$CONTAINER_NAME" || true

                    docker run -d \
                      --name "$CONTAINER_NAME" \
                      --restart unless-stopped \
                      -p "$APP_PORT:3000" \
                      "$IMAGE_NAME:$BUILD_NUMBER"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    for attempt in $(seq 1 15); do
                      if curl --fail --silent \
                        "http://127.0.0.1:${APP_PORT}/health"; then
                        echo ""
                        echo "CampusCare deployment verified."
                        exit 0
                      fi
                      sleep 2
                    done

                    echo "Health check failed."
                    docker logs "$CONTAINER_NAME" || true
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'CampusCare CI/CD pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
