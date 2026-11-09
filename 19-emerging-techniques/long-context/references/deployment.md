# Long Context: Extending Transformer Context Windows: Production Deployment

## Inference with Long Context

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load long-context model
model = AutoModelForCausalLM.from_pretrained(
    "togethercomputer/LLaMA-2-7B-32K",  # 32k context
    torch_dtype=torch.float16,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("togethercomputer/LLaMA-2-7B-32K")

# Process long document
long_text = "..." * 30000  # 30k tokens
inputs = tokenizer(long_text, return_tensors="pt", truncation=False).to('cuda')

# Generate
outputs = model.generate(
    **inputs,
    max_new_tokens=512,
    temperature=0.7,
)

response = tokenizer.decode(outputs[0], skip_special_tokens=True)
```

## Memory Optimization

```python
# Use gradient checkpointing for fine-tuning
model.gradient_checkpointing_enable()

# Use Flash Attention 2
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    attn_implementation="flash_attention_2",  # 2-3× faster
    torch_dtype=torch.float16
)

# Use paged attention (vLLM)
from vllm import LLM

llm = LLM(
    model="togethercomputer/LLaMA-2-7B-32K",
    max_model_len=32768,  # 32k context
    gpu_memory_utilization=0.9
)
```
