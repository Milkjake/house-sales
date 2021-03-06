const cardsRequestPayload = {
  polylines: [],
  page: 1,
  limit: parseInt(process.env.LIMIT),
  display_rentals: false,
  for_rent: false,
  for_sale: true,
  just_sold: false,
  off_market: false,
  sale_max: parseInt(process.env.SALE_MAX),
  sort: { order: "date", direction: "asc" },
};

exports.cardsRequestPayload = cardsRequestPayload;
