import weaviate
import warnings
import json
import os

warnings.simplefilter("ignore", ResourceWarning)

# Conectar al cliente de Weaviate v4
def get_weaviate_client():
    try:
        client = weaviate.Client("http://10.10.5.110:8080")  # Ajusta la IP y puerto según sea necesario
        if client.is_ready():
            print("Conexión exitosa con Weaviate")
        return client
    except Exception as e:
        print(f"Error al conectar con Weaviate: {e}")
        raise

# Leer el archivo output.txt y cargar los enunciados
def load_sentences(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"El archivo {file_path} no fue encontrado.")
    
    sentences = []
    with open(file_path, 'r', encoding='utf-8') as file:
        sentences = file.read().strip().split('\n\n')
    
    if not sentences:
        raise ValueError("El archivo está vacío o no contiene enunciados válidos.")
    
    return sentences

# Crear la clase en Weaviate si no existe (ajustado para v4)
def create_class_if_not_exists(client, class_name):
    """
    Crea la clase en Weaviate si no existe.
    """
    try:
        schema = client.schema.get()
        
        # Verificar si la clase ya existe
        if not any(cls['class'] == class_name for cls in schema['classes']):
            schema = {
                "class": class_name,
                "properties": [
                    {
                        "name": "text",
                        "dataType": ["text"],
                    }
                ],
            }
            client.schema.create_class(schema)
            print(f"Clase '{class_name}' creada con éxito.")
        else:
            print(f"La clase '{class_name}' ya existe en Weaviate.")
    except Exception as e:
        print(f"Error al crear la clase en Weaviate: {e}")
        raise

# Añadir documentos a Weaviate en lotes (ajustado para v4)
def add_sentences_to_weaviate(client, class_name, sentences):
    """
    Añade los enunciados a la clase en Weaviate en lotes dinámicos.
    """
    try:
        with client.batch as batch:
            for sentence in sentences:
                response = batch.add_data_object(
                    data_object={"text": sentence}, class_name=class_name
                )
                if response is not None:
                    print(f"Enunciado agregado: {sentence}")
                else:
                    print(f"Error al agregar enunciado: {sentence}")
    except Exception as e:
        print(f"Error al añadir los enunciados a Weaviate: {e}")
        raise

# Recuperar datos desde Weaviate
def retrieve_data_from_weaviate(client, class_name, limit=10):
    """
    Recupera datos de la clase en Weaviate.
    """
    try:
        query = (
            client.query
            .get(class_name, ["text"])  # Recupera los valores de la propiedad 'text'
            .with_limit(limit)  # Limita la cantidad de resultados recuperados
        )
        result = query.do()
        if result and 'data' in result and 'Get' in result['data']:
            objects = result['data']['Get'][class_name]
            for obj in objects:
                print(f"Texto recuperado: {obj['text']}")
        else:
            print("No se encontraron resultados.")
    except Exception as e:
        print(f"Error al recuperar datos de Weaviate: {e}")
        raise

def main():
    try:
        client = get_weaviate_client()
        class_name = "HackMeta"  # Nombre de la clase en Weaviate (asegúrate de que esté correcto)
        create_class_if_not_exists(client, class_name)  # Crear la clase si no existe
        sentences = load_sentences('output.txt')  # Cargar los enunciados desde el archivo
        add_sentences_to_weaviate(client, class_name, sentences)  # Añadir los enunciados a Weaviate
        retrieve_data_from_weaviate(client, class_name)  # Recuperar los primeros 10 datos desde Weaviate
    except FileNotFoundError as fnf_error:
        print(fnf_error)
    except ValueError as val_error:
        print(val_error)
    except Exception as e:
        print(f"Ha ocurrido un error inesperado: {e}")

if __name__ == "__main__":
    main()
