import requests
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import LLMResult, Generation
from langchain.llms.base import BaseLLM

# Paso 1: Crear la clase para manejar el prompt con la API externa
class CustomAPIWrapper(BaseLLM, BaseModel):  
    api_url: str  

    def _call(self, prompt, stop=None):
        if isinstance(prompt, list):
            prompt = prompt[0]  # Convertir lista a string si es necesario
        
        response = requests.post(self.api_url, json={"model": "llama3.1:70b", "prompt": prompt}, stream=True)
        if response.status_code == 200:
            result = ""
            for line in response.iter_lines():
                if line:
                    try:
                        partial_response = line.decode('utf-8')
                        partial_response_json = json.loads(partial_response)
                        result += partial_response_json['response']  # Concatenar las respuestas
                        if partial_response_json.get('done'):
                            break
                    except Exception as e:
                        raise ValueError(f"Error procesando fragmento de la respuesta: {str(e)}")
            return result
        else:
            raise ValueError(f"Error al llamar a la API: {response.status_code}, {response.text}")

    def _generate(self, prompt, stop=None):
        response = self._call(prompt, stop)
        return LLMResult(generations=[[Generation(text=response)]])

    @property
    def _identifying_params(self):
        return {"api_url": self.api_url}

    @property
    def _llm_type(self):
        return "custom_api"

# Instancia de API con URL de la API externa
api_url = "https://rhzzqeid4k2fbr-11434.proxy.runpod.net/api/generate"
custom_llm = CustomAPIWrapper(api_url=api_url)

# Definir el prompt template
template = """Question: {question}

Answer: Let's think step by step."""
prompt_template = ChatPromptTemplate.from_template(template)

# Crear el enrutador para la API de FastAPI
router = APIRouter()

# Modelo para recibir el prompt en el cuerpo de la solicitud
class PromptRequest(BaseModel):
    question: str

# Ruta POST para procesar el prompt
@router.post("/generate-prompt")
async def generate_prompt(request: PromptRequest):
    try:
        # Conectar el prompt y el modelo a través de la cadena
        chain = prompt_template | custom_llm
        result = chain.invoke({"question": request.question})

        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando el prompt: {str(e)}")
