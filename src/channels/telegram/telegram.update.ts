import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Logger } from '@nestjs/common'
import { Ctx, Hears, Message, On, Sender, Start, Update } from 'nestjs-telegraf'
import { AgentService } from 'src/agent/agent.service'
import { Context } from 'telegraf'

@Update()
export class TelegramUpdate {
    constructor(
        private agent: AgentService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    private readonly logger = new Logger(TelegramUpdate.name);

    @Start()
    onStart(@Sender('id') senderId: string): string {
        this.logger.log(`User ${senderId} started the bot.`);
        this.cacheManager.set(`ctx_${senderId}`, JSON.stringify([])) // clear context on /start
        return 'Bienvenido al LightAgent Bot! ¿En qué puedo ayudarte hoy?'
    }

    @Hears(['Hola'])
    async onGreeting(@Sender('id') userId: string, @Ctx() ctx: Context): Promise<void> {
        const context = await this.cacheManager.get<string>(`ctx_${userId}`) // ensure context exists
        if (context) {
            console.log('Existing context for user', userId, ':', JSON.parse(context));
        }
        ctx.reply('¡Hola! ¿Cómo puedo ayudarte hoy?')
    }

    @On('text')
    async onMessage(
        @Message('text') text: string,
        @Sender('id') senderId: string,
        @Ctx() ctx: Context
    ): Promise<void> {
        this.logger.log(`Received message from user ${senderId}: ${text}`);
        const response = await this.agent.respond(senderId, text)
        const escapedResponse = this.escapeMarkdownV2(response);
        const textoFinal = escapedResponse.replace(/\\\*\\\*/g, '*')
        ctx.replyWithMarkdownV2(textoFinal);
    }

    private escapeMarkdownV2(str) {
    return str.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
}
