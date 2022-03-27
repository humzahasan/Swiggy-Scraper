import axios from "axios";
import cheerio from "cheerio";
import express from "express";
import fs from "fs";

const PORT = process.env.PORT || 5000;

const app = express();

let options = {
  url: "https://www.swiggy.com/restaurants/chai-break-alipore-alipore-kolkata-490476",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36",
  },
};

axios(options)
  .then((res) => {
    const htmlData = res.data;
    const $ = cheerio.load(htmlData);
    const food = [];
    //.styles_item__3_NEA.styles_hasImage__3OsYt
    $(".styles_item__3_NEA.styles_hasImage__3OsYt", htmlData).each(
      (index, element) => {
        const name = $(element)
          .children(".styles_detailsContainer__22vh8")
          .children(".styles_itemName__hLfgz")
          .children(".styles_itemNameText__3ZmZZ")
          .text();

        const price = $(element)
          .children(".styles_detailsContainer__22vh8")
          .children(".styles_itemPortionContainer__1u_tj")
          .children(
            ".styles_price__2xrhD.styles_itemPrice__1Nrpd.styles_s__66zLz"
          )
          .text();

        const imgSrc = $(element)
          .children(".styles_itemImageContainer__3Czsd")
          .find("div > button > img")
          .attr("src");

        const desc = $(element)
          .children(".styles_detailsContainer__22vh8")
          .children(".styles_itemDesc__3vhM0")
          .text();
        // console.log(name, price, imgSrc);

        let foodMenu = { name, price, imgSrc, category: "chai-break", desc };
        food.push(foodMenu);
      }
    );
    console.log(food);
    fs.writeFile("input5.json", JSON.stringify(food), function (err) {
      if (err) throw err;
      console.log("complete");
    });
  })
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`server running port ${PORT}`));
