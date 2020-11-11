export interface JobItem {
  userId: string
  jobId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
