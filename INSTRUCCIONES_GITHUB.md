# Guía Paso a Paso: Cómo Subir y Ejecutar el Proyecto desde GitHub

Esta guía te explicará detalladamente cómo llevar este proyecto a **GitHub** y cómo cualquier persona (o tú mismo en otra computadora) puede clonarlo y levantarlo de forma rápida y profesional.

---

## Parte 1: Cómo descargar tu código desde AI Studio

Dado que el botón **Share (Compartir)** solo sirve para compartir un enlace de vista previa en la nube, para obtener los archivos reales del código debes seguir estos pasos:

1. Ve a la esquina superior derecha de la interfaz de **Google AI Studio Build**.
2. Busca el icono de **Configuración (Engranaje ⚙️)** o los **tres puntos verticales/horizontales (⋮)** que están en el panel de archivos/editor.
3. Selecciona la opción **Export to ZIP** (Exportar como ZIP) o **Download Project** (Descargar proyecto).
4. Guarda el archivo `.zip` en tu computadora y descomprímelo en una carpeta (por ejemplo, `C:\proyectos\sia-ct`).

---

## Parte 2: Crear un repositorio en GitHub y subir el código

Una vez que tengas los archivos descomprimidos en tu computadora, sigue estos pasos para subirlo a tu cuenta de GitHub:

### Paso 2.1: Crear el repositorio en la web de GitHub
1. Abre tu navegador y ve a [github.com](https://github.com) (inicia sesión con tu cuenta).
2. Haz clic en el botón **New** (Nuevo) o en el símbolo **+** arriba a la derecha y selecciona **New repository**.
3. Ponle un nombre al repositorio, por ejemplo: `sia-ct-plataforma`.
4. Elige si quieres que sea **Public** (Público) o **Private** (Privado).
5. **IMPORTANTE**: No marques las casillas de "Add a README", "Add .gitignore" ni "Choose a license", ya que el proyecto ya incluye estos archivos.
6. Haz clic en **Create repository**.

### Paso 2.2: Subir los archivos usando la terminal de tu computadora
Abre la terminal de tu computadora (CMD, PowerShell o Git Bash), navega a la carpeta donde descomprimiste el proyecto y ejecuta los siguientes comandos:

```bash
# 1. Inicializar Git en tu carpeta local
git init

# 2. Agregar todos los archivos al área de preparación
git add .

# 3. Confirmar los archivos con un mensaje inicial
git commit -m "Primer commit: Estructura SIA-CT con Backend Java y Frontend Angular"

# 4. Crear la rama principal llamada main
git branch -M main

# 5. Vincular tu carpeta local con el repositorio de GitHub
# (Reemplaza la URL con la dirección de tu repositorio de GitHub)
git remote add origin https://github.com/tu-usuario/sia-ct-plataforma.git

# 6. Subir el código a GitHub
git push -u origin main
```

---

## Parte 3: Cómo levantar el proyecto desde GitHub en una nueva PC

Si tú o un colega quieren ejecutar el proyecto directamente descargándolo desde GitHub, el proceso paso a paso es el siguiente:

### Paso 3.1: Clonar el proyecto
Abre la terminal en la carpeta donde guardas tus proyectos y escribe:
```bash
git clone https://github.com/tu-usuario/sia-ct-plataforma.git
cd sia-ct-plataforma
```

---

### Paso 3.2: Ejecutar el Backend (Spring Boot en IntelliJ IDEA 2025.3.4)

1. Abre **IntelliJ IDEA 2025.3.4**.
2. Haz clic en **Open** (Abrir).
3. Selecciona la subcarpeta **`backend-java`** (la que contiene el archivo `pom.xml`) y haz clic en **OK**.
4. Deja que IntelliJ descargue todas las dependencias de Maven.
5. Asegúrate de tener una base de datos PostgreSQL activa con el nombre `sia_ct_db`. *(Las credenciales se configuran en `src/main/resources/application.properties`)*.
6. Abre el archivo `src/main/java/com/mpfn/siact/SiaCtApplication.java`.
7. Haz clic derecho y selecciona **Run 'SiaCtApplication.main()'** para iniciar el backend en el puerto `8080`.

---

### Paso 3.3: Ejecutar el Frontend (Angular 17)

Puedes hacerlo desde la misma terminal integrada de IntelliJ:
1. Abre la **Terminal** de IntelliJ (pestaña inferior).
2. Ve a la carpeta del frontend:
   ```bash
   cd ../frontend-angular
   ```
3. Instala las dependencias de Angular:
   ```bash
   npm install
   ```
4. Levanta el servidor de desarrollo:
   ```bash
   npm start
   ```
5. Abre en tu navegador la dirección: **`http://localhost:4200`**

---
*¡Listo! Tu proyecto estará corriendo sincronizado, con el backend de Spring Boot conectándose a tu base de datos y sirviendo los datos al frontend de Angular 17 de manera profesional.*
