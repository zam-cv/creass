import asyncio
import websockets

async def send_prompt():
    uri = "ws://localhost:8000/ws"  # URL
    async with websockets.connect(uri) as websocket:
        prompt = "¿Cuál es el impacto del reciclaje en el medio ambiente?" # Prompt
        await websocket.send(prompt)
        
        try:
            while True:
                response = await websocket.recv()
                
                print(response, end="")
                
        except websockets.ConnectionClosed:
            #print("Conexión cerrada")
            pass

# Correr el cliente
asyncio.run(send_prompt())
