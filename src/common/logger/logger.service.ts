import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import {
  CustomLogger,
  LoggerBaseKey,
  LogData,
  LogLevel,
} from '@common/logger/interfaces';
import {
  ClsContextStorageService,
  ContextStorageServiceKey,
} from '@common/context/cls-context-storage.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements CustomLogger {
  private sourceClass: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: CustomLogger,
    @Inject(INQUIRER) parentClass: object,
    @Inject(ContextStorageServiceKey)
    private contextStorageService: ClsContextStorageService,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId:
        data?.correlationId || this.contextStorageService.getContextId(),
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
