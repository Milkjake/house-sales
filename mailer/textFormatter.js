exports.textFormatter = function (suburbsData) {
  return suburbsData.reduce((accText, curSuburb) => {
    const { suburb, city, properties } = curSuburb;
    accText += `${suburb}, ${city}\n`;
    accText += properties.reduce((accPropertyText, curProperty) => {
      const { address, url, dateAdded, estimateValue, estimateRange } =
        curProperty;

      accPropertyText += `\t address: ${address}\n 
      \t url: ${url}\n 
      \t date added: ${dateAdded} \n 
      \t estimated value: ${estimateValue} \n 
      \t estimated range: ${estimateRange}\n`;

      return accPropertyText;
    }, "");
    return accText;
  }, "");
};
