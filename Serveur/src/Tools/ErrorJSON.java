package Tools;


import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class ErrorJSON {

    public static JSONObject serviceRefused(String message, int codeErreur) {
        try {
            JSONObject json = new JSONObject();
            json.put("code", codeErreur);
            json.put("message", message);
            return json;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static JSONObject serviceAccepted() {
        try {
            JSONObject json = new JSONObject();
            json.put("state", "OK");
            return json;
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }


    public static JSONObject ListIdToJSON(List<Integer> listid) {

        try {
            JSONObject jsonObject = new JSONObject();
            int i = 1;
            for (int id : listid) {
                jsonObject.put(i + "", new JSONObject().put("id_user", id));
                i++;
            }
            return jsonObject;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }

    }
}
