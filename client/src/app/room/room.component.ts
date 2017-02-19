import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})

export class RoomComponent implements OnInit {

  room: string;
  privateMsg: string;
  textMessage: string;
  userList: string[];
  opsList: string[];
  messages: string[];
  obMsgs: Object[];
  isOps: boolean;
  loggedInUser: string;
  isBanned: boolean;

  constructor(private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private appComponent: AppComponent) { }

  ngOnInit() {
    this.loggedInUser = this.appComponent.globalUserName;
    console.log("Hi! I am " + this.loggedInUser);
    console.log('þetta fer þangað' + this.route.snapshot.params['id']);
    const id = this.route.snapshot.params['id'];
    this.room = id;
    this.chatService.joinRoom(this.room).subscribe(success => {
      this.isBanned = !success;
      
      console.log('objResponse type: ' + typeof success);
      if (typeof success === 'boolean') {
        console.log('In ngOnInit:' + success);
      }

    });

    this.chatService.listenKicked().subscribe(userKickedOut => {
      if (userKickedOut === this.loggedInUser) {
        this.router.navigate(['/rooms']);
      }
    });

    this.chatService.listenBanned().subscribe(userBanned => {
      if (userBanned === this.loggedInUser) {
        this.router.navigate(['/rooms']);
      }
    });

    this.chatService.listenMessages().subscribe(messageHistory => {
      this.obMsgs = messageHistory;
      this.textMessage = '';
    });

    this.chatService.listenUserList().subscribe(userArr => {
      console.log('Work with object');
      this.userList = [];
      this.opsList = [];
      for (const currUser in userArr.users) {
        if (userArr.users.hasOwnProperty(currUser)) {
          this.userList.push(currUser);
          console.log('key is: ' + currUser + ', value is: ' + userArr.users[currUser]);
        }
      }

      this.isOps = false;
      for (const currUser in userArr.ops) {
        if (userArr.ops.hasOwnProperty(currUser)) {
          this.opsList.push(currUser);
          if (currUser === this.loggedInUser)
            this.isOps = true;
          console.log('OPS: key is: ' + currUser + ', value is: ' + userArr.ops[currUser]);
        }
      }
    });
  }

  partRoom() {
    console.log('inni í leave');
    this.chatService.leaveRoom(this.room).subscribe(logText => {
      console.log('uppl úr room: ' + logText);
    });
    this.router.navigate(['/rooms']);
  }

  kickUserFromRoom(user: string) {
    console.log("inni í kickUserFromRoom");
    this.chatService.kickFromRoom(this.room, user).subscribe(success => {
      console.log("uppl úr room: " + success);
    })
  }

  banUserFromRoom(user: string) {
    console.log("inni í banUserFromRoom");
    this.chatService.banFromRoom(this.room, user).subscribe(success => {
      console.log("uppl úr room: " + success);
    })
  }

  SendMessage(text: string) {
    if (text === undefined) {
      text = this.textMessage;
    }
    console.log('Sending: ' + text);
    this.chatService.sendMsg(text, this.room).subscribe(success => {
      console.log("Message sent: " + success);
    });
  }
}