import { Audit } from "./audit.model";

export interface WorkflowPendingTask<T extends Audit> {
  taskId: string,
  processInstanceId: string;
  pendingObject: T;
  permittedActions: string[];
  comment: string;
}
