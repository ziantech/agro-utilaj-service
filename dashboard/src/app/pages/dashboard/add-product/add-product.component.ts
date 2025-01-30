import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuillModule } from 'ngx-quill';
import { IAddProductPayload } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    MatCheckboxModule,
    QuillModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  productForm: FormGroup;
  imagePreviews: string[] = []
  description: string = ''
  isLoading = false;


  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Formatting options
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      ['clean'], // Remove formatting
    ],

  };


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      make: ['', [Validators.required]],
      productModel: ['', [Validators.required]],
      price: this.fb.array([
        this.fb.group({
          amount: [0, [Validators.required, Validators.min(0)]],
          currency: ['EUR', [Validators.required]]
        })
      ]),
      negotiable:[false]
    })
  }

  get priceArray(): FormArray {
    return this.productForm.get('price') as FormArray;
  }

  addPrice() {
    this.priceArray.push(
      this.fb.group({
        amount: [0, [Validators.required, Validators.min(0)]],
        currency: ['EUR', [Validators.required]],
      })
    );
  }
  removePrice(index: number) {
    this.priceArray.removeAt(index);
  }
  triggerFileUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  formatText(command: string): void {
    document.execCommand(command, false, '');
  }

  onDescriptionInput(event: Event): void {
    const value = (event.target as HTMLElement).innerHTML;
    this.productForm.get('description')?.setValue(value);
  }

  handleKeyDown(event: KeyboardEvent): void {
    // Handle special behaviors (e.g., pressing "Enter" for new list items)
    const selection = window.getSelection();
    if (
      event.key === 'Enter' &&
      selection &&
      selection.focusNode?.nodeName === 'LI'
    ) {
      event.preventDefault();
      document.execCommand('insertParagraph', false, '');
    }
  }
  onSubmit() {
    this.isLoading = true;
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      this.isLoading = false;
      return;
    }

    const payload: IAddProductPayload = {
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      category: this.productForm.value.category,
      make: this.productForm.value.make,
      productModel: this.productForm.value.productModel,
      price: this.productForm.value.price,
      negotiable: this.productForm.value.negotiable,
      images: this.imagePreviews.map((image, index) => {
        const base64Data = image.split(',')[1]; // Remove the `data:image/png;base64,` part
        const binaryData = atob(base64Data); // Decode base64 to binary
        const arrayBuffer = new Uint8Array(binaryData.length);

        for (let i = 0; i < binaryData.length; i++) {
          arrayBuffer[i] = binaryData.charCodeAt(i);
        }

        return new File([arrayBuffer], `image_${index + 1}.png`, { type: 'image/png' });
      }),
    }

    this.productService.createProduct(payload).subscribe({
      next: (response) => {
        this.toastService.show(response.message, "success");
        this.router.navigate(['/dashboard/product'], { queryParams: { id: response.id } }).then(() => {
          window.location.reload()
         });
      },
      error: (err) => {
        console.error('Error creating product:', err.message);
        this.toastService.show(err.message, "error");
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    })
  }

  onDescriptionChanged(event: any): void {
    const value = event.html; // Quill's HTML content
    this.productForm.get('description')?.setValue(value);
  }
}
