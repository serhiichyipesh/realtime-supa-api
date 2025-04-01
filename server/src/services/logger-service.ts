import { FG_BLUE, FG_RED, FG_YELLOW, RESET } from '../lib/constants.js';

export class LoggerService {
  #context: string;

  constructor(context: string = 'APP') {
    this.#context = context;
  }

  #formatMessage(
    level: string,
    message: string,
    meta?: Record<string, unknown>
  ): string {
    const timestamp = new Date().toLocaleString();
    let metaStr = '';
    if (meta && Object.keys(meta).length > 0) {
      metaStr =
        ' | ' +
        Object.entries(meta)
          .map(([_, value]) => `${value}`)
          .join(' ');
    }
    return `${timestamp} - ${this.#context} - ${level} - ${message}${metaStr}`;
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    // eslint-disable-next-line no-console
    console.debug(
      `${FG_YELLOW}${this.#formatMessage('[DEBUG]', message, meta)}${RESET}`
    );
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    console.info(
      `${FG_BLUE}${this.#formatMessage('[INFO]', message, meta)}${RESET}`
    );
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(
      `${FG_YELLOW}${this.#formatMessage('[WARN]', message, meta)}${RESET}`
    );
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    console.error(
      `${FG_RED}${this.#formatMessage('[ERROR]', message, meta)}${RESET}`
    );
  }
}
