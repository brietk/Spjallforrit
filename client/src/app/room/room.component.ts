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

  userList : string[];

  constructor(private chatService: ChatService, 
              private router: Router, 
              private route: ActivatedRoute) {}

  ngOnInit() {
    console.log("þetta fer þangað"+this.route.snapshot.params['id'] );
     let id = this.route.snapshot.params['id'];
     this.room = id;
     this.chatService.joinRoom(this.room).subscribe(objResponse => {
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
         // this.userList = objResponse;
         console.log(objResponse[1].username);
          for (let entry of objResponse) {
            console.log(entry.username);
          }
        }
      //}     
    });
  }

  partRoom() {
    console.log("inni í leave");
    this.chatService.leaveRoom(this.room).subscribe(logText => {
      console.log("uppl úr room: " + logText);
    })
    this.router.navigate(["/rooms"]);

  }
}
