import { Audit } from "./audit.model";

export interface Authority extends Audit {
  authorityId: number;
  context: string;
  permission: string;
  systemAdminAuthority: boolean;
}
