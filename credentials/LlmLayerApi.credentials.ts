import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LlmLayerApi implements ICredentialType {
	name = 'llmLayerApi';
	displayName = 'LLMLayer API';
	documentationUrl = 'https://docs.llmlayer.ai';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your LLMLayer API key from https://app.llmlayer.ai',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.llmlayer.dev',
			description: 'LLMLayer API base URL (only change for custom deployments)',
			required: false,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl || "https://api.llmlayer.dev"}}',
			url: '/api/v1/web_search',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: 'test',
				search_type: 'general',
			}),
			skipSslCertificateValidation: false,
		},
	};
}
