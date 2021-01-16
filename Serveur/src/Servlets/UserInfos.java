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
@WebServlet(name = "UserInfos")
public class UserInfos extends HttpServlet {
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
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
