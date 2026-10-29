
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
                    set -eu

                    echo "Building frontend..."
                    docker run --rm \
                      -v "$WORKSPACE:/app" \
                      -w /app/client \
                      node:22-alpine \
                      sh -c "npm ci && npm run build"

                    echo "Installing backend dependencies and running tests..."
                    docker run --rm \
                      -v "$WORKSPACE:/app" \
                      -w /app \
                      node:22-alpine \
                      sh -c "npm ci && npm test"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -eu

                    docker build \
                      --no-cache \
                      -t "$IMAGE_NAME:$BUILD_NUMBER" \
                      -t "$IMAGE_NAME:latest" .

                    echo "Checking production dependencies..."
                    docker run --rm \
                      --entrypoint node \
                      "$IMAGE_NAME:$BUILD_NUMBER" \
                      -e "require('express'); require('mongoose'); console.log('Production dependencies OK')"
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    set -eu

                    echo "Replacing the CampusCare container..."

                    docker rm -f "$CONTAINER_NAME" || true

                    docker run -d \
                      --name "$CONTAINER_NAME" \
                      --restart unless-stopped \
                      -p "$APP_PORT:3000" \
                      "$IMAGE_NAME:$BUILD_NUMBER"

                    echo "Container started."
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -eu

                    echo "Checking application health..."

                    for attempt in $(seq 1 20); do
                        if curl --fail --silent \
                            "http://127.0.0.1:${APP_PORT}/health"; then
                            echo ""
                            echo "CampusCare deployment verified."
                            exit 0
                        fi

                        sleep 2
                    done

                    echo "Health check failed. Container logs:"
                    docker logs "$CONTAINER_NAME" || true
                    exit 1
                '''
            }
        }

        stage('Selenium Browser Tests') {
            steps {
                sh '''
                    set -eu

                    NETWORK="campuscare-selenium-${BUILD_NUMBER}"
                    SELENIUM_CONTAINER="campuscare-chrome-${BUILD_NUMBER}"

                    cleanup() {
                        docker rm -f "$SELENIUM_CONTAINER" >/dev/null 2>&1 || true
                        docker network rm "$NETWORK" >/dev/null 2>&1 || true
                    }

                    trap cleanup EXIT

                    docker network create "$NETWORK"

                    docker run -d \
                      --name "$SELENIUM_CONTAINER" \
                      --network "$NETWORK" \
                      --network-alias chrome \
                      --shm-size=2g \
                      selenium/standalone-chrome:latest

                    docker run --rm \
                      --network "$NETWORK" \
                      --add-host=host.docker.internal:host-gateway \
                      -v "$WORKSPACE/selenium:/tests:ro" \
                      -e SELENIUM_URL=http://chrome:4444 \
                      -e WEBSITE_URL=http://host.docker.internal:3000/ \
                      python:3.12-slim \
                      sh -c "pip install --no-cache-dir selenium && python /tests/test_homepage.py"
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
