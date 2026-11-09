# Model Merging: Combining Pre-trained Models: Production Deployment

## Save and Upload

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load merged model
model = AutoModelForCausalLM.from_pretrained("./merged-model")
tokenizer = AutoTokenizer.from_pretrained("./merged-model")

# Upload to HuggingFace Hub
model.push_to_hub("username/my-merged-model")
tokenizer.push_to_hub("username/my-merged-model")
```

## Quantize Merged Model

```bash
# Quantize with GGUF
python convert.py ./merged-model --outtype f16 --outfile merged-model.gguf

# Quantize with GPTQ
python quantize_gptq.py ./merged-model --bits 4 --group_size 128
```
