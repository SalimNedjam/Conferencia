package Tools.Facturation;

import java.util.Date;
import java.text.SimpleDateFormat;

import org.json.simple.JSONObject;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.awt.Color;
import java.io.IOException;

public class Header {
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	private String invoiceDate;
	private String invoiceNumber;

    public Header(JSONObject jsonHeader) {
        this.setInvoiceDate();

        if(jsonHeader.containsKey("invoiceNumber")) {
            this.setInvoiceNumber((String)jsonHeader.get("invoiceNumber"));
        }
    }

    public void setInvoiceDate() {

        invoiceDate =  new SimpleDateFormat("yyyy-MM-dd").format(new Date());

    }
    public String getInvoiceDateString() {
        return this.invoiceDate;
    }
    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }
    public String getInvoiceNumber() {
        return this.invoiceNumber;
    }

    public void printPDF(PDPageContentStream contents) throws IOException {

        PDFont headerFont = PDType1Font.HELVETICA_BOLD;
        PDFPrinter headerPrinter = new PDFPrinter(contents, headerFont, 16);
        headerPrinter.putText(120, 740, "Conferentia Inc.");

        PDFont font = PDType1Font.HELVETICA;
        PDFPrinter textPrinter = new PDFPrinter(contents, font, 10);
        textPrinter.putText(120, 720, "Avenue des Champs-Élysées");
        textPrinter.putText(120, 708, "Paris, 75008");
        textPrinter.putText(120, 696, "www.conferentia.com");

        Color color = new Color(200, 200, 200);
        PDFPrinter invoiceHeaderPrinter = new PDFPrinter(contents, font, 24, color);
        invoiceHeaderPrinter.putText(450, 740, "FACTURE");

        textPrinter.putText(400, 710, "Date de facturation:");
        textPrinter.putText(400, 698, "Numéro de la facture:");
        textPrinter.putText(500, 710, this.getInvoiceDateString());
        textPrinter.putText(500, 698, this.getInvoiceNumber());
    }
}