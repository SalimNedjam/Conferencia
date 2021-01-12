package Tools;

import BDs.DBStatic;


import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.TimeZone;

public class Database {
    public static Database database;
    private DataSource dataSource;

    private Database(String jndiname) throws SQLException {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            dataSource = (DataSource) new InitialContext().lookup("java:comp/env/" + jndiname);
        } catch (NamingException e) {
            throw new SQLException(jndiname + " is missing in JNDI! : " + e.getMessage());
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }



    public static Connection getMySQLConnection() throws SQLException {
        if (!DBStatic.mysql_pooling) {
            try {
                Class.forName("com.mysql.jdbc.Driver");
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
            return DriverManager.getConnection(
                    "jdbc:mysql://" + DBStatic.mysql_host + "/" + DBStatic.mysql_db + "?serverTimezone=" + TimeZone.getDefault().getID(), DBStatic.mysql_username,
                    DBStatic.mysql_password);
        } else {
            if (database == null) {
                database = new Database("jdbc/Nedjam_AitGhezali");
            }
            return (database.getConnection());
        }
    }

    private Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

}
