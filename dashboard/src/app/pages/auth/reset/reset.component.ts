import { Component, OnInit } from '@angular/core';
import {  IResetPasswordInterface } from '../../../interfaces/auth.interface';
import { IErrorResponse, IGeneralMessage } from '../../../interfaces/shared.interface';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomInputComponent } from "../../../components/custom-input/custom-input.component";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-reset',
  imports: [
        CustomInputComponent,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatButtonModule
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent implements OnInit{
  isLoading: boolean = false;
  token: string = "";

  fields: IResetPasswordInterface = {
      password: '',
      token: this.token
    };

  errors: IResetPasswordInterface = {
      password: '',
      token: this.token
    };

     generalMessage: IGeneralMessage = {
        message:'',
        type: ''
      }

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
      ){}

    ngOnInit(): void {
      this.token = this.route.snapshot.queryParamMap.get("token") as string;
    }

      onFieldChange(fieldName: keyof IResetPasswordInterface, value: string): void {
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

      const fieldsToValidate = [ 'password']

      fieldsToValidate.forEach((key) => {
        const field = key as keyof typeof this.fields;
        if (!this.fields[field].trim()) {
          this.errors[field] = `${this.getLabel(field)} este necesara`;
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

        const resetData: IResetPasswordInterface = {
          password: this.fields.password,
          token: this.token
        };


        this.authService.resetPassword(resetData).subscribe({
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
        token: this.token
      }
      this.errors = {
        password: '',
        token: this.token
      }
    }

    getLabel(fieldName: string): string {
      const labels: { [key: string]: string } = {
        password: 'Password',

      };
      return labels[fieldName] || fieldName;
    }
    navigateToHome():void {
      this.router.navigate(['/']).then(() => {
        window.location.reload()
       })
    }
}
