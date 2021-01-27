
package Tools;

import BDs.InscriptionsDB;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.InputStream;
import java.sql.SQLException;

public class InscriptionsTools {



    public static int addInscription(int id_user, int idC, int idT, boolean isEarly, InputStream inputStream)  throws SQLException {

        return InscriptionsDB.addInscription(id_user, idC, idT, isEarly,inputStream);
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

    public static boolean approveInscription(int idI, int approve, String email, String reason)   throws SQLException {
        if(approve == 1)
            return InscriptionsDB.approveInscription(idI, email);
        else
            return InscriptionsDB.disapproveInscription(idI, email, reason);

    }


    public static boolean payInscription(int idI, String email)   throws SQLException {
        return InscriptionsDB.payInscription(idI, email);

    }

}
