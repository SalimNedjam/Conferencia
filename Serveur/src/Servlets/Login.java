package Servlets;

import Services.AuthsManager;
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
@WebServlet(name = "Login")
public class Login extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String user = request.getParameter("user");
        String password = request.getParameter("password");
        String key = request.getParameter("key");
        String root = request.getParameter("root");
        String idUser = request.getParameter("idUser");



        JSONObject json;
        if (idUser != null)
            json = AuthsManager.getInfosFromId(key, idUser);
        else if (key != null)
            json = AuthsManager.getInfos(key);
        else if (password != null)
            json = AuthsManager.doLogin(user, password, root);
        else json = null;
        response.setContentType(" text / json ");
        PrintWriter out = response.getWriter();
        out.println(json);
    }


}
