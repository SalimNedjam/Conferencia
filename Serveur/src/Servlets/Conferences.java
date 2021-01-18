package Servlets;

import Services.ConferencesManager;
import Tools.ErrorJSON;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "Conferences")
public class Conferences extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String operation = request.getParameter("op");
        String nom = request.getParameter("nom");
        String field_set = request.getParameter("field_set");

        String dateClotEarly = request.getParameter("date_clot_early");
        String dateConf = request.getParameter("date_conf");
        String idConf = request.getParameter("id_conf");
        String tarifEarly = request.getParameter("tarif_early");
        String tarifLate = request.getParameter("tarif_late");

        String key = request.getParameter("key");
        JSONObject json;
        if(operation != null) {
            switch (operation) {
                case "conf":
                    json = ConferencesManager.addConference(key, nom, dateClotEarly, dateConf, field_set);
                    break;
                case "type":
                    json = ConferencesManager.addTypeConference(key, idConf, nom, tarifEarly, tarifLate);
                    break;
                default:
                    json = ErrorJSON.serviceRefused("Undifined Operation", 5);
                    break;
            }

        }else {
            json = ErrorJSON.serviceRefused("Undifined Operation", 5);
        }
        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String key = request.getParameter("key");
        String idConf = request.getParameter("id_conf");

        JSONObject json;
        if(idConf != null && !idConf.equals(""))
            json= ConferencesManager.getConferenceById(key, idConf);
        else
            json = ConferencesManager.getAllConference(key);

        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);

    }


}