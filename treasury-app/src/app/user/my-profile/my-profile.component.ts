import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  @Input() user: User;
  @Output() userUpdated = new EventEmitter();
  editedUser: User;
  errorMessage: any = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onEdit() {
    this.editedUser = JSON.parse(JSON.stringify(this.user));
    if (!this.editedUser.userDetails.address) {
      this.editedUser.userDetails["address"] = {
        addressId: null,
        addressLine1: null,
        addressLine2: null,
        nearestLandMark: null,
        city: null,
        state: null,
        postalCode: null,
        country: null
      };
    }
  }

  onSave() {
    if (JSON.stringify(this.editedUser) === JSON.stringify(this.user)) {
      this.editedUser = null;
      return;
    }
    const isAddressNull = Object.values(this.editedUser.userDetails.address).every(x => (x === null));
    if (isAddressNull) {
      this.editedUser.userDetails.address = null;
    }
    this.userService.modifyPerson(this.editedUser.userDetails).subscribe(res => {
      this.userUpdated.emit();
    }, err => {
      this.errorMessage = err.error.errorMessages;
    });
    this.editedUser = null;
  }

}
