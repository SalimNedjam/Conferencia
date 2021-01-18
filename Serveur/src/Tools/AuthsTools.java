package Tools;

import BDs.AuthsDB;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.SQLException;
import java.util.UUID;

public class AuthsTools {
    public static boolean passwordCheck(int idU, String password) throws SQLException {

        return AuthsDB.passwordCheck(idU, password);
    }

    public static String insertSession(int idU, boolean logged) throws SQLException {
        return AuthsDB.insertSession(idU, logged);
    }


    public static int getUserIdFromKey(String key) throws SQLException {
        return AuthsDB.getUserIdFromKey(key);
    }

    public static JSONObject getUserInfosFromLogin(String login) throws SQLException, JSONException {
        return AuthsDB.getUserInfosFromLogin(login);
    }

    public static String getLoginFromId(int idUser) throws SQLException {
        return AuthsDB.getLoginFromId(idUser);
    }


    public static String generateKey() throws SQLException {
        String key;
        do {
            key = UUID.randomUUID().toString().replace("-", "");
        } while (AuthsTools.checkKey(key));
        return key;
    }

    public static boolean checkKey(String key) throws SQLException {

        return AuthsDB.checkKey(key);
    }

    public static boolean isKeyValid(String key) throws SQLException {

        return AuthsDB.isKeyValid(key);
    }

    public static boolean isRoot(String key) throws SQLException {

        return AuthsDB.isRoot(key);
    }
    public static boolean isStaff(String key) throws SQLException {

        return AuthsDB.isStaff(key);
    }
    public static boolean disconnect(String key) throws SQLException {

        return AuthsDB.disconnect(key);
    }

    public static boolean recoverPassword(String email) throws SQLException {
        return AuthsDB.recoverPassword(email);
    }

    public static boolean resetPassword(int userId, String newPassword) throws SQLException {
        return AuthsDB.resetPassword(userId, newPassword);

    }
}
