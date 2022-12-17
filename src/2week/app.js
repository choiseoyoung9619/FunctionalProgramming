var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// ----- 데이터 -----
var shopping_cart = [];
var all_items = [];
// ----- 액션 -----
var getButtons = function () {
    return document.querySelectorAll("button");
};
var $buttons = getButtons();
$buttons.forEach(function (button) {
    button.parentNode && all_items.push(button.parentNode);
    button.addEventListener("click", function (_a) {
        var target = _a.target;
        var $target = target.parentNode;
        var $name = $target === null || $target === void 0 ? void 0 : $target.querySelector(".menu-name");
        var $price = $target === null || $target === void 0 ? void 0 : $target.querySelector(".price");
        if ($name && $price) {
            var name_1 = $name.textContent || "";
            var price = $price.textContent || "";
            add_item_to_cart({ name: name_1, price: price });
        }
    });
});
var add_item_to_cart = function (item) {
    shopping_cart = add_item_to_array(shopping_cart, item);
    var shopping_cart_total = shopping_cart
        .map(function (item) { return KRW_to_number(item.price); })
        .reduce(function (prev, curr) { return prev + curr; }, 0);
    update_tax_dom(shopping_cart_total);
    update_cart_total_dom(shopping_cart_total);
    update_shipping_icons(shopping_cart_total);
};
function update_shipping_icons(cartTotal) {
    var _a;
    for (var i = 0; i < all_items.length; i++) {
        var item = all_items[i];
        var itemPrice = KRW_to_number((_a = item.querySelector(".price")) === null || _a === void 0 ? void 0 : _a.textContent);
        var tempPrice = cartTotal + itemPrice;
        check_free_shipping_availability(tempPrice)
            ? show_free_shopping_icon(item)
            : hide_free_shopping_icon(item);
    }
}
var show_free_shopping_icon = function (item) {
    var icon = item.querySelector(".free-shipping-icon");
    console.log(item);
    if (!icon) {
        var span = document.createElement("span");
        span.classList.add("free-shipping-icon");
        span.textContent = "FREE SHIPPING";
        item.append(span);
    }
};
var hide_free_shopping_icon = function (item) {
    var icon = item.querySelector(".free-shipping-icon");
    if (icon) {
        // ...
    }
};
var update_cart_total_dom = function (total) {
    var totalPrice = document.querySelector(".total-price");
    if (totalPrice)
        totalPrice.textContent = number_to_KRW(total);
};
var update_tax_dom = function (total) {
    var taxPrice = document.querySelector(".tax-price");
    if (taxPrice)
        taxPrice.textContent = number_to_KRW(calc_tax(total));
};
// ----- 계산 -----
var calc_tax = function (price) { return price * 0.1; };
var add_item_to_array = function (array, item) { return __spreadArray(__spreadArray([], array, true), [item], false); };
var check_free_shipping_availability = function (price) { return price >= 20000; };
var KRW_to_number = function (price) {
    return Number(price === null || price === void 0 ? void 0 : price.replace(/[^0-9.-]+/g, "")) || 0;
};
var number_to_KRW = function (price) {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
    }).format(price);
};
