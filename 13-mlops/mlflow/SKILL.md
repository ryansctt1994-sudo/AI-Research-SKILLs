---
name: mlflow
description: Track ML experiments, manage model registry with versioning, deploy models to production, and reproduce experiments with MLflow - framework-agnostic ML lifecycle platform
version: 1.0.1
author: Orchestra Research
license: MIT
tags: [MLOps, MLflow, Experiment Tracking, Model Registry, ML Lifecycle, Deployment, Model Versioning, PyTorch, TensorFlow, Scikit-Learn, HuggingFace]
dependencies: [mlflow, sqlalchemy, boto3]
---

# MLflow: ML Lifecycle Management Platform

## When to Use This Skill

Use MLflow when you need to:
- **Track ML experiments** with parameters, metrics, and artifacts
- **Manage model registry** with versioning and stage transitions
- **Deploy models** to various platforms (local, cloud, serving)
- **Reproduce experiments** with project configurations
- **Compare model versions** and performance metrics
- **Collaborate** on ML projects with team workflows
- **Integrate** with any ML framework (framework-agnostic)

**Users**: 20,000+ organizations | **GitHub Stars**: 23k+ | **License**: Apache 2.0

## Installation

```bash
# Install MLflow
pip install mlflow

# Install with extras
pip install mlflow[extras]  # Includes SQLAlchemy, boto3, etc.

# Start MLflow UI
mlflow ui

# Access at http://localhost:5000
```

## Quick Start

### Basic Tracking

```python
import mlflow

# Start a run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("batch_size", 32)

    # Your training code
    model = train_model()

    # Log metrics
    mlflow.log_metric("train_loss", 0.15)
    mlflow.log_metric("val_accuracy", 0.92)

    # Log model
    mlflow.sklearn.log_model(model, "model")
```

### Autologging (Automatic Tracking)

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier

# Enable autologging
mlflow.autolog()

# Train (automatically logged)
model = RandomForestClassifier(n_estimators=100, max_depth=5)
model.fit(X_train, y_train)

# Metrics, parameters, and model logged automatically!
```

## Core Concepts

### 1. Experiments and Runs

**Experiment**: Logical container for related runs
**Run**: Single execution of ML code (parameters, metrics, artifacts)

```python
import mlflow

# Create/set experiment
mlflow.set_experiment("my-experiment")

# Start a run
with mlflow.start_run(run_name="baseline-model"):
    # Log params
    mlflow.log_param("model", "ResNet50")
    mlflow.log_param("epochs", 10)

    # Train
    model = train()

    # Log metrics
    mlflow.log_metric("accuracy", 0.95)

    # Log model
    mlflow.pytorch.log_model(model, "model")

# Run ID is automatically generated
print(f"Run ID: {mlflow.active_run().info.run_id}")
```

### 2. Logging Parameters

```python
with mlflow.start_run():
    # Single parameter
    mlflow.log_param("learning_rate", 0.001)

    # Multiple parameters
    mlflow.log_params({
        "batch_size": 32,
        "epochs": 50,
        "optimizer": "Adam",
        "dropout": 0.2
    })

    # Nested parameters (as dict)
    config = {
        "model": {
            "architecture": "ResNet50",
            "pretrained": True
        },
        "training": {
            "lr": 0.001,
            "weight_decay": 1e-4
        }
    }

    # Log as JSON string or individual params
    for key, value in config.items():
        mlflow.log_param(key, str(value))
```

### 3. Logging Metrics

```python
with mlflow.start_run():
    # Training loop
    for epoch in range(NUM_EPOCHS):
        train_loss = train_epoch()
        val_loss = validate()

        # Log metrics at each step
        mlflow.log_metric("train_loss", train_loss, step=epoch)
        mlflow.log_metric("val_loss", val_loss, step=epoch)

        # Log multiple metrics
        mlflow.log_metrics({
            "train_accuracy": train_acc,
            "val_accuracy": val_acc
        }, step=epoch)

    # Log final metrics (no step)
    mlflow.log_metric("final_accuracy", final_acc)
```

### 4. Logging Artifacts

```python
with mlflow.start_run():
    # Log file
    model.save('model.pkl')
    mlflow.log_artifact('model.pkl')

    # Log directory
    os.makedirs('plots', exist_ok=True)
    plt.savefig('plots/loss_curve.png')
    mlflow.log_artifacts('plots')

    # Log text
    with open('config.txt', 'w') as f:
        f.write(str(config))
    mlflow.log_artifact('config.txt')

    # Log dict as JSON
    mlflow.log_dict({'config': config}, 'config.json')
```

### 5. Logging Models

```python
# PyTorch
import mlflow.pytorch

with mlflow.start_run():
    model = train_pytorch_model()
    mlflow.pytorch.log_model(model, "model")

# Scikit-learn
import mlflow.sklearn

with mlflow.start_run():
    model = train_sklearn_model()
    mlflow.sklearn.log_model(model, "model")

# Keras/TensorFlow
import mlflow.keras

with mlflow.start_run():
    model = train_keras_model()
    mlflow.keras.log_model(model, "model")

# HuggingFace Transformers
import mlflow.transformers

with mlflow.start_run():
    mlflow.transformers.log_model(
        transformers_model={
            "model": model,
            "tokenizer": tokenizer
        },
        artifact_path="model"
    )
```

## Autologging

Automatically log metrics, parameters, and models for popular frameworks.

### Enable Autologging

```python
import mlflow

# Enable for all supported frameworks
mlflow.autolog()

# Or enable for specific framework
mlflow.sklearn.autolog()
mlflow.pytorch.autolog()
mlflow.keras.autolog()
mlflow.xgboost.autolog()
```

### Autologging with Scikit-learn

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Enable autologging
mlflow.sklearn.autolog()

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train (automatically logs params, metrics, model)
with mlflow.start_run():
    model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
    model.fit(X_train, y_train)

    # Metrics like accuracy, f1_score logged automatically
    # Model logged automatically
    # Training duration logged
```

### Autologging with PyTorch Lightning

```python
import mlflow
import pytorch_lightning as pl

# Enable autologging
mlflow.pytorch.autolog()

# Train
with mlflow.start_run():
    trainer = pl.Trainer(max_epochs=10)
    trainer.fit(model, datamodule=dm)

    # Hyperparameters logged
    # Training metrics logged
    # Best model checkpoint logged
```

## Model Registry

See the **Model Registry** section of [references/model-registry.md](references/model-registry.md) for: Register Model; Model Stages; Load Model from Registry; Model Versioning; Model Annotations.

## Searching Runs

Find runs programmatically.

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Search all runs in experiment
experiment_id = client.get_experiment_by_name("my-experiment").experiment_id
runs = client.search_runs(
    experiment_ids=[experiment_id],
    filter_string="metrics.accuracy > 0.9",
    order_by=["metrics.accuracy DESC"],
    max_results=10
)

for run in runs:
    print(f"Run ID: {run.info.run_id}")
    print(f"Accuracy: {run.data.metrics['accuracy']}")
    print(f"Params: {run.data.params}")

# Search with complex filters
runs = client.search_runs(
    experiment_ids=[experiment_id],
    filter_string="""
        metrics.accuracy > 0.9 AND
        params.model = 'ResNet50' AND
        tags.dataset = 'ImageNet'
    """,
    order_by=["metrics.f1_score DESC"]
)
```

## Integration Examples

See [references/integrations.md](references/integrations.md) for: PyTorch; HuggingFace Transformers; XGBoost.

## Best Practices

### 1. Organize with Experiments

```python
# ✅ Good: Separate experiments for different tasks
mlflow.set_experiment("sentiment-analysis")
mlflow.set_experiment("image-classification")
mlflow.set_experiment("recommendation-system")

# ❌ Bad: Everything in one experiment
mlflow.set_experiment("all-models")
```

### 2. Use Descriptive Run Names

```python
# ✅ Good: Descriptive names
with mlflow.start_run(run_name="resnet50-imagenet-lr0.001-bs32"):
    train()

# ❌ Bad: No name (auto-generated UUID)
with mlflow.start_run():
    train()
```

### 3. Log Comprehensive Metadata

```python
with mlflow.start_run():
    # Log hyperparameters
    mlflow.log_params({
        "learning_rate": 0.001,
        "batch_size": 32,
        "epochs": 50
    })

    # Log system info
    mlflow.set_tags({
        "dataset": "ImageNet",
        "framework": "PyTorch 2.0",
        "gpu": "A100",
        "git_commit": get_git_commit()
    })

    # Log data info
    mlflow.log_param("train_samples", len(train_dataset))
    mlflow.log_param("val_samples", len(val_dataset))
```

### 4. Track Model Lineage

```python
# Link runs to understand lineage
with mlflow.start_run(run_name="preprocessing"):
    data = preprocess()
    mlflow.log_artifact("data.csv")
    preprocessing_run_id = mlflow.active_run().info.run_id

with mlflow.start_run(run_name="training"):
    # Reference parent run
    mlflow.set_tag("preprocessing_run_id", preprocessing_run_id)
    model = train(data)
```

### 5. Use Model Registry for Deployment

```python
# ✅ Good: Use registry for production
model_uri = "models:/my-classifier/Production"
model = mlflow.pyfunc.load_model(model_uri)

# ❌ Bad: Hard-code run IDs
model_uri = "runs:/abc123/model"
model = mlflow.pyfunc.load_model(model_uri)
```

## Deployment

### Serve Model Locally

```bash
# Serve registered model
mlflow models serve -m "models:/my-classifier/Production" -p 5001

# Serve from run
mlflow models serve -m "runs:/<RUN_ID>/model" -p 5001

# Test endpoint
curl http://127.0.0.1:5001/invocations -H 'Content-Type: application/json' -d '{
  "inputs": [[1.0, 2.0, 3.0, 4.0]]
}'
```

### Deploy to Cloud

```bash
# Deploy to AWS SageMaker
mlflow sagemaker deploy -m "models:/my-classifier/Production" --region-name us-west-2

# Deploy to Azure ML
mlflow azureml deploy -m "models:/my-classifier/Production"
```

## Configuration

### Tracking Server

```bash
# Start tracking server with backend store
mlflow server \
  --backend-store-uri postgresql://user:password@localhost/mlflow \
  --default-artifact-root s3://my-bucket/mlflow \
  --host 0.0.0.0 \
  --port 5000
```

### Client Configuration

```python
import mlflow

# Set tracking URI
mlflow.set_tracking_uri("http://localhost:5000")

# Or use environment variable
# export MLFLOW_TRACKING_URI=http://localhost:5000
```

## Resources

- **Documentation**: https://mlflow.org/docs/latest
- **GitHub**: https://github.com/mlflow/mlflow (23k+ stars)
- **Examples**: https://github.com/mlflow/mlflow/tree/master/examples
- **Community**: https://mlflow.org/community

## See Also

- `references/tracking.md` - Comprehensive tracking guide
- `references/model-registry.md` - Model lifecycle management
- `references/deployment.md` - Production deployment patterns


