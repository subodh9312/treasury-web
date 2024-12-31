import { Person } from "./person.model";
import { Audit } from "./audit.model";
import { Authority } from "./authority.model";

export interface User extends Audit {
  userName: string;
  password: string;
  userDetails: Person;
  authorities: Authority[];
  active: boolean;
}
