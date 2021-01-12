package Servlets;

import Services.AuthsManager;
import org.json.JSONObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


@WebServlet(name = "Reset")
public class Reset extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String login = request.getParameter("login");
        String password = request.getParameter("password");
        String newPassword = request.getParameter("newPassword");
        JSONObject json = AuthsManager.changePassword(login, password, newPassword);

        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String email = request.getParameter("email");


        JSONObject json = AuthsManager.recoverPassword(email);

        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }

}
