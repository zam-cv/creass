import logging
import json
import httpx 
from fastapi import WebSocket, WebSocketDisconnect
import asyncio
from .data_vector import WeaviateQuery

# Logger configuration for the WebSocket server
logger = logging.getLogger(__name__)

weaviate_query = WeaviateQuery()
class_name = "HackMetaNew"

# Function that handles real-time response generation
async def handle_client(websocket: WebSocket, client_id: int):
    """
    Function that manages the WebSocket connection with the client to generate real-time responses
    using the data received from the client, including the prompt, user information, and browser results.
    """
    try:
        await websocket.accept()  # Accept the WebSocket connection

        while True:  # Keep the connection open
            # Receive the prompt from the client
            data = await websocket.receive_text()

            final_prompt = ''
            list_prompts = []

            # Continue while the size of the list is less than 5
            while len(list_prompts) < 5:
                # First step: make the first HTTP call
                async with httpx.AsyncClient() as client:
                    async with client.stream(
                        "POST",
                        "https://rhzzqeid4k2fbr-11434.proxy.runpod.net/api/generate",
                        json={"model": "llama3.2:3b",
                        "prompt":f"Tienes los siguientes datos {data} prompt es la pregunta de un usuario con las caracteristicas descritas en user_context, results son los resultados de una busqueda en un navegador y context es el contexto de la conversacion. Solamente debes escribir seis prompts adecuados que resuman lo que el usuario necesita saber separados por '%' . RECUERDA, DEBEN HABER EXACTAMENTE SEIS PROMPTS Y SEIS '%', NO DEBES ESCRIBIR NADA MAS, no debes agregar espacios ni saltos de linea ni comillas, el formato debe ser exactamente el siguiente: Prompt1%Prompt2%Prompt3%Prompt4%Prompt5%Prompt6%"
                        },
                    ) as response:

                        # Process the response in real-time
                        async for line in response.aiter_lines():
                            if line:
                                try:
                                    partial_response_json = json.loads(line)
                                    response_fragment = partial_response_json['response']
                                    final_prompt += response_fragment

                                    logger.info(f"[Cliente {client_id}] Fragmento recibido: {response_fragment}")

                                    # Check if the response is complete
                                    if partial_response_json.get('done'):
                                        break

                                except json.JSONDecodeError as e:
                                    logger.error(f"Error al decodificar JSON para el cliente {client_id}: {str(e)}")

                # Split the response into a list of prompts
                list_prompts = final_prompt.split('%')

            print(len(list_prompts))
            print(list_prompts)

            debug = ''

            for i, prompt in enumerate(list_prompts):
                await websocket.send_text(prompt)
                await websocket.send_text('$')
                if i == 5:
                    break

                web_scrapping_data = weaviate_query.query(class_name, prompt)

                # Second step: make the second HTTP call
                async with httpx.AsyncClient() as client:
                    async with client.stream(
                        "POST",
                        "https://rhzzqeid4k2fbr-11434.proxy.runpod.net/api/generate",
                        json={"model": "llama3.1:70b", "prompt": f"Tomando en cuenta los siguientes datos: [{web_scrapping_data}] da una muy breve descripcion y no respondas nada mas, ni un solo saludo ni nada que no sea una descripcion que responda al siguiente prompt: {prompt}."},
                    ) as response:

                        # Process the response in real-time
                        async for line in response.aiter_lines():
                            if line:
                                try:
                                    partial_response_json = json.loads(line)
                                    response_fragment = partial_response_json['response']

                                    debug += response_fragment

                                    logger.info(f"[Cliente {client_id}] Fragmento recibido: {response_fragment}")

                                    # Send the response fragment to the WebSocket client
                                    await websocket.send_text(response_fragment)

                                    # Check if the response is complete
                                    if partial_response_json.get('done'):
                                        break

                                except json.JSONDecodeError as e:
                                    logger.error(f"Error al decodificar JSON para el cliente {client_id}: {str(e)}")
                        await websocket.send_text('%')
            print(debug)

    except WebSocketDisconnect:
        logger.info(f"Cliente {client_id} desconectado.")
    except Exception as e:
        logger.error(f"Error en WebSocket para el cliente {client_id}: {str(e)}")
    finally:
        await websocket.close()
        logger.info(f"Conexión cerrada para el cliente {client_id}")

# WebSocket endpoint
async def websocket_endpoint(websocket: WebSocket):
    # Generate a unique identifier for each connection
    client_id = id(websocket)
    logger.info(f"Conexión establecida para el cliente {client_id}")
    
    # Create an asynchronous task to handle this client separately
    await handle_client(websocket, client_id)
