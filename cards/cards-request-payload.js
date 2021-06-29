const cardsRequestPayload = {
  polylines: [],
  page: 1,
  limit: 20,
  display_rentals: false,
  for_rent: false,
  for_sale: true,
  just_sold: false,
  off_market: false,
  sort: { order: "date", direction: "asc" },
};

exports.cardsRequestPayload = cardsRequestPayload;
