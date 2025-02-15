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
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/mhmdnori/devsecops.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'docker build -t $FRONTEND_IMAGE:$DOCKER_TAG ./frontend'
                    sh 'docker build -t $BACKEND_IMAGE:$DOCKER_TAG ./backend'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose -f ./docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!!!!!!!'
        }
    }
}
