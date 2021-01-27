package Tools.Facturation;

import Tools.Database;
import org.json.JSONException;
import org.json.simple.JSONObject;
import java.io.*;


import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
public class PDFCreator {

    public static String createPDF(int id_insc) throws SQLException {
        JSONObject jsonDocument = new JSONObject();
        PDDocument pdfDocument = new PDDocument();
        JSONObject row = new JSONObject();


        String query = " select * From  Users u, Inscriptions i, UserInfos uf where i.id_insc = ? and u.id_user = i.id_user and uf.id_user = i.id_user";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, id_insc);
            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                jsonDocument.put("invoiceNumber",id_insc+"");
                jsonDocument.put("nom", rs.getString("nom"));
                jsonDocument.put("prenom", rs.getString("prenom"));
                jsonDocument.put("title", rs.getString("title"));
                jsonDocument.put("address", rs.getString("address"));
                jsonDocument.put("zip", rs.getString("zip"));
                jsonDocument.put("city", rs.getString("city"));
                jsonDocument.put("country", rs.getString("country"));
                jsonDocument.put("phone", rs.getString("phone"));
                jsonDocument.put("email", rs.getString("Mail"));
                jsonDocument.put("notes", "");

            }
        }

        query = " select i.id_insc, is_early, c.id_conf, i.id_conf, t.id_type, i.id_type, tarif_early, " +
                "tarif_late, c.nom AS 'conference_nom', t.nom AS 'type_nom'  " +
                "From  Inscriptions i, Conferences c, Conference_type t  " +
                "where i.id_insc = ? and c.id_conf = i.id_conf and t.id_type = i.id_type";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, id_insc);
            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                row.put("productId",rs.getString("id_type"));
                row.put("quantity", "1");

                String desc = "";
                desc += rs.getString("conference_nom")+" - ";
                desc += rs.getString("type_nom")+" - ";

                boolean isEarly = rs.getBoolean("is_early");
                if(isEarly){
                    desc +="Early";
                    row.put("unitPrice", rs.getInt("tarif_early")+"");

                } else{
                    desc +="Late";
                    row.put("unitPrice", rs.getInt("tarif_late")+"");

                }
                row.put("description", desc);

                jsonDocument.put("row", row);
            }
        }
        try {

            Invoice invoice = new Invoice(jsonDocument);
            PDPage pdfPage = new PDPage();
            pdfDocument.addPage(pdfPage);
            PDPageContentStream contents = new PDPageContentStream(pdfDocument, pdfPage);
            invoice.printPDF(pdfDocument, contents);
            pdfDocument.save(System.getProperty("user.dir") + "/" + id_insc+".pdf");
            return System.getProperty("user.dir") + "/" + id_insc+".pdf";
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                pdfDocument.close();
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
        return "";
    }
}
