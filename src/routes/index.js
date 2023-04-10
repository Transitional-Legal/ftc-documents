const express = require("express");
const router = express.Router();

const {
  extractEmploymentDataAsync,
  findEmploymentType,
  findNetEarnings,
  getPayPeriod,
} = require("../modules/employer");

const Recipe = require("muhammara").Recipe;

router.get("/", (req, res) => {
  res.send("Hello World");
});

// TODO: Get this from bank statement
const calculateExpenditure = (req) => {
  const result = {
    weekly_income: 0,
    personal_expenditure: 0,
  };

  return result;
};

router.post("/employment", async (req, res) => {
  const payslip_data = await extractEmploymentDataAsync();
  const employmentType = findEmploymentType(payslip_data);
  
  let ftx = 100;
  
  if (employmentType === "full-time") {
    ftx = 100;
  }

  const netEarnings = findNetEarnings(payslip_data);
  console.log(netEarnings);
  const weekly_income = netEarnings / getPayPeriod(payslip_data);

  return res.json({
    employmentType,
    weekly_income,
  });
});

router.post("/finstatement", async (req, res) => {
  const name = `${req.body.given_name} ${req.body.family_name}`;

  // Output file name a UUID
  const pdfDoc = new Recipe(
    "Financial_Statement_FORM_0921V1.pdf",
    "output.pdf"
  );

  // Family Court of Australia requires 12pt font https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.
  // Arial is preferred by the Family Court of Australia https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.

  pdfDoc
    .editPage(1)
    // [X] Federal Circuit and Family Court of Australia
    .text("X", 74, 152, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(name, 146, 219, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // Part A: About you
    .text(req.body.family_name, 96, 352, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.given_name, 334, 352, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.address, 96, 376, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.address_2 || "", 96, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.state || "", 412, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.postcode || "", 500, 395, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(req.body.witness || "", 320, 654, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .endPage();

  // Part B: Financial summary
  const dollars = Intl.NumberFormat("en-AU");

  // const payslip_data = await extractEmploymentDataAsync();
  // const employmentType = findEmploymentType(payslip_data);
  
  let employment_type_x = 104;
  let employment_type_y = 393;

  const employment_type = req.body.employment_type || "full-time";
  if (employment_type === "full-time") {
    employment_type_x = 104;
  }

  if (employment_type === "part-time") {
    employment_type_y = 410;
  }

  // const netEarnings = findNetEarnings(payslip_data);
  // console.log(netEarnings);
  // const weekly_income = netEarnings / getPayPeriod(payslip_data);
  // console.log(employmentType);

  const weekly_income = req.body.weekly_income || 0;

  pdfDoc
    .editPage(2)
    .text(dollars.format(Number(weekly_income || 0)), 486, 116, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // Employed
    .text("X", 102, 360, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("X", employment_type_x, employment_type_y, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .endPage();

  const password = req.body.password || "";
  if (password) {
    pdfDoc.encrypt({
      userPassword: password,
      // ownerPassword: "123", // TODO: ADD LAWYER PASSWORD
      userProtectionFlag: 4,
    });
  }

  pdfDoc.endPDF();

  res.send(`Financial Statement Generated for ${name}`);
});

module.exports = router;
