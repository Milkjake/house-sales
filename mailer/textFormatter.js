exports.textFormatter = function (suburbsData) {
  return suburbsData.reduce((accText, currSuburb) => {
    const { suburb, city, properties } = currSuburb;

    if (properties.length > 0) {
      accText += suburb + ", " + city + "\n";
      accText += properties.reduce((accPropertyText, currProperty) => {
        const { address, url, dateAdded, estimateValue, estimateRange } =
          currProperty;

        accPropertyText +=
          "\t address: " +
          address +
          "\n" +
          "\t url: " +
          url +
          "\n" +
          "\t date added: " +
          dateAdded +
          "\n" +
          "\t estimated value:" +
          estimateValue +
          "\n" +
          "\t estimated range:" +
          estimateRange +
          "\n\n";

        return accPropertyText;
      }, "");
      return accText;
    }
    return "";
  }, "");
};
