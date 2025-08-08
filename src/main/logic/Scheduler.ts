export type TaskFn = () => Promise<void>

export class Scheduler {
  async runSequential(tasks: TaskFn[]) {
    for (const t of tasks) {
      await t()
    }
  }
  async runParallel(tasks: TaskFn[], concurrency = 4) {
    const queue = tasks.slice()
    const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, async () => {
      while (queue.length) {
        const task = queue.shift()!
        await task()
      }
    })
    await Promise.all(workers)
  }
}