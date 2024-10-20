const fs = require('fs').promises;
const axios = require('axios');

// Ruta del archivo Output.txt
const filePath = 'Output.txt';

// Función para leer el contenido del archivo Output.txt
async function readOutputFile() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return data;  // Devuelve el contenido del archivo
    } catch (error) {
        console.error('Error reading the file:', error);
        return null;
    }
}

// Función principal que envía el prompt junto con el contenido del archivo a una API
async function sendPromptWithFileContent() {
    try {
        // Leer el contenido del archivo Output.txt
        const fileContent = await readOutputFile();
        
        // Verificar si se leyó correctamente el archivo
        if (!fileContent) {
            console.error('No file content to send.');
            return;
        }

        // Prompt que quieres enviar
        const prompt = "Necesito que generes párrafos concisos y claros de no más de 200 caracteres cada uno, con ideas sobre alimentación saludable y hábitos relacionados, basados en la siguiente información, toma en cuenta que es informacion sacada de web scrapping, por lo que no tiene algun formato en especifico:";

        // Crear el mensaje concatenando el prompt con el contenido del archivo
        const dataToSend = `${prompt}\n\n${fileContent}`;

        // Crear el objeto JSON para enviar el prompt y el contenido, usando el campo "question"
        const jsonObject = {
            question: dataToSend
        };

        // Enviar el resultado al endpoint de tu API
        const apiResponse = await axios.post('http://127.0.0.1:8000/generate-prompt', jsonObject, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        // Mostrar la respuesta de la API
        if (apiResponse && apiResponse.data) {
            console.log("Response from API:", apiResponse.data);
        } else {
            console.error('No valid response received from the API.');
        }
    } catch (error) {
        console.error('Error occurred while sending the prompt:', error);
    }
}

// Llamada a la función principal
sendPromptWithFileContent();
