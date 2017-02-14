import { Component, OnInit } from '@angular/core';
import { ChatService } from "../chat.service";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {

  room: string;
  textMessage : string;

  userList : string[];
  messages : string[];
  obMsgs : Object[];

  constructor(private chatService: ChatService,
              private router: Router,
              private route: ActivatedRoute) {}

  UpdateChat(chats)
  {
    /*
    console.log("Msg: "+ chats);
    for (let entry of chats) {
      console.log("GG:" +entry.message); // 1, "string", false
    }
    let a = chats;
    this.obMsgs = a;
*/
    //this.obMsgs = chats;
    //if(strs != undefined && strs != "" )
    //{
     // this.obMsgs = strs;
      //console.log('Messages:' + this.messages);
    //}
  }

  ngOnInit() {
    console.log("þetta fer þangað"+this.route.snapshot.params['id'] );
     let id = this.route.snapshot.params['id'];
     this.room = id;
     this.chatService.joinRoom(this.room, this.UpdateChat).subscribe(objResponse => {
     // if (succeeded == true) {
        //console.log("Succeeded in roomlist.component!");

        console.log("objResponse type: " + typeof objResponse);
        if(typeof objResponse === "boolean" )
        {
          // Hér erum við með success fyrir hvort hafi tekist að join-a room
          console.log("In ngOnInit: "+objResponse);
        }
        else
        {
          // Hér erum við með lista af notendum í tilteknu herbergi

          console.log("Work with object");
          this.userList = [];
         
          for (var k in objResponse) {
              if (objResponse.hasOwnProperty(k)) {
                  this.userList.push(k);
                  console.log('key is: ' + k + ', value is: ' + objResponse[k]);
              }
          }          
        }
        
    });
    this.SendMessage("Hæ, hvað er að frétta?");
  }

  partRoom() {
    console.log("inni í leave");
    this.chatService.leaveRoom(this.room).subscribe(logText => {
      console.log("uppl úr room: " + logText);
    })
    this.router.navigate(["/rooms"]);

  }

  SendMessage(text : string) {
    if(text == undefined)
      text = this.textMessage;

    console.log("Sending: " + text);
    this.chatService.sendMsg(text, this.room, this.UpdateChat).subscribe(messageHistory => {

      for (let entry of messageHistory) {
        console.log("GG:" +entry.message); // 1, "string", false
      }
      
      this.obMsgs = messageHistory;
      this.textMessage = "";
      // gera eitthvað
    });
  }
}
