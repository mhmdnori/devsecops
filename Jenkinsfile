pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'my-frontend-image'
        BACKEND_IMAGE = 'my-backend-image'
        MONGODB_IMAGE = 'mongo:4.0'
        DOCKER_TAG = 'latest'
        PORT = '80'
        HOST = '127.0.0.1'
        SONAR_HOST_URL = 'http://localhost:9001' 
        SONAR_TOKEN = credentials('SONARQUBE_TOKEN') 
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
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/mhmdnori/devsecops.git']],
                    extensions: [[$class: 'CleanBeforeCheckout']]
                ])
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SONARQUBE_TOKEN') {
                    script {
                        echo "Running SonarQube Analysis..."
                        sh """
                        sonar-scanner \
                          -Dsonar.projectKey=my-project \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Quality Gate Check') {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        def qualityGate = waitForQualityGate()
                        if (qualityGate.status != 'OK') {
                            error "❌ Pipeline stopped: Quality Gate failed!"
                        }
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh '''
                    echo "Removing old Docker images..."
                    docker rmi -f ${FRONTEND_IMAGE}:${DOCKER_TAG} || true
                    docker rmi -f ${BACKEND_IMAGE}:${DOCKER_TAG} || true

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
