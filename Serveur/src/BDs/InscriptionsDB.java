package BDs;

import Tools.Database;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static BDs.AuthsDB.getUserIdFromKey;

public class InscriptionsDB {



    public static boolean isResponsableOfInscription(String key, int idI) throws SQLException {
        String query = " select * From Session s, Conferences c, Inscriptions i where s.key_session=? and s.id_user = c.id_resp and c.id_conf = i.id_conf and i.id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);
            preparedStmt.setInt(2, idI);
            ResultSet rs = preparedStmt.executeQuery();
            return rs.next();
        }
    }


    public static Boolean addInscription(String key, int idC, int idT, boolean isEarly) throws SQLException {
        String query = " insert into Inscriptions (id_user, id_conf, id_type, is_early, approved, paid)" + " values (?, ?, ?, ?, ?, ?)";

        int userId = getUserIdFromKey(key);
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, userId);
            preparedStmt.setInt(2, idC);
            preparedStmt.setInt(3, idT);
            preparedStmt.setBoolean(4, isEarly);
            preparedStmt.setBoolean(5, false);
            preparedStmt.setBoolean(6, false);

            if (preparedStmt.executeUpdate() > 0)
                return true;
            else
                return false;

        }
    }

    public static JSONArray getAllInscriptions(int idC)  throws JSONException, SQLException {
        String query = "select * From Inscriptions i where i.id_conf=?";

        JSONArray array = new JSONArray();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, idC);
            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                JSONObject conf = new JSONObject();
                conf.put("id_insc", rs.getInt("id_insc"));
                conf.put("id_conf", rs.getInt("id_conf"));
                conf.put("id_type", rs.getInt("id_type"));
                conf.put("id_user", rs.getInt("id_user"));
                conf.put("is_early", rs.getBoolean("is_early"));
                conf.put("approved", rs.getInt("approved"));
                conf.put("paid", rs.getBoolean("paid"));
                array.put(conf);
            }
        }
        return array;

    }

    public static JSONArray getInscriptionsByUser(String  key)  throws JSONException, SQLException {
        String query = " select * From Session s, Inscriptions i where s.key_session=?  and s.id_user= i.id_user";

        JSONArray array = new JSONArray();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setString(1, key);

            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                JSONObject conf = new JSONObject();
                conf.put("id_insc", rs.getInt("id_insc"));
                conf.put("id_conf", rs.getInt("id_conf"));
                conf.put("id_type", rs.getInt("id_type"));
                conf.put("id_user", rs.getInt("id_user"));
                conf.put("is_early", rs.getBoolean("is_early"));
                conf.put("approved", rs.getInt("approved"));
                conf.put("paid", rs.getBoolean("paid"));
                array.put(conf);
            }
        }
        return array;

    }


    public static boolean approveInscription(int idI, int approve) throws SQLException {
        String query = "update Inscriptions set approved = ? where id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, approve);
            preparedStmt.setInt(2, idI);
            preparedStmt.executeUpdate();
        }
        return true;
    }
}
