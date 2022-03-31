import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTransactionFormComponent } from './new-transaction-form.component';

describe('NewTransactionFormComponent', () => {
  let component: NewTransactionFormComponent;
  let fixture: ComponentFixture<NewTransactionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTransactionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
