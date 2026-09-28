import { AsyncLocalStorage } from 'async_hooks';

// Test-harness hook: records pipeline events when a run is active, no-op otherwise.
export type TraceSink = (event: string, data: Record<string, unknown>) => void;

const storage = new AsyncLocalStorage<TraceSink>();

export const withTrace = <T>(sink: TraceSink, fn: () => Promise<T>) => storage.run(sink, fn);

export const trace = (event: string, data: Record<string, unknown>) => storage.getStore()?.(event, data);
