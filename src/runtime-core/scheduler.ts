let query: any[] = []
let isFlushingPending: boolean = false

const p = Promise.resolve()
export function nextTick(fn) {
  return fn ? p.then(fn) : p
}

export const queryJob = (job) => {
  if (!query.includes(job)) {
    query.push(job)
  }
  queryFlushing()
}

function queryFlushing() {
  if (isFlushingPending) return
  isFlushingPending = true
  nextTick(flushJob)
}

function flushJob() {
  isFlushingPending = false
  let job
  while (job = query.shift()) {
    job && job()
  }
}
