// Type definitions for LLMLayer node

export type AnswerType = 'markdown' | 'html' | 'json';
export type SearchType = 'general' | 'news';
export type DateFilter = 'hour' | 'day' | 'week' | 'month' | 'year' | 'anytime';
export type SearchContextSize = 'low' | 'medium' | 'high';
export type ScrapeFormat = 'markdown' | 'html' | 'pdf' | 'screenshot';
export type WebSearchType = 'general' | 'news' | 'shopping' | 'videos' | 'images' | 'scholar';
export type RecencyType = 'hour' | 'day' | 'week' | 'month' | 'year';

export interface SearchRequest {
	query: string;
	model: string;
	provider_key?: string;
	location?: string;
	system_prompt?: string | null;
	response_language?: string;
	answer_type?: AnswerType;
	search_type?: SearchType;
	json_schema?: string | Record<string, unknown> | null;
	citations?: boolean;
	return_sources?: boolean;
	return_images?: boolean;
	date_filter?: DateFilter;
	max_tokens?: number;
	temperature?: number;
	domain_filter?: string[];
	max_queries?: number;
	search_context_size?: SearchContextSize;
}

export interface SimplifiedSearchResponse {
	llm_response: string | Record<string, unknown>;
	response_time: number | string;
	input_tokens: number;
	output_tokens: number;
	sources?: Array<Record<string, unknown>>;
	images?: Array<Record<string, unknown>>;
	model_cost?: number | null;
	llmlayer_cost?: number | null;
}

export interface YTResponse {
	transcript: string;
	url: string;
	cost?: number | null;
	language?: string | null;
}

export interface PdfContentResponse {
	text: string;
	pages: number;
	url: string;
	status_code: number;
	cost?: number | null;
}

export interface ScrapeResponse {
	markdown: string;
	html?: string | null;
	pdf_data?: string | null;
	screenshot_data?: string | null;
	url: string;
	status_code: number;
	cost?: number | null;
}

export interface WebSearchResponse {
	results: Array<Record<string, unknown>>;
	cost?: number | null;
}

export interface LlmLayerCredentials {
	apiKey: string;
	baseUrl?: string;
}
