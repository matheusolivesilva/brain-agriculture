import { CustomLoggerService } from './custom-logger.service';
import { createLogger, Logger } from 'winston';

jest.mock('winston', () => {
  const mLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };
  return {
    createLogger: jest.fn(() => mLogger),
    format: {
      combine: jest.fn(),
      timestamp: jest.fn(),
      json: jest.fn(),
      printf: jest.fn(),
    },
    transports: {
      Console: jest.fn(),
    },
  };
});

describe('CustomLoggerService', () => {
  let loggerService: CustomLoggerService;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    loggerService = new CustomLoggerService();
    mockLogger = (createLogger as jest.Mock).mock.results[0].value;
  });

  it('should log info', () => {
    loggerService.log('Test info', { foo: 'bar' });
    expect(mockLogger.info).toHaveBeenCalledWith('Test info', { foo: 'bar' });
  });

  it('should log error', () => {
    loggerService.error('Test error', { errorCode: 123 });
    expect(mockLogger.error).toHaveBeenCalledWith('Test error', {
      errorCode: 123,
    });
  });

  it('should log warning', () => {
    loggerService.warn('Test warn', { context: 'warn-context' });
    expect(mockLogger.warn).toHaveBeenCalledWith('Test warn', {
      context: 'warn-context',
    });
  });

  it('should log debug', () => {
    loggerService.debug('Debug message', { env: 'test' });
    expect(mockLogger.debug).toHaveBeenCalledWith('Debug message', {
      env: 'test',
    });
  });

  it('should log verbose', () => {
    loggerService.verbose('Verbose message', { trace: true });
    expect(mockLogger.verbose).toHaveBeenCalledWith('Verbose message', {
      trace: true,
    });
  });
});
