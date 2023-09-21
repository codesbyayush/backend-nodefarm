const http = require("http");
const url = require("url");
const { readFileSync } = require("fs");

const cardtemp = readFileSync("./templates/card.html", "utf8");
const product = readFileSync("./templates/product.html", "utf8");
const overview = readFileSync("./templates/overview.html", "utf8");
const data = readFileSync("./data.json", "utf8");
const dataObj = JSON.parse(data);

function replaceTemplate(el, tempCard) {
  let output = tempCard.replace(/{%PRODUCTNAME%}/g, el.productName);
  output = output.replace(/{%IMAGE%}/g, el.image);
  output = output.replace(/{%FROM%}/g, el.from);
  output = output.replace(/{%NUTRIENTS%}/g, el.nutrients);
  output = output.replace(/{%QUANTITY%}/g, el.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, el.description);
  output = output.replace(/{%PRICE%}/g, el.price);
  output = output.replace(/{%ID%}/g, el.id);
  if (el.organic) {
    output = output.replace(/{%NOTORGANIC%}/g, "");
  } else {
    output = output.replace(/{%NOTORGANIC%}/g, "not-organic");
  }
  return output;
}

const server = http.createServer((req, res) => {
  const reqObj = url.parse(req.url, true);
  const query = reqObj.query;
  const pathname = reqObj.pathname;

  res.writeHead(200, { "Content-type": "text/html" });
  if (req.url === "/" || req.url === "/overview") {
    let cardsHtml = dataObj.map((el) => replaceTemplate(el, cardtemp));
    cardsHtml = cardsHtml.join(" ");
    let tempOverview = overview.replace(/{%PRODUCTCARDS%}/g, cardsHtml);
    res.end(tempOverview);
  } else if (pathname === "/product") {
    res.end(replaceTemplate(dataObj[query.id], product));
  } else {
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(5000);
