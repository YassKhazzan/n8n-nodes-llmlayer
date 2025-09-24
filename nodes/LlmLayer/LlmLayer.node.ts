import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class LlmLayer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LLMLayer',
		name: 'llmLayer',
		icon: 'file:llmlayer.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Search and answer questions using LLMLayer API',
		defaults: {
			name: 'LLMLayer',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'llmLayerApi',
				required: true,
			},
		],
		properties: [
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Answer',
						value: 'answer',
						description: 'Search and generate AI answers',
					},
					{
						name: 'Web Search',
						value: 'webSearch',
						description: 'Search the web for information',
					},
					{
						name: 'Scrape',
						value: 'scrape',
						description: 'Scrape content from a URL',
					},
					{
						name: 'YouTube',
						value: 'youtube',
						description: 'Get YouTube video transcript',
					},
					{
						name: 'PDF',
						value: 'pdf',
						description: 'Extract content from PDF',
					},
				],
				default: 'answer',
				required: true,
			},

			// ===== ANSWER RESOURCE =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['answer'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate an answer based on search results',
						action: 'Generate an answer',
					},
				],
				default: 'generate',
			},

			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['answer'],
						operation: ['generate'],
					},
				},
				placeholder: 'What is the latest news about AI?',
				description: 'The question or query to search and answer',
			},

			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['answer'],
						operation: ['generate'],
					},
				},
				options: [
					// OpenAI Models
					{
						name: 'GPT-5 (Complex Reasoning)',
						value: 'openai/gpt-5',
						description: '$1.25/$10.00 per M tokens - Best for complex reasoning & analysis',
					},
					{
						name: 'GPT-5 Mini (Cost-Effective)',
						value: 'openai/gpt-5-mini',
						description: '$0.25/$2.00 per M tokens - Cost-effective reasoning',
					},
					{
						name: 'GPT-5 Nano (Balanced)',
						value: 'openai/gpt-5-nano',
						description: '$0.05/$0.40 per M tokens - Balanced performance',
					},
					{
						name: 'O3 (Complex Reasoning)',
						value: 'openai/o3',
						description: '$2.00/$8.00 per M tokens - Complex reasoning & analysis',
					},
					{
						name: 'O3 Mini',
						value: 'openai/o3-mini',
						description: '$1.10/$4.40 per M tokens - Cost-effective reasoning',
					},
					{
						name: 'O4 Mini',
						value: 'openai/o4-mini',
						description: '$1.10/$4.40 per M tokens - Balanced performance',
					},
					{
						name: 'GPT-4.1',
						value: 'openai/gpt-4.1',
						description: '$2.00/$8.00 per M tokens - Advanced tasks',
					},
					{
						name: 'GPT-4.1 Mini',
						value: 'openai/gpt-4.1-mini',
						description: '$0.40/$1.60 per M tokens - Efficient advanced tasks',
					},
					{
						name: 'GPT-4o (Multimodal)',
						value: 'openai/gpt-4o',
						description: '$2.50/$10.00 per M tokens - Multimodal & complex queries',
					},
					{
						name: 'GPT-4o Mini (Fast & Affordable)',
						value: 'openai/gpt-4o-mini',
						description: '$0.15/$0.60 per M tokens - Fast, affordable searches',
					},
					// Groq Models
					{
						name: 'GPT OSS 120B (Groq)',
						value: 'groq/openai-gpt-oss-120b',
						description: '$0.15/$0.75 per M tokens - High-performance search',
					},
					{
						name: 'GPT OSS 20B (Groq)',
						value: 'groq/openai-gpt-oss-20b',
						description: '$0.10/$0.50 per M tokens - Budget-friendly quality',
					},
					{
						name: 'Kimi K2 (Groq)',
						value: 'groq/kimi-k2',
						description: '$1.00/$3.00 per M tokens - High-performance search',
					},
					{
						name: 'Qwen3 32B (Groq)',
						value: 'groq/qwen3-32b',
						description: '$0.29/$0.59 per M tokens - Budget-friendly quality',
					},
					{
						name: 'Llama 3.3 70B (Groq)',
						value: 'groq/llama-3.3-70b-versatile',
						description: '$0.59/$0.79 per M tokens - Versatile applications',
					},
					{
						name: 'DeepSeek R1 Distill Llama 70B (Groq)',
						value: 'groq/deepseek-r1-distill-llama-70b',
						description: '$0.75/$0.99 per M tokens - Deep reasoning tasks',
					},
					{
						name: 'Llama 4 Maverick 17B (Groq)',
						value: 'groq/llama-4-maverick-17b-128e-instruct',
						description: '$0.20/$0.60 per M tokens - Fast, efficient searches',
					},
					// Anthropic Models
					{
						name: 'Claude Sonnet 4',
						value: 'anthropic/claude-sonnet-4',
						description:
							'$3.00/$15.00 per M tokens - Highly creative writing & intelligent responses',
					},
					// DeepSeek Models
					{
						name: 'DeepSeek Chat',
						value: 'deepseek/deepseek-chat',
						description: '$0.27/$1.10 per M tokens - General purpose chat',
					},
					{
						name: 'DeepSeek Reasoner',
						value: 'deepseek/deepseek-reasoner',
						description: '$0.55/$2.19 per M tokens - Complex reasoning',
					},
				],
				default: 'openai/gpt-4o-mini',
				description: 'The AI model to use for generating answers',
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['answer'],
						operation: ['generate'],
					},
				},
				options: [
					{
						displayName: 'Answer Type',
						name: 'answer_type',
						type: 'options',
						options: [
							{
								name: 'Markdown',
								value: 'markdown',
							},
							{
								name: 'HTML',
								value: 'html',
							},
							{
								name: 'JSON',
								value: 'json',
							},
						],
						default: 'markdown',
						description: 'Format of the generated answer',
					},
					{
						displayName: 'Search Type',
						name: 'search_type',
						type: 'options',
						options: [
							{
								name: 'General',
								value: 'general',
							},
							{
								name: 'News',
								value: 'news',
							},
						],
						default: 'general',
						description: 'Type of search to perform',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: 'us',
						description: 'Location code for search results (e.g., us, uk, de, fr, jp)',
					},
					{
						displayName: 'Response Language',
						name: 'response_language',
						type: 'string',
						default: 'auto',
						description: 'Language for the response (auto detects from query)',
					},
					{
						displayName: 'System Prompt',
						name: 'system_prompt',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'Custom system prompt to guide the AI response',
					},
					{
						displayName: 'Include Citations',
						name: 'citations',
						type: 'boolean',
						default: true,
						description: 'Whether to include source citations in the answer',
					},
					{
						displayName: 'Return Sources',
						name: 'return_sources',
						type: 'boolean',
						default: false,
						description: 'Whether to return source documents',
					},
					{
						displayName: 'Return Images',
						name: 'return_images',
						type: 'boolean',
						default: false,
						description: 'Whether to return related images',
					},
					{
						displayName: 'Date Filter',
						name: 'date_filter',
						type: 'options',
						options: [
							{
								name: 'Anytime',
								value: 'anytime',
							},
							{
								name: 'Past Hour',
								value: 'hour',
							},
							{
								name: 'Past Day',
								value: 'day',
							},
							{
								name: 'Past Week',
								value: 'week',
							},
							{
								name: 'Past Month',
								value: 'month',
							},
							{
								name: 'Past Year',
								value: 'year',
							},
						],
						default: 'anytime',
						description: 'Filter results by date',
					},
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 1500,
						description: 'Maximum tokens for the response',
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 1,
							numberStepSize: 0.1,
						},
						default: 0.7,
						description: 'Creativity of the response (0-2)',
					},
					{
						displayName: 'Domain Filter',
						name: 'domain_filter',
						type: 'string',
						default: '',
						placeholder: 'nytimes.com,-wikipedia.org',
						description: 'Include/exclude domains (use - to exclude)',
					},
					{
						displayName: 'Max Queries',
						name: 'max_queries',
						type: 'number',
						default: 1,
						description: 'Maximum number of search queries to perform',
					},
					{
						displayName: 'Search Context Size',
						name: 'search_context_size',
						type: 'options',
						options: [
							{
								name: 'Low',
								value: 'low',
							},
							{
								name: 'Medium',
								value: 'medium',
							},
							{
								name: 'High',
								value: 'high',
							},
						],
						default: 'medium',
						description: 'Amount of context to include from search results',
					},
					{
						displayName: 'JSON Schema',
						name: 'json_schema',
						type: 'json',
						default: '',
						displayOptions: {
							show: {
								answer_type: ['json'],
							},
						},
						description: 'JSON schema for structured output (when Answer Type is JSON)',
					},
				],
			},

			// ===== WEB SEARCH RESOURCE =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['webSearch'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search the web',
						action: 'Search the web',
					},
				],
				default: 'search',
			},

			{
				displayName: 'Query',
				name: 'webSearchQuery',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['webSearch'],
						operation: ['search'],
					},
				},
				placeholder: 'Latest technology trends',
				description: 'Search query',
			},

			{
				displayName: 'Additional Fields',
				name: 'webSearchAdditionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['webSearch'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Search Type',
						name: 'search_type',
						type: 'options',
						options: [
							{
								name: 'General',
								value: 'general',
							},
							{
								name: 'News',
								value: 'news',
							},
							{
								name: 'Shopping',
								value: 'shopping',
							},
							{
								name: 'Videos',
								value: 'videos',
							},
							{
								name: 'Images',
								value: 'images',
							},
							{
								name: 'Scholar',
								value: 'scholar',
							},
						],
						default: 'general',
						description: 'Type of search',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: 'us',
						description: 'Location code for search',
					},
					{
						displayName: 'Recency',
						name: 'recency',
						type: 'options',
						options: [
							{
								name: 'Any Time',
								value: '',
							},
							{
								name: 'Past Hour',
								value: 'hour',
							},
							{
								name: 'Past Day',
								value: 'day',
							},
							{
								name: 'Past Week',
								value: 'week',
							},
							{
								name: 'Past Month',
								value: 'month',
							},
							{
								name: 'Past Year',
								value: 'year',
							},
						],
						default: '',
						description: 'Filter by recency',
					},
					{
						displayName: 'Domain Filter',
						name: 'domain_filter',
						type: 'string',
						default: '',
						placeholder: 'example.com,-badsite.com',
						description: 'Include/exclude domains',
					},
				],
			},

			// ===== SCRAPE RESOURCE =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
					},
				},
				options: [
					{
						name: 'Scrape URL',
						value: 'scrapeUrl',
						description: 'Scrape content from a URL',
						action: 'Scrape content from URL',
					},
				],
				default: 'scrapeUrl',
			},

			{
				displayName: 'URL',
				name: 'scrapeUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['scrapeUrl'],
					},
				},
				placeholder: 'https://example.com',
				description: 'URL to scrape',
			},

			{
				displayName: 'Additional Fields',
				name: 'scrapeAdditionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['scrape'],
						operation: ['scrapeUrl'],
					},
				},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'Markdown',
								value: 'markdown',
							},
							{
								name: 'HTML',
								value: 'html',
							},
							{
								name: 'PDF',
								value: 'pdf',
							},
							{
								name: 'Screenshot',
								value: 'screenshot',
							},
						],
						default: 'markdown',
						description: 'Output format',
					},
					{
						displayName: 'Include Images',
						name: 'include_images',
						type: 'boolean',
						default: true,
						description: 'Whether to include images',
					},
					{
						displayName: 'Include Links',
						name: 'include_links',
						type: 'boolean',
						default: true,
						description: 'Whether to include links',
					},
				],
			},

			// ===== YOUTUBE RESOURCE =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['youtube'],
					},
				},
				options: [
					{
						name: 'Get Transcript',
						value: 'getTranscript',
						description: 'Get YouTube video transcript',
						action: 'Get YouTube transcript',
					},
				],
				default: 'getTranscript',
			},

			{
				displayName: 'Video URL',
				name: 'youtubeUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['youtube'],
						operation: ['getTranscript'],
					},
				},
				placeholder: 'https://www.youtube.com/watch?v=...',
				description: 'YouTube video URL',
			},

			{
				displayName: 'Language',
				name: 'youtubeLanguage',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['youtube'],
						operation: ['getTranscript'],
					},
				},
				placeholder: 'en',
				description: 'Transcript language code (optional)',
			},

			// ===== PDF RESOURCE =====
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['pdf'],
					},
				},
				options: [
					{
						name: 'Extract Content',
						value: 'extractContent',
						description: 'Extract text from PDF',
						action: 'Extract PDF content',
					},
				],
				default: 'extractContent',
			},

			{
				displayName: 'PDF URL',
				name: 'pdfUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['pdf'],
						operation: ['extractContent'],
					},
				},
				placeholder: 'https://example.com/document.pdf',
				description: 'PDF URL to extract content from',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('llmLayerApi');

		if (!credentials || !credentials.apiKey) {
			throw new NodeOperationError(this.getNode(), 'No credentials found or API key is missing');
		}

		const baseUrl = (credentials.baseUrl as string) || 'https://api.llmlayer.dev';
		const apiKey = credentials.apiKey as string;

		// Process each input item
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				let responseData: any;
				let endpoint: string;
				let body: any = {};

				// Handle different resources
				if (resource === 'answer') {
					// Process Answer resource
					const query = this.getNodeParameter('query', itemIndex) as string;
					const model = this.getNodeParameter('model', itemIndex) as string;
					const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as any;

					endpoint = '/api/v1/search';
					body = { query, model };

					// Add optional fields
					if (additionalFields.answer_type) {
						body.answer_type = additionalFields.answer_type;
					}
					if (additionalFields.search_type) {
						body.search_type = additionalFields.search_type;
					}
					if (additionalFields.location) {
						body.location = additionalFields.location;
					}
					if (additionalFields.response_language) {
						body.response_language = additionalFields.response_language;
					}
					if (additionalFields.system_prompt) {
						body.system_prompt = additionalFields.system_prompt;
					}
					if (additionalFields.citations !== undefined) {
						body.citations = additionalFields.citations;
					}
					if (additionalFields.return_sources !== undefined) {
						body.return_sources = additionalFields.return_sources;
					}
					if (additionalFields.return_images !== undefined) {
						body.return_images = additionalFields.return_images;
					}
					if (additionalFields.date_filter) {
						body.date_filter = additionalFields.date_filter;
					}
					if (additionalFields.max_tokens) {
						body.max_tokens = additionalFields.max_tokens;
					}
					if (additionalFields.temperature !== undefined) {
						body.temperature = additionalFields.temperature;
					}
					if (additionalFields.max_queries) {
						body.max_queries = additionalFields.max_queries;
					}
					if (additionalFields.search_context_size) {
						body.search_context_size = additionalFields.search_context_size;
					}

					// Handle domain filter
					if (additionalFields.domain_filter) {
						const domainFilter = additionalFields.domain_filter as string;
						body.domain_filter = domainFilter
							.split(',')
							.map((domain: string) => domain.trim())
							.filter((domain: string) => domain.length > 0);
					}

					// Handle JSON schema
					if (additionalFields.answer_type === 'json' && additionalFields.json_schema) {
						try {
							body.json_schema =
								typeof additionalFields.json_schema === 'string'
									? additionalFields.json_schema
									: JSON.stringify(additionalFields.json_schema);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Invalid JSON schema format', {
								itemIndex,
							});
						}
					}
				} else if (resource === 'webSearch') {
					// Process Web Search resource
					const query = this.getNodeParameter('webSearchQuery', itemIndex) as string;
					const additionalFields = this.getNodeParameter(
						'webSearchAdditionalFields',
						itemIndex,
						{},
					) as any;

					endpoint = '/api/v1/web_search';
					body = { query };

					if (additionalFields.search_type) {
						body.search_type = additionalFields.search_type;
					}
					if (additionalFields.location) {
						body.location = additionalFields.location;
					}
					if (additionalFields.recency && additionalFields.recency !== '') {
						body.recency = additionalFields.recency;
					}

					// Handle domain filter
					if (additionalFields.domain_filter) {
						const domainFilter = additionalFields.domain_filter as string;
						body.domain_filter = domainFilter
							.split(',')
							.map((domain: string) => domain.trim())
							.filter((domain: string) => domain.length > 0);
					}
				} else if (resource === 'scrape') {
					// Process Scrape resource
					const url = this.getNodeParameter('scrapeUrl', itemIndex) as string;
					const additionalFields = this.getNodeParameter(
						'scrapeAdditionalFields',
						itemIndex,
						{},
					) as any;

					endpoint = '/api/v1/scrape';
					body = { url };

					body.format = additionalFields.format || 'markdown';
					body.include_images =
						additionalFields.include_images !== undefined ? additionalFields.include_images : true;
					body.include_links =
						additionalFields.include_links !== undefined ? additionalFields.include_links : true;
				} else if (resource === 'youtube') {
					// Process YouTube resource
					const url = this.getNodeParameter('youtubeUrl', itemIndex) as string;
					const language = this.getNodeParameter('youtubeLanguage', itemIndex, '') as string;

					endpoint = '/api/v1/youtube_transcript';
					body = { url };

					if (language && language.trim() !== '') {
						body.language = language.trim();
					}
				} else if (resource === 'pdf') {
					// Process PDF resource
					const url = this.getNodeParameter('pdfUrl', itemIndex) as string;

					endpoint = '/api/v1/get_pdf_content';
					body = { url };
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex,
					});
				}

				// Make HTTP request
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: `${baseUrl}${endpoint}`,
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
					body,
					json: true,
					timeout: 60000,
				};

				// eslint-disable-next-line prefer-const
				responseData = await this.helpers.httpRequest(options);

				// Add response to return data
				returnData.push({
					json: responseData,
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				// Handle errors based on continueOnFail setting
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
					returnData.push({
						json: {
							error: errorMessage,
							resource: this.getNodeParameter('resource', itemIndex),
							itemIndex,
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
