import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuillModule } from 'ngx-quill';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { IProduct } from '../../interfaces/product.interface';
interface DataFetched {
  product: IProduct
}
@Component({
  selector: 'app-edit-product',
  standalone: true,
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
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = false;
  productId!: string;
  initialProductData!: Partial<IProduct>;

  isPageLoading: boolean = false;
  hasError: boolean = false;

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.queryParamMap.get("id") as string;

    this.loadPageData()

    // Initialize form (will be updated when data is fetched)
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: new FormControl('', Validators.required),
      category: ['', [Validators.required]],
      make: ['', [Validators.required]],
      productModel: ['', [Validators.required]],
      price: this.fb.array([]),
      negotiable: [false]
    });
  }
  get descriptionControl(): FormControl {
    return this.productForm.get('description') as FormControl;
  }

  onDescriptionChanged(event: any): void {
    if (event.html === this.descriptionControl.value) {
      return;
    }
    this.descriptionControl.setValue(event.html, { emitEvent: false });
  }


  async loadPageData():Promise<void> {
    this.isPageLoading = true;
    this.hasError = false;

    try {
      await this.fetchProduct();
    } catch (error) {
        console.error('Error loading travel page data:', error);
        this.hasError = true;
        this.isPageLoading = false;
    }
  }

  fetchProduct():Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getProduct(this.productId).subscribe({
        next: (data: DataFetched) => {
          this.initialProductData = data.product;
          this.populateForm(data.product)
          this.isPageLoading = false;
          resolve()
        },
        error: (err: any) => {
          console.error('Error fetching items:', err);
            this.isPageLoading = false;
            reject()
        },
        complete: () => {
          this.isPageLoading = false;
        }
      })
    })
  }

  private populateForm(product: IProduct): void {
    console.log(product)
    this.productForm.patchValue({
      name: product.name,
      description: product.description || "",
      category: product.category,
      make: product.make,
      productModel: product.productModel,
      negotiable: product.negotiable
    });

    const priceArray = this.productForm.get('price') as FormArray;
    product.price.forEach(p => {
      priceArray.push(this.fb.group({
        amount: [p.amount, [Validators.required, Validators.min(0)]],
        currency: [p.currency, [Validators.required]]
      }));
    });
  }

  get priceArray(): FormArray {
    return this.productForm.get('price') as FormArray;
  }

  addPrice(): void {
    this.priceArray.push(this.fb.group({
      amount: [0, [Validators.required, Validators.min(0)]],
      currency: ['EUR', [Validators.required]],
    }));
  }

  get isNegotiable(): boolean {
    return this.productForm.get('negotiable')?.value || false;
  }

  updateNegotiable(value: boolean): void {
    this.productForm.get('negotiable')?.setValue(value);
  }


  removePrice(index: number): void {
    this.priceArray.removeAt(index);
  }

  onSubmit(): void {
    this.isLoading = true;

    const updatedData: Partial<IProduct> = {};
    const formValues = this.productForm.value;

    // Check what fields have changed
    Object.keys(formValues).forEach((key) => {
      if (JSON.stringify(formValues[key]) !== JSON.stringify(this.initialProductData[key as keyof IProduct])) {
        updatedData[key as keyof IProduct] = formValues[key];
      }
    });

    if (Object.keys(updatedData).length === 0) {
      this.toastService.show('Nicio modificare detectată', 'error');
      this.isLoading = false;
      return;
    }

    this.productService.updateProduct(this.productId, updatedData).subscribe({
      next: (response) => {
        this.toastService.show(response.message, "success");
        this.router.navigate(['/dashboard/product'], { queryParams: { id: this.productId } }).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.toastService.show(err.message, "error");
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
