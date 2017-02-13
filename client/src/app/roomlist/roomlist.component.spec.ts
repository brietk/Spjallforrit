/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RoomlistComponent } from './roomlist.component';

describe('RoomlistComponent', () => {
  let component: RoomlistComponent;
  let fixture: ComponentFixture<RoomlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
