import { NewTagProps } from "@/components/newTag";

export interface navLink extends NewTagProps {
  title: string;
  link: string;
  icon?: React.JSX.Element;
  isExternal?: boolean;
}

export interface OrderTypeProps {
  fees: number;
  setFees: React.Dispatch<React.SetStateAction<number>>;
  setPostOrderStatus: React.Dispatch<React.SetStateAction<boolean>>;
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
export interface cartItemOption {
  name: string;
  id_zelty: string;
  details: Array<OptionData>;
}
export interface OptionData {
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

// export interface ProductData {
//   id: number;
//   name: string;
//   image: string | null;
//   disable?: boolean;
//   description: string | null;
//   price: number;
//   cat: Array<ProductCategory>;
//   options: Array<ProductOption>;
// }

export interface ProductCategory {
  name: string;
  id_zelty: string;
  id: number;
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

// export interface Products {
//   data: ProductData[];
//   message: string;
//   success: boolean;
// }

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
  id: number;
};

export type PostOrderProps = {
  phone: string;
  total_amount: number;
  user: number;
  Address: addressProps;
  commande: cartItem[];
};

export type PostTakeAwayOrderProps = {
  phone: string;
  total_amount: number;
  user: number;
  commande: cartItem[];
  due_date: Date;
};

export interface ReceiptProps {
  fees: number;
  commande: cartItem[];
  due_date?: Date;
  Address?: addressProps;
  client_name: string;
  client_mail: string;
  loyalty: number;
}

export type addressProps = {
  name: string;
  street: string;
  zip_code: string;
  city: string;
};

export interface PreviousOrders {
  data: OrderLog[];
  message: string;
  success: boolean;
}
export interface OrderLog {
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
  details: {
    id: string;
    name: string;
    qte: number;
    price: number;
  }[];
}

export interface orderMutation {
  data: orderMutationData;
  message: string;
  success: boolean;
}
export interface orderMutationData {
  MSIDN: string;
  amount: string;
  created_at: Date;
  id: number;
  method_paiement: string;
  ref: string;
  status: string;
  updated_at: Date;
}

export interface checkTransactionStatus {
  data: orderMutationData[];
  message: string;
  success: boolean;
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

// ##############
//    Address
// ##############

export interface AddressResponse {
  message: string;
  statusCode: number;
  data: AddtressData[];
}

export interface AddtressData {
  id: number;
  id_zelty: number;
  ville: string;
  quartier: string;
  prix: string;
  created_at: Date;
  updated_at: Date;
}

// ##############
// User
// ##############

export interface UserResponse {
  message: string;
  statusCode: number;
  data: UserData;
}

export interface UserData {
  id: number;
  uuid: string;
  remote_id?: null;
  nice_name: string;
  updated_at: string;
  country_code?: null;
  name: string;
  fname: string;
  company: string;
  card?: null;
  phone: string;
  phone2: string;
  mail: string;
  birthday?: null;
  balance: number;
  personal_info: string;
  loyalty: number;
  registration: Date;
  default_address: number;
  billing_address: number;
  accept_marketing: boolean;
  sms_optin?: null;
  mail_optin?: null;
  turnover: number;
  nb_orders: number;
  last_order_date: Date;
  vip: boolean;
  other: string;
  metadata?: null;
  last_restaurant_id: number;
  addresses: any[];
  isFirstOrder: boolean;
  id_zelty: number;
  email: string;
  created_at: Date;
}

// ##############
// Categories
// ##############

export interface CategoryResponse {
  message: string;
  statusCode: number;
  data: CategoriesData[];
}

export interface CategoriesData {
  id: number;
  id_restaurant: number;
  remote_id: null;
  name: string;
  img: null | string;
  description: null;
  id_parent: number | null;
  color: string;
  o: number;
  zc_only: boolean;
  zc_hidden: boolean;
  is_group: boolean;
  meta: null;
  image: null | string;
}

// ##############
// Products
// ##############

export interface ProductsResponse {
  message: string;
  statusCode: number;
  data: ProductsData[];
}

export interface ProductsData {
  id: number;
  remote_id?: null;
  id_restaurant: number;
  sku?: null;
  name: string;
  description?: string;
  image: string;
  thumb: string;
  price: number;
  price_togo?: number;
  price_delivery?: number;
  happy_price?: number;
  cost_price?: number;
  tva: number;
  tvat?: number;
  tvad?: number;
  tax: number;
  tax_takeaway?: number;
  tax_delivery?: number;
  tags: Cat[];
  options: Option[];
  id_fabrication_place: number;
  fab_name?: string;
  color?: string;
  loyalty_points: number;
  loyalty_points_discount?: number;
  earn_loyalty: number;
  price_to_define: boolean;
  weight_for_price?: number;
  disable: boolean;
  disable_takeaway: boolean;
  disable_delivery: boolean;
  disable_before?: boolean;
  disable_after?: boolean;
  o: number;
  zc_only: boolean;
  meta: string;
  zc_name?: string;
  cat: Cat[];
}

export interface Cat {
  id: number;
  id_restaurant: number;
  remote_id?: string;
  name: string;
  img?: string;
  description?: string;
  id_parent?: number;
  color: string;
  o: number;
  zc_only: boolean;
  zc_hidden: boolean;
  is_group: boolean;
  meta?: string;
}

export interface Option {
  id: number;
  remote_id?: number;
  name: string;
  values: Value[];
  disable: boolean;
  zc_only: boolean;
  donotpresent: boolean;
  meta: string;
  pick_same_value: boolean;
  min_choices: number;
  max_choices: number;
  id_zelty: string;
  enfants: Enfant[];
}

export interface Enfant {
  id: number;
  remote_id?: number;
  name: string;
  description?: string;
  image: string;
  price: string;
  min_choices?: number;
  max_choices?: number;
  id_zelty: string;
}

export interface Value {
  id: number;
  remote_id?: number;
  name: string;
  description?: number;
  image: string;
  price: number;
}

// ##############
// User Orders
// ##############

export interface UserOrdersResponse {
  message: string;
  statusCode: number;
  data: OrdersData[];
}

export interface OrdersData {
  id: number;
  zelty_order_id?: number;
  reference: string;
  items: string;
  user_id: number;
  prix_total: number;
  lieu_livraison: string;
  is_delivred: number;
  is_paid: number;
  uuid?: string;
  metadata?: string;
  promotionId?: number;
  created_at: Date;
  updated_at: Date;
}

// ##############
// Login
// ##############

export interface Props {
  email: string;
  password: string;
}

export interface UserLogin {
  message: string;
  statusCode: number;
  data: UserLoginData;
}

export interface UserLoginData {
  user: User;
  "bearer token": string;
}

export interface User {
  id: number;
  uuid: string;
  remote_id: number;
  nice_name: string;
  updated_at: string;
  country_code: string;
  name: string;
  fname: string;
  company: string;
  card?: string;
  phone: string;
  phone2: string;
  mail: string;
  birthday?: string;
  balance: number;
  personal_info: string;
  loyalty: number;
  registration: Date;
  default_address: number;
  billing_address: number;
  accept_marketing: boolean;
  sms_optin: boolean;
  mail_optin: boolean;
  turnover: number;
  nb_orders: number;
  last_order_date: string;
  vip: boolean;
  other: string;
  metadata?: string;
  last_restaurant_id: number;
  addresses: UserAddress[];
  isFirstOrder: boolean;
  email: string;
  created_at: string;
  "bearer token": string;
}

export interface UserAddress {
  id: number;
  remote_id: null;
  name: string;
  street: string;
  street_num?: string;
  zip_code: string;
  city: string;
  formatted_address: string;
  google_id: null;
  location: number[];
  address_more?: string;
  floor?: string;
  door?: string;
  building?: string;
  code?: string;
}
