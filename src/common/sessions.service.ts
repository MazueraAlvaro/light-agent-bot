import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class SessionsService {
    private client?: Redis
    private memory = new Map<string, string>()

    constructor() {
        if (process.env.REDIS_URL) {
            this.client = new Redis(process.env.REDIS_URL)
        }
    }

    async get(key: string) {
        if (this.client) return this.client.get(key)
        return this.memory.get(key) ?? null
    }

    async set(key: string, val: string, ttlSec = 86400) {
        if (this.client) return this.client.set(key, val, 'EX', ttlSec)
        this.memory.set(key, val)
    }
}
