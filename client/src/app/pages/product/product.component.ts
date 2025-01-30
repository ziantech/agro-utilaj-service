import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../interfaces/product.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { ImageDialogComponent } from '../../components/image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface DataFetched {
  product: IProduct
}

@Component({
  selector: 'app-product',
  imports: [
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers:[DatePipe]
})
export class ProductComponent implements OnInit {
  productLoading: boolean = false;
  product: IProduct | null = null;
  menuActive: boolean = true;
  productId: string = ''

  selectedImage: string =  'assets/banner.jpg';

   constructor(
      private router: Router,
      private productService: ProductService,
      private datePipe: DatePipe,
      private toastService: ToastService,
      private route: ActivatedRoute,
      private dialog: MatDialog
    ) {}

ngOnInit(): void {
  this.productId = this.route.snapshot.queryParamMap.get("id") as string;
    this.loadPageData();
  }



  async loadPageData():Promise<void> {
    this.productLoading = true;

    try {
      await this.fetchProduct();
    } catch (error) {
      console.error('Error loading travel page data:', error);
      this.productLoading = false;
    }
  }


  fetchProduct():Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getProduct(this.productId).subscribe({
        next: (data: DataFetched) => {
          this.product = data.product;
          this.selectedImage = data.product.images.length ? data.product.images[0].file: 'assets/banner.jpg';
          resolve()
        },
        error: (err: any) => {
          console.error('Error fetching items:', err);
            this.productLoading = false;
            reject()
        },
        complete: () => {
          this.productLoading = false;
        }
      })
    })
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }

  navigateTo():void {
    this.router.navigate(['/'])
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid Date';

    return this.datePipe.transform(parsedDate, 'd MMMM yyyy', undefined, 'ro') || 'N/A';
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }
  makeCall(): void {
    window.location.href = 'tel:+0742431571';
  }

  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
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
}
