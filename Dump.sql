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
-- Table structure for table `Conference_type`
--

DROP TABLE IF EXISTS `Conference_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Conference_type` (
  `id_type` int NOT NULL AUTO_INCREMENT,
  `id_conf` int NOT NULL,
  `nom` varchar(45) NOT NULL,
  `tarif_early` int NOT NULL,
  `tarif_late` int NOT NULL,
  `need_file` tinyint NOT NULL,
  PRIMARY KEY (`id_type`),
  KEY `fk_Conference_type_1_idx` (`id_conf`),
  CONSTRAINT `fk_Conference_type_1` FOREIGN KEY (`id_conf`) REFERENCES `Conferences` (`id_conf`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Conference_type`
--

LOCK TABLES `Conference_type` WRITE;
/*!40000 ALTER TABLE `Conference_type` DISABLE KEYS */;
INSERT INTO `Conference_type` VALUES (7,9,'étudiant',20,30,1),(8,9,'particulier',30,40,0);
/*!40000 ALTER TABLE `Conference_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Conferences`
--

DROP TABLE IF EXISTS `Conferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Conferences` (
  `id_conf` int NOT NULL AUTO_INCREMENT,
  `id_resp` int NOT NULL,
  `nom` varchar(45) NOT NULL,
  `date_clot_early` date NOT NULL,
  `date_conf` date NOT NULL,
  `field_set` int NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id_conf`),
  KEY `fk_Conferences_1_idx` (`id_resp`),
  CONSTRAINT `fk_Conferences_1` FOREIGN KEY (`id_resp`) REFERENCES `Users` (`id_user`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Conferences`
--

LOCK TABLES `Conferences` WRITE;
/*!40000 ALTER TABLE `Conferences` DISABLE KEYS */;
INSERT INTO `Conferences` VALUES (9,32,'Bigdata','2021-01-20','2021-02-18',1023,'');
/*!40000 ALTER TABLE `Conferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Inscriptions`
--

DROP TABLE IF EXISTS `Inscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inscriptions` (
  `id_insc` int NOT NULL AUTO_INCREMENT,
  `id_conf` int NOT NULL,
  `id_type` int NOT NULL,
  `is_early` tinyint NOT NULL,
  `approved` tinyint NOT NULL,
  `paid` tinyint NOT NULL,
  `id_user` int NOT NULL,
  `file` mediumblob,
  PRIMARY KEY (`id_insc`),
  KEY `fk_Inscription_1_idx` (`id_type`),
  KEY `fk_Inscription_2_idx` (`id_conf`),
  KEY `fk_Inscription_3_idx` (`id_user`),
  CONSTRAINT `fk_Inscription_1` FOREIGN KEY (`id_type`) REFERENCES `Conference_type` (`id_type`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `fk_Inscription_2` FOREIGN KEY (`id_conf`) REFERENCES `Conferences` (`id_conf`) ON DELETE CASCADE,
  CONSTRAINT `fk_Inscription_3` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Inscriptions`
--

LOCK TABLES `Inscriptions` WRITE;
/*!40000 ALTER TABLE `Inscriptions` DISABLE KEYS */;
INSERT INTO `Inscriptions` VALUES (12,9,8,0,1,0,33,NULL),(13,9,8,0,1,1,34,NULL);
/*!40000 ALTER TABLE `Inscriptions` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `Session` VALUES (34,'1909a79546094a9db82a0a4b1572ead0','2021-01-28 13:14:47',0),(32,'3a101d8a2c874fda9974aa1b05eb0022','2021-01-20 22:59:00',0),(32,'522cf914cdcb4a9bbcbb500f7e4161b8','2021-01-12 17:51:13',1),(32,'5b796c9fc47d45e9b8d824c6ea4a828e','2021-01-12 17:48:35',0),(32,'5e190d108d8844bcaaf893192a24fb1c','2021-01-12 17:50:56',0),(32,'757d38d55a5b4d4b8ef743fe139d6f43','2021-01-12 17:48:34',0),(32,'b8c41cc54d554c139fa4276f22d644f5','2021-01-19 22:12:35',0),(32,'c519497eb8c34faa8fb52f0ae026f787','2021-01-12 17:52:39',1),(32,'cf2b919123ba45e2aebf98faf485747d','2021-01-12 17:48:29',0),(32,'df19444b333748008ec3342b2987e618','2021-01-18 15:40:03',1),(32,'f1a1f502201542c893ce44cffa7b0277','2021-01-27 18:22:52',0),(32,'f5e03e9851fa48a2ae754539d90d9dd5','2021-01-26 21:26:42',1);
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
INSERT INTO `UserInfos` VALUES (32,'Admin','Admin','Mr','Zdazdaz','Dazdazd','azdazd','Azdazd','Azdazd','azdazdaz'),(33,'Conferencier','Conferencier','Mr','Qsdqs','Dqsd','qsdqs','Qsdqsd','Qsdqsd','qsdqsd'),(34,'NEDJAM','Salim','Prof','Sorbonne université','101 bis rue mouffetard','75005','Paris','France','0698904497');
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
  `is_staff` tinyint(3) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `Mail` (`Mail`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (32,'admin@admin.com',_binary '21232f297a57a5a743894a0e4a801fc3','2021-01-12 17:45:05',002),(33,'eatin.lham02@yandex.com',_binary '21232f297a57a5a743894a0e4a801fc3','2021-01-20 22:14:54',000),(34,'nedjam.t.salim@gmail.com',_binary '21232f297a57a5a743894a0e4a801fc3','2021-01-28 13:10:57',001);
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

-- Dump completed on 2021-02-03 17:24:01
