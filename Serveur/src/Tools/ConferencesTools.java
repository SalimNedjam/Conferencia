
package Tools;

        import BDs.ConferencesDB;
        import org.json.JSONArray;
        import org.json.JSONException;
        import org.json.JSONObject;

        import java.sql.Date;
        import java.sql.SQLException;
        import java.util.List;

public class ConferencesTools {



    public static JSONObject addConference(int id, String[] types, String nom, Date dateClotEarly, Date dateConf, int fieldSet, String description) throws SQLException, JSONException {

        return ConferencesDB.addConference(id, types, nom, dateClotEarly, dateConf, fieldSet, description);
    }


    public static boolean isResponsable(String key, int idC) throws SQLException {

        return ConferencesDB.isResponsable(key, idC);
    }


    public static JSONArray getAllConference() throws SQLException, JSONException {
        return ConferencesDB.getAllConference();

    }

    public static JSONObject getConferenceById(int idC) throws SQLException, JSONException {
        return ConferencesDB.getConferenceById(idC);

    }

    public static boolean isConfValid(int idConf) throws SQLException{
        return ConferencesDB.isConfValid(idConf);

    }
    public static boolean isEarly(int idConf) throws SQLException{
        return ConferencesDB.isEarly(idConf);

    }


}
