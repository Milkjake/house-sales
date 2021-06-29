const axios = require("axios");
const { cardsRequestPayload } = require("./cards/cards-request-payload");

const ADDRESS_URI = "https://gateway.homes.co.nz/address";
const ADDRESS_SUBURB_URI = "https://gateway.homes.co.nz/address-suburb";
const CARDS_URI = "https://gateway.homes.co.nz/map/cards";

(async function () {
  const addressSuburbRes = await axios.get(
    ADDRESS_SUBURB_URI + "/wellington,johnsonville"
  );

  const {
    suburb: { suburbs },
  } = addressSuburbRes.data;

  cardsRequestPayload.polylines = suburbs[0].boundary;

  const cardsRes = await axios.post(CARDS_URI, cardsRequestPayload);

  console.log(cardsRes.data);
})();
