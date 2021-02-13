import { readdirSync, statSync, existsSync } from 'fs'
import { resolve, join } from 'path'

export function readDirRecursivelyLegacy (directory: string): string[] {
  const files = readdirSync(directory)
    .map(path => {
      path = join(directory, path)

      if (path.endsWith('.ts') || path.endsWith('.js')) { return resolve(path) }
      if (!path.includes('.')) { return readDirRecursively(path) }
    }) as string[]

  return files.flat()
}

export function readDirRecursively (directory: string, filter: (path: string) => boolean = () => true): string[] {
  if (!existsSync(directory)) { return [] }

  const files = readdirSync(directory)
    .map(path => {
      path = join(directory, path)

      if (!statSync(path).isFile()) { return readDirRecursively(path) }
      if (filter(path)) { return resolve(path) }
    }) as string[]

  return files.flat()
}
