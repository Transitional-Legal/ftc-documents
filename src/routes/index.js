const express = require("express");
const router = express.Router();

const {
  extractEmploymentDataAsync,
  findEmployerName,
  findEmploymentType,
  findNetEarnings,
  getPayPeriod,
} = require("../modules/employer");

const Recipe = require("muhammara").Recipe;

router.get("/", (req, res) => {
  res.send("Hello World");
});

// move to a module / class
// TODO: Get this from bank statement
const calculateExpenditure = (req) => {
  const result = {
    weekly_income: 0,
    personal_expenditure: 0,
  };

  return result;
};

router.post("/subpoena", async (req, res) => {
  const name = `${req.body.given_name} ${req.body.family_name}`;

  const date = new Date();

  // TODO: Add YYYY-MM-DD to filename
  const filename = `${req.body.given_name}-${req.body.family_name}_Financial_Statement.pdf`;

  const pdfDoc = new Recipe(
    "src/templates/subpoena_familylaw_0723v1.pdf",
    filename
  );
});

router.get("/employment", async (req, res) => {
  const payslip_data = await extractEmploymentDataAsync();
  const employmentType = findEmploymentType(payslip_data);
  const name = findEmployerName(payslip_data);

  const netEarnings = findNetEarnings(payslip_data);
  console.log(netEarnings);
  const weekly_income = netEarnings / getPayPeriod(payslip_data);

  return res.json({
    employmentType,
    weekly_income,
    name
  });
});

router.post("/finstatement", async (req, res) => {
  const name = `${req.body.given_name} ${req.body.family_name}`;

  const date = new Date();

  // TODO: Add YYYY-MM-DD to filename
  const filename = `${req.body.given_name}-${req.body.family_name}_Financial_Statement.pdf`;

  const pdfDoc = new Recipe(
    "src/templates/Financial_Statement_FORM_0921V1.pdf",
    filename
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
  const employmentType = "full-time"; // = findEmploymentType(payslip_data);

  let employment_type_x = 104;
  let employment_type_y = 393;

  const employment_type = employmentType || "full-time";
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
  const personal = req.body.personal || 0;
  const property = req.body.property || 0;
  const superannuation = req.body.superannuation || 0;
  const liabilities = req.body.liabilities || 0;
  const resources = req.body.resources || 0;

  const occupation = {
    position: "Sales Manager",
    employer: "Place Graceville",
    address: "389 Honour Ave, Graceville",
    phone: "07 3379 4311",
    state: "QLD",
    postcode: "4075",
    duration: 1,
  };

  // Part C: Your employment details
  pdfDoc
    .editPage(2)
    .text(dollars.format(Number(weekly_income)), 486, 118, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(dollars.format(Number(personal)), 486, 137, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(dollars.format(Number(property)), 486, 156, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(dollars.format(Number(superannuation)), 486, 175, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(dollars.format(Number(liabilities)), 486, 194, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(dollars.format(Number(resources)), 486, 213, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 3. What is your current position?
    .text(occupation.position, 102, 288, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 4. Are you employed?
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
    .text(occupation.employer, 102, 452, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(occupation.address, 102, 500, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(occupation.state, 136, 520, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(occupation.postcode, 330, 520, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text(occupation.phone, 470, 520, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 7. How long have you been employed at this place?
    .text(occupation.duration, 366, 552, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 446, 552, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 530, 552, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 8. Are you self-employed?
    .text("X", 102, 596, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .endPage();

    // Part D: Your income
    // 9
    pdfDoc
    .editPage(3)
    .text(dollars.format(Number(weekly_income)), 500, 138, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 10. Investment income (before tax)
    .text("NIL", 500, 178, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("NIL", 500, 256, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 11. Income from business / partnership / company / trust
    .text("NIL", 500, 334, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .endPage();

  // Part E: Other income earners in your household
  pdfDoc
    .editPage(4)
    // 17
    .text("0", 500, 112, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 500, 144, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 500, 176, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // Part F: Expenses paid by others for your benefit
    // 18
    .text("0", 500, 248, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 500, 280, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("0", 500, 312, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .endPage();

  // Part H: Personal expenses you pay for the benifits of others
  pdfDoc
    .editPage(6)
    // 34
    .text("NIL", 500, 106, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("NIL", 500, 162, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 35
    .text("NIL", 500, 250, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    // 36
    .text("NIL", 500, 336, {
      color: "#000000",
      fontSize: 12,
      font: "Arial",
    })
    .text("NIL", 500, 400, {
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
