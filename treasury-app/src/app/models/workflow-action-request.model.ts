import { WorkflowPendingTask } from "./workflow-pending-task.model";
import { Audit } from "./audit.model";

export interface WorkflowActionRequest<T extends Audit> {
  workflowPendingTask: WorkflowPendingTask<T>;
  workflowAction: string;
}
