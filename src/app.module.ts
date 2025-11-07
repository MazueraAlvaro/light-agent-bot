import { Module } from '@nestjs/common'
import { AgentModule } from './agent/agent.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppointmentsModule } from './appointments/appointments.module'
import { FaqModule } from './faq/faq.module'
import { TelegrafModule } from 'nestjs-telegraf'
import { TelegramModule } from './channels/telegram/telegram.module'
import { sessionMiddleware } from './middleware/session.middleware'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-store'
import Keyv from 'keyv'
import KeyvRedis from '@keyv/redis'

@Module({
    imports: [
        AgentModule,
        ConfigModule.forRoot({ isGlobal: true }),
        TelegrafModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                botName: 'LightAgent_Bot',
                token: configService.get('TELEGRAM_BOT_TOKEN') || '',
                include: [TelegramModule],
                middlewares: [sessionMiddleware],
            }),
            inject: [ConfigService],
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    stores: [
                        new KeyvRedis(
                            'redis://:' +
                                configService.get('REDIS_PASSWORD') +
                                '@' +
                                configService.get('REDIS_HOST') +
                                ':' +
                                configService.get('REDIS_PORT')
                        ),
                    ],
                }
            },
            inject: [ConfigService],
        }),
        AppointmentsModule,
        FaqModule,
        TelegramModule,
    ],
})
export class AppModule {}
