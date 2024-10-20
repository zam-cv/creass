# Creas: ¡Cambiemos juntos la forma de alimentarnos!

Creas es la aplicación que está revolucionando la forma en que las personas cuidan su alimentación, enfocándose en México, uno de los países con los índices de obesidad más altos en el mundo. Nuestra misión es simple pero poderosa: ofrecerte recomendaciones de alimentación **saludable, económica y accesible**, para que el bienestar no sea un lujo, sino una realidad para todos.

## ¿Qué te ofrece Creas?

- **Comida sana, al alcance de todos:** Olvídate de dietas complicadas y costosas. En Creas, te proponemos opciones fáciles de encontrar y asequibles que no solo cuidan tu salud, sino también tu bolsillo.

- **Recomendaciones personalizadas:** Porque cada persona es diferente, Creas te sugiere alimentos y combinaciones adaptadas a tus gustos, necesidades y estilo de vida, ayudándote a mejorar tu alimentación día a día.

- **Acción en la palma de tu mano:**     Queremos ser tu compañero en este viaje hacia una vida más saludable. Desde consejos prácticos hasta planes de alimentación accesibles, Creas te impulsa a dar el primer paso hacia el cambio que siempre has querido.

Creas no es solo una app, es una herramienta para empoderar a las personas a tomar decisiones conscientes sobre su salud, de forma realista, económica y efectiva. ¡Únete al movimiento y descubre que cuidar de tu cuerpo puede ser más fácil y emocionante de lo que creías!


## Instrucciones para correr la aplicacion

### Requerimientos

1. **Node.js**: Puedes descargarlo desde el siguiente enlace:
   [Descargar Node.js](https://nodejs.org/en/download/package-manager)

2. **Python 3.9 o superior**: Puedes descargar la versión correcta desde el siguiente enlace:
   [Descargar Python](https://www.python.org/downloads/)

3. **Git**: Asegúrate de tenerlo instalado. Puedes obtenerlo desde el siguiente enlace:
   [Descargar Git](https://git-scm.com/downloads)

4. **Rust**: Lo puedes descargar en el siguiente enlace:

    [Descargar Rust](https://www.rust-lang.org/tools/install)


## Clona el repositorio 

```bash
git clone https://github.com/zam-cv/creass
```

Ingresa a la carpeta del proyecto


```bash
cd creass
```

## Pasos para correr el servidor

Ingresa a la carpeta backend/api

```bash
cd backend/api
```

Instala dependencias de python


```bash
pip install -r requirements.txt
```

Corre el servidor


```bash
fastapi run app.py
```

```bash
pip install pyoxidizer
```

## Pasos para correr la aplcacion

Abre otra terminal en el proyecto raiz e ingresa a la carpeta de app


```bash
cd app
```

Descarga las dependencias de node

```bash
npm install
```

Corre la aplicacion

```bash
npm run tauri dev
```

# Tecnologías
## Ollama
Para el procesamiento de lenguaje natural, se usaron dos modelos de la familia Llama de Ollama:  

* **llama3.2:3b**:  
   * Este modelo fue empleado para realizar el embedding de los datos extraídos (mediante web scraping) hacia una base vectorial, lo que permite optimizar la búsqueda y recuperación de información.  
   * También fue utilizado para preprocesar los datos recibidos por la aplicación y generar un prompt personalizado, adaptado al perfil y las preferencias del usuario.  
* **llama3.1:70b**:  
   * Este modelo recibe el prompt personalizado y, a partir de los datos previamente procesados y extraídos del web scraping, genera descripciones detalladas y recomendaciones de "ideas" alimenticias, ayudando a los usuarios a tomar decisiones informadas.  

<div style="text-align: center;">
   <img src="assets/42f6b28d-9117-48cd-ac0d-44baaf5c178e.png" alt="Ollama" width="300" height="300">
</div>

## FastAPI
FastAPI es el framework elegido para implementar el backend de la aplicación. Fue utilizado principalmente para:

* Crear el servidor de WebSocket, que permite el envío y recepción de datos en tiempo real entre la aplicación y los modelos de lenguaje que procesan las recomendaciones alimenticias.  
* Gestionar las solicitudes de la API que manejan la interacción con los modelos de lenguaje y otros servicios.  

<div style="text-align: center;">
   <img src="assets/logo-teal.png" alt="FastAPI" width="800" height="300">
</div>

## Node
Node.js fue utilizado para realizar el web scraping, mediante el cual se extraen datos útiles sobre alimentación y salud desde diversas fuentes en la web. Este proceso automatizado permite obtener información actualizada que luego es integrada y procesada por los modelos de lenguaje.  

<div style="text-align: center;">
   <img src="assets/node-js-icon-454x512-nztofx17.png" alt="NodeJS" width="300" height="300">
</div>

## Tauri
Tauri es el framework utilizado para desarrollar la aplicación de escritorio que brinda a los usuarios una interfaz amigable e intuitiva. Tauri permite mantener la aplicación ligera, rápida y segura, integrando las funcionalidades del backend con el frontend de manera eficiente.

<div style="text-align: center;">
   <img src="assets/tauri-1.svg" alt="Tauri" width="300" height="300">
</div>