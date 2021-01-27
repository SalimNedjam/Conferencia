package Servlets;

import Services.InscriptionsManager;
import Services.UsersManager;
import Tools.ErrorJSON;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "Inscriptions")
public class Inscriptions extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idConf = request.getParameter("id_conf");
        String idType = request.getParameter("id_type");
        String operation = request.getParameter("op");
        String idInsc = request.getParameter("id_insc");
        String reason = request.getParameter("reason");
        String email = request.getParameter("email");
        String prepayed = request.getParameter("prepayed");

        String key = request.getParameter("key");
        JSONObject json;

        if(operation != null) {
            switch (operation) {
                case "subscribe":
                    json = InscriptionsManager.addInscription(key, idConf, idType);
                    break;
                case "approve":
                    json = InscriptionsManager.approveInscription(key, idInsc, 1, reason);
                    break;
                case "disapprove":
                    json = InscriptionsManager.approveInscription(key, idInsc, 2, reason);
                    break;
                case "pay":
                    json = InscriptionsManager.payInscription(key, idInsc);
                    break;
                case "invite":
                    json = InscriptionsManager.inviteUser(key, email, idConf, idType, prepayed);
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
            json= InscriptionsManager.getAllInscriptions(key, idConf);
        else
            json= InscriptionsManager.getInscriptionsByUser(key);

        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);

    }


}