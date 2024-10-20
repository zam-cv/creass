from fastapi import FastAPI
from websocket import server  # Importar el servidor del socket

app = FastAPI()

# Incluir el WebSocket
app.add_api_websocket_route("/ws", server.websocket_endpoint)  # Integrar el WebSocket en la app principal
