import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roomlist',
  templateUrl: './roomlist.component.html',
  styleUrls: ['./roomlist.component.css']
})
export class RoomlistComponent implements OnInit {
  roomName: string;

  rooms: string[];
  users: string[];
  joined: boolean;
  constructor(private chatService: ChatService, private router: Router) {}
  ngOnInit() {
    this.chatService.getUserList().subscribe(llst => {
      console.log('updating users');
      this.users = llst;
    });
    this.chatService.getRoomList().subscribe(lst => {
      console.log('updating rooms');
      this.rooms = lst;
    });
  }

  OnJoin(room: string) {
    if (room === undefined) {
      room = this.roomName;
    }
    this.router.navigate(['/room/' + room]);
  }
}
