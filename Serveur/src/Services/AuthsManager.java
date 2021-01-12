package Services;

import BDs.AuthsDB;
import Tools.AuthsTools;
import Tools.ErrorJSON;
import Tools.UsersTools;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.SQLException;

public class AuthsManager {

    public static JSONObject doLogin(String login, String password, String isRoot) {
        if (login == null || password == null || login.equals("") || password.equals("") || isRoot == null || isRoot.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments ", -1);
        boolean root = Boolean.parseBoolean(isRoot);
        try {
            if (!UsersTools.existEmail(login))
                return ErrorJSON.serviceRefused("Utilisateur introuvable", 1);


            JSONObject o = AuthsTools.getUserInfosFromLogin(login);
            int userId = o.getInt("user");
            if (!AuthsTools.passwordCheck(userId, password))
                return ErrorJSON.serviceRefused("Mot de passe incorrect", 2);


            String key;
            JSONObject json = new JSONObject();
            key = AuthsTools.insertSession(userId, root);
            json.put("id", userId);
            json.put("nom", o.getString("nom"));
            json.put("prenom", o.getString("prenom"));
            json.put("login", login);
            json.put("key", key);
            return json;

        } catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        }

    }

    public static JSONObject recoverPassword(String email) {
        if (email == null || email.equals(""))
            return ErrorJSON.serviceRefused("Erreur d'arguments ", -1);

        try {
            if (!UsersTools.existEmail(email))
                return ErrorJSON.serviceRefused("Utilisateur introuvable", 1);


            if (AuthsTools.recoverPassword(email))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        }

    }

    public static JSONObject doLogout(String key) {
        if (key == null || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);

        try {
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 3);

            if (AuthsTools.disconnect(key))
                return ErrorJSON.serviceAccepted();

            return ErrorJSON.serviceRefused("Vous n'etes pas connecté", 4);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        }
    }

    public static JSONObject getInfos(String key) {
        if (key == null || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);

        try {
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 3);

            return AuthsDB.getUserInfosFromKey(key);

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        } catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }

    public static JSONObject getInfosFromId(String key, String id) {
        if (id == null || id.equals("") || key == null || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);

        try {
            int idUser = Integer.parseInt(id);
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 3);

            return AuthsDB.getUserInfosFromLogin(AuthsDB.getLoginFromId(idUser));

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        } catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }

    public static JSONObject changePassword(String login, String password, String newPassword) {
        if (login == null || login.equals("") || password == null || password.equals("") || newPassword == null || newPassword.equals(""))
            return ErrorJSON.serviceRefused("Erreur d'arguments ", -1);

        try {
            if (!UsersTools.existEmail(login))
                return ErrorJSON.serviceRefused("Utilisateur introuvable", 1);


            JSONObject o = AuthsTools.getUserInfosFromLogin(login);
            int userId = o.getInt("user");
            if (!AuthsTools.passwordCheck(userId, password))
                return ErrorJSON.serviceRefused("Mot de passe incorrect", 2);

            if (AuthsTools.resetPassword(userId, newPassword))
                return ErrorJSON.serviceAccepted();


            return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);

        } catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }
}
