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
  privateMsg: string;
  rooms: string[];
  users: string[];
  joined: boolean;
  selectedUser: string;

  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
    this.chatService.getUserList().subscribe(lst => {
      console.log('updating users');
      this.users = lst;
    });
    this.chatService.getRoomList().subscribe(lst => {
      console.log('updating rooms');
      this.rooms = lst;
    });
    this.chatService.listenPrivateMessage().subscribe(msg => {
      alert(msg);
    });
  }

  OnJoin(room: string) {
    if (room === undefined) {
      room = this.roomName;
    }
    this.router.navigate(['/room/' + room]);
  }

  OnLogout() {
    console.log('onlogout');
    this.chatService.disconnectUser().subscribe(text => {
      console.log('disconnecting: ' + text);
      if (text === 'quit') {
        this.router.navigate(['/login']);
      }
    });
  }

  SendPrivateMessage() {
    this.chatService.sendPrivateMsg(this.privateMsg, this.selectedUser).subscribe(text => {
      console.log('SendPrivateMessage: ' + text);
      this.privateMsg = '';
    });
  }
}
