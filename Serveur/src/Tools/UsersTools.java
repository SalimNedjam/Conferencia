package Tools;

import BDs.UsersDB;

import java.sql.SQLException;

public class UsersTools {

    public static boolean insertUser(String password, String email, String nom, String prenom, String title, String institution, String address, String zip, String city, String country, String phone) throws SQLException {
        return UsersDB.insertUser(password, email, nom, prenom, title, institution, address, zip, city, country, phone);
    }

    public static boolean updateUser(int user_id, String nom, String prenom, String title, String institution, String address, String zip, String city, String country, String phone) throws SQLException {
        return UsersDB.updateUser(user_id, nom, prenom, title, institution, address, zip, city, country, phone);
    }

    public static int getUserId(String login) throws SQLException {
        return UsersDB.getUserId(login);
    }

    public static int isAdmin(int userId) throws SQLException {
        return UsersDB.isAdmin(userId);
    }

    public static boolean existEmail(String email) throws SQLException {
        return UsersDB.existEmail(email);
    }




    public static int inviteUser(String email) throws SQLException  {
        return UsersDB.inviteUser(email);

    }
}
