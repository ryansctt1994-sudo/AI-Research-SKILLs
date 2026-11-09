# LlamaIndex - Data Framework for LLM Applications: Vector store integrations

## Chroma (local)

```python
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

# Initialize Chroma
db = chromadb.PersistentClient(path="./chroma_db")
collection = db.get_or_create_collection("my_collection")

# Create vector store
vector_store = ChromaVectorStore(chroma_collection=collection)

# Use in index
from llama_index.core import StorageContext
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
```

## Pinecone (cloud)

```python
from llama_index.vector_stores.pinecone import PineconeVectorStore
import pinecone

# Initialize Pinecone
pinecone.init(api_key="your-key", environment="us-west1-gcp")
pinecone_index = pinecone.Index("my-index")

# Create vector store
vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
```

## FAISS (fast)

```python
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss

# Create FAISS index
d = 1536  # Dimension of embeddings
faiss_index = faiss.IndexFlatL2(d)

vector_store = FaissVectorStore(faiss_index=faiss_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

index = VectorStoreIndex.from_documents(documents, storage_context=storage_context)
```
