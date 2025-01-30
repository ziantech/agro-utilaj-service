import { Component } from '@angular/core';
import { CustomInputComponent } from "../../../components/custom-input/custom-input.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthFields, ForgotField, IForgotPasswordInterface, ILoginInterface } from '../../../interfaces/auth.interface';
import { IErrorResponse, IGeneralMessage } from '../../../interfaces/shared.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forgot',
  imports: [
        CustomInputComponent,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule
  ],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
  isLoading: boolean = false;

  fields: ForgotField = {
    email: '',
  };

  errors: ForgotField = {
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


  onFieldChange(fieldName: keyof ForgotField, value: string): void {
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

    const fieldsToValidate = ['email']

    fieldsToValidate.forEach((key) => {
      const field = key as keyof typeof this.fields;
      if (!this.fields[field].trim()) {
        this.errors[field] = `${this.getLabel(field)} este necesar`;
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

      const forgotData: IForgotPasswordInterface = {
        email: this.fields.email,
      };



      this.authService.forgotPassword(forgotData).subscribe({
        next: async (response) => {
         this.generalMessage = {
          message: response.message,
          type: 'success'
         }
         console.log(response)
         this.resetForm();
         this.isLoading = false;
         this.router.navigate(['/']).then(() => {
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
      email: '',

    }
    this.errors = {
      email: '',

    }
  }

  navigateToHome():void {
    this.router.navigate(['/']).then(() => {
      window.location.reload()
     })
  }

  getLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',

    };
    return labels[fieldName] || fieldName;
  }

}
