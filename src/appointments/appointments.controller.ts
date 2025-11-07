import { Body, Controller, Post } from '@nestjs/common'
import { AgentService } from 'src/agent/agent.service'

@Controller('chat')
export class AppointmentsController {
    constructor(private agent: AgentService) {}

    @Post('message')
    async message(
        @Body() body: { userId: string; text: string; context?: any[] }
    ) {
        const reply = await this.agent.respond(
            body.userId,
            body.text,
            body.context || []
        )
        return { reply }
    }
}
