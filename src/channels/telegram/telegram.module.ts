import { Module } from '@nestjs/common'
import { TelegramUpdate } from './telegram.update'
import { AgentModule } from 'src/agent/agent.module'

@Module({
    providers: [TelegramUpdate],
    imports: [AgentModule],
})
export class TelegramModule {}
