-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: COP4331
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

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
-- Table structure for table `Contacts`
--

DROP TABLE IF EXISTS `Contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Contacts` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Phone` varchar(50) NOT NULL DEFAULT '',
  `Email` varchar(50) NOT NULL DEFAULT '',
  `UserID` int NOT NULL DEFAULT '0',
  `FirstName` varchar(20) DEFAULT NULL,
  `LastName` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_userid` (`UserID`),
  CONSTRAINT `fk_userid` FOREIGN KEY (`UserID`) REFERENCES `Users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=286 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Contacts`
--

LOCK TABLES `Contacts` WRITE;
/*!40000 ALTER TABLE `Contacts` DISABLE KEYS */;
INSERT INTO `Contacts` VALUES (166,'7654321098','emilywhite@example.com',31,'Emily','White'),(193,'420-420-6969','420blazeit@69.com',47,'studdy','more'),(194,'407-000-0000','test@test.com',47,'blah','blah'),(195,'407-000-0000','test@test.com',45,'a','a'),(201,'444-456-7890','johnsmurf@example.com',29,'John','Smith'),(209,'1231231234','example@gmail.com',29,'firstname1','lastname2'),(211,'4072808754','ishan03kp@gmail.com',61,'Ishan','Patel'),(226,'1231231234','example@gmail.com',29,'firstname1','lastname2'),(229,'1231231234','email@gmail.com',29,'Joshua','chappelle'),(231,'1231231234','example@gmail.com',29,'firstname1','lastname2'),(232,'123-456-7890','test@test.com',64,'test','test'),(234,'123-123-1234','asd@asd.com',64,'asd','asd'),(237,'1111111111','Lebron@gmail.com',29,'Lebron','James'),(238,'123-456-7890','johndoe@example.com',29,'John','Smith'),(259,'786-599-9999','cris@gmail.com',65,'cris','gomez'),(263,'111-444-0000','pe@gmail.com',66,'peter','pan'),(264,'1231231234','example@gmail.com',29,'firstname2','lastname2'),(266,'555-555-5555','asdf@fsdf.com',30,'aa','a'),(267,'123-456-7890','jish@phil.com',70,'josh','phill'),(269,'3243242341','hamilton@gmail.com',61,'Mark','Ham'),(274,'123-123-1234','example@gmail.com',76,'first','last2'),(280,'987-654-3210','john.smith@example.com',29,'John','Smith'),(281,'123-456-7890','jane.doe@example.com',29,'Jane','Doe'),(283,'987-654-3210','john.smith@example.com',29,'John','Smith');
/*!40000 ALTER TABLE `Contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `DateCreated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DateLastLoggedIn` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FirstName` varchar(50) NOT NULL DEFAULT '',
  `LastName` varchar(50) NOT NULL DEFAULT '',
  `Login` varchar(50) NOT NULL DEFAULT '',
  `Password` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (29,'2024-09-19 14:46:59','2024-09-19 14:46:59','Test','User','Test','Password'),(30,'2024-09-19 14:47:07','2024-09-19 14:47:07','John','Doe','jdoe','john123'),(31,'2024-09-19 14:47:14','2024-09-19 14:47:14','Jane','Smith','jsmith','jane456'),(32,'2024-09-19 15:03:28','2024-09-19 15:03:28','brandon','stewart','bs','test'),(33,'2024-09-19 19:06:43','2024-09-19 19:06:43','firstname','lastname','username','password'),(34,'2024-09-19 19:13:03','2024-09-19 19:13:03','firstname2','lastname2','username2','password2'),(35,'2024-09-19 19:36:37','2024-09-19 19:36:37','firstname3','lastname3','username3','password3'),(36,'2024-09-19 19:51:23','2024-09-19 19:51:23','firstname4','lastname4','username4','password4'),(37,'2024-09-19 20:08:14','2024-09-19 20:08:14','firstname5','lastname5','username5','password5'),(38,'2024-09-19 20:12:50','2024-09-19 20:12:50','firstname4','lastname4','username4','password4'),(39,'2024-09-19 20:29:59','2024-09-19 20:29:59','firstname5','lastname5','username5','password5'),(40,'2024-09-19 20:45:57','2024-09-19 20:45:57','firstname4','lastname4','username4','password4'),(41,'2024-09-19 21:06:11','2024-09-19 21:06:11','firstname6','lastname6','username6','password6'),(42,'2024-09-19 21:49:46','2024-09-19 21:49:46','firstname7','lastname7','username7','password7'),(43,'2024-09-19 22:44:44','2024-09-19 22:44:44','firstname8','lastname8','username8','password8'),(44,'2024-09-20 20:07:13','2024-09-20 20:07:13','csd','cds','test','test'),(45,'2024-09-20 20:32:00','2024-09-20 20:32:00','a','n','blah','blah'),(46,'2024-09-20 20:43:45','2024-09-20 20:43:45','b','Smith','b','test'),(47,'2024-09-20 23:04:08','2024-09-20 23:04:08','daddy','fixedurcodebucks','studdymore','studdy'),(48,'2024-09-20 23:28:12','2024-09-20 23:28:12','B','S','BS','test'),(49,'2024-09-21 20:38:29','2024-09-21 20:38:29','firstname4','lastname4','username4','password4'),(50,'2024-09-21 21:32:31','2024-09-21 21:32:31','b','Smith','b','test'),(51,'2024-09-21 21:33:57','2024-09-21 21:33:57','firstname4','lastname4','username4','password4'),(52,'2024-09-21 21:42:57','2024-09-21 21:42:57','b','Smith','b','test'),(53,'2024-09-21 21:44:42','2024-09-21 21:44:42','Josh','chappelle','jchappelle','jchappelle'),(54,'2024-09-21 21:45:17','2024-09-21 21:45:17','AA','AAaaaaaa','AAAaaaa','aaaaaa'),(55,'2024-09-21 21:45:33','2024-09-21 21:45:33','Josh','chappelle','jchappelle','jchappelle'),(56,'2024-09-21 21:47:45','2024-09-21 21:47:45','asd','asd','asdasd','asdasd'),(57,'2024-09-21 21:49:02','2024-09-21 21:49:02','asdasd','asdasd','asdasd','asdasd'),(58,'2024-09-21 21:54:03','2024-09-21 21:54:03','asdasd','asda','asdasd','asd'),(59,'2024-09-21 21:58:23','2024-09-21 21:58:23','asdf','asdf','asdf','asdf'),(60,'2024-09-21 22:28:40','2024-09-21 22:28:40','','','',''),(61,'2024-09-21 22:38:58','2024-09-21 22:38:58','Ishan','Patel','Ishan','Patel'),(62,'2024-09-21 22:38:59','2024-09-21 22:38:59','Ishan','Patel','Ishan','Patel'),(63,'2024-09-21 22:38:59','2024-09-21 22:38:59','Ishan','Patel','Ishan','Patel'),(64,'2024-09-21 23:24:25','2024-09-21 23:24:25','deez','nuts','vozzt','abcdefg'),(65,'2024-09-22 02:33:03','2024-09-22 02:33:03','cris','Gomez','cg','cris2002!'),(66,'2024-09-22 18:10:53','2024-09-22 18:10:53','bianca','fr','biancafrantz','meyli'),(67,'2024-09-22 18:10:54','2024-09-22 18:10:54','bianca','fr','biancafrantz','meyli'),(68,'2024-09-22 18:13:09','2024-09-22 18:13:09','skibidi','toilet','skibididotcom','Shepherd1'),(69,'2024-09-22 18:52:24','2024-09-22 18:52:24','Skibidi','Toilet','st01','Shepherd1'),(70,'2024-09-22 18:52:46','2024-09-22 18:52:46','josh','phil','jishdotcom','Shepherd1'),(71,'2024-09-22 18:54:33','2024-09-22 18:54:33','a','a','a','teat'),(72,'2024-09-22 21:02:43','2024-09-22 21:02:43','','','',''),(73,'2024-09-22 21:02:44','2024-09-22 21:02:44','','','',''),(74,'2024-09-22 21:02:44','2024-09-22 21:02:44','','','',''),(75,'2024-09-22 21:02:44','2024-09-22 21:02:44','','','',''),(76,'2024-09-23 00:19:31','2024-09-23 00:19:31','first','last','user','password'),(77,'2024-09-23 00:31:16','2024-09-23 00:31:16','b','Smith','b','test'),(78,'2024-09-23 00:37:15','2024-09-23 00:37:15','b','Smith','b','test'),(79,'2024-09-23 01:05:33','2024-09-23 01:05:33','first2','last2','user2','pass2'),(80,'2024-09-23 01:05:35','2024-09-23 01:05:35','first2','last2','user2','pass2'),(81,'2024-09-23 01:09:47','2024-09-23 01:09:47','first3','last3','user3','pass3'),(82,'2024-09-23 01:10:28','2024-09-23 01:10:28','new','user','newuser','newpass'),(83,'2024-09-23 01:14:47','2024-09-23 01:14:47','first4','last4','user4','pass4'),(84,'2024-09-23 01:15:27','2024-09-23 01:15:27','first5','last5','user5','password5'),(85,'2024-09-23 01:15:29','2024-09-23 01:15:29','first5','last5','user5','password5'),(86,'2024-09-23 01:18:20','2024-09-23 01:18:20','first5','last5','user5','pass5'),(87,'2024-09-23 01:20:34','2024-09-23 01:20:34','first7','last7','user7','pass7'),(88,'2024-09-23 01:24:59','2024-09-23 01:24:59','first8','last8','user8','pass8');
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

-- Dump completed on 2024-09-23 16:47:53
