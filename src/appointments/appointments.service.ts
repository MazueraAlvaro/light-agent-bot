import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'

@Injectable()
export class AppointmentsService {
    private base: string
    private readonly logger = new Logger(AppointmentsService.name);
    constructor(
        private cfg: ConfigService,
        private readonly httpService: HttpService
    ) {
        this.base = cfg.get('APPOINTMENTS_API_URL') || ''
    }

    async verifyPatient(payload: { documentId: string; birthDate: string }) {
        
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .get(
                        `${this.base}/user/validate/${payload.documentId}/${payload.birthDate}`
                    )
                    .pipe(
                        catchError((error) => {
                            throw 'Error verifying patient: ' + error.message
                        })
                    )
            )
            this.logger.log(`Patient verification response: OK`);
            return { ok: true, ...data }
        } catch (error) {
            this.logger.warn(`Patient verification failed`);
            return { ok: false }
        }
    }

    async listAvailability(payload: { specialtyCode: string }) {
        const { data } = await firstValueFrom(
            this.httpService
                .get(`${this.base}/appointment/agenda/${payload.specialtyCode}`)
                .pipe(
                    catchError((error) => {
                        throw 'Error fetching slots: ' + error.message
                    })
                )
        )
        this.logger.log(`Fetched availability for specialty: ${payload.specialtyCode}, slots count: ${data.length}`);
        return data
    }

    async createAppointment(payload: {
        appointmentId: string
        userId: string
    }) {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post(`${this.base}/appointment/assign`, payload)
                    .pipe(
                        catchError((error) => {
                            throw 'Error creating appointment: ' + error.message
                        })
                    )
            )
            this.logger.log(`Appointment created: ${payload.appointmentId} for user: ${payload.userId}`);
            return { ok: true, ...data }
        } catch (error) {
            this.logger.warn(`Failed to create appointment for user: ${payload.userId}`);
            return { ok: false, error: error }
        }
    }

    async getAppointment(payload: { userId: string }) {
        const { data } = await firstValueFrom(
            this.httpService
                .get(`${this.base}/appointment/check/${payload.userId}`)
                .pipe(
                    catchError((error) => {
                        throw 'Error fetching appointments: ' + error.message
                    })
                )
        )
        this.logger.log(`Fetched appointments for user: ${payload.userId}, count: ${data.length}`);
        return data
    }

    async cancelAppointment(payload: {
        appointmentId: string
        userId: string
    }) {
        try {
            const { data } = await firstValueFrom(
                this.httpService
                    .post(`${this.base}/appointment/cancel`, payload)
                    .pipe(
                        catchError((error) => {
                            throw (
                                'Error cancelling appointment: ' + error.message
                            )
                        })
                    )
            )
            this.logger.log(`Cancelled appointment: ${payload.appointmentId} for user: ${payload.userId}`);
            return { ok: true, ...data }
        } catch (error) {
            this.logger.warn(`Failed to cancel appointment: ${payload.appointmentId} for user: ${payload.userId}`);
            return { ok: false, error: error }
        }
    }
}
