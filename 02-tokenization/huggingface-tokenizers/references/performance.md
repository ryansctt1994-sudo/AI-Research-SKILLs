# HuggingFace Tokenizers - Fast Tokenization for NLP: Performance benchmarks

## Training speed

| Corpus Size | BPE (30k vocab) | WordPiece (30k) | Unigram (8k) |
|-------------|-----------------|-----------------|--------------|
| 10 MB       | 15 sec          | 18 sec          | 25 sec       |
| 100 MB      | 1.5 min         | 2 min           | 4 min        |
| 1 GB        | 15 min          | 20 min          | 40 min       |

**Hardware**: 16-core CPU, tested on English Wikipedia

## Tokenization speed

| Implementation | 1 GB corpus | Throughput    |
|----------------|-------------|---------------|
| Pure Python    | ~20 minutes | ~50 MB/min    |
| HF Tokenizers  | ~15 seconds | ~4 GB/min     |
| **Speedup**    | **80×**     | **80×**       |

**Test**: English text, average sentence length 20 words

## Memory usage

| Task                    | Memory  |
|-------------------------|---------|
| Load tokenizer          | ~10 MB  |
| Train BPE (30k vocab)   | ~200 MB |
| Encode 1M sentences     | ~500 MB |
