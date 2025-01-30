import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from "../../../components/custom-input/custom-input.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthFields, ILoginInterface } from '../../../interfaces/auth.interface';
import { IErrorResponse, IGeneralMessage } from '../../../interfaces/shared.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  rememberMe:boolean = false;


  fields: AuthFields = {
    password: '',
    email: '',
  };

  errors: AuthFields = {
    password: '',
    email: '',
  };

  generalMessage: IGeneralMessage = {
    message:'',
    type: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    const savedCredentials = JSON.parse(localStorage.getItem('userCredentials') || '{}');

    if(savedCredentials) {
      this.fields.email = savedCredentials.email || '';
      this.rememberMe = true;
    }
  }

  onFieldChange(fieldName: keyof AuthFields, value: string): void {
    this.fields[fieldName] = value;

    if (value.trim() !== '') {
      this.errors[fieldName] = '';
      this.generalMessage = {
        message:'',
        type:''
      }
    }
  }


  async onSubmit(): Promise<void> {
    let isValid = true;
    this.isLoading = true;

    this.generalMessage = {
      message: '',
      type:''
    };

    const fieldsToValidate = ['email', 'password']

    fieldsToValidate.forEach((key) => {
      const field = key as keyof typeof this.fields;
      if (!this.fields[field].trim()) {
        this.errors[field] = `${this.getLabel(field)} este necesar/a`;
        isValid = false;
      }
    });



    if(!isValid) {
      this.generalMessage = {
        message: 'Va rugam sa rezolvati problemele, inainte de a continua',
        type: 'error'
      }
      this.isLoading = false;
      return;
    }

      const loginData: ILoginInterface = {
        email: this.fields.email,
        password: this.fields.password
      };

      if(this.rememberMe) {
        localStorage.setItem('userCredentials', JSON.stringify({email:this.fields.email}));
      }
      if(!this.rememberMe) {
        localStorage.removeItem('userCredentials')
      }
      this.authService.login(loginData).subscribe({
        next: async (response) => {
         this.generalMessage = {
          message: response.message,
          type: 'success'
         }
         this.resetForm();
         this.router.navigate(['/dashboard']).then(() => {
          window.location.reload()
         })
        },
        error: (error: IErrorResponse) => {
          if(error.field) {
            this.errors[error.field as keyof typeof this.errors] = error.message;
          } else {
            this.generalMessage = {
              message: error.message,
              type:'error'
            }
            this.isLoading = false;
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      })

  }


  resetForm():void {
    this.fields = {
      password: '',
      email: '',

    }
    this.errors = {
      password: '',
      email: '',

    }
  }

  navigateToForgot(): void {
    this.router.navigate(['/forgot']).then(() => {
      window.location.reload()
     })
  }

  getLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      password: 'Password',
      email: 'Email',

    };
    return labels[fieldName] || fieldName;
  }

}
