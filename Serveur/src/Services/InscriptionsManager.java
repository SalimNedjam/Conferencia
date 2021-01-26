package Services;

import BDs.AuthsDB;
import Tools.*;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.SQLException;

import static BDs.AuthsDB.getUserIdFromKey;

public class InscriptionsManager {

    public static JSONObject addInscription(String key, String idConf, String idType)  {
        int idC, idT;
        boolean isEarly;
        if (key == null || idConf == null || idType == null
                || key.equals("") || idConf.equals("") || idType.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        try {
            try {

                idC = Integer.parseInt(idConf);
                idT = Integer.parseInt(idType);


            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);
            if (!ConferencesTools.isConfValid(idC))
                return ErrorJSON.serviceRefused("La conférence n'est plus valide", 1);

            isEarly = ConferencesTools.isEarly(idC);
            int userId = getUserIdFromKey(key);

            if(InscriptionsTools.addInscription(userId, idC, idT, isEarly)>0)
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }
    }


    public static JSONObject getAllInscriptions(String key, String idConf) {
        int idC;

        if (key == null || idConf == null || idConf.equals("") || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);


        try {
            try {
                idC = Integer.parseInt(idConf);
            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);

            if (!ConferencesTools.isResponsable(key, idC))
                return ErrorJSON.serviceRefused("Vous n'avez pas les droits", 1);

            return new JSONObject().put("inscriptions", InscriptionsTools.getAllInscriptions(idC));

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }

    public static JSONObject getInscriptionsByUser(String key) {

        if (key == null || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);


        try {
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);


            return new JSONObject().put("inscriptions", InscriptionsTools.getInscriptionsByUser(key));

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }

    public static JSONObject approveInscription(String key, String idInsc, int approve, String reason) {
        int idI;
        String email;
        if (key == null || idInsc == null
                || key.equals("") || idInsc.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        try {
            try {

                idI = Integer.parseInt(idInsc);


            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);

            if (!InscriptionsTools.isResponsableOfInscription(key, idI))
                return ErrorJSON.serviceRefused("Vous n'avez pas les droits", 1);

            email = AuthsDB.getEmailFromInsc(idI);

            if(InscriptionsTools.approveInscription(idI, approve, email, reason))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }
    }

    public static JSONObject payInscription(String key, String idInsc) {
        int idI;
        String email;
        if (key == null || idInsc == null
                || key.equals("") || idInsc.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        try {
            try {

                idI = Integer.parseInt(idInsc);


            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);


            email = AuthsDB.getEmailFromKey(key);

            if(InscriptionsTools.payInscription(idI, email))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }
    }
    public static JSONObject inviteUser(String key, String email, String idConf, String idType) {
        if (key == null || idConf == null || idType == null || email == null
                || key.equals("") || idConf.equals("") || idType.equals("") || email.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        int idC, idT, idU, idI;
        boolean isEarly;
        try {
            try {

                idC = Integer.parseInt(idConf);
                idT = Integer.parseInt(idType);


            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (UsersTools.existEmail(email))
                return ErrorJSON.serviceRefused("Utilisateur déja existant", 2);

            if (!ConferencesTools.isResponsable(key, idC))
                return ErrorJSON.serviceRefused("Vous n'avez pas les droits", 1);

            idU = UsersTools.inviteUser(email);
            isEarly = ConferencesTools.isEarly(idC);

            idI = InscriptionsTools.addInscription(idU, idC, idT, isEarly);

            if(InscriptionsTools.payInscription(idI, email))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }

    }
}