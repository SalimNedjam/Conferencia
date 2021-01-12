package Tools;

import BDs.UsersDB;

import java.sql.Date;
import java.sql.SQLException;

public class UsersTools {
    public static boolean insertUser(String password, String email, String nom, String prenom, String title, String institution, String address, String zip, String city, String country, String phone) throws SQLException {
        return UsersDB.insertUser(password, email, nom, prenom, title, institution, address, zip, city, country, phone);
    }

    public static boolean existUser(int idFriend) throws SQLException {
        return UsersDB.existUser(idFriend);
    }



    public static boolean existEmail(String email) throws SQLException {
        return UsersDB.existEmail(email);
    }

    public static boolean sameUser(String key, int id) throws SQLException {
        return UsersDB.sameUser(key, id);
    }


}
