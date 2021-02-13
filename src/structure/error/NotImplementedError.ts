import { WappermelonError } from "./WappermelonError";

export class NotImplementedError extends WappermelonError {
  constructor (message?: string) {
    super('NotImplementedError', message)
  }
}
