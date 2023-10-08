import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

/**
 * TODO: commend-nest에 대한 수정 필요
 * - NODE_ENV 상황별 전환 가능하도록
 * - 파라미터 전달 가능하도록
 */
@Command({ name: 'basic', description: 'A Parameter parse' })
@Injectable()
export class BasicCommand extends CommandRunner {
  private readonly logger = new Logger(BasicCommand.name);
  constructor() {
    super();
  }

  async run(passedParam: string[], options?: BasicCommandOptions) {
    console.log('run command');
    this.logger.error('error log');
    this.logger.warn('warn log');
    this.logger.log('log');
    this.logger.verbose('verbose log');
    this.logger.debug('debug log');
    return
  }
}
