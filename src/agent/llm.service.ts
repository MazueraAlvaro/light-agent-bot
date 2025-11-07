import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class LlmService {
    private client: OpenAI
    private model = 'Qwen/Qwen3-4B-Instruct-2507'

    private readonly logger = new Logger(LlmService.name);
    constructor(private cfg: ConfigService) {
        this.client = new OpenAI({
            apiKey: cfg.get('OPENAI_KEY') || '',
            baseURL: cfg.get('OPENAI_URL'),
        })
        this.logger.log(`Initialized LLM Service with model: ${this.model}`);
    }

    async chat(messages: any[], tools?: any[]) {
        return await this.client.chat.completions.create({
            model: this.model,
            messages,
            tools,
            tool_choice: 'auto',
            temperature: 0.2,
            stream: false,
        })
    }
}
