import moment from "moment";
import { faker } from "@faker-js/faker";

export default function get_formated_data(
  userData,
  orderData,
  merchantsCheckoutId
) {
  const phone = `+${userData.phone}`;
  const items = Object.keys(orderData.products).map((prodId) => {
    const p = orderData.products[prodId];
    return {
      price: { amount: 1.0, currency: "USD" },
      name: p.name,
      sku: faker.commerce.isbn(),
      image: p.image,
      quantity: p.quantity,
      category: [[p.category.name]],
    };
  });

  return {
    amounts: {
      total: orderData.total,
      subtotal: orderData.total,
      tax: 5,
      shipping: 307,
      discount_total: null,
      currency: "USD",
    },
    items: items,
    platform: { platform_type: "merchant-app-demo", platform_version: "1.0" },
    billing: {
      name: userData.name,
      address_1: userData.address,
      address_2: userData.address,
      city: "NY",
      area: null,
      zone_code: "NY", // TODO: tune this
      country_code: "US", // TODO: tune this
      postal_code: "90210", // TODO: tune this
      phone_number: phone,
    },
    shipping: {
      name: userData.name,
      address_1: userData.address,
      address_2: userData.address,
      city: "New York", // TODO: tune this
      area: null,
      zone_code: "NY", // TODO: tune this
      country_code: "US", // TODO: tune this
      postal_code: "90210", // TODO: tune this
      phone_number: phone,
    },
    created_at: moment().format(),
    updated_at: moment().format(),
    shipping_method: "overnight",
    merchant_checkout_id: merchantsCheckoutId, // "4b718371-a466-4270-bc97-ece09d256443"
    merchant_user_id: "1234", // TODO: tune this
    redirect_cancel_url: "https://merchant.com/cancel",
    redirect_confirm_url: "https://merchant.com/redirect",
    user_cohorts: ["platinum", "newsletter", "club_membe"],
  };
}
