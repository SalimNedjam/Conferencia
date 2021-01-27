package Services;

        import Tools.AuthsTools;
        import Tools.ConferencesTools;
        import Tools.ErrorJSON;

        import org.json.JSONException;
        import org.json.JSONObject;

        import java.sql.Date;
        import java.sql.SQLException;
        import java.text.SimpleDateFormat;

        import static Tools.AuthsTools.getIdFromEmail;

public class ConferencesManager {

    public static JSONObject addConference(String key, String[] types, String nom, String dateClotEarly, String dateConf, String field_set, String description, String email) {
        Date date_clot_early, date_conf;
        int fieldSet;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        if (key == null || nom == null || dateClotEarly == null || dateConf == null || field_set == null || email == null
                || key.equals("") || nom.equals("") || dateClotEarly.equals("") || dateConf.equals("") || field_set.equals("") || email.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        try {
            try {
                nom = nom.substring(0, 1).toUpperCase() + nom.substring(1).toLowerCase();
                if (description == null) {
                    description = "";
                }

                date_clot_early = new Date(sdf.parse(dateClotEarly).getTime());
                date_conf = new Date(sdf.parse(dateConf).getTime());
                fieldSet = Integer.parseInt(field_set);

            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);
            if (!AuthsTools.isStaff(key))
                return ErrorJSON.serviceRefused("Vous n'avez pas les droits", 1);

            int resp_id = getIdFromEmail(email);
            if (resp_id == -1) {
                return ErrorJSON.serviceRefused("Utilisateur " + email + " inexistant", 2);
            }

            return ConferencesTools.addConference(resp_id, types, nom, date_clot_early, date_conf, fieldSet, description);


        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        } catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }


    public static JSONObject getAllConference(String key) {

        if (key == null || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);


        try {
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);

            return new JSONObject().put("conferences", ConferencesTools.getAllConference());
        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }
    public static JSONObject getConferenceById(String key, String id_conf) {
        int idC;

        if (key == null || id_conf == null || id_conf.equals("") || key.equals(""))
            return ErrorJSON.serviceRefused("Erreur arguments", -1);


        try {
            try {
                idC = Integer.parseInt(id_conf);
            } catch (Exception e) {
                return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
            }
            if (!AuthsTools.isKeyValid(key))
                return ErrorJSON.serviceRefused("Clé invalide", 1);

            return ConferencesTools.getConferenceById(idC);
        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }catch (JSONException e) {
            return ErrorJSON.serviceRefused("JSON ERROR " + e.getMessage(), 100);
        }
    }


}