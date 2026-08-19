import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const generateSaleInvoice = (
  sale,
  items = []
) => {

  const doc = new jsPDF();


  // ==========================================
  // COLORS
  // ==========================================

  const dark = [25, 25, 25];
  const gray = [100, 100, 100];
  const lightGray = [245, 245, 245];


  // ==========================================
  // PAGE HEADER
  // ==========================================

  doc.setFillColor(
    ...dark
  );

  doc.rect(
    0,
    0,
    210,
    12,
    "F"
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(22);

  doc.setTextColor(
    ...dark
  );

  doc.text(
    "SALES INVOICE",
    15,
    30
  );


  // ==========================================
  // INVOICE INFO
  // ==========================================

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    ...gray
  );


  doc.text(
    `Invoice #: ${sale.id}`,
    15,
    39
  );


  const saleDate =
    sale.createdAt
      ? new Date(
          sale.createdAt
        ).toLocaleString(
          "en-PK",
          {
            dateStyle:
              "medium",
            timeStyle:
              "short",
          }
        )
      : "-";


  doc.text(
    `Date: ${saleDate}`,
    15,
    46
  );


  // ==========================================
  // CUSTOMER SECTION
  // ==========================================

  doc.setFillColor(
    ...lightGray
  );

  doc.roundedRect(
    15,
    55,
    180,
    30,
    3,
    3,
    "F"
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(10);

  doc.setTextColor(
    ...dark
  );

  doc.text(
    "CUSTOMER",
    22,
    64
  );


  doc.setFont(
    "helvetica",
    "normal"
  );


  doc.text(
    sale.customerName ||
      "Walk-in Customer",
    22,
    72
  );


  if (sale.customerPhone) {

    doc.text(
      `Phone: ${sale.customerPhone}`,
      22,
      79
    );

  }


  if (sale.customerEmail) {

    doc.text(
      `Email: ${sale.customerEmail}`,
      110,
      79
    );

  }


  // ==========================================
  // ITEMS TABLE
  // ==========================================

  autoTable(
    doc,
    {

      startY: 95,

      head: [[
        "Product",
        "SKU",
        "Qty",
        "Unit Price",
        "Total",
      ]],

      body: items.map(
        (item) => [

          item.productName ||
            item.name ||
            "Product",

          item.sku ||
            "-",

          String(
            item.quantity
          ),

          `Rs. ${Number(
            item.unitPrice
          ).toLocaleString(
            "en-PK"
          )}`,

          `Rs. ${Number(
            item.totalPrice
          ).toLocaleString(
            "en-PK"
          )}`,

        ]
      ),

      theme: "grid",

      styles: {
        fontSize: 9,
        cellPadding: 5,
        textColor: dark,
      },

      headStyles: {
        fillColor: dark,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },

      columnStyles: {

        0: {
          cellWidth: 60,
        },

        1: {
          cellWidth: 35,
        },

        2: {
          halign: "center",
          cellWidth: 20,
        },

        3: {
          halign: "right",
          cellWidth: 30,
        },

        4: {
          halign: "right",
          cellWidth: 35,
        },

      },

    }
  );


  // ==========================================
  // SUMMARY
  // ==========================================

  const finalY =
    doc.lastAutoTable.finalY + 10;


  const summaryX = 135;


  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setTextColor(
    ...gray
  );


  doc.text(
    "Subtotal",
    summaryX,
    finalY
  );


  doc.text(
    `Rs. ${Number(
      sale.subtotal
    ).toLocaleString(
      "en-PK"
    )}`,
    195,
    finalY,
    {
      align: "right",
    }
  );


  doc.text(
    "Discount",
    summaryX,
    finalY + 7
  );


  doc.text(
    `Rs. ${Number(
      sale.discount
    ).toLocaleString(
      "en-PK"
    )}`,
    195,
    finalY + 7,
    {
      align: "right",
    }
  );


  doc.text(
    "Tax",
    summaryX,
    finalY + 14
  );


  doc.text(
    `Rs. ${Number(
      sale.tax
    ).toLocaleString(
      "en-PK"
    )}`,
    195,
    finalY + 14,
    {
      align: "right",
    }
  );


  // ==========================================
  // TOTAL
  // ==========================================

  doc.setDrawColor(
    200,
    200,
    200
  );

  doc.line(
    130,
    finalY + 20,
    195,
    finalY + 20
  );


  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(12);

  doc.setTextColor(
    ...dark
  );


  doc.text(
    "TOTAL",
    summaryX,
    finalY + 29
  );


  doc.text(
    `Rs. ${Number(
      sale.total
    ).toLocaleString(
      "en-PK"
    )}`,
    195,
    finalY + 29,
    {
      align: "right",
    }
  );


  // ==========================================
  // PAYMENT INFORMATION
  // ==========================================

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );


  doc.setTextColor(
    ...gray
  );


  doc.text(
    `Payment Method: ${
      sale.paymentMethod ||
      "-"
    }`,
    15,
    finalY + 10
  );


  doc.text(
    `Amount Paid: Rs. ${Number(
      sale.amountPaid
    ).toLocaleString(
      "en-PK"
    )}`,
    15,
    finalY + 17
  );


  // ==========================================
  // FOOTER
  // ==========================================

  const pageHeight =
    doc.internal.pageSize.height;


  doc.setDrawColor(
    220,
    220,
    220
  );


  doc.line(
    15,
    pageHeight - 25,
    195,
    pageHeight - 25
  );


  doc.setFontSize(9);

  doc.setTextColor(
    ...gray
  );


  doc.text(
    "Thank you for your purchase!",
    105,
    pageHeight - 17,
    {
      align: "center",
    }
  );


  // ==========================================
  // DOWNLOAD
  // ==========================================

  doc.save(
    `Sale-Invoice-${sale.id}.pdf`
  );

};