package Servlets;

import Services.AuthsManager;
import Services.InscriptionsManager;
import Services.UsersManager;
import Tools.ErrorJSON;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * Servlet implementation class HelloWorld
 */
@WebServlet(name = "UserInfos")
public class UserInfos extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String key = request.getParameter("key");
        String operation = request.getParameter("op");
        String oldPassword = request.getParameter("oldPassword");
        String password = request.getParameter("password");
        String nom = request.getParameter("nom");
        String prenom = request.getParameter("prenom");
        String title = request.getParameter("title");
        String institution = request.getParameter("institution");
        String address = request.getParameter("address");
        String zip = request.getParameter("zip");
        String city = request.getParameter("city");
        String country = request.getParameter("country");
        String phone = request.getParameter("phone");
        JSONObject json;
        if(operation != null) {
            switch (operation) {
                case "password":
                    json = AuthsManager.changePassword(key, oldPassword, password);
                    break;
                case "info":
                    json = UsersManager.updateUser(key, nom, prenom, title, institution, address, zip, city, country, phone);
                    break;

                default:
                    json = ErrorJSON.serviceRefused("Undefined Operation", 5);
                    break;
            }

        }else {
            json = ErrorJSON.serviceRefused("Undefined Operation", 6);
        }
        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String key = request.getParameter("key");
        String idUser = request.getParameter("idUser");

        JSONObject json;
        if (idUser != null && key != null)
            json = AuthsManager.getInfosFromId(key, idUser);
        else json = null;
        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);

    }


}
