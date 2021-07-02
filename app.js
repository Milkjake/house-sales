require("dotenv").config();
const axios = require("axios");
const { transport } = require("./mailer/transport");
const { textFormatter } = require("./mailer/textFormatter");
const { createMailOptions } = require("./mailer/mailOptions");
const { cardsRequestPayload } = require("./cards/cards-request-payload");

const ADDRESS_URI = "https://www.homes.co.nz/address";
const ADDRESS_SUBURB_URI = "https://gateway.homes.co.nz/address-suburb";
const CARDS_URI = "https://gateway.homes.co.nz/map/cards";

exports.houseSales = async (req, res) => {
  const addressSuburbRes = await axios.get(
    ADDRESS_SUBURB_URI + "/wellington,johnsonville"
  );

  const {
    suburb: { suburbs },
  } = addressSuburbRes.data;

  let suburbsData = await Promise.all(
    suburbs.map(async (suburb) => {
      const { boundary, name, city_name } = suburb;

      try {
        cardsRequestPayload.polylines = boundary;

        const cardsRes = await axios.post(CARDS_URI, cardsRequestPayload);

        const { cards } = cardsRes.data;

        const properties = cards.map((card) => {
          const {
            date,
            url,
            property_details: {
              address,
              display_estimated_value_short,
              display_estimated_lower_value_short,
              display_estimated_upper_value_short,
            },
          } = card;

          return {
            address,
            url: ADDRESS_URI + url,
            dateAdded: date,
            estimateValue: display_estimated_value_short,
            estimateRange:
              display_estimated_lower_value_short +
              " - " +
              display_estimated_upper_value_short,
          };
        });

        return { suburb: name, city: city_name, properties };
      } catch (err) {
        throw err;
      }
    })
  );

  try {
    await transport.sendMail(
      createMailOptions("New Houses for sale", textFormatter(suburbsData))
    );
  } catch (err) {
    throw err;
  }

  res.status(200).send("success");
};
