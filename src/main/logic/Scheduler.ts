import { WorkType } from '@common/enums'

export type TaskFn = (signal?: AbortSignal) => Promise<void>

export class Scheduler {
  private sleep(ms: number, signal?: AbortSignal) {
    return new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, ms)
      if (signal) {
        const onAbort = () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')) }
        if (signal.aborted) onAbort()
        else signal.addEventListener('abort', onAbort, { once: true })
      }
    })
  }

  async run(tasks: TaskFn[], mode: WorkType, options?: { concurrency?: number; randomPause?: boolean; minPauseMs?: number; maxPauseMs?: number; signal?: AbortSignal }) {
    const concurrency = options?.concurrency ?? (mode === WorkType.GlobalParallel || mode === WorkType.SingleParallel ? 5 : 1)
    const randomPause = options?.randomPause ?? false
    const minPause = options?.minPauseMs ?? 50
    const maxPause = options?.maxPauseMs ?? 100
    const signal = options?.signal

    const queue = tasks.slice()
    const worker = async () => {
      while (queue.length) {
        const task = queue.shift()!
        if (randomPause) {
          const ms = Math.floor(Math.random() * (maxPause - minPause)) + minPause
          await this.sleep(ms, signal).catch(() => {})
        }
        await task(signal)
      }
    }

    if (concurrency <= 1) {
      await worker()
      return
    }
    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker())
    await Promise.all(workers)
  }
}