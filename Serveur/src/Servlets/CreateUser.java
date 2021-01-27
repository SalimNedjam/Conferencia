package Servlets;

import Services.UsersManager;
import Tools.ErrorJSON;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Servlet implementation class HelloWorld
 */
@WebServlet(name = "CreateUser")
public class CreateUser extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String password = request.getParameter("password");
        String email = request.getParameter("mail");
        String nom = request.getParameter("nom");
        String prenom = request.getParameter("prenom");
        String title = request.getParameter("title");
        String institution = request.getParameter("institution");
        String address = request.getParameter("address");
        String zip = request.getParameter("zip");
        String city = request.getParameter("city");
        String country = request.getParameter("country");
        String phone = request.getParameter("phone");
        String operation = request.getParameter("op");
        String key = request.getParameter("key");

        JSONObject json;
        if(operation != null) {
            switch (operation) {
                case "user":
                    json = UsersManager.createUser(password, email, nom, prenom, title, institution, address, zip, city, country, phone);
                    break;
                case "admin":
                    json = UsersManager.inviteAdmin(key, email);
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

}
