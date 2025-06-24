import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { trace, context } from '@opentelemetry/api';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
      format.json(),
      format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const spanContext = trace.getSpan(context.active())?.spanContext();
        return JSON.stringify({
          timestamp,
          severity: level.toUpperCase(),
          message,
          attributes: {
            ...meta,
            traceId: spanContext?.traceId || 'unknown',
            spanId: spanContext?.spanId || 'unknown',
            stack: stack || 'stack not provided',
          },
        });
      }),
    ),
    transports: [new transports.Console()],
  });

  log(message: string, meta: Record<string, any> = {}) {
    this.logger.info(message, meta);
  }

  error(message: string, meta: Record<string, any> = {}) {
    this.logger.error(message, { ...meta });
  }

  warn(message: string, meta: Record<string, any> = {}) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta: Record<string, any> = {}) {
    this.logger.debug(message, meta);
  }

  verbose(message: string, meta: Record<string, any> = {}) {
    this.logger.verbose(message, meta);
  }
}
