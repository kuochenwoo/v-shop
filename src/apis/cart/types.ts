// export interface shoppingCartAddParams {
//   goodsId: number;
//   number: number;
//   addition?: string;
//   sku?: string;
//   type?: string;
// }
export interface shoppingCartResult {
  items: Recordable[];
  number: Number;
  price: Number;
  score: Number;
}

export interface shoppingCartAddParams {
  serviceId: number;
  productId: number;
}
