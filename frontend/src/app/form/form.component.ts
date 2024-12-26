import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  form: FormGroup;
  @Input() fullName = ""
  @Input() email = ""
  @Input() status = false
  @Output() newUser = new EventEmitter();
  showForm = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: [this.fullName],
      email: [this.email],
      status: [this.status]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.form.get('status')?.setValue(changes['status'].currentValue == false ? "inactive" : "active");
    this.showForm = !this.showForm
  }

  onSubmit() {
    console.log(this.form.value);
    this.newUser.emit(this.form.value)
    this.form = this.fb.group({
      fullName: [''],
      email: [''],
      status: ['']
    });
  }
}
