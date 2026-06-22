# Consolidado de Entrega CI/CD: ClimaColombia

Este documento consolida el historial de cambios, soluciones a problemas comunes (troubleshooting), responsabilidades del equipo y las opiniones finales respecto a la integración de la plataforma de software con herramientas de Integración y Entrega Continua (CI/CD) y contenedores.

---

## 1. Historial de Cambios

La evolución del proyecto para alcanzar la entrega actual se ha realizado de forma progresiva:

1.  **Dockerización Base:** Se empaquetó el `Frontend` (React/Vite) y el `Backend` (Node.js/Express) en contenedores independientes mediante sus respectivos `Dockerfile`. Se implementó un `docker-compose.yml` central para orquestar la comunicación de ambos servicios.
2.  **Integración de Jenkins:**
    *   Se creó un contenedor especializado de Jenkins configurado a través de `Dockerfile.jenkins` para tener las herramientas necesarias (Node.js, Docker CLI).
    *   Se implementó el archivo `Jenkinsfile` definiendo las etapas del pipeline de automatización (Instalación, Linting, Testing, Build de Imágenes y Publicación/Despliegue).
    *   Se añadió el archivo `docker-compose.jenkins.yml` para aislar el entorno del servidor de integración.
3.  **Integración de Travis CI:** Se creó el archivo `.travis.yml` para conectar el repositorio a la plataforma Cloud de Travis. Se configuraron los entornos de NodeJS y servicios Docker, añadiendo scripts para evaluar la calidad del código mediante Linter y Jest en cada Push.
4.  **Integración de Codeship:** Se añadieron los archivos de Codeship Pro:
    *   `codeship-services.yml` para orquestar el entorno de validación dentro de la infraestructura de Codeship.
    *   `codeship-steps.yml` con la secuencia de pruebas obligatoria previa a la integración y despliegue del proyecto.
5.  **Ajustes de Calidad:** Se agregaron scripts de npm (`"lint"` y `"test:cov"`) a los proyectos Backend y Frontend para estandarizar las validaciones exigidas por todas las plataformas CI.

---

## 2. Sugerencias para la Solución de Problemas (Troubleshooting)

A continuación, una recopilación de posibles problemas detectados durante las pruebas y sus soluciones:

### A. Fallos en el Pipeline de Jenkins (Docker-out-of-Docker)
*   **Problema:** Jenkins falla al ejecutar comandos como `docker build` con el error "Cannot connect to the Docker daemon".
*   **Causa:** El contenedor de Jenkins no tiene acceso al daemon de Docker del host anfitrión.
*   **Solución:** Asegurar que en el archivo `docker-compose.jenkins.yml`, el volumen `/var/run/docker.sock:/var/run/docker.sock` esté correctamente mapeado. En Windows/Linux, a veces es necesario ajustar los permisos del socket: `sudo chmod 666 /var/run/docker.sock` en el host.

### B. Fallos en Linter o Tests en Travis CI / Codeship
*   **Problema:** El build falla en la nube, pero pasa en entorno local.
*   **Causa:** Diferencias en las versiones de Node.js o dependencias (`node_modules`) en caché, o configuraciones locales no subidas al repositorio (ej. `.env`).
*   **Solución:**
    1. Usar `npm ci` en lugar de `npm install` en los pipelines para garantizar una instalación inmaculada usando `package-lock.json`.
    2. Asegurarse de que el pipeline no dependa de variables de entorno estáticas, sino parametrizadas en la configuración de la herramienta CI.

### C. Conflictos de Puertos Locales
*   **Problema:** Al levantar `docker-compose.yml` o `docker-compose.jenkins.yml`, se indica que el puerto `8080`, `3000` o `5173` ya está en uso.
*   **Solución:** Identificar el proceso que utiliza el puerto y detenerlo, o modificar temporalmente el mapeo de puertos en el archivo YAML correspondiente (ej. `8081:8080`).

---

## 3. Responsabilidades

El éxito de la plataforma requiere la definición clara de roles y responsabilidades en torno a este nuevo ecosistema automatizado:

*   **Desarrolladores (Frontend/Backend):**
    *   Responsables de asegurar que su código pasa exitosamente por los scripts de `npm run lint` y `npm run test` localmente **antes** de hacer push.
    *   Mantener la cobertura de pruebas (Coverage) del Backend.
    *   Actualizar los `Dockerfile` de aplicación si el stack de dependencias base cambia.
*   **Líder Técnico / DevOps:**
    *   Administración y mantenimiento del servidor Jenkins (Gestión de plugins, monitoreo de recursos y permisos).
    *   Gestión de credenciales seguras (Secrets) dentro de Jenkins, Travis CI y Codeship.
    *   Mantenimiento de los archivos de configuración de infraestructura como código (`Jenkinsfile`, `.travis.yml`, `codeship-steps.yml`).
    *   Aprobar los despliegues a Producción.
*   **QA Automatizador:**
    *   Añadir pruebas e2e o de integración profundas a los pipelines sin comprometer los tiempos de ejecución drásticamente.

---

## 4. Opiniones y Conclusiones de la Integración

*   **Sobre los Contenedores:** Dockerizar la aplicación ha sido un éxito para estandarizar entornos. Evita el clásico problema de "funciona en mi máquina" y permite que cualquier herramienta (Jenkins, Travis, Codeship) utilice las mismas instrucciones para probar y construir la aplicación.
*   **Sobre Jenkins:** Ofrece un nivel de personalización extremo y es ideal si queremos tener control total de los recursos (Self-Hosted) o si la empresa ya cuenta con servidores. Sin embargo, su configuración inicial (Plugins, Docker-in-Docker) requiere una mayor curva de aprendizaje.
*   **Sobre Travis CI y Codeship:** Se destacan por su simplicidad e inmediatez. Al ser soluciones SaaS, ahorran el esfuerzo de mantener servidores e infraestructura base (como se hace con Jenkins). El modelo declarativo de YAML permite configurar flujos rápidos para evaluar Pull Requests eficientemente.
*   **Conclusión General:**
    Implementar estas tres herramientas demuestra flexibilidad y robustez en la arquitectura. Las pruebas automatizadas reducen en gran medida los errores en producción. Se recomienda a futuro estandarizar el despliegue usando solo un orquestador principal (ej. Jenkins para despliegues pesados y Travis para validaciones pre-merge rápidas).
