import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from "./chat.service";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomlistComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{
      path: "",
      redirectTo: "login",
      pathMatch: "full"
    },{
      path: "login",
      component: LoginComponent
    },{
      path: "rooms",
      component: RoomlistComponent
    },{
      path: "room/:id",
      component: RoomComponent
      }])
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
