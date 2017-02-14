import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs/Observable";


@Injectable()
export class ChatService {

  socket : any;

  constructor() {
    this.socket = io ("http://localhost:8080/");
    this.socket.on("connect", function() {
      console.log("connect");
    });
   }

//þetta fall hjúpar samskiptin við bakendann.
   login(userName: string) : Observable<boolean> {
     let observable = new Observable(observer => {
      this.socket.emit("adduser", userName, succeeded => {
        console.log("Reply recieved");
       observer.next(succeeded);
       console.log("userAdded: " + userName);
      });
     });

     return observable;
   }
/* Dabs gerir eftirfarandi kóða í tíma:
   getRoomList() : Observable<string[]> {
     const obs = new Observable(observer => {
       this.socket.emit("rooms");
       this.socket.on("roomlist", (lst) => {
         const strArr: string[] = [];
         for (const x in lst){
           if(lst.hasOwnProperty(x)){
             strArr.push(x);
           }

         }
         observer.next(strArr);
       })
     });

     return obs;
   }
   
   lst['briet'] = 'briet'
   lst['gg'] = 'gg'
   lst['kk'] = 'kk'
*/
   getRoomList() : Observable<string[]> {
     let obs = new Observable(observer => {
       this.socket.emit("rooms");
       this.socket.on("roomlist", (lst) => {
         let strArr: string[] = [];
         for (var x in lst){
           if(lst.hasOwnProperty(x)){
             strArr.push(x);
           }
         }
         observer.next(strArr);
       })
     });

     return obs;
   }

   getUserList() : Observable<string[]> {
    console.log("Getting userlist");
     let obs = new Observable(observer => {
       this.socket.emit("users");
       this.socket.on("userlist", (lst) => {
        console.log(lst);
        observer.next(lst);
       })
     });

     return obs;
   }

   joinRoom(roomname : string, fn : any) : Observable<any> {
     console.log("inni í joinroom");

      interface RoomObj {
        room : string;
        pass : string;
      }
      var obj : RoomObj = { room: roomname, pass: undefined}
      console.log(obj);

      let o = new Observable(observer => {
        this.socket.emit("joinroom", obj, function(succeeded, reason) {
          observer.next(succeeded);

          if(succeeded)
            console.log("joinroom succeeded");
          else
            console.log("joinroom not succeeded: " + reason);

        });
        this.socket.on("servermessage", function( text, room, username){
          console.log("New Servermessage: " + text + " " + room + " " + username );

        });
        this.socket.on("updatechat", function(room, messageHistory){
          console.log("updatechat: " + room + " " + messageHistory );

         let strArr: string[] = [];
         for (var x in messageHistory){
           if(messageHistory.hasOwnProperty(x)){
             strArr.push(x);
           }
         }
          fn(strArr);
          //observer.next(strArr);
        });
        this.socket.on("updateusers", function(room, users, ops){
          console.log("updateusers: " + room + users + ops);
          observer.next(users);
        });
    });

     return o;
   }

 sendMsg(text : string, roomname : string, fn : any) : Observable<any> {
     console.log("sendi message");
     
      interface MsgObj {
        msg : string;
        roomName : string;
      }
      var obj : MsgObj = { msg: text, roomName: roomname}
      console.log("Sending obj: "+obj);

      let o = new Observable(observer => {
        this.socket.emit("sendmsg", obj);
        this.socket.on("updatechat", function(room, messageHistory){
          observer.next(messageHistory);
          console.log("updatechat: " + room + " " + messageHistory );

          let obMsg = [];
          for (let entry of messageHistory) {
            obMsg.push(entry);
            console.log(entry); // 1, "string", false
          }

          fn(obMsg);
          //this.socket.next(messageHistory);
          //observer.next(strArr);
        });
    });

     return o;
   }
   leaveRoom(room: string) : Observable<string> {
     let observable = new Observable(observer => {
      this.socket.emit("partroom", room);
      this.socket.on("servermessage", function( text, room, username){
          observer.next("New Servermessage: " + text + " " + room + " " + username);
      });
      });
          return observable;
   }

}
