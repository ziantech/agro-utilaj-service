import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-custom-input',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [
    MatDatepickerModule
  ]
})
export class CustomInputComponent {
  @Input() label: string = ''; // Label for the input
  @Input() placeholder: string = ''; // Placeholder for the input
  @Input() type: string = 'text'; // Input type (text, password, etc.)
  @Input() helperText: string = ''; // Optional helper text
  @Input() errorMessage: string = ''; // Error message for the input
  @Input() isHalfWidth: boolean = false; // Determines input width
  @Input() controlValue: string = ''; // Value of the input field
  @Input() required: boolean = false;

  @Output() valueChange = new EventEmitter<string>(); // Emits the input's value on change

  inputType: string = this.type; // Internal type for toggling password visibility

  // Handle input change
  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
}
