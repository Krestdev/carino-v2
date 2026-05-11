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
// export interface User {
//   id: number;
//   name: string;
//   phone: string;
//   email: string;
//   created_at: string;
//   updated_at: string;
//   loyalty: number;
//   isFirstOrder: boolean;
// }

export interface cartItem {
  name: string;
  quantity: number;
  id: string;
  item_id: number;
  options: Array<cartItemOption>;
  price: number;
  image: string;
  tags: Array<Number>;
  originalPrice?: number;
}
export interface cartItemOption {
  name: string;
  id_zelty?: string;
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
  mail: string;
  fname: string;
  phone: string;
  password: string;
};

export interface ProductCategory {
  name: string;
  id_zelty: string;
  id: number;
  id_parent: number | null;
}

export interface ProductOption {
  id: number;
  name: string;
  values: OptionValue[];
  max_choices: number;
  min_choices: number;
  donotpresent: boolean;
  zc_only: boolean;
  disable: boolean;
}

export interface OptionValue {
  id: number;
  remote_id: string | null;
  name: string;
  description: string | null;
  image: string;
  price: number;
}

// export interface ProductOption {
//   name: string;
//   id_zelty: string;
//   enfants: Array<ProductOptionChild>;
// }
// export interface ProductOptionChild {
//   name: string;
//   price: number;
//   id_zelty: string;
//   min_choices: null | number;
//   max_choices: null | number;
// }
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
  metadata: string;
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
  vendor_reference: string;
}

export interface checkTransactionStatus {
  vendor_reference?: string;
  status?: "PENDING" | "COMPLETED" | "FAILED";
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
  dishes: ProductsData[];
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

export interface ProdData {
  id: number;
  remote_id: string | null;
  id_restaurant: number;
  sku: string | null;
  name: string;
  description: string | null;
  image: string;
  thumb: string;
  price: number; // en cents (ex: 100000 = 1000.00 €)
  price_togo: number | null;
  price_delivery: number | null;
  happy_price: number | null;
  cost_price: number | null;
  tva: number;
  tvat: number | null;
  tvad: number | null;
  tax: number;
  tax_takeaway: number | null;
  tax_delivery: number | null;
  tags: number[]; // IDs des catégories/tags
  options: number[]; // IDs des options
  id_fabrication_place: number;
  fab_name: string | null;
  color: string | null;
  loyalty_points: number;
  loyalty_points_discount: number | null;
  earn_loyalty: number;
  price_to_define: boolean;
  weight_for_price: number | null;
  disable: boolean;
  disable_takeaway: boolean;
  disable_delivery: boolean;
  disable_before: string | null;
  disable_after: string | null;
  o: number;
  zc_only: boolean;
  meta: Record<string, any>;
  zc_name: string | null;
}

export interface Cat {
  id: number;
  id_restaurant?: number;
  remote_id?: string;
  name: string;
  img?: string;
  description?: string;
  id_parent?: number;
  color?: string;
  o?: number;
  zc_only?: boolean;
  zc_hidden?: boolean;
  is_group?: boolean;
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
  price: number;
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
  vendor_reference: string;
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

export type deliveryMode = "takeaway" | "delivery";

export type Retry = {
  orderUuid: string | undefined;
  phone: string;
  network: 'MTN_CM' | 'ORANGE_CM';
};

export type Order = {
  total: number;
  first_name: string;
  address?: Omit<AddtressData, 'id' | 'created_at' | 'updated_at'>;
  items: Omit<cartItem, 'id' | 'options' | 'image' | 'tags' | 'name'>[];
  payment: {
    network: 'MTN_CM' | 'ORANGE_CM';
    phone: string;
  }
  due_date?: string;
  mode: deliveryMode
};

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

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone: string
  isFirstOrder: boolean
  loyalty: number;
}

export interface User {
  id: number;
  id_zelty?: number;
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
  last_login: string;
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

export interface ReservationData {
  id: number
  remote_id: string
  id_customer: number
  id_command: number
  created_at?: Date
  booking_for: Date
  arrived_at?: Date
  closed_at?: Date
  table: number
  places: number
  status: number
  cancel_reason?: number
  src: string
  comment: string
  final_price: number
  customer: User
}

export interface ReservationResponse {
  amount: number;
  phone: string;
  note: string;
  menu: string;
  id?: number;
  uid?: string;
  remote_id?: string;
  id_customer?: number;
  id_command?: number;
  created_at?: Date;
  booking_for: string;
  id_restaurant?: number;
  arrived_at?: null;
  closed_at?: null;
  table?: number;
  places?: number;
  status?: number;
  cancel_reason?: number;
  src?: string;
  comment?: string;
  final_price?: null;
}

export type Detail = { name: string; quantity: number };
export type Item = { name: string; details: Detail[] };

export interface Promotion {
  id: string;
  name: string;
  priority: number;          // pour choisir l’ordre d’application
  combinable: boolean;       // si elle peut se cumuler avec d’autres
  isActive: () => boolean;
  apply: (cart: cartItem[]) => cartItem[];
  image?: string;
  message: string;
  href?: string;
}

export interface PromotionDelivery {
  id: string;
  name: string;
  priority: number;          // pour choisir l’ordre d’application
  combinable: boolean;       // si elle peut se cumuler avec d’autres
  isActive: () => boolean;
  apply: (fees: number, district: string, cart: Array<cartItem>) => number;
}