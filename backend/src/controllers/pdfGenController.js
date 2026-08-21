import PDFDocument from "pdfkit";
import {db} from "../../db/index.js"
import { sale } from "../models/saleModel.js";
import { saleItem } from "../models/saleItemModel.js";
import { customer } from "../models/customerModel.js";
import { product } from "../models/productModel.js";
import { eq } from "drizzle-orm";
import { supplier } from "../models/supplierModel.js";
import { purchase } from "../models/purchaseModel.js";
import { purchaseItem } from "../models/purchaseItemModel.js";
import { productBatch } from "../models/productBatchModel.js";


// DOWNLOAD SALE INVOICE PDF


export const downloadSaleInvoice = async (req, res) => {
  try {
    const saleId = Number(req.params.id);

    if (Number.isNaN(saleId)) {
      return res.status(400).json({
        message: "Invalid sale ID",
      });
    }

    
    // GET SALE + CUSTOMER
    

    const [saleData] = await db
      .select({
        id: sale.id,
        customerId: sale.customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        subtotal: sale.subtotal,
        discount: sale.discount,
        tax: sale.tax,
        total: sale.total,
        paymentMethod: sale.paymentMethod,
        amountPaid: sale.amountPaid,
        createdAt: sale.createdAt,
      })
      .from(sale)
      .leftJoin(
        customer,
        eq(sale.customerId, customer.id)
      )
      .where(eq(sale.id, saleId));

    if (!saleData) {
      return res.status(404).json({
        message: "Sale not found",
      });
    }

    
    // GET SALE ITEMS
    

    const items = await db
      .select({
        id: saleItem.id,
        productId: saleItem.productId,
        productName: product.name,
        sku: product.sku,
        unit: product.unit,
        quantity: saleItem.quantity,
        unitPrice: saleItem.unitPrice,
        totalPrice: saleItem.totalPrice,
      })
      .from(saleItem)
      .leftJoin(
        product,
        eq(saleItem.productId, product.id)
      )
      .where(eq(saleItem.saleId, saleId));

    
    // PDF RESPONSE
    

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Sale-Invoice-${saleId}.pdf"`
    );

    
    // CREATE PDF
    

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const margin = 40;

    
    // HEADER
    

    doc
      .fillColor("#191919")
      .rect(
        0,
        0,
        pageWidth,
        18
      )
      .fill();

    doc
      .fillColor("#191919")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "SALES INVOICE",
        margin,
        45
      );

    
    // INVOICE INFO
    

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text(
        `Invoice #: ${saleData.id}`,
        margin,
        80
      );

    const saleDate = saleData.createdAt
      ? new Date(
          saleData.createdAt
        ).toLocaleString("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

    doc.text(
      `Date: ${saleDate}`,
      margin,
      96
    );

    
    // CUSTOMER BOX
    

    doc
      .roundedRect(
        margin,
        125,
        pageWidth - margin * 2,
        85,
        6
      )
      .fill("#f5f5f5");

    doc
      .fillColor("#191919")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        "CUSTOMER",
        margin + 12,
        138
      );

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(
        saleData.customerName ||
          "Walk-in Customer",
        margin + 12,
        156
      );

    if (saleData.customerPhone) {
      doc.text(
        `Phone: ${saleData.customerPhone}`,
        margin + 12,
        174
      );
    }

    if (saleData.customerEmail) {
      doc.text(
        `Email: ${saleData.customerEmail}`,
        300,
        174
      );
    }

    
    // ITEMS TABLE
    

    let y = 240;

    // Header background
    doc
      .rect(
        margin,
        y,
        pageWidth - margin * 2,
        25
      )
      .fill("#191919");

    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(9);

    doc.text("Product", 48, y + 8);
    doc.text("SKU", 230, y + 8);
    doc.text("Qty", 300, y + 8);
    doc.text("Unit Price", 350, y + 8);
    doc.text("Total", 465, y + 8);

    y += 25;

    
    // ITEMS
    

    doc.font("Helvetica");

    items.forEach((item, index) => {
      const rowHeight = 28;

      if (index % 2 === 0) {
        doc
          .rect(
            margin,
            y,
            pageWidth - margin * 2,
            rowHeight
          )
          .fill("#fafafa");
      }

      doc
        .fillColor("#222222")
        .fontSize(9);

      doc.text(
        item.productName || "Product",
        48,
        y + 9,
        {
          width: 165,
        }
      );

      doc.text(
        item.sku || "-",
        230,
        y + 9,
        {
          width: 60,
        }
      );

      doc.text(
        String(item.quantity),
        300,
        y + 9,
        {
          width: 35,
          align: "center",
        }
      );

      doc.text(
        `Rs. ${Number(
          item.unitPrice
        ).toLocaleString("en-PK")}`,
        350,
        y + 9,
        {
          width: 90,
          align: "right",
        }
      );

      doc.text(
        `Rs. ${Number(
          item.totalPrice
        ).toLocaleString("en-PK")}`,
        465,
        y + 9,
        {
          width: 85,
          align: "right",
        }
      );

      y += rowHeight;
    });

    
    // SUMMARY
    

    y += 20;

    const summaryX = 350;
    const valueX = 465;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#666666");

    doc.text(
      "Subtotal",
      summaryX,
      y
    );

    doc.text(
      `Rs. ${Number(
        saleData.subtotal
      ).toLocaleString("en-PK")}`,
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    y += 18;

    doc.text(
      "Discount",
      summaryX,
      y
    );

    doc.text(
      `Rs. ${Number(
        saleData.discount
      ).toLocaleString("en-PK")}`,
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    y += 18;

    doc.text(
      "Tax",
      summaryX,
      y
    );

    doc.text(
      `Rs. ${Number(
        saleData.tax
      ).toLocaleString("en-PK")}`,
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    y += 10;

    doc
      .moveTo(
        summaryX,
        y
      )
      .lineTo(
        pageWidth - margin,
        y
      )
      .strokeColor("#cccccc")
      .stroke();

    y += 15;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#191919");

    doc.text(
      "TOTAL",
      summaryX,
      y
    );

    doc.text(
      `Rs. ${Number(
        saleData.total
      ).toLocaleString("en-PK")}`,
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    
    // PAYMENT
    

    y += 45;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#666666");

    doc.text(
      `Payment Method: ${
        saleData.paymentMethod || "-"
      }`,
      margin,
      y
    );

    doc.text(
      `Amount Paid: Rs. ${Number(
        saleData.amountPaid
      ).toLocaleString("en-PK")}`,
      margin,
      y + 18
    );

    
    // FOOTER
    

    const footerY =
  doc.page.height - margin - 45;

doc
  .moveTo(
    margin,
    footerY
  )
  .lineTo(
    pageWidth - margin,
    footerY
  )
  .strokeColor("#dddddd")
  .stroke();

doc
  .font("Helvetica")
  .fontSize(9)
  .fillColor("#666666")
  .text(
    "Purchase Invoice",
    margin,
    footerY + 12,
    {
      width: pageWidth - margin * 2,
      align: "center",
    }
  );

    
    // END PDF
    

    doc.end();

  } catch (error) {
    console.error(
      "Download sale invoice error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        message:
          "Failed to generate invoice",
      });
    }
  }
};


// DOWNLOAD PURCHASE INVOICE PDF

export const downloadPurchaseInvoice = async (req, res) => {
  try {
    const purchaseId = Number(req.params.id);

    if (Number.isNaN(purchaseId)) {
      return res.status(400).json({
        message: "Invalid purchase ID",
      });
    }

    // GET PURCHASE + SUPPLIER

    const [purchaseData] = await db
      .select({
        id: purchase.id,
        invoiceNumber: purchase.invoiceNumber,
        purchaseDate: purchase.purchaseDate,
        totalAmount: purchase.totalAmount,

        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierPhone: supplier.phone,
        supplierEmail: supplier.email,
        supplierAddress: supplier.address,

        createdAt: purchase.createdAt,
      })
      .from(purchase)
      .leftJoin(
        supplier,
        eq(purchase.supplierId, supplier.id)
      )
      .where(eq(purchase.id, purchaseId));

    if (!purchaseData) {
      return res.status(404).json({
        message: "Purchase not found",
      });
    }

    // GET PURCHASE ITEMS

    const items = await db
      .select({
        id: purchaseItem.id,

        productId: purchaseItem.productId,
        productName: product.name,
        sku: product.sku,
        unit: product.unit,

        batchNumber: productBatch.batchNumber,

        quantity: purchaseItem.quantity,
        costPrice: purchaseItem.costPrice,
        totalPrice: purchaseItem.totalPrice,
      })
      .from(purchaseItem)
      .leftJoin(
        product,
        eq(
          purchaseItem.productId,
          product.id
        )
      )
      .leftJoin(
        productBatch,
        eq(
          purchaseItem.batchId,
          productBatch.id
        )
      )
      .where(
        eq(
          purchaseItem.purchaseId,
          purchaseId
        )
      );

    // PDF RESPONSE

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Purchase-Invoice-${purchaseId}.pdf"`
    );

    // CREATE PDF

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const margin = 40;

    // HEADER

    doc
      .fillColor("#191919")
      .rect(
        0,
        0,
        pageWidth,
        18
      )
      .fill();

    doc
      .fillColor("#191919")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text(
        "PURCHASE INVOICE",
        margin,
        45
      );

    // INVOICE INFO

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text(
        `Invoice #: ${purchaseData.invoiceNumber}`,
        margin,
        80
      );

    doc.text(
      `Purchase ID: ${purchaseData.id}`,
      margin,
      96
    );

    const purchaseDate = purchaseData.purchaseDate
      ? new Date(
          purchaseData.purchaseDate
        ).toLocaleDateString("en-PK", {
          dateStyle: "medium",
        })
      : "-";

    doc.text(
      `Purchase Date: ${purchaseDate}`,
      300,
      80
    );

    const createdDate = purchaseData.createdAt
      ? new Date(
          purchaseData.createdAt
        ).toLocaleString("en-PK", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

    doc.text(
      `Created: ${createdDate}`,
      300,
      96
    );

    // SUPPLIER BOX

    doc
      .roundedRect(
        margin,
        125,
        pageWidth - margin * 2,
        90,
        6
      )
      .fill("#f5f5f5");

    doc
      .fillColor("#191919")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        "SUPPLIER",
        margin + 12,
        138
      );

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(
        purchaseData.supplierName || "-",
        margin + 12,
        156
      );

    if (purchaseData.supplierPhone) {
      doc.text(
        `Phone: ${purchaseData.supplierPhone}`,
        margin + 12,
        174
      );
    }

    if (purchaseData.supplierEmail) {
      doc.text(
        `Email: ${purchaseData.supplierEmail}`,
        300,
        174
      );
    }

    if (purchaseData.supplierAddress) {
      doc.text(
        `Address: ${purchaseData.supplierAddress}`,
        300,
        192,
        {
          width: 200,
        }
      );
    }

    // ITEMS TABLE

    let y = 245;

    doc
      .rect(
        margin,
        y,
        pageWidth - margin * 2,
        25
      )
      .fill("#191919");

    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(9);

    doc.text(
      "Product",
      48,
      y + 8
    );

    doc.text(
      "SKU",
      190,
      y + 8
    );

    doc.text(
      "Batch",
      270,
      y + 8
    );

    doc.text(
      "Qty",
      350,
      y + 8
    );

    doc.text(
      "Cost Price",
      390,
      y + 8
    );

    doc.text(
      "Total",
      475,
      y + 8
    );

    y += 25;

    // ITEMS

    doc.font("Helvetica");

    items.forEach((item, index) => {
      const rowHeight = 30;

      // Prevent overflowing to next page
      if (
        y + rowHeight >
        doc.page.height - 130
      ) {
        doc.addPage();
        y = 50;
      }

      if (index % 2 === 0) {
        doc
          .rect(
            margin,
            y,
            pageWidth - margin * 2,
            rowHeight
          )
          .fill("#fafafa");
      }

      doc
        .fillColor("#222222")
        .fontSize(9);

      doc.text(
        item.productName || "Product",
        48,
        y + 9,
        {
          width: 135,
        }
      );

      doc.text(
        item.sku || "-",
        190,
        y + 9,
        {
          width: 70,
        }
      );

      doc.text(
        item.batchNumber || "-",
        270,
        y + 9,
        {
          width: 70,
        }
      );

      doc.text(
        String(item.quantity),
        350,
        y + 9,
        {
          width: 30,
          align: "center",
        }
      );

      doc.text(
        `Rs. ${Number(
          item.costPrice || 0
        ).toLocaleString("en-PK")}`,
        390,
        y + 9,
        {
          width: 75,
          align: "right",
        }
      );

      doc.text(
        `Rs. ${Number(
          item.totalPrice || 0
        ).toLocaleString("en-PK")}`,
        475,
        y + 9,
        {
          width: 70,
          align: "right",
        }
      );

      y += rowHeight;
    });

    // SUMMARY

    y += 20;

    const summaryX = 350;
    const valueX = 465;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#666666");

    doc.text(
      "Total Items",
      summaryX,
      y
    );

    doc.text(
      String(items.length),
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    y += 22;

    doc
      .moveTo(
        summaryX,
        y
      )
      .lineTo(
        pageWidth - margin,
        y
      )
      .strokeColor("#cccccc")
      .stroke();

    y += 15;

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#191919");

    doc.text(
      "TOTAL",
      summaryX,
      y
    );

    doc.text(
      `Rs. ${Number(
        purchaseData.totalAmount || 0
      ).toLocaleString("en-PK")}`,
      valueX,
      y,
      {
        width: 85,
        align: "right",
      }
    );

    // FOOTER

   const footerY =
  doc.page.height - margin - 45;

doc
  .moveTo(
    margin,
    footerY
  )
  .lineTo(
    pageWidth - margin,
    footerY
  )
  .strokeColor("#dddddd")
  .stroke();

doc
  .font("Helvetica")
  .fontSize(9)
  .fillColor("#666666")
  .text(
    "Purchase Invoice",
    margin,
    footerY + 12,
    {
      width: pageWidth - margin * 2,
      align: "center",
    }
  );

    // END PDF

    doc.end();

  } catch (error) {
    console.error(
      "Download purchase invoice error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        message:
          "Failed to generate purchase invoice",
      });
    }
  }
};