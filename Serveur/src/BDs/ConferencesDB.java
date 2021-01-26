package BDs;

import Tools.AuthsTools;
import Tools.Database;
import Tools.EmailUtil;
import com.mysql.cj.xdevapi.JsonArray;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Properties;

import static BDs.AuthsDB.getUserIdFromKey;

public class ConferencesDB {



    public static boolean isResponsable(String key, int idC) throws SQLException {
        String query = " select * From Session s, Conferences c where s.key_session=?  and s.id_user= c.id_resp and c.id_conf = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);
            preparedStmt.setInt(2, idC);
            ResultSet rs = preparedStmt.executeQuery();
            return rs.next();
        }
    }
    public static JSONObject addConference(int userId, String[] types, String nom, Date dateClotEarly, Date dateConf, int fieldSet, String description) throws SQLException, JSONException {
        String query = " insert into Conferences (id_resp, nom, date_clot_early, date_conf, field_set, description)" + " values (?, ?, ?, ?, ?, ?)";
        JSONObject conf = new JSONObject();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {

            preparedStmt.setInt(1, userId);
            preparedStmt.setString(2, nom);
            preparedStmt.setDate(3, dateClotEarly);
            preparedStmt.setDate(4, dateConf);
            preparedStmt.setInt(5, fieldSet);
            preparedStmt.setString(6, description);

            if (preparedStmt.executeUpdate() == 0)
                throw new SQLException();

            try (ResultSet generatedKeys = preparedStmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    int conf_id = (int) generatedKeys.getLong(1);
                    conf.put("id_conf", conf_id);
                    for (String type : types) {
                        String[] args = type.split("\\;", -1);
                        int early, late;
                        early = Integer.parseInt(args[1]);
                        late = Integer.parseInt(args[2]);
                        addTypeConference(args[0], conf_id, early, late);
                    }
                }
                else {
                    throw new SQLException();
                }
            }

        }
        return conf;
    }

    public static boolean addTypeConference(String nom, int idC, int early, int late) throws SQLException {
        String query = " insert into Conference_type (id_conf, nom, tarif_early, tarif_late)" + " values (?, ?, ?, ?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, idC);
            preparedStmt.setString(2, nom);
            preparedStmt.setInt(3, early);
            preparedStmt.setInt(4, late);

            if (preparedStmt.executeUpdate() > 0)
                return true;
            else
                return false;


        }
    }

    public static JSONArray getAllConference() throws JSONException, SQLException {
        String query = "select * From Conferences";
        String query2 = "select * From Conference_type t where t.id_conf=?";
        String query3 = "select * From UserInfos where id_user = ?";
        String[] field = {"nom", "prenom", "title", "institution", "address", "zip", "city", "country", "phone"};

        JSONArray array = new JSONArray();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                JSONObject conf = new JSONObject();
                JSONObject resp = new JSONObject();
                PreparedStatement preparedStmt3 = conn.prepareStatement(query3);
                preparedStmt3.setInt(1, rs.getInt("id_resp"));
                ResultSet rs3 = preparedStmt3.executeQuery();
                if(rs3.next()){
                    for(int i=0; i<field.length; i++){
                        resp.put(field[i],rs3.getString(field[i]));
                    }
                    resp.put("id_resp", rs.getInt("id_resp"));
                }

                conf.put("id_conf", rs.getInt("id_conf"));
                conf.put("nom", rs.getString("nom"));
                conf.put("responsable", resp);
                conf.put("date_clot_early", rs.getDate("date_clot_early"));
                conf.put("date_conf", rs.getDate("date_conf"));
                conf.put("field_set", rs.getInt("field_set"));
                conf.put("description", rs.getString("description"));

                PreparedStatement preparedStmt2 = conn.prepareStatement(query2);
                preparedStmt2.setInt(1, rs.getInt("id_conf"));
                ResultSet rs2 = preparedStmt2.executeQuery();

                JSONArray arrayType = new JSONArray();
                while (rs2.next()) {
                    JSONObject type = new JSONObject();
                    type.put("id_type", rs2.getInt("id_type"));
                    type.put("nom", rs2.getString("nom"));
                    type.put("tarif_early", rs2.getInt("tarif_early"));
                    type.put("tarif_late", rs2.getInt("tarif_late"));

                    arrayType.put(type);
                }
                conf.put("types", arrayType);

                array.put(conf);
            }
        }
        return array;
    }

    public static JSONObject getConferenceById(int idC) throws JSONException, SQLException {

        String query = "select * From Conferences c where c.id_conf=?";
        String query2 = "select * From Conference_type t where t.id_conf=?";
        String query3 = "select * From UserInfos i where i.id_user = ?";

        JSONObject conf = new JSONObject();
        JSONObject resp = new JSONObject();
        String[] field = {"nom", "prenom", "title", "institution", "address", "zip", "city", "country", "phone"};
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, idC);
            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                PreparedStatement preparedStmt3 = conn.prepareStatement(query3);
                preparedStmt3.setInt(1, rs.getInt("id_resp"));
                ResultSet rs3 = preparedStmt3.executeQuery();
                if(rs3.next()) {

                    for (int i = 0; i < field.length; i++) {
                        resp.put(field[i], rs3.getString(field[i]));
                    }
                    resp.put("id_resp", rs.getInt("id_resp"));

                }
                conf.put("responsable", resp);
                conf.put("id_conf", idC);
                conf.put("nom", rs.getString("nom"));
                conf.put("date_clot_early", rs.getDate("date_clot_early"));
                conf.put("date_conf", rs.getDate("date_conf"));
                conf.put("field_set", rs.getInt("field_set"));
                conf.put("description", rs.getString("description"));

                PreparedStatement preparedStmt2 = conn.prepareStatement(query2);
                preparedStmt2.setInt(1, idC);
                ResultSet rs2 = preparedStmt2.executeQuery();

                JSONArray arrayType = new JSONArray();
                while (rs2.next()) {
                    JSONObject type = new JSONObject();
                    type.put("id_type", rs2.getInt("id_type"));
                    type.put("nom", rs2.getString("nom"));
                    type.put("tarif_early", rs2.getInt("tarif_early"));
                    type.put("tarif_late", rs2.getInt("tarif_late"));

                    arrayType.put(type);
                }
                conf.put("types", arrayType);

            }
        }
        return conf;
    }


    public static boolean isConfValid(int idC) throws SQLException {
        String query = " select * From Conferences c where c.id_conf = ?";
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, idC);

            ResultSet rs = preparedStmt.executeQuery();

            if (rs.next()) {


                Timestamp timeNow = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));
                if (timeNow.getTime() - rs.getDate("date_conf").getTime() < 0)
                    return true;

            }
            return false;

        }
    }

    public static boolean isEarly(int idC) throws SQLException {
        String query = " select * From Conferences c where c.id_conf = ?";
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, idC);

            ResultSet rs = preparedStmt.executeQuery();

            if (rs.next()) {


                Timestamp timeNow = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));
                if (timeNow.getTime() - rs.getDate("date_clot_early").getTime() < 0)
                    return true;

            }
            return false;

        }
    }
}
