import { Module } from '@nestjs/common'
import { LlmService } from './llm.service'
import { AgentService } from './agent.service'
import { AppointmentsModule } from 'src/appointments/appointments.module'

@Module({
    providers: [LlmService, AgentService],
    imports: [AppointmentsModule],
    exports: [AgentService],
})
export class AgentModule {}
