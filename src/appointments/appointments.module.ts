import { Module } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    providers: [AppointmentsService],
    exports: [AppointmentsService],
})
export class AppointmentsModule {}
