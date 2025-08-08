import pkg from '../../package.json' assert { type: 'json' }

export function GetProgramVersion(): string {
  return pkg.version
}

export const VERSION = GetProgramVersion()