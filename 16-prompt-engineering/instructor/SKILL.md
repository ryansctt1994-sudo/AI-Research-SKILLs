---
name: instructor
description: Extract structured data from LLM responses with Pydantic validation, retry failed extractions automatically, parse complex JSON with type safety, and stream partial results with Instructor - battle-tested structured output library
version: 1.0.1
author: Orchestra Research
license: MIT
tags: [Prompt Engineering, Instructor, Structured Output, Pydantic, Data Extraction, JSON Parsing, Type Safety, Validation, Streaming, OpenAI, Anthropic]
dependencies: [instructor, pydantic, openai, anthropic]
---

# Instructor: Structured LLM Outputs

## When to Use This Skill

Use Instructor when you need to:
- **Extract structured data** from LLM responses reliably
- **Validate outputs** against Pydantic schemas automatically
- **Retry failed extractions** with automatic error handling
- **Parse complex JSON** with type safety and validation
- **Stream partial results** for real-time processing
- **Support multiple LLM providers** with consistent API

**GitHub Stars**: 15,000+ | **Battle-tested**: 100,000+ developers

## Installation

```bash
# Base installation
pip install instructor

# With specific providers
pip install "instructor[anthropic]"  # Anthropic Claude
pip install "instructor[openai]"     # OpenAI
pip install "instructor[all]"        # All providers
```

## Quick Start

### Basic Example: Extract User Data

```python
import instructor
from pydantic import BaseModel
from anthropic import Anthropic

# Define output structure
class User(BaseModel):
    name: str
    age: int
    email: str

# Create instructor client
client = instructor.from_anthropic(Anthropic())

# Extract structured data
user = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "John Doe is 30 years old. His email is john@example.com"
    }],
    response_model=User
)

print(user.name)   # "John Doe"
print(user.age)    # 30
print(user.email)  # "john@example.com"
```

### With OpenAI

```python
from openai import OpenAI

client = instructor.from_openai(OpenAI())

user = client.chat.completions.create(
    model="gpt-4o-mini",
    response_model=User,
    messages=[{"role": "user", "content": "Extract: Alice, 25, alice@email.com"}]
)
```

## Core Concepts

### 1. Response Models (Pydantic)

Response models define the structure and validation rules for LLM outputs.

#### Basic Model

```python
from pydantic import BaseModel, Field

class Article(BaseModel):
    title: str = Field(description="Article title")
    author: str = Field(description="Author name")
    word_count: int = Field(description="Number of words", gt=0)
    tags: list[str] = Field(description="List of relevant tags")

article = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Analyze this article: [article text]"
    }],
    response_model=Article
)
```

**Benefits:**
- Type safety with Python type hints
- Automatic validation (word_count > 0)
- Self-documenting with Field descriptions
- IDE autocomplete support

#### Nested Models

```python
class Address(BaseModel):
    street: str
    city: str
    country: str

class Person(BaseModel):
    name: str
    age: int
    address: Address  # Nested model

person = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "John lives at 123 Main St, Boston, USA"
    }],
    response_model=Person
)

print(person.address.city)  # "Boston"
```

#### Optional Fields

```python
from typing import Optional

class Product(BaseModel):
    name: str
    price: float
    discount: Optional[float] = None  # Optional
    description: str = Field(default="No description")  # Default value

# LLM doesn't need to provide discount or description
```

#### Enums for Constraints

```python
from enum import Enum

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

class Review(BaseModel):
    text: str
    sentiment: Sentiment  # Only these 3 values allowed

review = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "This product is amazing!"
    }],
    response_model=Review
)

print(review.sentiment)  # Sentiment.POSITIVE
```

### 2. Validation

Pydantic validates LLM outputs automatically. If validation fails, Instructor retries.

#### Built-in Validators

```python
from pydantic import Field, EmailStr, HttpUrl

class Contact(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    age: int = Field(ge=0, le=120)  # 0 <= age <= 120
    email: EmailStr  # Validates email format
    website: HttpUrl  # Validates URL format

# If LLM provides invalid data, Instructor retries automatically
```

#### Custom Validators

```python
from pydantic import field_validator

class Event(BaseModel):
    name: str
    date: str
    attendees: int

    @field_validator('date')
    def validate_date(cls, v):
        """Ensure date is in YYYY-MM-DD format."""
        import re
        if not re.match(r'\d{4}-\d{2}-\d{2}', v):
            raise ValueError('Date must be YYYY-MM-DD format')
        return v

    @field_validator('attendees')
    def validate_attendees(cls, v):
        """Ensure positive attendees."""
        if v < 1:
            raise ValueError('Must have at least 1 attendee')
        return v
```

#### Model-Level Validation

```python
from pydantic import model_validator

class DateRange(BaseModel):
    start_date: str
    end_date: str

    @model_validator(mode='after')
    def check_dates(self):
        """Ensure end_date is after start_date."""
        from datetime import datetime
        start = datetime.strptime(self.start_date, '%Y-%m-%d')
        end = datetime.strptime(self.end_date, '%Y-%m-%d')

        if end < start:
            raise ValueError('end_date must be after start_date')
        return self
```

### 3. Automatic Retrying

Instructor retries automatically when validation fails, providing error feedback to the LLM.

```python
# Retries up to 3 times if validation fails
user = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Extract user from: John, age unknown"
    }],
    response_model=User,
    max_retries=3  # Default is 3
)

# If age can't be extracted, Instructor tells the LLM:
# "Validation error: age - field required"
# LLM tries again with better extraction
```

**How it works:**
1. LLM generates output
2. Pydantic validates
3. If invalid: Error message sent back to LLM
4. LLM tries again with error feedback
5. Repeats up to max_retries

### 4. Streaming

Stream partial results for real-time processing.

#### Streaming Partial Objects

```python
from instructor import Partial

class Story(BaseModel):
    title: str
    content: str
    tags: list[str]

# Stream partial updates as LLM generates
for partial_story in client.messages.create_partial(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Write a short sci-fi story"
    }],
    response_model=Story
):
    print(f"Title: {partial_story.title}")
    print(f"Content so far: {partial_story.content[:100]}...")
    # Update UI in real-time
```

#### Streaming Iterables

```python
class Task(BaseModel):
    title: str
    priority: str

# Stream list items as they're generated
tasks = client.messages.create_iterable(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Generate 10 project tasks"
    }],
    response_model=Task
)

for task in tasks:
    print(f"- {task.title} ({task.priority})")
    # Process each task as it arrives
```

## Provider Configuration

See the **Provider Configuration** section of [references/providers.md](references/providers.md) for: Anthropic Claude; OpenAI; Local Models (Ollama).

## Common Patterns

See the **Common Patterns** section of [references/examples.md](references/examples.md) for: Pattern 1: Data Extraction from Text; Pattern 2: Classification; Pattern 3: Multi-Entity Extraction; Pattern 4: Structured Analysis; Pattern 5: Batch Processing.

## Advanced Features

See [references/advanced-features.md](references/advanced-features.md) for: Union Types; Dynamic Models; Custom Modes; Context Management.

## Error Handling

### Handling Validation Errors

```python
from pydantic import ValidationError

try:
    user = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=1024,
        messages=[...],
        response_model=User,
        max_retries=3
    )
except ValidationError as e:
    print(f"Failed after retries: {e}")
    # Handle gracefully

except Exception as e:
    print(f"API error: {e}")
```

### Custom Error Messages

```python
class ValidatedUser(BaseModel):
    name: str = Field(description="Full name, 2-100 characters")
    age: int = Field(description="Age between 0 and 120", ge=0, le=120)
    email: EmailStr = Field(description="Valid email address")

    class Config:
        # Custom error messages
        json_schema_extra = {
            "examples": [
                {
                    "name": "John Doe",
                    "age": 30,
                    "email": "john@example.com"
                }
            ]
        }
```

## Best Practices

### 1. Clear Field Descriptions

```python
# ❌ Bad: Vague
class Product(BaseModel):
    name: str
    price: float

# ✅ Good: Descriptive
class Product(BaseModel):
    name: str = Field(description="Product name from the text")
    price: float = Field(description="Price in USD, without currency symbol")
```

### 2. Use Appropriate Validation

```python
# ✅ Good: Constrain values
class Rating(BaseModel):
    score: int = Field(ge=1, le=5, description="Rating from 1 to 5 stars")
    review: str = Field(min_length=10, description="Review text, at least 10 chars")
```

### 3. Provide Examples in Prompts

```python
messages = [{
    "role": "user",
    "content": """Extract person info from: "John, 30, engineer"

Example format:
{
  "name": "John Doe",
  "age": 30,
  "occupation": "engineer"
}"""
}]
```

### 4. Use Enums for Fixed Categories

```python
# ✅ Good: Enum ensures valid values
class Status(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Application(BaseModel):
    status: Status  # LLM must choose from enum
```

### 5. Handle Missing Data Gracefully

```python
class PartialData(BaseModel):
    required_field: str
    optional_field: Optional[str] = None
    default_field: str = "default_value"

# LLM only needs to provide required_field
```

## Comparison to Alternatives

See [references/comparison.md](references/comparison.md).

## Resources

- **Documentation**: https://python.useinstructor.com
- **GitHub**: https://github.com/jxnl/instructor (15k+ stars)
- **Cookbook**: https://python.useinstructor.com/examples
- **Discord**: Community support available

## See Also

- `references/validation.md` - Advanced validation patterns
- `references/providers.md` - Provider-specific configuration
- `references/examples.md` - Real-world use cases


