package BDs;

import Tools.AuthsTools;
import Tools.Database;
import Tools.EmailUtil;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Properties;
import java.util.UUID;

public class UsersDB {

    public static boolean insertUser(String password, String email, String nom, String prenom, String title, String institution, String address, String zip, String city, String country, String phone) throws SQLException {

        try (Connection conn = Database.getMySQLConnection();
             Statement statement = conn.createStatement()) {
            statement.execute("BEGIN");
            String query = " insert into Users (Mail,Password,date_create, is_staff)" + " values (?, md5(?), ?, ?)";
            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                Timestamp createDate = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));

                preparedStmt.setString(1, email);
                preparedStmt.setString(2, password);
                preparedStmt.setTimestamp(3, createDate);
                preparedStmt.setBoolean(4, false);


                if (preparedStmt.executeUpdate() == 0) {
                    statement.execute("ROLLBACK");
                    return false;
                }

            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback Users");
            }

            query = " select id_user From Users where Mail=?";

            int idUser;
            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                preparedStmt.setString(1, email);

                ResultSet rs = preparedStmt.executeQuery();
                if (rs.next())
                    idUser = rs.getInt("id_user");
                else {
                    statement.execute("ROLLBACK");
                    return false;
                }

            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback UserId");
            }

            query = " insert into UserInfos (id_user, nom, prenom, title, institution, address, zip, city, country, phone)" + " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                preparedStmt.setInt(1, idUser);
                preparedStmt.setString(2, nom);
                preparedStmt.setString(3, prenom);
                preparedStmt.setString(4, title);
                preparedStmt.setString(5, institution);
                preparedStmt.setString(6, address);
                preparedStmt.setString(7, zip);
                preparedStmt.setString(8, city);
                preparedStmt.setString(9, country);
                preparedStmt.setString(10, phone);


                if (preparedStmt.executeUpdate() == 0) {
                    statement.execute("ROLLBACK");
                    return false;
                }
                statement.execute("COMMIT");
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

                EmailUtil.sendEmail(session, email, "Inscription Project", "Votre Inscription à bien été prise en compte.");


            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback UserInfo");
            }
        }

        return true;
    }

    public static boolean existUser(int idUser) throws SQLException {
        String query = " select * From Users where id_user=?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, idUser);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                return true;


        }
        return false;
    }

    public static boolean existEmail(String email) throws SQLException {
        String query = " select * From Users where Mail=?";

        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, email);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                return true;


        }
        return false;
    }



    public static int getUserId(String login) throws SQLException {
        String query = " select id_user From Users where Mail=?";

        int userId = -1;
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setString(1, login);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                userId = rs.getInt("id_user");

        }
        return userId;

    }

    public static boolean isAdmin(int userdId) throws SQLException {
        String query = " select is_staff From Users where id_user=?";
        try (Connection conn = Database.getMySQLConnection();
             PreparedStatement preparedStmt = conn.prepareStatement(query)) {

            preparedStmt.setInt(1, userdId);

            ResultSet rs = preparedStmt.executeQuery();
            if (rs.next())
                return rs.getInt("is_staff") == 2;

        }
        return false;
    }

    public static boolean sameUser(String key, int id) throws SQLException {
        return AuthsTools.getUserIdFromKey(key) == id;
    }

    public static int inviteUser(String email) throws SQLException {
        int idUser;

        String password = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

        try (Connection conn = Database.getMySQLConnection();
             Statement statement = conn.createStatement()) {
            statement.execute("BEGIN");
            String query = " insert into Users (Mail,Password,date_create, is_staff)" + " values (?, md5(?), ?, ?)";
            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                Timestamp createDate = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC")));

                preparedStmt.setString(1, email);
                preparedStmt.setString(2, password);
                preparedStmt.setTimestamp(3, createDate);
                preparedStmt.setBoolean(4, false);


                if (preparedStmt.executeUpdate() == 0) {
                    statement.execute("ROLLBACK");
                    return -1;
                }

            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback Users");
            }

            query = " select id_user From Users where Mail=?";

            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                preparedStmt.setString(1, email);

                ResultSet rs = preparedStmt.executeQuery();
                if (rs.next())
                    idUser = rs.getInt("id_user");
                else {
                    statement.execute("ROLLBACK");
                    return -1;
                }

            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback UserId");
            }

            query = " insert into UserInfos (id_user, nom, prenom, title, institution, address, zip, city, country, phone)" + " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement preparedStmt = conn.prepareStatement(query)) {

                preparedStmt.setInt(1, idUser);
                preparedStmt.setString(2, "");
                preparedStmt.setString(3, "");
                preparedStmt.setString(4, "");
                preparedStmt.setString(5, "");
                preparedStmt.setString(6, "");
                preparedStmt.setString(7, "");
                preparedStmt.setString(8, "");
                preparedStmt.setString(9, "");
                preparedStmt.setString(10, "");


                if (preparedStmt.executeUpdate() == 0) {
                    statement.execute("ROLLBACK");
                    return -1;
                }
                statement.execute("COMMIT");
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

                EmailUtil.sendEmail(session, email, "Vous avez été invité dans le site Conferentia", "Vous avez été invité dans le site Conferentia: http://localhost:3000/login\n Votre identifiant: " +email+ " \nVotre mot de passe: "+password);


            } catch (SQLException e) {
                statement.execute("ROLLBACK");
                throw new SQLException("Rollback UserInfo");
            }
        }

        return idUser;
    }
}
