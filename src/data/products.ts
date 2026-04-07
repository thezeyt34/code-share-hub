export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  category: string;
  variants?: number;
}

export const products: Product[] = [
  {
    id: "sement",
    name: "Sement",
    price: 130000,
    oldPrice: 138000,
    discount: 6,
    image: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400&h=400&fit=crop",
    category: "Qurilish mollari",
  },
  {
    id: "mashxad",
    name: "Mashxad",
    price: 25000,
    oldPrice: 28000,
    discount: 11,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop",
    category: "Qurilish mollari",
  },
  {
    id: "temir-samarez",
    name: "Temir samarez",
    price: 30000,
    oldPrice: 31500,
    discount: 5,
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=400&h=400&fit=crop",
    category: "Qurilish mollari",
  },
  {
    id: "samarez",
    name: "Samarez",
    price: 27000,
    oldPrice: 28000,
    discount: 4,
    image: "https://images.unsplash.com/photo-1609205807107-2573c6402977?w=400&h=400&fit=crop",
    category: "Qurilish mollari",
    variants: 3,
  },
  {
    id: "mix",
    name: "Mix",
    price: 10200,
    oldPrice: 10550,
    discount: 3,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop",
    category: "Qurilish mollari",
    variants: 3,
  },
];

export const categories = ["Hammasi", "Qurilish mollari"];

export function formatPrice(price: number): string {
  return price.toLocaleString("uz-UZ") + " so'm";
}
