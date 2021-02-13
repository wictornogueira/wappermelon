export class WappermelonError extends Error {
  constructor (public name: string, message?: string) {
    super(message)
  }
}
