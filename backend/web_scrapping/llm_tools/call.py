# Importar la clase WeaviateQuery desde el archivo weaviate_query.py
from test import WeaviateQuery

def main():
    # Crear una instancia de la clase WeaviateQuery
    weaviate_query = WeaviateQuery()

    # Definir el nombre de la clase en Weaviate y el prompt
    class_name = "HackMetaNew"
    prompt = "¿Cómo puedo mejorar mi salud con la alimentación?"

    # Realizar la consulta
    result = weaviate_query.query(class_name, prompt)

    # Mostrar el resultado de la consulta
    print(result)

if __name__ == "__main__":
    main()
