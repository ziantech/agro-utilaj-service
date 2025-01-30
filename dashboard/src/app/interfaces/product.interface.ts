export interface IAddProductPayload {
  name: string;
  description: string;
  category: string;
  make: string;
  productModel: string;
  price: Price[];
  negotiable: boolean;
  images: File[];
}

export interface ICreatePostResponse {
  message: string;
  id: string;
}

interface Price {
  amount: number;
  currency: string;
}

interface Image {
  id: string;
  file: string;
}

export interface IProduct {
  _id: string;
  unique_id: string;
  name: string;
  description: string;
  category: string;
  make: string;
  productModel: string;
  price: Price[];
  negotiable: boolean;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}
