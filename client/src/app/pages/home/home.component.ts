import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IProduct } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';

interface DataFetched {
  products: IProduct[]
}

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {

  menuActive: boolean = true;
  productsLoading: boolean = false;

  contactName: string = '';
  contactEmail: string = '';
  contactMessage: string = '';

  sendMessageLoading: boolean = false;

  products: IProduct[] = []

  faqs = [
    {
      question: 'Ce tipuri de utilaje agricole oferiți?',
      answer: 'Oferim o gamă variată de utilaje agricole, atât noi, cât și second-hand, pentru diverse nevoi în fermă.'
    },
    {
      question: 'Oferiți servicii de întreținere și reparații?',
      answer: 'Da, asigurăm service și întreținere pentru toate tipurile de utilaje agricole, indiferent de marcă.'
    },
    {
      question: 'Cum funcționează transportul utilajelor?',
      answer: 'Oferim transport pentru utilaje agricole, iar costul este negociabil în funcție de locație și dimensiunea utilajului.'
    },
    {
      question: 'Oferiți garanție pentru utilajele achiziționate?',
      answer: 'Da, utilajele noi vin cu garanție standard, iar cele second-hand pot avea garanție în funcție de starea lor. Contactați-ne pentru mai multe detalii.'
    },
    {
      question: 'Pot returna un utilaj dacă nu sunt mulțumit?',
      answer: 'Returnarea este posibilă doar în anumite condiții. Vă rugăm să verificați politica noastră de retur sau să ne contactați pentru mai multe informații.'
    }
];

  constructor(
    private router: Router,
    private productService: ProductService,
    private datePipe: DatePipe,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPageData();
  }

  async loadPageData():Promise<void> {
    this.productsLoading = true;

    try {
      await this.fetchProducts();
    } catch (error) {
      console.error('Error loading travel page data:', error);
      this.productsLoading = false;
    }
  }


  fetchProducts():Promise<void> {
    return new Promise((resolve, reject) => {
      this.productService.getLastProducts().subscribe({
        next: (data: DataFetched) => {
          this.products = data.products;
          resolve()
        },
        error: (err: any) => {
          console.error('Error fetching items:', err);
            this.productsLoading = false;
            reject()
        },
        complete: () => {
          this.productsLoading = false;
        }
      })
    })
  }

  toggleMenu() {
    this.menuActive = !this.menuActive;
  }


  scrollToSection(sectionId: string):void {
    const section =  document.getElementById(sectionId)
    if(section) {
      section.scrollIntoView({behavior: 'smooth', block:'start'})
    }
  }
  navigateTo(path:string):void {
    this.router.navigate([path])
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid Date';

    return this.datePipe.transform(parsedDate, 'd MMMM yyyy', undefined, 'ro') || 'N/A';
  }

  sendMessage(): void {

    this.sendMessageLoading = true;
    if (!this.contactName || !this.contactEmail || !this.contactMessage) {
      this.toastService.show('Toate câmpurile sunt obligatorii!', 'error');
      this.sendMessageLoading = false;
      return;
    }

    this.productService.sendMessage(this.contactName, this.contactEmail, this.contactMessage).subscribe({
      next: (response) => {
        this.toastService.show(response.message, 'success');
        this.contactName = '';
        this.contactEmail = '';
        this.contactMessage = '';
        this.sendMessageLoading = false;
      },
      error: () => {
        this.toastService.show('Eroare la trimiterea mesajului. Încercați din nou!', 'error');
        this.sendMessageLoading = false;
      }
    });
  }

  navigateToProduct(id:string):void {
    this.router.navigate(['/produs'], {queryParams: {id: id}})
  }

}
