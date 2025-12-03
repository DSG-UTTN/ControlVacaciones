# Control de Vacaciones y Permisos

Aplicación web moderna para la gestión de solicitudes de vacaciones y permisos de salida, construida con **Vue 3**, **Tailwind CSS** y **Firebase**.

## 🚀 Características

- **Dashboard**: Vista general con métricas en tiempo real de solicitudes.
- **Gestión de Vacaciones**: Formulario de solicitud con validación y listado de historial.
- **Gestión de Salidas**: Registro de permisos de salida por horas.
- **Panel de Administración**: Interfaz para aprobar o rechazar solicitudes.
- **Consejos Diarios**: Integración con API externa para mostrar consejos aleatorios.
- **Autenticación**: Sistema de login seguro (Usuario fijo).
- **Diseño Responsivo**: Interfaz adaptada a móviles y escritorio gracias a Tailwind CSS.

## 🛠️ Tecnologías

- **Frontend**: Vue 3 (Composition API)
- **Estilos**: Tailwind CSS v3
- **Base de Datos**: Firebase Realtime Database
- **Build Tool**: Vite
- **Routing**: Vue Router

## 📦 Instalación y Uso

1.  **Clonar el repositorio**
    ```bash
    git clone <url-del-repo>
    cd VacationControl
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar en desarrollo**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

4.  **Compilar para producción**
    ```bash
    npm run build
    ```

## 🔐 Credenciales de Acceso

Para acceder a la aplicación, utiliza las siguientes credenciales de prueba:

- **Usuario**: `admin`
- **Contraseña**: `123456`

## ☁️ Despliegue

La aplicación está configurada para desplegarse fácilmente en **Netlify** o **Vercel**.

### Netlify
Arrastra la carpeta `dist` generada tras el build al panel de Netlify Drop. El archivo `_redirects` incluido asegura que el enrutamiento funcione correctamente.

### Vercel
Conecta tu repositorio a Vercel. El archivo `vercel.json` incluido configura las reescrituras necesarias para la SPA.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
