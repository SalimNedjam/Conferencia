-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: project
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Session`
--

DROP TABLE IF EXISTS `Session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Session` (
  `id_user` int DEFAULT NULL,
  `key_session` varchar(64) NOT NULL,
  `date_session` timestamp NULL DEFAULT NULL,
  `root` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`key_session`),
  KEY `id_user_session` (`id_user`),
  CONSTRAINT `id_user_session` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES (32,'522cf914cdcb4a9bbcbb500f7e4161b8','2021-01-12 17:51:13',1),(32,'5b796c9fc47d45e9b8d824c6ea4a828e','2021-01-12 17:48:35',0),(32,'5e190d108d8844bcaaf893192a24fb1c','2021-01-12 17:50:56',0),(32,'757d38d55a5b4d4b8ef743fe139d6f43','2021-01-12 17:48:34',0),(32,'c519497eb8c34faa8fb52f0ae026f787','2021-01-12 17:52:39',1),(32,'cf2b919123ba45e2aebf98faf485747d','2021-01-12 17:48:29',0);
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserInfos`
--

DROP TABLE IF EXISTS `UserInfos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserInfos` (
  `id_user` int NOT NULL,
  `nom` varchar(32) DEFAULT NULL,
  `prenom` varchar(32) DEFAULT NULL,
  `title` varchar(10) DEFAULT NULL,
  `institution` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `zip` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `id_user` (`id_user`),
  CONSTRAINT `id_user_info` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserInfos`
--

LOCK TABLES `UserInfos` WRITE;
/*!40000 ALTER TABLE `UserInfos` DISABLE KEYS */;
INSERT INTO `UserInfos` VALUES (20,'Nom','Prenom','Mr','Sorbonne','Rue','75000','Paris','France','0666666666'),(32,'Azdazda','Dazdzad','sada','Zdazdaz','Dazdazd','azdazd','Azdazd','Azdazd','azdazdaz');
/*!40000 ALTER TABLE `UserInfos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `Mail` varchar(32) DEFAULT NULL,
  `Password` blob,
  `date_create` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `Mail` (`Mail`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (20,'nedjam.t.salim@gmail.com',_binary '5f4dcc3b5aa765d61d8327deb882cf99','2021-01-11 12:07:38'),(32,'eatin.lham01@yandex.com',_binary '21232f297a57a5a743894a0e4a801fc3','2021-01-12 17:45:05');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-12 20:38:53
