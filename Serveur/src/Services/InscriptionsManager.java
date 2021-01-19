package Services;

import Tools.AuthsTools;
import Tools.ConferencesTools;
import Tools.ErrorJSON;
import Tools.InscriptionsTools;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Date;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

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

            if(InscriptionsTools.addInscription(key, idC, idT, isEarly))
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

            return new JSONObject().put("Inscriptions", InscriptionsTools.getAllInscriptions(idC));

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


            return new JSONObject().put("Inscriptions", InscriptionsTools.getInscriptionsByUser(key));

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }

    public static JSONObject approveInscription(String key, String idInsc, int approve) {
        int idI;
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


            if(InscriptionsTools.approveInscription(idI, approve))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Problem du serveur", 2);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }
    }
}