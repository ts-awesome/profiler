import { IProfilingLog } from '../interfaces'

// noinspection JSUnusedGlobalSymbols
export function serverTimingReporter(logs: readonly IProfilingLog[]): readonly string[] {
  return logs.map(({metric, description, time}) => [
    metric.toLowerCase().replace(/[^a-z0-9]+([a-z0-9])/gi, (x, _) => _.toUpperCase()),
    `dur=${time.toFixed(1)}`,
    typeof description === 'string' ? `desc=${JSON.stringify(description)}` : null,
  ].filter(x => x).join(';'));
}
