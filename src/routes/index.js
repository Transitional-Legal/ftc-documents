const express = require("express");
const router = express.Router();

const Recipe = require("muhammara").Recipe;

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.post("/finstatement", (req, res) => {

  const name = `${req.body.given_name} ${req.body.family_name}`;

  // Output file name a UUID
  const pdfDoc = new Recipe("Financial_Statement_FORM_0921V1.pdf", "output.pdf");
  
  // Family Court of Australia requires 12pt font https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.
  // Arial is preferred by the Family Court of Australia https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.
  
  pdfDoc
    .editPage(1)
    // [X] Federal Circuit and Family Court of Australia
    .text("X", 74, 152, {
      color: "#000000",
      fontSize: 12, 
      font: "Arial"
    })
    .text(name, 146, 219, {
      color: "#000000",
      fontSize: 12, 
      font: "Arial"
    })
    // Part A: About you
    .text(req.body.family_name, 96, 352, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.given_name, 334, 352, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.address, 96, 376, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.address_2 || "", 96, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.state || "", 412, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.postcode || "", 500, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .text(req.body.witness || "", 320, 654, {
      color: "#000000",
      fontSize: 12,
      font: "Arial"
    })
    .endPage()
    .endPDF();

  res.send("Financial Statement Generated");
});

module.exports = router;
