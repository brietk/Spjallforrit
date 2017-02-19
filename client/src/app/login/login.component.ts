import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: string;
  loginFailed: boolean;
  userInfo: any;
  isAdmin: boolean;

  constructor(private chatService: ChatService,
    private router: Router,
    private appComponent: AppComponent) {
    this.isAdmin = true;
  }

  onClickAddUser() {
    this.isAdmin = !this.isAdmin;
  }

  ngOnInit() {

  }

  onLogin() {
    this.chatService.login(this.userName).subscribe(succeeded => {
      console.log('Success!');
      this.loginFailed = !succeeded;
      if (succeeded === true) {
        this.appComponent.globalUserName = this.userName;
        this.router.navigate(['/rooms']);
      }
    });
  }
}
