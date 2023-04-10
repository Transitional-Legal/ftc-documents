const pdfParse = require("pdf-parse");

const extractEmploymentDataAsync = async () => {
  const payslip = "payslip_21079851.pdf";

  const data = await pdfParse(payslip);
  console.log(data.numpages);
  const text = data.text;
  return text;
};

const findEmploymentData = (text) => {
  const result = {
    name: "",
    address: "",
  };

  return result;
};

const findEmploymentType = (text) => {
  console.log(text);
  let type = "part-time";

  // const words = text.split(" ");
  // console.log(words);

  // words.map((word) => {
  //   console.log(word);

  //   if (word.trim().includes(
  //       "full-time" ||
  //         "full time" ||
  //         "fulltime" ||
  //         "Full-time" ||
  //         "Full time" ||
  //         "Employment type: Full-time"
  //     )
  //   ) {
  //     type = "full-time";
  //   }
  // });

  // check to see if any of the words are full-time
  // if so, set type to full-time

  const regex = /Full[-\s]Time/i;
  if (regex.test(text)) {
    return "full-time";
  }

  return type;
};

const findNetEarnings = (text) => {
  let net_earnings = 0;

  // const re = new RegExp("Net Earnings\\$([0-9,]+)");
  // const match = re.exec(text);
  // if (match) {
  //   net_earnings = match[1];
  // }

  const regex = /Net[-\s]Earnings\$(\d+(?:,\d+)?\.\d+)/i;
  const match = text.match(regex);
  if (match) {
    const netEarnings = parseFloat(match[1].replace(/,/g, ""));
    net_earnings = netEarnings.toFixed(2);
  }

  return net_earnings;
};

const findEmployerName = (text) => {
  let name = "";

  const regex = /Pay[-\s]Advice[-\s]From/i;
  const match = text.match(regex);
  if (match) {
    name = match[0];
    name = name.trim();
  }

  return name;
};

const getPayPeriod = (text) => {
  return 2;
};

module.exports = {
  extractEmploymentDataAsync,
  findEmploymentData,
  findEmploymentType,
  findNetEarnings,
  findEmployerName,
  getPayPeriod,
};
