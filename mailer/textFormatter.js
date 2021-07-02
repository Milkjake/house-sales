exports.textFormatter = function (suburbsData) {
  return suburbsData.reduce((accText, currSuburb) => {
    const { suburb, city, properties } = currSuburb;

    if (properties.length > 0) {
      const suburbHeading = suburb + ", " + city + "\n";

      accText += suburbHeading;
      accText += properties.reduce((accPropertyText, currProperty) => {
        const { address, url, dateAdded, estimateValue, estimateRange } =
          currProperty;

        const propertyText =
          "\t address: " +
          address +
          "\n" +
          "\t url: " +
          url +
          "\n" +
          "\t date added: " +
          new Date(dateAdded).toLocaleString() +
          "\n" +
          "\t estimated value: " +
          estimateValue +
          "\n" +
          "\t estimated range: " +
          estimateRange +
          "\n\n";

        accPropertyText += propertyText;

        return accPropertyText;
      }, "");
    }

    return accText;
  }, "");
};
