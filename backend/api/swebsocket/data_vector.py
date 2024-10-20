import weaviate
import warnings
import os
import requests  # Usaremos requests para interactuar con la API de Ollama

class WeaviateQuery:
    def __init__(self, weaviate_url="http://172.21.1.107:8080", ollama_url="https://rhzzqeid4k2fbr-11434.proxy.runpod.net/api/embeddings"):
        warnings.simplefilter("ignore", ResourceWarning)
        self.weaviate_url = weaviate_url
        self.ollama_url = ollama_url
        self.client = self.get_weaviate_client()

    # Conectar al cliente de Weaviate v4
    def get_weaviate_client(self):
        try:
            client = weaviate.Client(self.weaviate_url)
            if client.is_ready():
                print("Conexión exitosa con Weaviate")
            return client
        except Exception as e:
            print(f"Error al conectar con Weaviate: {e}")
            raise

    # Llamar a la API de Ollama para generar embeddings
    def get_embedding_from_ollama(self, sentence, max_length=512):
        if len(sentence) > max_length:
            print(f"El enunciado es demasiado largo, truncando a {max_length} caracteres.")
            sentence = sentence[:max_length]
        
        payload = {
            "model": "llama3.2:3b",
            "prompt": sentence
        }

        try:
            response = requests.post(self.ollama_url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            if 'embedding' in data and isinstance(data['embedding'], list):
                return data['embedding']
            else:
                print(f"Error: No se encontró el embedding en la respuesta de Ollama para '{sentence}'")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Error al llamar a la API de Ollama: {e}")
            return None

    # Crear la clase en Weaviate si no existe
    def create_class_if_not_exists(self, class_name):
        try:
            schema = self.client.schema.get()
            if any(cls['class'] == class_name for cls in schema['classes']):
                print(f"La clase '{class_name}' ya existe en Weaviate.")
                return True
            else:
                schema = {
                    "class": class_name,
                    "properties": [{"name": "text", "dataType": ["text"]}],
                }
                self.client.schema.create_class(schema)
                print(f"Clase '{class_name}' creada con éxito.")
                return False
        except Exception as e:
            print(f"Error al crear la clase en Weaviate: {e}")
            raise

    # Añadir documentos a Weaviate con embeddings generados por Ollama
    def add_sentences_to_weaviate(self, class_name, sentences):
        try:
            with self.client.batch as batch:
                for sentence in sentences:
                    embedding = self.get_embedding_from_ollama(sentence)
                    if embedding:
                        batch.add_data_object(
                            data_object={"text": sentence}, class_name=class_name, vector=embedding
                        )
                        print(f"Enunciado agregado con embedding: {sentence}")
                    else:
                        print(f"Error al generar el embedding para: {sentence}")
        except Exception as e:
            print(f"Error al añadir los enunciados a Weaviate: {e}")
            raise

    # Recuperar datos desde Weaviate usando embeddings
    def retrieve_data_from_weaviate(self, class_name, prompt, limit=10):
        try:
            embedding = self.get_embedding_from_ollama(prompt)
            if not embedding:
                print("Error al generar embedding para el prompt.")
                return None

            query = (
                self.client.query
                .get(class_name, ["text"])
                .with_near_vector({"vector": embedding, "certainty": 0.7})
                .with_limit(limit)
            )
            result = query.do()
            if result and 'data' in result and 'Get' in result['data']:
                objects = result['data']['Get'][class_name]
                retrieved_texts = [obj['text'] for obj in objects]
                return retrieved_texts
            else:
                print("No se encontraron resultados.")
                return None
        except Exception as e:
            print(f"Error al recuperar datos de Weaviate: {e}")
            raise

    # Método para llamar la clase y consultar los datos
    def query(self, class_name, prompt):
        collection_exists = self.create_class_if_not_exists(class_name)
        if not collection_exists:
            print("Por favor, añade los datos primero.")
            return
        
        retrieved_texts = self.retrieve_data_from_weaviate(class_name, prompt)
        if retrieved_texts:
            combined_text = " ".join(retrieved_texts)
            return combined_text
        else:
            return "Una alimentación balanceada incluye frutas, verduras, proteínas magras y granos enteros. Evita los alimentos ultraprocesados y opta por opciones frescas y naturales para mantener una buena salud."


