# Guía de Importación y Ejecución de SIA-CT en IntelliJ IDEA 2025.3.4

Este proyecto ha sido estructurado para ser ejecutado localmente de forma independiente y profesional utilizando **IntelliJ IDEA 2025.3.4** para el backend en **Java Spring Boot (JPA)**, y la terminal integrada de IntelliJ para el frontend en **Angular 17**.

---

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales:
1. **/backend-java**: Servicio Backend en **Spring Boot (Java 17 / Maven / Spring Data JPA)**.
2. **/frontend-angular**: Cliente Web en **Angular 17 (Standalone Components / Tailwind CSS)**.

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu máquina local:
- **Java JDK 17** o superior.
- **Node.js** (Versión 18 o superior) y **npm**.
- **PostgreSQL** corriendo localmente (o cambiar la cadena de conexión en el backend si utilizas otro motor de base de datos como H2, MySQL, etc.).

---

## Paso 1: Exportar y Descargar el Código
Para descargar este proyecto desde la plataforma AI Studio:
1. Dirígete al menú superior de la plataforma o en **Settings / Configuración**.
2. Selecciona **Export to ZIP** (o descargar como archivo ZIP).
3. Descomprime el archivo en tu carpeta de desarrollo local.

---

## Paso 2: Importar y Configurar el Backend en IntelliJ IDEA 2025.3.4

1. Abre **IntelliJ IDEA 2025.3.4**.
2. En la pantalla de bienvenida, selecciona **Open** (o haz clic en `File -> Open` si ya estás dentro del IDE).
3. Selecciona la carpeta **`backend-java`** (donde se encuentra el archivo `pom.xml`) y haz clic en **OK**.
4. IntelliJ detectará automáticamente el archivo `pom.xml` y comenzará a descargar las dependencias de Maven. *(Esto puede tomar un par de minutos la primera vez)*.

### Configurar la Base de Datos (PostgreSQL)
El backend está preconfigurado para conectarse a una base de datos PostgreSQL llamada `sia_ct_db`.
Si deseas crearla localmente:
```sql
CREATE DATABASE sia_ct_db;
```

Si necesitas cambiar las credenciales o el nombre de la base de datos, edita el archivo:
`backend-java/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sia_ct_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

### Ejecutar el Backend
1. En la vista del proyecto (`Project Tool Window`), navega hasta `src/main/java/com/mpfn/siact/SiaCtApplication.java`.
2. Haz clic derecho sobre el archivo y selecciona **Run 'SiaCtApplication.main()'** (o presiona `Shift + F10`).
3. El servidor Spring Boot iniciará en el puerto **`8080`** con el prefijo `/api` (ej: `http://localhost:8080/api/cases`).
4. **Carga de Datos Iniciales**: El backend creará automáticamente las tablas en la base de datos e insertará datos simulados iniciales (Carpetas Fiscales y Elementos de Convicción) la primera vez que se ejecute si la tabla está vacía.

---

## Paso 3: Configurar y Ejecutar el Frontend en Angular

Puedes correr la aplicación de Angular directamente desde la terminal integrada de IntelliJ IDEA:

1. Abre la pestaña **Terminal** en la parte inferior de IntelliJ IDEA.
2. Navega al directorio del frontend:
   ```bash
   cd ../frontend-angular
   ```
   *(O si abriste la carpeta raíz del proyecto, asegúrate de estar en `frontend-angular`)*.
3. Instala las dependencias necesarias de Angular ejecutando:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo local de Angular:
   ```bash
   npm start
   ```
5. Una vez compilado correctamente, abre tu navegador en:
   **`http://localhost:4200`**

---

## Funcionalidades del Módulo D (SIA-CT V2)
- **Clasificación Inteligente Automatizada**: Al ingresar la descripción de un elemento de convicción (ej: *"Declaración testimonial de..."*), el sistema analiza las palabras clave fácticas y clasifica de forma automática el elemento en la categoría estándar del Ministerio Público (Testimonial, Pericial, Actas, Documental o Informe Técnico).
- **Evaluación del Triple Test de Valoración**: Permite marcar y analizar la **Pertinencia**, **Conducencia** y **Utilidad** del elemento de prueba.
- **Diagnóstico Automático de Suficiencia**: Pondera automáticamente las variables ingresadas para emitir alertas de "Elementos suficientes", "Elementos insuficientes" o la necesidad urgente de "Diligencias o Actos de Investigación Adicionales" para asegurar el éxito procesal de la carpeta fiscal.

---
*Desarrollado para el Ministerio Público de la Nación. Compatible con IntelliJ IDEA 2025.3.4.*
