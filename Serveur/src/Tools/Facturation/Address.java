package Tools.Facturation;

import org.json.simple.JSONObject;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import java.io.IOException;
import java.awt.Color;
import java.lang.StringBuilder;

public class Address {
	private String title;
	private String first;
	private String last;
	private String address;
	private String city;
	private String zipCode;
	private String country;

	public Address(JSONObject jsonAddress) {

		if(jsonAddress.containsKey("title")) {
			this.setTitle((String)jsonAddress.get("title"));
		}
		if(jsonAddress.containsKey("nom")) {
			this.setFirst((String)jsonAddress.get("nom"));
		}
		if(jsonAddress.containsKey("prenom")) {
			this.setLast((String)jsonAddress.get("prenom"));
		}
        if(jsonAddress.containsKey("address")) {
            this.setAddress((String)jsonAddress.get("address"));
        }
		if(jsonAddress.containsKey("zip")) {
			this.setZipCode((String)jsonAddress.get("zip"));
		}
        if(jsonAddress.containsKey("city")) {
            this.setCity((String)jsonAddress.get("city"));
        }
        if(jsonAddress.containsKey("country")) {
            this.setCountry((String)jsonAddress.get("country"));
        }
	}

	public void printPDF(PDPageContentStream contents, boolean rightSide) throws IOException {
		PDFont font = PDType1Font.HELVETICA;
        Color color = new Color(80, 80, 80);

        int x = rightSide ? 400 : 120;

        int y = 660;

        PDFPrinter headerPrinter = new PDFPrinter(contents, font, 10);
        headerPrinter.putText(x, y, "Facture pour:");

        y -= 12;
        PDFPrinter addressPrinter = new PDFPrinter(contents, font, 10, color);
        addressPrinter.putText(x, y, getFullName());
        y -= 12;
        addressPrinter.putText(x, y, getAddress());
        y -= 12;
        addressPrinter.putText(x, y, getZipCode()+" "+getCity() + " "+ getCountry());
    }

	public String getFullName() {
		StringBuilder sb = new StringBuilder();
		sb.append(this.getTitle()).append(" ");
		sb.append(this.getFirst()).append(" ");
		sb.append(this.getLast());
		return sb.toString();
	}

	public void setTitle(String title) {
		this.title = title;
	}
	public String getTitle() {
		return this.title;
	}
	public void setFirst(String first) {
		this.first = first;
	}
	public String getFirst() {
		return this.first;
	}
	public void setLast(String last) {
		this.last = last;
	}
	public String getLast() {
		return this.last;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAddress() {
		return this.address;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCity() {
		return this.city;
	}
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
	public String getZipCode() {
		return this.zipCode;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getCountry() {
		return this.country;
	}
}