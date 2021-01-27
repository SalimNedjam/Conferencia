package Servlets;

import Services.InscriptionsManager;
import Services.UsersManager;
import Tools.ErrorJSON;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

@WebServlet(name = "Inscriptions")
@MultipartConfig( fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 5 * 5 )
public class Inscriptions extends HttpServlet {

    private String extractFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        for (String s : items) {
            if (s.trim().startsWith("filename")) {
                return s.substring(s.indexOf("=") + 2, s.length() - 1);
            }
        }
        return "";
    }
    public static final String JUSTIFICATIFS_FOLDER = "Justificatifs";

    public String uploadPath = JUSTIFICATIFS_FOLDER;
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String idConf = request.getParameter("id_conf");
        String idType = request.getParameter("id_type");
        String operation = request.getParameter("op");
        String idInsc = request.getParameter("id_insc");
        String reason = request.getParameter("reason");
        String email = request.getParameter("email");
        String isPaid = request.getParameter("paid");

        String key = request.getParameter("key");

        JSONObject json;
        InputStream inputStream = null; // input stream of the upload file
        Part filePart = request.getPart("file");
        if (filePart != null) {
            System.out.println(filePart.getName());
            System.out.println(filePart.getSize());
            System.out.println(filePart.getContentType());
            inputStream = filePart.getInputStream();
        }

        if(operation != null) {
            switch (operation) {
                case "subscribe":
                    json = InscriptionsManager.addInscription(key, idConf, idType, inputStream);
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
                    json = InscriptionsManager.inviteUser(key, email, idConf, idType, isPaid);
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