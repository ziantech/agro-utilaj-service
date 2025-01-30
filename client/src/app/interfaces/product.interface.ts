
interface Price {
amount: number;
currency: string;
}

interface Image {
  id:string;
  file: string;
}

export interface IProduct {
   _id: string;
  name: string;
  unique_id: string;
  make: string;
  productModel:string;
  price: Price[];
  images: Image[];
  category: string;
  createdAt: string;
  description?:string;
}
