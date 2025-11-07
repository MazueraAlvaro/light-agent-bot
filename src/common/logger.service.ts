import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class AppLogger {
  private readonly logger = new Logger('Agent');
  info(msg: string) { this.logger.log(msg); }
  debug(msg: string) { this.logger.debug(msg); }
  warn(msg: string) { this.logger.warn(msg); }
  success(msg: string) { console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`); }
}