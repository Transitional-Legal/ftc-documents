
export const fullName = (fullname) => {
  pdfDoc
    .editPage(1)
    .text(fullname, 146, 220, {
      color: "#000000",
      fontSize: 12, // Family Court of Australia requires 12pt font https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.
      font: "Arial", // Arial is preferred by the Family Court of Australia https://www.fedcourt.gov.au/online-services/preparing-documents-for-the-court#:~:text=Font%20size%2C%20colour%20and%20type&text=The%20font%20size%20for%20Federal,such%20as%20blue%20and%20red.
    })
    .endPage()
    .endPDF();
};
