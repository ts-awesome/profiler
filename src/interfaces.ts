export interface IProfilingLog {
  readonly id: number;
  readonly metric: string;
  readonly description?: string;
  readonly group?: string;
  readonly time: number;

  toString(): string;
  valueOf(): number;
}

export interface IProfilingStopper {
  (): IProfilingLog;
}

export interface IProfilerFactory {
  (metric: string, group?: string, description?: string): IProfilingStopper;
}

export interface IProfilingSession {
  readonly logs: readonly IProfilingLog[];
  readonly start: IProfilerFactory;

  auto<T>(metric: string, action: () => Promise<T>): Promise<T>;
  auto<T>(metric: string, group: string, action: () => Promise<T>): Promise<T>;
  auto<T>(metric: string, group: string | undefined, description: string, action: () => Promise<T>): Promise<T>;

  clean(): void;

  toString(): string;
  valueOf(): IProfilingLog[];
}

