# Model Merging: Combining Pre-trained Models: Advanced Patterns

## Layer-wise Merging

```yaml
# Different models for different layers
merge_method: passthrough
slices:
  - sources:
      - model: mistralai/Mistral-7B-v0.1
        layer_range: [0, 16]   # First half
  - sources:
      - model: teknium/OpenHermes-2.5-Mistral-7B
        layer_range: [16, 32]  # Second half
dtype: bfloat16
```

## MoE from Merged Models

```yaml
# Create Mixture of Experts
merge_method: moe
base_model: mistralai/Mistral-7B-v0.1
experts:
  - source_model: WizardLM/WizardMath-7B-V1.1
    positive_prompts:
      - "math"
      - "calculate"
  - source_model: teknium/OpenHermes-2.5-Mistral-7B
    positive_prompts:
      - "chat"
      - "conversation"
  - source_model: ajibawa-2023/Code-Mistral-7B
    positive_prompts:
      - "code"
      - "python"
dtype: bfloat16
```

## Tokenizer Merging

```yaml
merge_method: linear
models:
  - model: mistralai/Mistral-7B-v0.1
  - model: custom/specialized-model

tokenizer:
  source: "union"  # Combine vocabularies from both models
  tokens:
    <|special_token|>:
      source: "custom/specialized-model"
```
