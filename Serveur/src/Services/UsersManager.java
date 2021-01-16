package Services;

import Tools.ErrorJSON;
import Tools.UsersTools;
import org.json.JSONObject;

import java.sql.Date;
import java.sql.SQLException;
import java.text.SimpleDateFormat;

public class UsersManager {



    public static JSONObject createUser(String password, String email, String nom, String prenom, String title, String institution, String address, String zip, String city, String country, String phone) {
        if (password == null || email == null || nom == null || prenom == null || title == null || institution == null || address == null
                || zip == null || city == null || country == null || phone == null
                || password.equals("") || email.equals("") || nom.equals("") || prenom.equals("") || title.equals("") || institution.equals("")
                || address.equals("") || zip.equals("") || city.equals("") || country.equals("") || phone.equals("") )
            return ErrorJSON.serviceRefused("Erreur arguments", -1);
        try {
            nom = nom.substring(0, 1).toUpperCase() + nom.substring(1).toLowerCase();
            prenom = prenom.substring(0, 1).toUpperCase() + prenom.substring(1).toLowerCase();
            institution = institution.substring(0, 1).toUpperCase() + institution.substring(1).toLowerCase();
            address = address.substring(0, 1).toUpperCase() + address.substring(1).toLowerCase();
            city = city.substring(0, 1).toUpperCase() + city.substring(1).toLowerCase();
            country = country.substring(0, 1).toUpperCase() + country.substring(1).toLowerCase();

        } catch (Exception e) {
            return ErrorJSON.serviceRefused("Mauvais type d'arguments", -1);
        }
        try {
            if (UsersTools.existEmail(email))
                return ErrorJSON.serviceRefused("Utilisateur déja existant", 2);

            if (UsersTools.insertUser(password, email, nom, prenom, title, institution, address, zip, city, country, phone))
                return ErrorJSON.serviceAccepted();
            else
                return ErrorJSON.serviceRefused("Operation impossible ", 15);

        } catch (SQLException e) {
            return ErrorJSON.serviceRefused("SQL ERROR " + e.getMessage(), 1000);
        }

    }
}
