import { NewTagProps } from "@/components/newTag";


export interface navLink extends NewTagProps {
  title: string;
  link: string;
  icon?: React.JSX.Element;
  isExternal?: boolean;
}

export interface OrderTypeProps {
  fees:number; 
  setFees:React.Dispatch<React.SetStateAction<number>>
  setPostOrderStatus:React.Dispatch<React.SetStateAction<boolean>>
}
export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    created_at: string;
    updated_at: string;
    loyalty: number;
    isFirstOrder: boolean;
  }
  
  export interface cartItem {
    nom: string;
    qte: number;
    id: string;
    itemId: number;
    options: Array<cartItemOption>;
    price: number;
    image: string;
    cat: Array<ProductCategory>;
  }
  export interface cartItemOption{
    name: string;
    id_zelty:string;
    details: Array<OptionData>;
  }
  export interface OptionData{
    id: string;
    name: string;
    qte: number;
    price: number;
  }

export type credentialsType = {
  email: string;
  password: string;
};

export type UserRegistration = {
  email: string;
  name: string;
  phone: string;
  password: string;
  confirm_password: string;
};

export interface ProductData {
  id: number;
  name: string;
  image: string | null;
  disable?: boolean;
  description: string | null;
  price: number;
  cat: Array<ProductCategory>;
  options: Array<ProductOption>;
}

export interface ProductCategory {
  name: string;
  id_zelty: string;
  id:number;
  id_parent: number | null;
}
export interface ProductOption {
  name: string;
  id_zelty: string;
  enfants: Array<ProductOptionChild>;
}
export interface ProductOptionChild {
  name: string;
  price: number;
  id_zelty: string;
  min_choices: null | number;
  max_choices: null | number;
}
export interface DataValue {
  name: string;
  quantity: number;
}

export interface Products {
  data: ProductData[];
  message: string;
  success: boolean;
}

export type CategoryData = {
  data: Categories[];
  message: string;
  success: boolean;
};
export type Categories = {
  name: string;
  image: string | null;
  description: string | null;
  id_parent: number | null;
  id:number;
};

export type PostOrderProps = {
    phone: string;
    total_amount: number;
    user: number;
    Address: addressProps;
    commande: cartItem[];
}

export type PostTakeAwayOrderProps = {
    phone: string;
    total_amount: number;
    user: number;
    commande: cartItem[];
    due_date: Date;
}

export interface ReceiptProps {
    fees: number;
    commande: cartItem[];
    due_date?: Date;
    Address?: addressProps;
    client_name: string;
    client_mail:string;
    loyalty:number;
}

export type addressProps = {
    name: string;
    street: string;
    zip_code: string;
    city: string;
}

export interface PreviousOrders{
    data: OrderLog[];
    message: string;
    success: boolean;
}
export interface OrderLog{
    id: number;
    zelty_order_id: string;
    reference: string;
    items: string;
    is_delivred: boolean;
    is_paid: boolean;
    prix_total: string;
    created_at: Date;
    updated_at: Date;
    user_id: number;
}

export interface otherOption {
  name: string;
  details:{
    id: string;
    name: string;
    qte: number;
    price: number;
  }[]
}

export interface orderMutation{
  data: orderMutationData;
  message: string;
  success: boolean;
}
export interface orderMutationData{
  MSIDN: string;
  amount: string;
  created_at: Date;
  id: number;
  method_paiement: string;
  ref:string;
  status: string;
  updated_at: Date;
}

export interface checkTransactionStatus{
  data: orderMutationData[];
  message:string;
  success:boolean;
}

export interface CitiesResponse {
  data: Array<City>;
  message: string;
  success: boolean;
}
export interface City {
  id: number;
  ville: string;
  quartier: string;
  prix: string;
}

