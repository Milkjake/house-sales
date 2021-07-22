require("dotenv").config();
const _ = require("lodash");
const axios = require("axios");
const { transport } = require("./mailer/transport");
const { textFormatter } = require("./mailer/textFormatter");
const { createMailOptions } = require("./mailer/mailOptions");
const { cardsRequestPayload } = require("./cards/cards-request-payload");

const ADDRESS_URI = "https://www.homes.co.nz/address";
const ADDRESS_SUBURB_URI = "https://gateway.homes.co.nz/address-suburb";
const CARDS_URI = "https://gateway.homes.co.nz/map/cards";

const ONE_MINUTE = 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

exports.houseSales = async (req, res) => {
  const now = Date.now();
  const suburbsToQuery = process.env.SUBURBS_TO_QUERY.split(" ");

  let suburbs = await Promise.all(
    suburbsToQuery.map(async (suburbToQuery) => {
      try {
        const suburbToQueryRes = await axios.get(
          ADDRESS_SUBURB_URI + "/" + suburbToQuery
        );

        const { suburb, error } = suburbToQueryRes.data;

        if (error) return null;

        return suburb.suburbs;
      } catch (err) {
        throw err;
      }
    })
  );

  suburbs = _.uniqBy(suburbs.filter((suburb) => suburb !== null).flat(), "id");

  let suburbsData = await Promise.all(
    suburbs.map(async (suburb) => {
      const { boundary, name, city_name } = suburb;

      try {
        cardsRequestPayload.polylines = boundary;

        const cardsRes = await axios.post(CARDS_URI, cardsRequestPayload);

        const { cards } = cardsRes.data;

        const properties = cards.reduce((accProperties, currCard) => {
          const {
            date,
            url,
            property_details: {
              address,
              display_estimated_value_short,
              display_estimated_lower_value_short,
              display_estimated_upper_value_short,
            },
          } = currCard;

          // Property posted earlier than one day + one minute (for padding)
          if (now - new Date(date) < ONE_DAY + ONE_MINUTE) {
            return [
              ...accProperties,
              {
                address,
                url: ADDRESS_URI + url,
                dateAdded: date,
                estimateValue: display_estimated_value_short,
                estimateRange:
                  display_estimated_lower_value_short +
                  " - " +
                  display_estimated_upper_value_short,
              },
            ];
          }

          return accProperties;
        }, []);

        return { suburb: name, city: city_name, properties };
      } catch (err) {
        throw err;
      }
    })
  );

  suburbsData = suburbsData.filter((suburb) => {
    const { properties } = suburb;
    return properties.length > 0;
  });

  try {
    await transport.sendMail(
      createMailOptions(
        "New Houses for sale",
        suburbsData.length > 0
          ? textFormatter(_.sortBy(suburbsData, "suburb"))
          : "No new houses for sale"
      )
    );
  } catch (err) {
    throw err;
  }

  res.status(200).send("success");
};
