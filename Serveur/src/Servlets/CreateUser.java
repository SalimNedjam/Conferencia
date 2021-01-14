package Servlets;

import Services.UsersManager;
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

        JSONObject json = UsersManager.createUser(password, email, nom, prenom);
        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }

}
