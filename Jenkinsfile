pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'my-frontend-image'
        BACKEND_IMAGE = 'my-backend-image'
        MONGODB_IMAGE = 'mongo:4.0'
        DOCKER_TAG = 'latest'
        PORT = '80'
        HOST = '127.0.0.1'
    }

    stages {
        stage('Cleanup Previous Containers') {
            steps {
                script {
                    sh '''
                    echo "Stopping and removing existing containers..."
                    docker compose -f ./docker-compose.yml down || true
                    docker container prune -f || true
                    '''
                }
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mhmdnori/devsecops.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    sh '''
                    echo "Building Docker images..."
                    docker build -t ${FRONTEND_IMAGE}:${DOCKER_TAG} ./frontend
                    docker build -t ${BACKEND_IMAGE}:${DOCKER_TAG} ./backend
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh '''
                    echo "Deploying services..."
                    docker compose -f ./docker-compose.yml up -d
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            script {
                echo '❌ Pipeline failed! Cleaning up resources...'
                sh 'docker compose -f ./docker-compose.yml down || true'
            }
        }
    }
}
