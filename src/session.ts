import { IProfilerFactory, IProfilingStopper, IProfilingLog, IProfilingSession } from './interfaces'
import { performance } from 'perf_hooks';

const scales = ['', 's', 'm']
const factors = [1000, 60, 60]

function toString(this: IProfilingLog): string {
  const { metric, group } = this
  const name = group ? `${group}.${metric}` : metric

  let time = this.time
  if (time < 5) return `${name}: ${time.toFixed(3)}`
  if (time < 50) return `${name}: ${time.toFixed(2)}`

  let scale = 0
  while (scale < factors.length && time > factors[scale]) {
    time /= factors[scale]
    scale++
  }
  return `${name}: ${time.toFixed(1)}${scales[scale]}`
}

function valueOf(this: IProfilingLog): number {
  return this.time
}

const profilerFactory: IProfilerFactory = (metric: string, group?: string, description?: string) => {
  const id = Date.now()
  const started = performance.now()
  return (): IProfilingLog => {
    const time = performance.now() - started
    return Object.freeze({
      id,
      metric,
      description,
      group,
      time,

      toString,
      valueOf,
    });
  }
}

// noinspection JSUnusedGlobalSymbols
export class ProfilingSession implements IProfilingSession {
  public logs: IProfilingLog[] = [];
  public running = 0;

  public start(metric: string, group?: string, description?: string): IProfilingStopper {
    ++this.running;
    const stop = profilerFactory(metric, group, description)
    let log: IProfilingLog
    return (): IProfilingLog => {
      if (!log) {
        log = stop();
        this.logs.push(log);
        --this.running;
      }
      return log;
    }
  }

  public toString(): string {
    return this.logs.map(x => x.toString()).join('\n')
  }

  public valueOf(): IProfilingLog[] {
    return [...this.logs]
  }

  auto<T>(metric: string, action: () => Promise<T>): Promise<T>;
  auto<T>(metric: string, group: string, action: () => Promise<T>): Promise<T>;
  auto<T>(metric: string, group: string | undefined, description: string, action: () => Promise<T>): Promise<T>;
  public async auto<T>(...args: unknown[]): Promise<T> {
    const action = args.pop() as (() => Promise<T>);
    const stop = this.start(...args as [string, string?, string?]);
    try {
      return await action?.();
    } finally {
      stop();
    }
  }

  public clean(): void {
    this.logs = [];
  }
}
