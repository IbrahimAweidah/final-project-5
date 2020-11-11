export interface Job {
  jobId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
