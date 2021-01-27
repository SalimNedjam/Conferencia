package BDs;


import Tools.AuthsTools;
import Tools.Database;
import Tools.EmailUtil;
import org.json.JSONException;
import org.json.JSONObject;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Properties;
import java.util.UUID;

public class AuthsDB {
    public static final int SESSION_TIMEOUT = 3600 * 1000;

    public static boolean disconnect(String key) throws SQLException {
        String query = "DELETE FROM Session WHERE key_session = ? ;";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setString(1, key);

            return preparedStmt.executeUpdate() > 0;

        }
    }

    public static String insertSession(int idU, boolean root) throws SQLException {
        String ret = "";
        String query = "insert into Session (id_user, key_session, date_session,root)" + " values (?, ?, ?, ?)";

        String key = AuthsTools.generateKey();

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {


            Timestamp requestDate = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));

            preparedStmt.setInt(1, idU);
            preparedStmt.setString(2, key);
            preparedStmt.setTimestamp(3, requestDate);
            preparedStmt.setBoolean(4, root);

            if (preparedStmt.executeUpdate() > 0)
                ret = key;

        }
        return ret;

    }

    public static boolean passwordCheck(int idUser, String password) throws SQLException {
        String query = " select * From Users where id_user=? and Password=md5(?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setInt(1, idUser);
            preparedStmt.setString(2, password);

            ResultSet rs = preparedStmt.executeQuery();
            return rs.next();


        }
    }

    public static int getUserIdFromKey(String key) throws SQLException {
        int userId = -1;
        String query = " select id_user From Session where key_session=?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                userId = rs.getInt("id_user");


        }


        return userId;

    }



    public static JSONObject getUserInfosFromKey(String key) throws SQLException, JSONException {
        int userId = -1;

        JSONObject o = new JSONObject();
        String query;
        if (getStaffStatus(key) == 2) {
            query = " select * From Session s,Users u where s.key_session=? and s.id_user=u.id_user";

            try (Connection conn = Database.getMySQLConnection();
                 PreparedStatement preparedStmt = conn.prepareStatement(query)) {
                preparedStmt.setString(1, key);
                ResultSet rs = preparedStmt.executeQuery();
                if (rs.next()) {
                    userId = rs.getInt("id_user");
                    o.put("login", rs.getString("Mail"));
                    o.put("is_staff", rs.getInt("is_staff"));
                }
                o.put("user", userId);
            }
        } else {
            query = " select * From Session s,Users u ,UserInfos i where s.key_session=? and s.id_user=i.id_user and s.id_user=u.id_user";

            try (Connection conn = Database.getMySQLConnection();
                 PreparedStatement preparedStmt = conn.prepareStatement(query)) {
                preparedStmt.setString(1, key);
                ResultSet rs = preparedStmt.executeQuery();
                if (rs.next()) {
                    userId = rs.getInt("id_user");
                    o.put("nom", rs.getString("nom"));
                    o.put("prenom", rs.getString("prenom"));
                    o.put("login", rs.getString("Mail"));
                    o.put("is_staff", rs.getInt("is_staff"));
                }
                o.put("user", userId);
            }
        }

        return o;
    }

    public static JSONObject getUserInfosFromLogin(String login) throws SQLException, JSONException {
        int userId = -1;
        JSONObject o = new JSONObject();

        String query = " select * From Users u , UserInfos i where (u.Mail=?) && u.id_user=i.id_user ";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, login);


            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                userId = rs.getInt("id_user");
                o.put("nom", rs.getString("nom"));
                o.put("prenom", rs.getString("prenom"));
                o.put("title", rs.getString("title"));
                o.put("institution", rs.getString("institution"));
                o.put("address", rs.getString("address"));
                o.put("zip", rs.getString("zip"));
                o.put("city", rs.getString("city"));
                o.put("country", rs.getString("country"));
                o.put("phone", rs.getString("phone"));
            }
            o.put("user", userId);

        }

        return o;

    }

    public static String getLoginFromId(int idUser) throws SQLException {
        String login = "";
        String query = " select Mail From Users where (id_user=?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, idUser);


            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                login = rs.getString("Mail");


        }
        return login;

    }

    public static boolean checkKey(String key) throws SQLException {
        String query = " select * From Session where (key_session=?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);


            ResultSet rs = preparedStmt.executeQuery();
            return rs.next();


        }


    }


    public static boolean isKeyValid(String key) throws SQLException {
        String query = " select * From Session where (key_session=?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);


            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                if (rs.getBoolean("root"))
                    return true;

                Timestamp timeNow = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));
                if (timeNow.getTime() - rs.getTimestamp("date_session").getTime() < SESSION_TIMEOUT) {
                    refreshKey(key);
                    return true;
                } else {
                    deleteKey(key);
                    return false;
                }

            }
            return false;
        }

    }

    private static void refreshKey(String key) throws SQLException {
        String query = "update Session set date_session = ? where key_session = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            Timestamp requestDate = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));
            preparedStmt.setTimestamp(1, requestDate);
            preparedStmt.setString(2, key);
            preparedStmt.executeUpdate();
        }

    }

    private static void deleteKey(String key) throws SQLException {
        String query = " Delete from Session where key_session=?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setString(1, key);
            preparedStmt.executeUpdate();
        }

    }


    public static boolean isRoot(String key) throws SQLException {
        String query = " select * From Session where key_session=?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {
            preparedStmt.setString(1, key);
            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                return rs.getBoolean("root");
            }
            throw new SQLException("Clé inexistante");


        }

    }


    public static boolean recoverPassword(String email) throws SQLException {

        String query = " update Users set  Password=md5(?)  where Mail=?;";
        String password = UUID.randomUUID().toString().replace("-", "").substring(0, 8);


        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, password);
            preparedStmt.setString(2, email);


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

                EmailUtil.sendEmail(session, email, "ProjectJEE password recovery.", "Thanks for using our platform.\nYour password has been changed.\nIf you are having trouble recovering your account, email Twister.web.recover@gmail.com \n \nYour new password is:\n " + password);
                return true;
            }


        }
        return false;
    }

    public static boolean resetPassword(int userId, String newPassword) throws SQLException {

        String query = " update Users set  Password=md5(?)  where id_user=?;";


        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, newPassword);
            preparedStmt.setInt(2, userId);


            return preparedStmt.executeUpdate() > 0;
        }

    }

    public static int getStaffStatus(String key) throws SQLException {
        String query = " select * From Session s,Users u where s.key_session=?  and s.id_user=u.id_user";

        int status = 0;
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next()) {
                status = rs.getInt("is_staff");
            }
        }

        return status;
    }

    public static int getIdFromEmail(String mail)  throws SQLException {
        int id = -1;
        String query = " select id_user From Users where (Mail=?)";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, mail);


            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                id = rs.getInt("id_user");


        }
        return id;

    }

    public static String getEmailFromId(int id_user)  throws SQLException {
        String query = " select Mail From Users where (id_user=?)";
        String mail = "";
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, id_user);


            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                mail = rs.getString("Mail");


        }
        return mail;

    }
    public static String getEmailFromKey(String key) throws SQLException {
        String mail = "";
        String query = " select Mail From Session s, Users u where s.key_session=? and u.id_user = s.id_user";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, key);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                mail = rs.getString("Mail");


        }


        return mail;

    }
    public static String getEmailFromInsc(int id_insc) throws SQLException {
        String mail = "";
        String query = " select Mail From Inscriptions i, Users u where  u.id_user = i.id_user and i.id_insc = ?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, id_insc);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                mail = rs.getString("Mail");


        }


        return mail;

    }

    public static boolean putAdmin(String email) throws SQLException {

        String query = " update Users set  is_staff = 2 where Mail=?;";


        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, email);


            return preparedStmt.executeUpdate() > 0;
        }

    }
}
