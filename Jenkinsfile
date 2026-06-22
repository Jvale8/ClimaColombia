pipeline {
    agent any
    
    environment {
        // En un ambiente real, esto se cambiaría al registry (ej. aws ecr)
        DOCKER_REGISTRY = 'local'
        FRONTEND_IMAGE = "climacolombia-frontend:${env.BUILD_ID}"
        BACKEND_IMAGE = "climacolombia-backend:${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Instalación & Dependencias') {
            steps {
                dir('Backend') {
                    sh 'npm ci || npm install'
                }
                dir('FrontEnd') {
                    sh 'npm ci || npm install'
                }
            }
        }
        
        stage('Análisis de Calidad (Linting)') {
            steps {
                parallel(
                    "Backend Lint": {
                        dir('Backend') { sh 'npm run lint || true' }
                    },
                    "Frontend Lint": {
                        dir('FrontEnd') { sh 'npm run lint || true' }
                    }
                )
            }
        }
        
        stage('Pruebas Automatizadas') {
            steps {
                dir('Backend') {
                    sh 'npm run test:cov || npm run test'
                }
            }
        }
        
        stage('Construcción de Imágenes Docker') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} ./Backend"
                sh "docker build -t ${FRONTEND_IMAGE} ./FrontEnd"
            }
        }
        
        // El stage de publicación y despliegue a Staging requeriría configuración del servidor de destino.
        // Se deja comentado como paso siguiente.
        /*
        stage('Publicación de Artefactos') {
            when { branch 'main' }
            steps {
                // ...
            }
        }
        */
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline ejecutado exitosamente.'
        }
        failure {
            echo 'Fallo en la ejecución del Pipeline.'
        }
    }
}
