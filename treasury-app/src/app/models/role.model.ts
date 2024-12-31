import { Audit } from "./audit.model";

export interface Role extends Audit{
  roleName: string;
  roleDescription: string;
}
