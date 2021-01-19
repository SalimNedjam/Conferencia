
package Tools;

import BDs.ConferencesDB;
import BDs.InscriptionsDB;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.Date;
import java.sql.SQLException;

public class InscriptionsTools {



    public static Boolean addInscription(String key, int idC, int idT, boolean isEarly)  throws SQLException {

        return InscriptionsDB.addInscription(key, idC, idT, isEarly);
    }


    public static JSONArray getAllInscriptions(int idC) throws SQLException, JSONException {
        return InscriptionsDB.getAllInscriptions(idC);

    }

    public static JSONArray getInscriptionsByUser(String key)  throws SQLException, JSONException {
        return InscriptionsDB.getInscriptionsByUser(key);

    }
    public static boolean isResponsableOfInscription(String key, int idI)  throws SQLException {
        return InscriptionsDB.isResponsableOfInscription(key, idI);

    }

    public static boolean approveInscription(int idI, int approve)   throws SQLException {
        return InscriptionsDB.approveInscription(idI, approve);

    }
}
