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

    options {
        skipDefaultCheckout(true) 
    }

    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                script {
                    sh '''
                    echo "Fetching latest changes from GitHub..."
                    git fetch origin main         
                    git reset --hard origin/main
                    git pull origin main
                    '''
                }
            }pipeline {
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
                    docker build --no-cache -t ${FRONTEND_IMAGE}:${DOCKER_TAG} ./frontend
                    docker build --no-cache -t ${BACKEND_IMAGE}:${DOCKER_TAG} ./backend
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

        }

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

        stage('Build') {
            steps {
                script {
                    sh '''
                    echo "Removing old Docker images..."
                    docker rmi ${FRONTEND_IMAGE}:${DOCKER_TAG} || true
                    docker rmi ${BACKEND_IMAGE}:${DOCKER_TAG} || true

                    echo "Building Docker images..."
                    docker build --no-cache -t ${FRONTEND_IMAGE}:${DOCKER_TAG} ./frontend
                    docker build --no-cache -t ${BACKEND_IMAGE}:${DOCKER_TAG} ./backend
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
        always {
            cleanWs(
                cleanWhenNotBuilt: false,
                deleteDirs: true,
                disableDeferredWipeout: true,
                notFailBuild: true,
                patterns: [
                    [pattern: '.gitignore', type: 'INCLUDE'],
                    [pattern: 'logs/', type: 'EXCLUDE']
                ]
            )
        }
    }
}