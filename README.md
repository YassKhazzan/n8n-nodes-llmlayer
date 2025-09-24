# n8n-nodes-llmlayer

This is an n8n community node for [LLMLayer](https://llmlayer.ai), a powerful Search & Answer API that combines web search with AI-powered responses.

## Features

The LLMLayer node provides access to:

- **AI-Powered Answers**: Generate comprehensive answers using various AI models (GPT-4, Claude, Gemini, etc.)
- **Web Search**: Search the web with multiple search types (general, news, shopping, videos, images, scholar)
- **Content Scraping**: Extract content from any URL in multiple formats (markdown, HTML, PDF, screenshot)
- **YouTube Transcripts**: Get transcripts from YouTube videos
- **PDF Content Extraction**: Extract text content from PDF files

## Installation

### In n8n Cloud

1. Go to Settings > Community Nodes
2. Search for `n8n-nodes-llmlayer`
3. Click Install

### In Self-Hosted n8n

Using npm:
```bash
npm install n8n-nodes-llmlayer
```

Using Docker:
```bash
docker exec -it n8n npm install n8n-nodes-llmlayer
```

Then restart your n8n instance.

## Authentication

To use this node, you need an API key from LLMLayer:

1. Sign up at [LLMLayer](https://app.llmlayer.ai)
2. Get your API key from the dashboard
3. In n8n, create new LLMLayer credentials
4. Enter your API key

## Usage

### Answer Generation

Generate AI-powered answers based on real-time web search:

1. Add the LLMLayer node to your workflow
2. Select "Answer" as the resource
3. Enter your query
4. Choose an AI model (GPT-4o, Claude 3.5, Gemini 2.0, etc.)
5. Configure additional options as needed

**Example Use Cases:**
- Customer support automation
- Research assistance
- Content generation
- Real-time information retrieval

### Web Search

Perform targeted web searches:

1. Select "Web Search" as the resource
2. Enter your search query
3. Choose search type (general, news, shopping, videos, images, scholar)
4. Apply filters (location, recency, domains)

### Content Scraping

Extract content from any webpage:

1. Select "Scrape" as the resource
2. Enter the URL to scrape
3. Choose output format (markdown, HTML, PDF, screenshot)
4. Configure image and link inclusion

### YouTube Transcripts

Get transcripts from YouTube videos:

1. Select "YouTube" as the resource
2. Enter the YouTube video URL
3. Optionally specify language

### PDF Content

Extract text from PDF files:

1. Select "PDF" as the resource
2. Enter the PDF URL
3. Get extracted text and metadata

## Node Configuration

### Answer Resource Options

- **Query**: Your question or search query
- **Model**: Choose from 13+ AI models
- **Answer Type**: markdown, HTML, or JSON
- **Search Type**: general or news
- **Location**: Geographic location for search
- **System Prompt**: Custom instructions for AI
- **Citations**: Include source citations
- **Return Sources**: Get source documents
- **Date Filter**: Filter by time period
- **Temperature**: Control creativity (0-2)
- **Max Tokens**: Response length limit

### Web Search Options

- **Search Type**: general, news, shopping, videos, images, scholar
- **Location**: Country code (us, uk, de, etc.)
- **Recency**: Filter by time (hour, day, week, month, year)
- **Domain Filter**: Include/exclude specific domains

### Scrape Options

- **Format**: markdown, HTML, PDF, screenshot
- **Include Images**: Extract images from page
- **Include Links**: Preserve hyperlinks

## Error Handling

The node includes comprehensive error handling:

- Authentication errors
- Rate limiting
- Invalid requests
- Network timeouts
- API errors

Enable "Continue On Fail" in node settings to handle errors gracefully.

## Examples

### Basic Answer Generation
```json
{
  "resource": "answer",
  "query": "What are the latest developments in AI?",
  "model": "openai/gpt-4o-mini",
  "answer_type": "markdown"
}
```

### News Search with Filters
```json
{
  "resource": "webSearch", 
  "query": "artificial intelligence breakthroughs",
  "search_type": "news",
  "recency": "week",
  "location": "us"
}
```

### Structured JSON Output
```json
{
  "resource": "answer",
  "query": "List top 5 programming languages",
  "model": "anthropic/claude-3-5-sonnet-latest",
  "answer_type": "json",
  "json_schema": {
    "type": "object",
    "properties": {
      "languages": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "rank": {"type": "number"},
            "use_cases": {"type": "array"}
          }
        }
      }
    }
  }
}
```

## Support

- **Documentation**: [LLMLayer Docs](https://docs.llmlayer.ai)
- **Issues**: [GitHub Issues](https://github.com/YassKhazzan/n8n-nodes-llmlayer/issues)
- **Email**: support@llmlayer.ai

## License

MIT

## Author

Yassine Khazzan - [LLMLayer](https://llmlayer.ai)

## Changelog

### 1.0.0
- Initial release
- Support for all LLMLayer API endpoints
- Full model selection
- Comprehensive error handling
- TypeScript implementation