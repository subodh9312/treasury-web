import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-authority',
  templateUrl: './authority.component.html',
  styleUrls: ['./authority.component.css']
})
export class AuthorityComponent implements OnInit {

  isAdd = false;
  authorityUpdated: any;

  @Output() authorityEvent: any = new EventEmitter;

  constructor () { }

  ngOnInit(): void {
  }

  onAdd() {
    this.isAdd = true;
  }

  onBack(event) {
    if (event != null) {
      this.onAuthorityUpdated(event);
    }
    this.isAdd = false;
  }

  onAuthorityUpdated(authority) {
    this.authorityUpdated = authority;
    this.authorityEvent.emit(authority);
  }

}
