# Python Backend for Generative UI

This is a simplified Python backend using LangGraph and FastAPI that provides streaming generative UI components.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Set up environment variables:
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

3. Start the server:
\`\`\`bash
python start.py
\`\`\`

The server will run on `http://localhost:8000`

## Features

- **LangGraph Chain**: Simple reasoning chain with tool selection
- **Streaming UI**: Compatible with Vercel AI SDK streaming
- **Three Demo Tools**:
  - GitHub repository information
  - Invoice parsing
  - Weather data
- **FastAPI**: RESTful API with automatic documentation at `/docs`

## API Endpoints

- `POST /chat/invoke` - Send a message and get streaming response
- `GET /docs` - API documentation
- `GET /chat/playground` - Interactive chat playground
