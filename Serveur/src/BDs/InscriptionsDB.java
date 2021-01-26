package BDs;

import Tools.Database;
import Tools.EmailUtil;
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

import static BDs.AuthsDB.getEmailFromId;
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


    public static int addInscription(int userId, int idC, int idT, boolean isEarly) throws SQLException {
        String query = " insert into Inscriptions (id_user, id_conf, id_type, is_early, approved, paid)" + " values (?, ?, ?, ?, ?, ?)";
        int id_insc;
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, userId);
            preparedStmt.setInt(2, idC);
            preparedStmt.setInt(3, idT);
            preparedStmt.setBoolean(4, isEarly);
            preparedStmt.setBoolean(5, false);
            preparedStmt.setBoolean(6, false);

            if (preparedStmt.executeUpdate() > 0) {
                    final String fromEmail = "Twister.Web.recover@gmail.com";
                    final String emailPass = "qtkskcnkuhmsvwzk";
                    System.out.println("TLSEmail Start");
                    Properties props = new Properties();
                    props.put("mail.smtp.host", "smtp.gmail.com");
                    props.put("mail.smtp.port", "587");
                    props.put("mail.smtp.auth", "true");
                    props.put("mail.smtp.starttls.enable", "true");

                    Authenticator auth = new Authenticator() {
                        protected PasswordAuthentication getPasswordAuthentication() {
                            return new PasswordAuthentication(fromEmail, emailPass);
                        }
                    };
                    Session session = Session.getInstance(props, auth);

                    EmailUtil.sendEmail(session, getEmailFromId(userId), "Demande d'inscription à une conférence.", "Merci de vous être inscrit à une conférence.\nVous allez recevoir un mail pour vous prevenir de l'avancement de votre inscription.\n");

                try (ResultSet generatedKeys = preparedStmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        id_insc = (int) generatedKeys.getLong(1);
                    }
                    else {
                        throw new SQLException();
                    }
                }


                return id_insc;
                }
            else
                throw new SQLException();

        }
    }

    public static JSONArray getAllInscriptions(int idC)  throws JSONException, SQLException {
        String query = "select * From Inscriptions i, Users u, Conference_type t, Conferences c where i.id_conf=? and i.id_type = t.id_type and i.id_user = u.id_user and i.id_conf= c.id_conf";
        String query3 = "select * From UserInfos i where i.id_user = ?";
        String[] field = {"nom", "prenom", "title", "institution", "address", "zip", "city", "country", "phone"};

        JSONArray array = new JSONArray();
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, idC);
            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                JSONObject user = new JSONObject();
                JSONObject conf = new JSONObject();

                PreparedStatement preparedStmt3 = conn.prepareStatement(query3);
                preparedStmt3.setInt(1, rs.getInt("id_user"));
                ResultSet rs3 = preparedStmt3.executeQuery();
                int field_set=rs.getInt("field_set");

                if(rs3.next()){
                    for(int i=0; i<field.length; i++){
                        if((field_set & 1 << i) != 0){
                            user.put(field[i],rs3.getString(field[i]));

                        }
                        conf.put("id_user", rs.getInt("id_user"));
                    }
                }
                conf.put("user", user);
                conf.put("id_insc", rs.getInt("id_insc"));
                conf.put("id_conf", rs.getInt("id_conf"));
                conf.put("id_type", rs.getInt("id_type"));
                conf.put("mail", rs.getString("Mail"));
                conf.put("nom", rs.getString("nom"));
                conf.put("tarif_early", rs.getString("tarif_early"));
                conf.put("tarif_late", rs.getString("tarif_late"));
                conf.put("is_early", rs.getBoolean("is_early"));
                conf.put("approved", rs.getInt("approved"));
                conf.put("paid", rs.getBoolean("paid"));
                array.put(conf);
            }
        }
        return array;

    }

    public static JSONArray getInscriptionsByUser(String  key)  throws JSONException, SQLException {
        String query = " select * From Session s, Inscriptions i, Users u, Conference_type t where s.key_session=?  and s.id_user= i.id_user and i.id_type = t.id_type and i.id_user = u.id_user";
        String query3 = "select * From UserInfos i where i.id_user = ?";
        String[] field = {"nom", "prenom", "title", "institution", "address", "zip", "city", "country", "phone"};
        JSONArray array = new JSONArray();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setString(1, key);

            ResultSet rs = preparedStmt.executeQuery();

            while (rs.next()) {
                JSONObject user = new JSONObject();
                JSONObject conf = new JSONObject();

                PreparedStatement preparedStmt3 = conn.prepareStatement(query3);
                preparedStmt3.setInt(1, rs.getInt("id_user"));
                ResultSet rs3 = preparedStmt3.executeQuery();
                int field_set=rs.getInt("field_set");

                if(rs3.next()){
                    for(int i=0; i<field.length; i++){
                        if((field_set & 1 << i) != 0){
                            user.put(field[i],rs3.getString(field[i]));

                        }
                        conf.put("id_user", rs.getInt("id_user"));
                    }
                }

                conf.put("user", user);
                conf.put("id_insc", rs.getInt("id_insc"));
                conf.put("id_conf", rs.getInt("id_conf"));
                conf.put("id_type", rs.getInt("id_type"));
                conf.put("mail", rs.getString("Mail"));
                conf.put("nom", rs.getString("nom"));
                conf.put("tarif_early", rs.getString("tarif_early"));
                conf.put("tarif_late", rs.getString("tarif_late"));
                conf.put("is_early", rs.getBoolean("is_early"));
                conf.put("approved", rs.getInt("approved"));
                conf.put("paid", rs.getBoolean("paid"));
                array.put(conf);
            }
        }
        return array;

    }


    public static boolean approveInscription(int idI, String email) throws SQLException {
        String query = "update Inscriptions set approved = ? where id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, 1);
            preparedStmt.setInt(2, idI);
            preparedStmt.executeUpdate();
            if (preparedStmt.executeUpdate() > 0){
                final String fromEmail = "Twister.Web.recover@gmail.com";
                final String emailPass = "qtkskcnkuhmsvwzk";
                System.out.println("TLSEmail Start");
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");

                Authenticator auth = new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(fromEmail, emailPass);
                    }
                };
                Session session = Session.getInstance(props, auth);

                EmailUtil.sendEmail(session, email, "Demande d'inscription à une conférence a été acceptée.", "Votre demande d'inscription à une conférence a été acceptée, vous devez maintenant proceder au payement\n");
                return true;
            } else
                    return false;
        }
    }

    public static boolean disapproveInscription(int idI, String email, String reason) throws SQLException {
        String query = "update Inscriptions set approved = ? where id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, 2);
            preparedStmt.setInt(2, idI);
            preparedStmt.executeUpdate();
            if (preparedStmt.executeUpdate() > 0){
                final String fromEmail = "Twister.Web.recover@gmail.com";
                final String emailPass = "qtkskcnkuhmsvwzk";
                System.out.println("TLSEmail Start");
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");

                Authenticator auth = new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(fromEmail, emailPass);
                    }
                };
                Session session = Session.getInstance(props, auth);

                EmailUtil.sendEmail(session, email, "Demande d'inscription à une conférence a été refusée.", "Votre demande d'inscription à une conférence a été refusée pour la raison suivante:\n" + reason +"\n");
                return true;
            }
        }
        return true;
    }


    public static boolean payInscription(int idI, String email) throws SQLException {
        String query = "update Inscriptions set paid = ? where id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setBoolean(1, true);
            preparedStmt.setInt(2, idI);
            preparedStmt.executeUpdate();
            if (preparedStmt.executeUpdate() > 0){
                final String fromEmail = "Twister.Web.recover@gmail.com";
                final String emailPass = "qtkskcnkuhmsvwzk";
                System.out.println("TLSEmail Start");
                Properties props = new Properties();
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");

                Authenticator auth = new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(fromEmail, emailPass);
                    }
                };
                Session session = Session.getInstance(props, auth);

                EmailUtil.sendEmail(session, email, "Votre payement à été accepté.", "Votre payement a été accepter, votre inscription à la conférence est confirmé.\n");
                return true;
            }
        }
        return true;
    }
}
