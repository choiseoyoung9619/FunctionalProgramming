// ----- 타입 -----
type Item = {
  name: string;
  price: string;
};

// ----- 데이터 -----
let shopping_cart: Item[] = [];
let all_items: ParentNode[] = [];

// ----- 액션 -----
const getButtons = (): NodeListOf<Element> =>
  document.querySelectorAll("button");

const $buttons = getButtons();

$buttons.forEach((button) => {
  button.parentNode && all_items.push(button.parentNode);
  button.addEventListener("click", ({ target }) => {
    const $target = (target as HTMLElement).parentNode;
    const $name = $target?.querySelector(".menu-name");
    const $price = $target?.querySelector(".price");

    if ($name && $price) {
      const name = $name.textContent || "";
      const price = $price.textContent || "";

      add_item_to_cart({ name, price });
    }
  });
});

const add_item_to_cart = (item: Item) => {
  shopping_cart = add_item_to_array(shopping_cart, item);
  const shopping_cart_total = shopping_cart
    .map((item) => KRW_to_number(item.price))
    .reduce((prev, curr) => prev + curr, 0);

  update_tax_dom(shopping_cart_total);
  update_cart_total_dom(shopping_cart_total);
  update_shipping_icons(shopping_cart_total);
};

function update_shipping_icons(cartTotal: number) {
  for (let i = 0; i < all_items.length; i++) {
    const item = all_items[i];
    const itemRawPrice = item.querySelector(".price");
    if (itemRawPrice) {
      const itemPrice = KRW_to_number(itemRawPrice.textContent);
      const tempPrice = cartTotal + itemPrice;

      check_free_shipping_availability(tempPrice)
        ? show_free_shopping_icon(item)
        : hide_free_shopping_icon(item);
    }
  }
}

const show_free_shopping_icon = (item: ParentNode) => {
  const icon = item.querySelector(".free-shipping-icon");

  if (!icon) {
    const span = document.createElement("span");
    span.classList.add("free-shipping-icon");
    span.textContent = "FREE SHIPPING";
    item.append(span);
  }
};

const hide_free_shopping_icon = (item: ParentNode) => {
  const icon = item.querySelector(".free-shipping-icon");
  if (icon) {
    // ...
  }
};

const update_cart_total_dom = (total: number) => {
  const totalPrice = document.querySelector(".total-price");
  if (totalPrice) totalPrice.textContent = number_to_KRW(total);
};

const update_tax_dom = (total: number) => {
  const taxPrice = document.querySelector(".tax-price");
  if (taxPrice) taxPrice.textContent = number_to_KRW(calc_tax(total));
};

// ----- 계산 -----
const calc_tax = (price: number) => price * 0.1;

const add_item_to_array = <T>(array: T[], item: T) => [...array, item];

const check_free_shipping_availability = (price: number) => price >= 20000;

const KRW_to_number = (price: string | null) =>
  Number(price?.replace(/[^0-9.-]+/g, "")) || 0;

const number_to_KRW = (price: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
