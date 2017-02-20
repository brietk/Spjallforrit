import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {

  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080/');
    this.socket.on('connect', function () {
      console.log('connect');
    });
  }

  login(userName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('adduser', userName, succeeded => {
        console.log('Reply recieved');
        observer.next(succeeded);
        console.log('userAdded: ' + userName);
      });
    });
    return observable;
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const strArr: string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(x);
          }
        }
        observer.next(strArr);
      });
    });
    return obs;
  }

  getUserList(): Observable<string[]> {
    console.log('Getting userlist');
    const obs = new Observable(observer => {
      this.socket.emit('users');
      this.socket.on('userlist', (lst) => {
        console.log(lst);
        observer.next(lst);
      });
    });
    return obs;
  }

  joinRoom(roomname: string): Observable<any> {
    console.log('inni í joinroom');

    interface RoomObj {
      room: string;
      pass: string;
    }
    const obj: RoomObj = { room: roomname, pass: undefined };
    console.log(obj);

    const o = new Observable(observer => {
      this.socket.emit('joinroom', obj, function (succeeded, reason) {
        observer.next(succeeded);

        if (succeeded) {
          console.log('joinroom succeeded');
        } else {
          console.log('joinroom not succeeded: ' + reason);
        }
      });
      this.socket.on('servermessage', function (text, room, username) {
        console.log('New Servermessage: ' + text + ' ' + room + ' ' + username);

      });
      this.socket.on('updateusers', function (room, users, ops) {
        console.log('updateusers: ' + room + users + ops);
        observer.next(users);
      });
    });
    return o;
  }

  sendMsg(text: string, roomname: string): Observable<any> {
    console.log('sendi message');
    interface MsgObj {
      msg: string;
      roomName: string;
    }
    const obj: MsgObj = { msg: text, roomName: roomname };
    console.log('Sending obj: ' + obj);

    const o = new Observable(observer => {
      this.socket.emit('sendmsg', obj);
      observer.next(true);
    });
    return o;
  }

  sendPrivateMsg(message: string, user: string): Observable<any> {

    interface MsgObj {
      nick: string;
      message: string;
    }
    const MsgObj: MsgObj = { nick: user, message: message };
    const observable = new Observable(observer => {
      this.socket.emit('privatemsg', MsgObj, function (success) {
        observer.next(success);
      });
    });
    return observable;
  }

  leaveRoom(room: string): Observable<string> {
    const observable = new Observable(observer => {
      this.socket.emit('partroom', room);
      this.socket.on('servermessage', function (text, aRoom, username) {
        observer.next('New Servermessage: ' + text + ' ' + aRoom + ' ' + username);
      });
    });
    return observable;
  }

  kickFromRoom(room: string, userName: string): Observable<any> {
    interface KickObj {
      room: string;
      user: string;
    }
    const obj: KickObj = { room: room, user: userName };
    console.log('Sending obj: ' + obj);

    const observable = new Observable(observer => {
      this.socket.emit('kick', obj, function (success) {
        console.log('tókst að hend út user: ' + success);
      });
    });
    return observable;
  }

  banFromRoom(room: string, userName: string): Observable<any> {
    interface BanObj {
      room: string;
      user: string;
    }
    const obj: BanObj = { room: room, user: userName };
    console.log('Sending obj: ' + obj);

    const observable = new Observable(observer => {
      this.socket.emit('ban', obj, function (success) {
        console.log('tókst að banna user: ' + success);
      });
    });
    return observable;
  }

  listenKicked(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('kicked', function (room, user, username) {
        console.log('user kicked out: ' + user);
        observer.next(user);
      });
    });
    return observable;
  }

  listenBanned(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('banned', function (room, user, username) {
        console.log('user banned: ' + user);
        observer.next(user);
      });
    });
    return observable;
  }

  listenMessages(): Observable<any> {
    const observable = new Observable(observer => {

      this.socket.on('updatechat', function (room, messageHistory) {
        observer.next(messageHistory);
        console.log('updatechat: ' + room + ' ' + messageHistory);

        const obMsg = [];
        for (const entry of messageHistory) {
          obMsg.push(entry);
          console.log(entry);
        }
      });
    });
    return observable;
  }

  listenPrivateMessage(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.on('recv_privatemsg', function (user, message) {
        const msg = 'privat message from ' + user + ': ' + message;
        observer.next(msg);
      });
    });
    return observable;
  }

  listenUserList(): Observable<any> {
    interface UserObj {
      users: any;
      ops: any;
    }

    const observable = new Observable(observer => {
      this.socket.on('updateusers', function (room, users, ops) {
        console.log('updateusers: ' + room + users + ops);
        const obj: UserObj = { users: users, ops: ops };

        observer.next(obj);
      });
    });
    return observable;
  }

  disconnectUser(): Observable<any> {
    const observable = new Observable(observer => {
      this.socket.emit('logout');
      this.socket.on('servermessage', function (text, rooms, username) {
        console.log(text);
        observer.next(text);
      });
    });
    return observable;
  }
}
