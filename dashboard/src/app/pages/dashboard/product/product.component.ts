import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { IProduct } from '../../../interfaces/product.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../../components/image-dialog/image-dialog.component';
import { ToastService } from '../../../services/toast.service';

interface DataFetched {
  product: IProduct
}

@Component({
  selector: 'app-product',
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [DatePipe]
})
export class ProductComponent implements OnInit {
   productId: string = ""

   isPageLoading: boolean = false;
   isDeleteLoading:boolean = false;
   isDeleteImageLoading:boolean = false;

   hasError: boolean = false;
   product: IProduct | null = null;

   constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
   ) {}

ngOnInit(): void {
  this.productId = this.route.snapshot.queryParamMap.get("id") as string;
  this.loadPageData()
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
        this.product = data.product;
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

formatDate(date: string): string {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return 'Invalid Date';
  return this.datePipe.transform(parsedDate, 'd MMMM, yyyy') || 'N/A';
}

getCurrencySymbol(currency: string): string {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    RON: 'lei',
    GBP: '£',
  };
  return currencySymbols[currency] || currency;
}

onEdit(): void {
  this.router.navigate(['/dashboard/edit-product'], { queryParams: { id: this.productId } }).then(() => {
    window.location.reload()
   });
}

onDelete(): void {
  const confirmed = confirm('Sunteti sigur/a ca vreti sa stergeti produsul acesta?')
  if (confirmed) {
    this.isDeleteLoading = true;
    this.productService.deleteProduct(this.productId).subscribe({
      next: (response: any) => {
        this.toastService.show('Produs sters cu success', "success")
        this.router.navigate(['/dashboard/products']).then(() => {
          window.location.reload()
         })
      },
      error: (err: any) => {
        console.error('Error fetching items:', err);
          this.isDeleteLoading = false;
      },
      complete: () => {
        this.isDeleteLoading = false;
      }
    })
  } else {
    console.log('Product deletion canceled.');
  }
}

onDeleteImage(imageId: string): void {
  const confirmed = confirm('Sunteti sigur/a ca vreti sa stergeti imaginea acesta?')
  if (confirmed) {
   this.isDeleteImageLoading = true;
   this.productService.deleteImage(this.productId, imageId).subscribe({
    next: (response: any) => {
      this.toastService.show('Poza stearsa cu success', "success");
      window.location.reload()
    },
    error: (err: any) => {
      console.error('Error fetching items:', err);
        this.isDeleteLoading = false;
    }
   })
  } else {
    console.log('Image deletion canceled.');
  }
}

openImageDialog(imageUrl: string):void {
  this.dialog.open(ImageDialogComponent, {
    data: {image: imageUrl},
    panelClass: 'custom-dialog-container',
    width: '90vw',
    height: '90vh',
    maxWidth: '100vw',
    maxHeight: '100vh'
  })
}
triggerFileUpload(fileInput: HTMLInputElement): void {
  fileInput.click();
}

onFileSelected(event: any) {
  const files = event.target.files;
  const convertedFiles: File[] = [];

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Data = e.target.result.split(',')[1]; // Remove the `data:image/png;base64,` part
      const binaryData = atob(base64Data); // Decode base64 to binary
      const arrayBuffer = new Uint8Array(binaryData.length);

      for (let i = 0; i < binaryData.length; i++) {
        arrayBuffer[i] = binaryData.charCodeAt(i);
      }

      const newFile = new File([arrayBuffer], file.name, { type: file.type });
      convertedFiles.push(newFile);

      if (convertedFiles.length === files.length) {
        this.uploadImages(convertedFiles);
      }
    }
    reader.readAsDataURL(file)
  }
}

uploadImages(files: File[]): void {
  this.productService.addImages(files, this.productId).subscribe({
    next: () => {

      window.location.reload();
    },
    error: (err) => {
      console.error('Error uploading images:', err.message);

    }
  });
}

}
