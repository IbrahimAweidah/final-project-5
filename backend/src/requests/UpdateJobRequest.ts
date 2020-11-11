/**
 * Fields in a request to update a single Job item.
 */
export interface UpdateJobRequest {
  name: string
  dueDate: string
  done: boolean
}