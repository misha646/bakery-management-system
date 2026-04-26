CREATE DATABASE  IF NOT EXISTS `testbms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `testbms`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: testbms
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',3,'add_permission'),(6,'Can change permission',3,'change_permission'),(7,'Can delete permission',3,'delete_permission'),(8,'Can view permission',3,'view_permission'),(9,'Can add group',2,'add_group'),(10,'Can change group',2,'change_group'),(11,'Can delete group',2,'delete_group'),(12,'Can view group',2,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add branch mst',6,'add_branchmst'),(22,'Can change branch mst',6,'change_branchmst'),(23,'Can delete branch mst',6,'delete_branchmst'),(24,'Can view branch mst',6,'view_branchmst'),(25,'Can add category mst',7,'add_categorymst'),(26,'Can change category mst',7,'change_categorymst'),(27,'Can delete category mst',7,'delete_categorymst'),(28,'Can view category mst',7,'view_categorymst'),(29,'Can add city mst',8,'add_citymst'),(30,'Can change city mst',8,'change_citymst'),(31,'Can delete city mst',8,'delete_citymst'),(32,'Can view city mst',8,'view_citymst'),(33,'Can add product mst',9,'add_productmst'),(34,'Can change product mst',9,'change_productmst'),(35,'Can delete product mst',9,'delete_productmst'),(36,'Can view product mst',9,'view_productmst'),(37,'Can add state mst',10,'add_statemst'),(38,'Can change state mst',10,'change_statemst'),(39,'Can delete state mst',10,'delete_statemst'),(40,'Can view state mst',10,'view_statemst'),(41,'Can add user mst',11,'add_usermst'),(42,'Can change user mst',11,'change_usermst'),(43,'Can delete user mst',11,'delete_usermst'),(44,'Can view user mst',11,'view_usermst'),(45,'Can add Token',12,'add_token'),(46,'Can change Token',12,'change_token'),(47,'Can delete Token',12,'delete_token'),(48,'Can view Token',12,'view_token'),(49,'Can add Token',13,'add_tokenproxy'),(50,'Can change Token',13,'change_tokenproxy'),(51,'Can delete Token',13,'delete_tokenproxy'),(52,'Can view Token',13,'view_tokenproxy'),(53,'Can add inventory mst',14,'add_inventorymst'),(54,'Can change inventory mst',14,'change_inventorymst'),(55,'Can delete inventory mst',14,'delete_inventorymst'),(56,'Can view inventory mst',14,'view_inventorymst'),(57,'Can add session',15,'add_session'),(58,'Can change session',15,'change_session'),(59,'Can delete session',15,'delete_session'),(60,'Can view session',15,'view_session'),(61,'Can add order mst',17,'add_ordermst'),(62,'Can change order mst',17,'change_ordermst'),(63,'Can delete order mst',17,'delete_ordermst'),(64,'Can view order mst',17,'view_ordermst'),(65,'Can add order item',16,'add_orderitem'),(66,'Can change order item',16,'change_orderitem'),(67,'Can delete order item',16,'delete_orderitem'),(68,'Can view order item',16,'view_orderitem'),(69,'Can add product recipe',18,'add_productrecipe'),(70,'Can change product recipe',18,'change_productrecipe'),(71,'Can delete product recipe',18,'delete_productrecipe'),(72,'Can view product recipe',18,'view_productrecipe'),(73,'Can add customer mst',19,'add_customermst'),(74,'Can change customer mst',19,'change_customermst'),(75,'Can delete customer mst',19,'delete_customermst'),(76,'Can view customer mst',19,'view_customermst'),(77,'Can add inventory mst',20,'add_inventorymst'),(78,'Can change inventory mst',20,'change_inventorymst'),(79,'Can delete inventory mst',20,'delete_inventorymst'),(80,'Can view inventory mst',20,'view_inventorymst'),(81,'Can add issue mst',21,'add_issuemst'),(82,'Can change issue mst',21,'change_issuemst'),(83,'Can delete issue mst',21,'delete_issuemst'),(84,'Can view issue mst',21,'view_issuemst'),(85,'Can add item mst',22,'add_itemmst'),(86,'Can change item mst',22,'change_itemmst'),(87,'Can delete item mst',22,'delete_itemmst'),(88,'Can view item mst',22,'view_itemmst'),(89,'Can add order detail',23,'add_orderdetail'),(90,'Can change order detail',23,'change_orderdetail'),(91,'Can delete order detail',23,'delete_orderdetail'),(92,'Can view order detail',23,'view_orderdetail'),(93,'Can add order mst',24,'add_ordermst'),(94,'Can change order mst',24,'change_ordermst'),(95,'Can delete order mst',24,'delete_ordermst'),(96,'Can view order mst',24,'view_ordermst'),(97,'Can add production mst',25,'add_productionmst'),(98,'Can change production mst',25,'change_productionmst'),(99,'Can delete production mst',25,'delete_productionmst'),(100,'Can view production mst',25,'view_productionmst'),(101,'Can add production plan',26,'add_productionplan'),(102,'Can change production plan',26,'change_productionplan'),(103,'Can delete production plan',26,'delete_productionplan'),(104,'Can view production plan',26,'view_productionplan'),(105,'Can add raw material mst',27,'add_rawmaterialmst'),(106,'Can change raw material mst',27,'change_rawmaterialmst'),(107,'Can delete raw material mst',27,'delete_rawmaterialmst'),(108,'Can view raw material mst',27,'view_rawmaterialmst'),(109,'Can add recipe mst',28,'add_recipemst'),(110,'Can change recipe mst',28,'change_recipemst'),(111,'Can delete recipe mst',28,'delete_recipemst'),(112,'Can view recipe mst',28,'view_recipemst'),(113,'Can add supplier mst',29,'add_suppliermst'),(114,'Can change supplier mst',29,'change_suppliermst'),(115,'Can delete supplier mst',29,'delete_suppliermst'),(116,'Can view supplier mst',29,'view_suppliermst'),(117,'Can add unit mst',30,'add_unitmst'),(118,'Can change unit mst',30,'change_unitmst'),(119,'Can delete unit mst',30,'delete_unitmst'),(120,'Can view unit mst',30,'view_unitmst');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1200000$tAZKThQwUUXIMHv476GyqI$ykEossVGhbL0kLNegGBKi+DmsYTbJoGFrT0+7IUBcck=','2026-03-07 10:43:40.484911',1,'admin','','','admin@bakery.in',1,1,'2026-03-07 09:59:33.905426');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authtoken_token`
--

DROP TABLE IF EXISTS `authtoken_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`key`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `authtoken_token_user_id_fk_user_mst_user_id` FOREIGN KEY (`user_id`) REFERENCES `user_mst` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authtoken_token`
--

LOCK TABLES `authtoken_token` WRITE;
/*!40000 ALTER TABLE `authtoken_token` DISABLE KEYS */;
INSERT INTO `authtoken_token` VALUES ('45ccf84655a619e2e0dfe15d1672936d0d129f3c','2026-03-26 05:43:35.263395',3),('9cf047392f431dae86522290054d519438f3f0f9','2026-03-26 05:44:38.862706',4),('d5ca41f840f303c7cba821afeec4f2cc7d9b1989','2026-03-25 19:20:13.969430',1),('f083c49adc4e356a962712eadc9512b6db3e9c2c','2026-03-26 05:43:06.417415',2);
/*!40000 ALTER TABLE `authtoken_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_mst`
--

DROP TABLE IF EXISTS `branch_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_mst` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) DEFAULT NULL,
  `fk_city_id` int NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phone_number1` varchar(15) NOT NULL,
  `phone_number2` varchar(15) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `manager_user_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`branch_id`),
  KEY `fk_city_id` (`fk_city_id`),
  CONSTRAINT `branch_mst_ibfk_1` FOREIGN KEY (`fk_city_id`) REFERENCES `city_mst` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_mst`
--

LOCK TABLES `branch_mst` WRITE;
/*!40000 ALTER TABLE `branch_mst` DISABLE KEYS */;
INSERT INTO `branch_mst` VALUES (1,'CG Road Branch',1,'CG Road, Navrangpura, Ahmedabad','+91 9123456789','+91 07926441234',1,2,'2026-03-11 20:17:24','2026-04-04 00:03:10'),(2,'Sindhu Bhavan Branch',1,'Sindhu Bhavan Road, Bodakdev, Ahmedabad','+91 9234567890','+91 07940051234',1,5,'2026-03-13 14:57:47','2026-04-04 00:03:10'),(3,'KANKARIYA BRANCH',1,'PUSHPAKUNJ, KANKARIYA - AHMEDABAD','+91 9345678901','+91 07940052734',1,NULL,'2026-03-24 14:39:00','2026-04-04 00:03:10'),(4,'Bopal',1,'Ghuma road, Bopal, Ahmedabad','+91 7899653680',NULL,1,NULL,'2026-04-04 07:43:33','2026-04-04 10:00:52');
/*!40000 ALTER TABLE `branch_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_branch_map`
--

DROP TABLE IF EXISTS `category_branch_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_branch_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  KEY `category_branch_map_ibfk_1` (`category_id`),
  CONSTRAINT `category_branch_map_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category_mst` (`category_id`) ON DELETE CASCADE,
  CONSTRAINT `category_branch_map_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_branch_map`
--

LOCK TABLES `category_branch_map` WRITE;
/*!40000 ALTER TABLE `category_branch_map` DISABLE KEYS */;
INSERT INTO `category_branch_map` VALUES (4,2,1),(5,2,2),(6,2,3),(7,3,1),(8,3,2),(9,3,3),(13,5,1),(14,5,2),(15,6,2),(16,6,3),(17,7,1),(18,7,3),(41,4,1),(42,4,2),(43,4,3),(44,8,1),(45,8,2),(46,8,3),(66,1,1),(67,1,2),(68,1,3),(77,9,1),(78,9,2),(79,9,3),(80,9,4);
/*!40000 ALTER TABLE `category_branch_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_mst`
--

DROP TABLE IF EXISTS `category_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_mst` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `category_code` varchar(25) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_branch_id` int DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`),
  UNIQUE KEY `category_code` (`category_code`),
  KEY `fk_category_branch` (`fk_branch_id`),
  CONSTRAINT `fk_category_branch` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_mst`
--

LOCK TABLES `category_mst` WRITE;
/*!40000 ALTER TABLE `category_mst` DISABLE KEYS */;
INSERT INTO `category_mst` VALUES (1,'Breads','BRD',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(2,'Cookies','COO',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(3,'Pastries','PAS',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(4,'Cakes','CAK',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(5,'Savory','SAV',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(6,'Specials','SPC',NULL,1,'2026-03-15 16:58:00','2026-03-15 16:58:00',NULL),(7,'Pizza','PZA',NULL,1,'2026-03-24 19:20:16','2026-03-24 19:20:16',NULL),(8,'Add-ons','ADN',NULL,1,'2026-03-29 14:24:04','2026-03-29 14:24:04',NULL),(9,'Decorative','DRT',NULL,1,'2026-04-04 16:26:50','2026-04-04 16:26:50',NULL);
/*!40000 ALTER TABLE `category_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city_mst`
--

DROP TABLE IF EXISTS `city_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city_mst` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `city_name` varchar(50) NOT NULL,
  `fk_state_id` int NOT NULL,
  PRIMARY KEY (`city_id`),
  KEY `fk_state_id` (`fk_state_id`),
  CONSTRAINT `city_mst_ibfk_1` FOREIGN KEY (`fk_state_id`) REFERENCES `state_mst` (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city_mst`
--

LOCK TABLES `city_mst` WRITE;
/*!40000 ALTER TABLE `city_mst` DISABLE KEYS */;
INSERT INTO `city_mst` VALUES (1,'Ahemdabad',1),(2,'Surat',1),(3,'Palanpur',1),(4,'Jaipur',3),(5,'Udaipur',3),(6,'Jodhpur',3),(7,'Pune',2),(8,'Mumbai',2);
/*!40000 ALTER TABLE `city_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_mst`
--

DROP TABLE IF EXISTS `customer_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_mst` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(50) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `fk_branch_id` int NOT NULL,
  PRIMARY KEY (`customer_id`),
  KEY `fk_cust_branch` (`fk_branch_id`),
  CONSTRAINT `fk_cust_branch` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_mst`
--

LOCK TABLES `customer_mst` WRITE;
/*!40000 ALTER TABLE `customer_mst` DISABLE KEYS */;
INSERT INTO `customer_mst` VALUES (1,'Ramesh Kumar Jha','+919876543210',1),(2,'Aarav Patel','+919825012345',1),(3,'Deepali Shah','+919909054321',1),(4,'Rajesh Varma','+919724011223',1),(5,'Priya Sharma','+919812345678',2),(6,'Ishaan Mehta','+919724098765',2),(7,'Zoya Pathan','+919898011223',2),(8,'Kavita Iyer','+919426055443',2),(9,'Neha Joshi','+911212343456',1),(10,'Smita','+919879871010',1),(11,'Takshvi','+918945238956',1);
/*!40000 ALTER TABLE `customer_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(6,'api','branchmst'),(7,'api','categorymst'),(8,'api','citymst'),(19,'api','customermst'),(20,'api','inventorymst'),(21,'api','issuemst'),(22,'api','itemmst'),(23,'api','orderdetail'),(24,'api','ordermst'),(25,'api','productionmst'),(26,'api','productionplan'),(9,'api','productmst'),(27,'api','rawmaterialmst'),(28,'api','recipemst'),(10,'api','statemst'),(29,'api','suppliermst'),(30,'api','unitmst'),(11,'api','usermst'),(2,'auth','group'),(3,'auth','permission'),(4,'auth','user'),(12,'authtoken','token'),(13,'authtoken','tokenproxy'),(5,'contenttypes','contenttype'),(14,'inventory','inventorymst'),(18,'inventory','productrecipe'),(16,'orders','orderitem'),(17,'orders','ordermst'),(15,'sessions','session');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2026-03-07 09:16:00.028078'),(2,'auth','0001_initial','2026-03-07 09:16:00.738380'),(3,'admin','0001_initial','2026-03-07 09:16:01.028638'),(4,'admin','0002_logentry_remove_auto_add','2026-03-07 09:16:01.043569'),(5,'admin','0003_logentry_add_action_flag_choices','2026-03-07 09:16:01.058563'),(8,'api','0001_initial','2026-03-07 09:18:34.092512'),(9,'api','0002_delete_authgroup_delete_authgrouppermissions_and_more','2026-03-07 09:18:34.111009'),(10,'api','0003_remove_branchmst_created_at_and_more','2026-03-07 09:57:09.064666'),(11,'contenttypes','0002_remove_content_type_name','2026-03-07 09:57:16.913785'),(12,'auth','0002_alter_permission_name_max_length','2026-03-07 09:57:17.011081'),(13,'auth','0003_alter_user_email_max_length','2026-03-07 09:57:17.041633'),(14,'auth','0004_alter_user_username_opts','2026-03-07 09:57:17.052565'),(15,'auth','0005_alter_user_last_login_null','2026-03-07 09:57:17.197859'),(16,'auth','0006_require_contenttypes_0002','2026-03-07 09:57:17.205129'),(17,'auth','0007_alter_validators_add_error_messages','2026-03-07 09:57:17.215403'),(18,'auth','0008_alter_user_username_max_length','2026-03-07 09:57:17.300690'),(19,'auth','0009_alter_user_last_name_max_length','2026-03-07 09:57:17.388726'),(20,'auth','0010_alter_group_name_max_length','2026-03-07 09:57:17.412876'),(21,'auth','0011_update_proxy_permissions','2026-03-07 09:57:17.429653'),(22,'auth','0012_alter_user_first_name_max_length','2026-03-07 09:57:17.514286'),(23,'authtoken','0001_initial','2026-03-07 09:57:17.627733'),(24,'authtoken','0002_auto_20160226_1747','2026-03-07 09:57:17.657262'),(25,'authtoken','0003_tokenproxy','2026-03-07 09:57:17.662357'),(26,'authtoken','0004_alter_tokenproxy_options','2026-03-07 09:57:17.670627'),(27,'inventory','0001_initial','2026-03-07 09:57:17.703032'),(28,'inventory','0002_alter_inventorymst_options_and_more','2026-03-07 09:58:06.520468'),(29,'orders','0001_initial','2026-03-07 09:58:26.433077'),(30,'sessions','0001_initial','2026-03-07 09:58:26.495853'),(31,'inventory','0003_alter_inventorymst_options_and_more','2026-03-10 14:55:20.519058'),(32,'api','0004_customermst_inventorymst_issuemst_itemmst_and_more','2026-03-22 06:17:12.412398'),(33,'api','0005_alter_branchmst_table_alter_categorymst_table_and_more','2026-03-25 19:16:50.012736');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('4eksvkb11l26ygigvyj4xq7ed5ivmzl9','.eJxVi7EKwjAQQP_lZilJvKR3Hd0dncM1uSNFEGnaSfx3ETro-N7jvSDLvrW8d13zUmGCAKdfN0u56-Mb5LkMB_Xh1nW99u1y1L-lSW8wgaqOY2Sq0SWMcQ54rubJNFQST9XMlTCjF5HkuAgzIRcuaBQxGcP7A5GeMtE:1w3vDr:L81YatAJ2CSV1EcgbSYWWLAbaDj73aS_-DzI5q4SpjQ','2026-04-04 12:14:31.043339'),('8czgxv5zi4wjwcq8ggrcfb39vg7vopop','.eJxVi7EKwjAQQP_lZilJvKR3Hd0dncM1uSNFEGnaSfx3ETro-N7jvSDLvrW8d13zUmGCAKdfN0u56-Mb5LkMB_Xh1nW99u1y1L-lSW8wgaqOY2Sq0SWMcQ54rubJNFQST9XMlTCjF5HkuAgzIRcuaBQxGcP7A5GeMtE:1w3vE8:BkKPcbwWUS2PQhyIYx_I0enEUe9IZenikjab25T6c8Y','2026-04-04 12:14:48.494503'),('8ewcewl2x5e5hxm108ln54ygvd45g28x','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w3fBH:RIs7cZWBysvZzLbpp1fiC9zn-nEz_evgQBU19ri_2f4','2026-04-03 19:06:47.563655'),('a04w2jdcc710mniu7iuj7sg7wogeb5sb','e30:1w5WFl:RycrUVIaH3K0m-KFigjfpH7pTUrIBWfgrWoR7eGOpDs','2026-04-08 21:59:05.715774'),('b0nqj9beyhv44283uqoih9qp192zr8r9','e30:1w5WEI:YAUxfnEgUTKDHNhZ3inRjr4pJajkOKTZEKGgjaeXs0I','2026-04-08 21:57:34.272076'),('b5yjzp74lkg7zm9q0s22txht5xr4b16f','.eJxVizsKwzAQBe-ydTCLZX3WZfqUqcWTtEImEIJlVyZ3DwEXSTkzzEER-9bi3nWNS6GZRrr8uoT80Oc34LUMJ_Xh3nW99e161r-loTeaqRpva_VGGEmLD3BW1E2GUdmLhMkGywrxOpoywWa4LMiQxMkwhN4fh8Yyvw:1w3vPX:9-u4irF4vYae2AQvNxemy542pvaWQBjGk2h0_zLIhkc','2026-04-04 12:26:35.806517'),('hm46sdnm5zho97i7hjj2ucy455uwys6h','e30:1w5cy6:TukOswisTKNYGqgfVjh1c3nOZ4Og7MyaV2d3Imp0fNo','2026-04-09 05:09:18.588455'),('kjt3ze6zznl453fefauqq519qcsqnhct','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w5QE0:DvvtfKikB1KwabZE0w4Vdz2U6gC3ojDUmRoEAM2PD5g','2026-04-08 15:32:52.284490'),('kun1c6fwgk3as4zv2nswdbp4qcyw05qx','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w3ENp:C_ejbV9ajMvqUtPmA9ZZajCo0IOoAw_X28n3wJg0EjM','2026-04-02 14:29:57.581621'),('la2w8zrpxow6hsmw8s2235q5rr2fwr71','e30:1w5WCN:Gvf91WJC0pZ1WD6cu_RFXQp0HHR8MYaLpPreTmwCVEk','2026-04-08 21:55:35.275664'),('n7pgwle9l5ceyaln44ihyh1luodpsfu0','.eJxVi7sKwzAMAP9FcwmW5Vcyds_Y2SiyjEOhlDiZSv-9FDK0491xL8h87C0fXbe8FpiA4PLrFpa7Pr6Bn-twUh9uXbe579ez_i2Ne4MJ_DhK8B45GXa6qFrmKI4NGyVLkTBiQMXgbK1INRZmW1J1iTyJCLw_gXoylw:1wALiw:1wY8bGckIVMV11WxLKYrB0K0IKdpQkxtfqOVRumq47E','2026-04-22 05:45:10.098895'),('p52wwx85s4el5c8n2tb35sfifcrm3b3s','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w5Tm1:WrUwpnqhz-4pHHau4ey0bQlU3_19p3JeYlMMRvehZSQ','2026-04-08 19:20:13.995035'),('pp0zzsscbvd8hp80fm0vhdphy2o23epo','e30:1w5WBn:mxd4pmcbggNhXfyMQEnTGbthLVPn6wYMgjVDXuiLsq0','2026-04-08 21:54:59.559984'),('pv6q3mr1ae7f26fx86ey0p9g5jmgiwna','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w6C63:Rt0OfUNrlxSgTrp0DOm4uT6gmXaXCTenfTwL0VwoaOg','2026-04-10 18:39:51.266136'),('qp0tl9wn3urpimerkfv9u3beirwrtzm2','e30:1w5WEU:LM8NuGASIbfLIyGMDJ5ptZ7N7FOWcO81mrDt_eJSdzE','2026-04-08 21:57:46.834485'),('r6latvittdmhwhe7qfnl4hcov0523imh','.eJxVizEKwzAMAP-iuQTLjhw7Y_eMnY1sSzgUSomTqfTvpZChHe-Oe0HiY2_p6LKltcIMCJdfl7nc5fEN_FyHk_pw67Itfb-e9W9p3BvMoGXKo5NAo5BjLdE6j5M4rUhGQzCRkDGQzzaiktQqli1571GNLQbeH4HCMh4:1wALn3:-BNC-Szv0rh9GW-a9t942GNOXMxK-kgMQPPXIQu2CP0','2026-04-22 05:49:25.535291'),('tuyeicb2n6q8kqhosbx86fpn28rdw2om','e30:1w5cMa:YzcUjHb-TqhWKhBS1MPDGsI_2x1QbuLWqeFRl_Lvjyg','2026-04-09 04:30:32.627785'),('v1swbzje2hy7qioiz1gy8y6zvectu4a4','.eJxVizEKwzAMAP-iuQSkSJGTsXvHzsayFRwKpcTJFPr3UsjQjnfHHRDTvtW4N1_jUmAChMuvs5Qf_vyG9Fq6k1p3b77e2nY9699SU6swgboEIkNkNQ2JWXpHRQpCPiqhzwNmVuTBgnDJ2UuZjcSQcz-ywPsDWF4xvw:1w5PIv:eZD8jrCA1ebmxDjgrEP82Q8MXyEwoen5gbadnchm0Tk','2026-04-08 14:33:53.232674'),('vrkkkdm1aknul58pnqlazssq49ngw1ja','e30:1w5WYA:kpZogfwlPVXQ6LmG9GwdDZ_Y0XRAWEUbleWvy-cfkS0','2026-04-08 22:18:06.580224'),('w0kreoydd0z4e8sdayhpk7lwiwbyxbnw','.eJxVi7EKwjAQQP_lZilJvKR3Hd0dncM1uSNFEGnaSfx3ETro-N7jvSDLvrW8d13zUmGCAKdfN0u56-Mb5LkMB_Xh1nW99u1y1L-lSW8wgaqOY2Sq0SWMcQ54rubJNFQST9XMlTCjF5HkuAgzIRcuaBQxGcP7A5GeMtE:1w3vP3:bz_9auZ7qEU3U9d-SchR_W4C_fZmXV4r6oPuPHvSIOw','2026-04-04 12:26:05.779765'),('yeqfz6edsd4dhemmoi9gj150qeul1l3g','e30:1w5WGV:LjDfONA5_OW2aV1v6Y_C3ir4MneGlnBs_oYa9JDY8go','2026-04-08 21:59:51.915363');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_inventorymst`
--

DROP TABLE IF EXISTS `inventory_inventorymst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_inventorymst` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `stock_quantity` decimal(10,3) NOT NULL,
  `cost_price` decimal(10,2) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `fk_branch_id` int NOT NULL,
  `last_updated` datetime(6) NOT NULL,
  `category_type` varchar(100) NOT NULL,
  PRIMARY KEY (`inventory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_inventorymst`
--

LOCK TABLES `inventory_inventorymst` WRITE;
/*!40000 ALTER TABLE `inventory_inventorymst` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_inventorymst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_log`
--

DROP TABLE IF EXISTS `inventory_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `fk_inventory_id` int DEFAULT NULL,
  `change_amount` decimal(10,2) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_log`
--

LOCK TABLES `inventory_log` WRITE;
/*!40000 ALTER TABLE `inventory_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_mst`
--

DROP TABLE IF EXISTS `inventory_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_mst` (
  `inventory_id` int NOT NULL AUTO_INCREMENT,
  `fk_branch_id` int NOT NULL,
  `fk_item_id` int NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `reorder_level` decimal(12,2) DEFAULT '10.00',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`inventory_id`),
  UNIQUE KEY `uk_branch_item` (`fk_branch_id`,`fk_item_id`),
  KEY `fk_inventory_item` (`fk_item_id`),
  CONSTRAINT `fk_inventory_branch` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `fk_inventory_item` FOREIGN KEY (`fk_item_id`) REFERENCES `item_mst` (`item_id`),
  CONSTRAINT `inventory_mst_ibfk_1` FOREIGN KEY (`fk_item_id`) REFERENCES `item_mst` (`item_id`),
  CONSTRAINT `inventory_mst_ibfk_2` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_mst`
--

LOCK TABLES `inventory_mst` WRITE;
/*!40000 ALTER TABLE `inventory_mst` DISABLE KEYS */;
INSERT INTO `inventory_mst` VALUES (1,1,1,80.00,10.00,'2026-03-15 18:03:53'),(3,2,2,45.00,10.00,'2026-03-15 18:05:35'),(4,2,5,40.00,10.00,'2026-03-15 18:05:35'),(5,2,8,50.00,10.00,'2026-03-15 18:05:35'),(6,2,11,30.00,10.00,'2026-03-15 18:05:35'),(7,2,14,40.00,10.00,'2026-03-15 18:05:35'),(8,2,41,30.00,10.00,'2026-03-15 18:05:35'),(9,2,18,20.00,10.00,'2026-03-15 18:05:35'),(10,2,21,10.00,10.00,'2026-04-04 14:37:48'),(11,2,24,30.00,10.00,'2026-03-15 18:05:35'),(12,2,26,15.00,10.00,'2026-03-15 18:05:35'),(13,2,29,10.00,10.00,'2026-03-15 18:05:35'),(14,2,32,10.00,10.00,'2026-03-15 18:05:35'),(15,2,35,5.00,10.00,'2026-03-15 18:05:35'),(16,2,38,25.00,10.00,'2026-03-15 18:05:35'),(17,2,44,30.00,10.00,'2026-03-15 18:05:35'),(18,2,47,1000.00,10.00,'2026-03-15 18:05:35'),(19,2,50,500.00,10.00,'2026-03-15 18:05:35'),(20,2,53,400.00,10.00,'2026-03-15 18:05:35'),(21,2,56,500.00,10.00,'2026-03-15 18:05:35'),(22,2,60,20.00,10.00,'2026-03-15 18:05:35'),(34,1,3,100.00,10.00,'2026-03-15 18:06:39'),(35,1,4,50.00,10.00,'2026-03-15 18:06:39'),(36,1,6,10.00,10.00,'2026-04-04 17:48:18'),(37,1,7,60.00,10.00,'2026-03-15 18:06:39'),(38,1,9,35.00,10.00,'2026-03-15 18:06:39'),(39,1,10,50.00,10.00,'2026-03-15 18:06:39'),(40,1,12,20.00,10.00,'2026-03-15 18:06:39'),(41,1,13,10.00,10.00,'2026-03-15 18:06:39'),(42,1,15,50.00,10.00,'2026-03-15 18:06:39'),(43,1,16,15.00,10.00,'2026-03-15 18:06:39'),(44,1,42,40.00,10.00,'2026-03-15 18:06:39'),(45,1,17,25.00,10.00,'2026-03-15 18:06:39'),(46,1,19,2.00,10.00,'2026-03-15 18:06:39'),(47,1,20,10.00,10.00,'2026-03-15 18:06:39'),(48,1,22,15.00,10.00,'2026-03-15 18:06:39'),(49,1,23,25.00,10.00,'2026-03-15 18:06:39'),(50,1,25,20.00,10.00,'2026-03-15 18:06:39'),(51,1,43,5.00,10.00,'2026-03-15 18:06:39'),(52,1,27,15.00,10.00,'2026-03-15 18:06:39'),(53,1,28,20.00,10.00,'2026-03-15 18:06:39'),(54,1,30,10.00,10.00,'2026-03-15 18:06:39'),(55,1,31,30.00,10.00,'2026-03-15 18:06:39'),(56,1,34,20.00,10.00,'2026-03-15 18:06:39'),(57,1,36,20.00,10.00,'2026-03-15 18:06:39'),(58,1,37,15.00,10.00,'2026-03-15 18:06:39'),(59,1,39,10.00,10.00,'2026-03-15 18:06:39'),(60,1,40,10.00,10.00,'2026-03-15 18:06:39'),(61,1,45,200.00,10.00,'2026-03-15 18:06:39'),(62,1,46,100.00,10.00,'2026-03-15 18:06:39'),(63,1,48,5000.00,10.00,'2026-03-15 18:06:39'),(64,1,49,1000.00,10.00,'2026-03-15 18:06:39'),(65,1,51,300.00,10.00,'2026-03-15 18:06:39'),(66,1,52,200.00,10.00,'2026-03-15 18:06:39'),(67,1,54,300.00,10.00,'2026-03-15 18:06:39'),(68,1,55,1000.00,10.00,'2026-03-15 18:06:39'),(69,1,57,2000.00,10.00,'2026-03-15 18:06:39'),(70,1,58,1000.00,10.00,'2026-03-15 18:06:39'),(71,1,59,10000.00,10.00,'2026-03-15 18:06:39'),(98,1,64,301.00,10.00,'2026-04-05 07:04:31'),(99,1,65,99.00,10.00,'2026-04-05 07:37:41'),(100,1,66,100.00,10.00,'2026-03-22 14:02:56'),(101,1,67,99.00,10.00,'2026-03-26 05:44:54'),(102,1,68,96.00,10.00,'2026-03-26 09:07:53'),(103,1,69,100.00,10.00,'2026-03-22 14:02:56'),(104,1,70,100.00,10.00,'2026-03-22 14:02:56'),(105,1,71,99.00,10.00,'2026-03-24 17:51:10'),(106,1,72,100.00,10.00,'2026-03-22 14:02:56'),(107,1,73,100.00,10.00,'2026-03-22 14:02:56'),(108,1,74,100.00,10.00,'2026-03-22 14:02:56'),(109,1,75,100.00,10.00,'2026-03-22 14:02:56'),(110,1,76,100.00,10.00,'2026-04-05 07:37:41'),(111,1,77,100.00,10.00,'2026-03-22 14:02:56'),(112,1,78,100.00,10.00,'2026-03-22 14:02:56'),(113,1,79,100.00,10.00,'2026-03-22 14:02:56'),(114,1,80,100.00,10.00,'2026-03-22 14:02:56'),(115,1,81,100.00,10.00,'2026-03-22 14:02:56'),(116,1,82,98.00,10.00,'2026-04-01 14:21:18'),(117,1,83,99.00,10.00,'2026-04-01 14:21:18'),(118,1,84,99.00,10.00,'2026-03-22 09:29:22'),(119,1,85,100.00,10.00,'2026-03-22 14:02:56'),(120,1,86,100.00,10.00,'2026-03-22 14:02:56'),(121,1,87,100.00,10.00,'2026-03-22 14:02:56'),(122,1,88,100.00,10.00,'2026-03-22 14:02:56'),(123,1,89,100.00,10.00,'2026-03-22 14:02:56'),(124,1,90,100.00,10.00,'2026-03-22 14:02:56'),(125,1,91,100.00,10.00,'2026-03-22 14:02:56'),(126,1,92,100.00,10.00,'2026-03-22 14:02:56'),(127,1,93,100.00,10.00,'2026-03-22 14:02:56'),(128,1,94,100.00,10.00,'2026-03-22 14:02:56'),(129,1,95,100.00,10.00,'2026-03-22 14:02:56'),(130,1,96,100.00,10.00,'2026-03-22 14:02:56'),(131,1,97,100.00,10.00,'2026-03-22 14:02:56'),(132,1,98,100.00,10.00,'2026-03-22 14:02:56'),(133,1,99,100.00,10.00,'2026-03-22 14:02:56'),(134,1,100,100.00,10.00,'2026-03-22 14:02:56'),(135,1,101,100.00,10.00,'2026-03-22 14:02:56'),(136,1,102,100.00,10.00,'2026-03-22 14:02:56'),(137,1,103,100.00,10.00,'2026-03-22 14:02:56'),(138,1,104,100.00,10.00,'2026-03-22 14:02:56'),(139,1,105,99.00,10.00,'2026-03-22 09:29:22'),(140,1,106,100.00,10.00,'2026-03-22 14:02:56'),(141,1,107,100.00,10.00,'2026-03-22 14:02:56'),(142,1,108,100.00,10.00,'2026-03-22 14:02:56'),(143,1,109,100.00,10.00,'2026-03-22 14:02:56'),(144,1,110,100.00,10.00,'2026-03-22 14:02:56'),(145,1,111,98.00,10.00,'2026-04-05 06:42:55'),(161,2,64,100.00,10.00,'2026-03-22 14:02:56'),(162,2,65,100.00,10.00,'2026-03-22 14:02:56'),(163,2,66,100.00,10.00,'2026-03-22 14:02:56'),(164,2,67,100.00,10.00,'2026-03-22 14:02:56'),(165,2,68,100.00,10.00,'2026-03-22 14:02:56'),(166,2,69,100.00,10.00,'2026-03-22 14:02:56'),(167,2,70,100.00,10.00,'2026-03-22 14:02:56'),(168,2,71,100.00,10.00,'2026-03-22 14:02:56'),(169,2,72,100.00,10.00,'2026-03-22 14:02:56'),(170,2,73,100.00,10.00,'2026-03-22 14:02:56'),(171,2,74,100.00,10.00,'2026-03-22 14:02:56'),(172,2,75,100.00,10.00,'2026-03-22 14:02:56'),(173,2,76,100.00,10.00,'2026-03-22 14:02:56'),(174,2,77,100.00,10.00,'2026-03-22 14:02:56'),(175,2,78,100.00,10.00,'2026-03-22 14:02:56'),(176,2,79,100.00,10.00,'2026-03-22 14:02:56'),(177,2,80,100.00,10.00,'2026-03-22 14:02:56'),(178,2,81,100.00,10.00,'2026-03-22 14:02:56'),(179,2,82,100.00,10.00,'2026-03-22 14:02:56'),(180,2,83,100.00,10.00,'2026-03-22 14:02:56'),(181,2,84,100.00,10.00,'2026-03-22 14:02:56'),(182,2,85,100.00,10.00,'2026-03-22 14:02:56'),(183,2,86,100.00,10.00,'2026-03-22 14:02:56'),(184,2,87,100.00,10.00,'2026-03-22 14:02:56'),(185,2,88,100.00,10.00,'2026-03-22 14:02:56'),(186,2,89,100.00,10.00,'2026-03-22 14:02:56'),(187,2,90,100.00,10.00,'2026-03-22 14:02:56'),(188,2,91,100.00,10.00,'2026-03-22 14:02:56'),(189,2,92,100.00,10.00,'2026-03-22 14:02:56'),(190,2,93,100.00,10.00,'2026-03-22 14:02:56'),(191,2,94,100.00,10.00,'2026-03-22 14:02:56'),(192,2,95,100.00,10.00,'2026-03-22 14:02:56'),(193,2,96,100.00,10.00,'2026-03-22 14:02:56'),(194,2,97,100.00,10.00,'2026-03-22 14:02:56'),(195,2,98,100.00,10.00,'2026-03-22 14:02:56'),(196,2,99,100.00,10.00,'2026-03-22 14:02:56'),(197,2,100,100.00,10.00,'2026-03-22 14:02:56'),(198,2,101,100.00,10.00,'2026-03-22 14:02:56'),(199,2,102,100.00,10.00,'2026-03-22 14:02:56'),(200,2,103,100.00,10.00,'2026-03-22 14:02:56'),(201,2,104,100.00,10.00,'2026-03-22 14:02:56'),(202,2,105,100.00,10.00,'2026-03-22 14:02:56'),(203,2,106,100.00,10.00,'2026-03-22 14:02:56'),(204,2,107,100.00,10.00,'2026-03-22 14:02:56'),(205,2,108,100.00,10.00,'2026-03-22 14:02:56'),(206,2,109,100.00,10.00,'2026-03-22 14:02:56'),(207,2,110,100.00,10.00,'2026-03-22 14:02:56'),(208,2,111,100.00,10.00,'2026-03-22 14:02:56'),(225,2,1,15.00,10.00,'2026-03-24 06:21:21');
/*!40000 ALTER TABLE `inventory_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issue_mst`
--

DROP TABLE IF EXISTS `issue_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_mst` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `issue_type` varchar(50) NOT NULL,
  `issue_status` enum('open','in_progress','resolved','closed','rejected') NOT NULL,
  `issue_description` text NOT NULL,
  `severity_level` enum('low','medium','high','critical') NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL,
  `fk_reported_by` int NOT NULL,
  `fk_reported_to` int DEFAULT NULL,
  `fk_resolved_by` int DEFAULT NULL,
  `fk_branch_id` int NOT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `fk_reported_by` (`fk_reported_by`),
  KEY `fk_resolved_by` (`fk_resolved_by`),
  KEY `fk_branch_id` (`fk_branch_id`),
  KEY `fk_issue_reported_to` (`fk_reported_to`),
  CONSTRAINT `fk_issue_reported_to` FOREIGN KEY (`fk_reported_to`) REFERENCES `user_mst` (`user_id`),
  CONSTRAINT `issue_mst_ibfk_1` FOREIGN KEY (`fk_reported_by`) REFERENCES `user_mst` (`user_id`),
  CONSTRAINT `issue_mst_ibfk_2` FOREIGN KEY (`fk_resolved_by`) REFERENCES `user_mst` (`user_id`),
  CONSTRAINT `issue_mst_ibfk_3` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_mst`
--

LOCK TABLES `issue_mst` WRITE;
/*!40000 ALTER TABLE `issue_mst` DISABLE KEYS */;
INSERT INTO `issue_mst` VALUES (1,'equipment','closed','The primary deck oven is not maintaining temperature; bottom heating element seems faulty.','critical','2026-03-15 20:12:57','2026-03-31 14:05:45',NULL,2,NULL,NULL,1),(2,'quality','in_progress','Several customers reported that the multigrain bread was harder than usual today.','medium','2026-03-15 20:12:57','2026-03-15 20:12:57',NULL,4,NULL,NULL,1),(3,'safety','closed','Wet floor near the dishwashing area without a sign; sign has now been placed.','low','2026-03-15 20:12:57','2026-03-15 20:12:57',NULL,6,NULL,NULL,1),(4,'equipment','open','Display refrigerator light is flickering and making a buzzing noise.','low','2026-03-15 20:12:57','2026-03-15 20:12:57',NULL,3,NULL,NULL,2),(5,'quality','resolved','Batch of Cheese Cakes (ID: 3) had a slightly sour smell; batch was discarded.','high','2026-03-15 20:12:57','2026-03-15 20:12:57',NULL,5,NULL,NULL,2),(7,'equipment','open','Mixer machine in Branch 1 is overheating during continuous use.','high','2024-01-12 09:45:00','2024-01-12 09:45:00',NULL,2,NULL,NULL,1),(8,'quality','in_progress','Chocolate muffins in Branch 2 had uneven texture reported by customers.','medium','2024-05-20 14:30:00','2024-05-20 14:30:00',NULL,4,NULL,NULL,2),(11,'equipment','in_progress','Bread slicer in Branch 1 is misaligned, causing uneven slices.','medium','2026-01-05 08:15:00','2026-01-05 08:15:00',NULL,5,NULL,NULL,1),(12,'safety','open','Equipment health is not so much good as before need to properly cleaned up','low','2026-03-24 19:16:02','2026-03-24 19:16:02',NULL,3,2,NULL,1),(13,'quality','closed','-','low','2026-03-26 12:53:43','2026-03-26 13:18:19',NULL,2,1,NULL,1),(14,'equipment','closed','Dough kneading machine in Branch 2 is producing unusual noise and overheating after 30 minutes of use.','high','2026-03-26 17:26:18','2026-03-29 15:17:55',NULL,3,2,NULL,1),(15,'equipment','open','Whisk attachment on the planetary mixer is loose and rattling during use.','low','2026-03-31 14:10:10','2026-03-31 14:10:10',NULL,3,2,NULL,1),(16,'equipment','closed','Taking so much time for printing bills','low','2026-04-01 14:06:10','2026-04-04 17:56:38',NULL,4,2,NULL,1),(17,'quality','open','Observed recurring inconsistency in flour quality supplied across multiple branches; requires supplier audit.','high','2026-04-04 14:11:35','2026-04-04 14:11:35',NULL,1,1,NULL,1),(18,'hygiene','open','fire extinguishers in Branch 2 are past their service date and need immediate replacement.','critical','2026-04-04 18:07:47','2026-04-04 18:07:47',NULL,2,1,NULL,1),(19,'equipment','open','the dough proofer in CG branch is not maintaining consistent humidity, causing uneven fermentation.','medium','2026-04-04 18:42:18','2026-04-04 18:42:18',NULL,3,2,NULL,1),(20,'equipment','open','Service staff reported that the POS terminal in CG branch is frequently freezing during billing, causing delays at checkout.','medium','2026-04-05 06:14:28','2026-04-05 06:14:28',NULL,4,2,NULL,1),(21,'quality','open','-','low','2026-04-05 09:41:29','2026-04-05 09:41:29',NULL,4,1,NULL,1);
/*!40000 ALTER TABLE `issue_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_mst`
--

DROP TABLE IF EXISTS `item_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_mst` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_type` enum('raw','product') NOT NULL,
  `ref_id` int NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `uk_item_type_ref` (`item_type`,`ref_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_mst`
--

LOCK TABLES `item_mst` WRITE;
/*!40000 ALTER TABLE `item_mst` DISABLE KEYS */;
INSERT INTO `item_mst` VALUES (1,'raw',1),(2,'raw',2),(3,'raw',3),(4,'raw',4),(5,'raw',5),(6,'raw',6),(7,'raw',7),(8,'raw',8),(9,'raw',9),(10,'raw',10),(11,'raw',11),(12,'raw',12),(13,'raw',13),(14,'raw',14),(15,'raw',15),(16,'raw',16),(41,'raw',17),(42,'raw',18),(17,'raw',19),(18,'raw',20),(19,'raw',21),(20,'raw',22),(21,'raw',23),(22,'raw',24),(23,'raw',25),(24,'raw',26),(25,'raw',27),(43,'raw',28),(26,'raw',29),(27,'raw',30),(28,'raw',31),(29,'raw',32),(30,'raw',33),(31,'raw',34),(32,'raw',35),(33,'raw',36),(34,'raw',37),(35,'raw',38),(44,'raw',39),(45,'raw',40),(46,'raw',41),(47,'raw',42),(48,'raw',43),(49,'raw',44),(50,'raw',45),(51,'raw',46),(52,'raw',47),(53,'raw',48),(54,'raw',49),(55,'raw',50),(56,'raw',51),(57,'raw',52),(58,'raw',53),(60,'raw',54),(59,'raw',55),(36,'raw',56),(37,'raw',57),(38,'raw',58),(39,'raw',59),(40,'raw',60),(64,'product',1),(65,'product',2),(66,'product',3),(67,'product',4),(68,'product',5),(69,'product',6),(70,'product',7),(71,'product',8),(72,'product',9),(73,'product',10),(74,'product',11),(75,'product',12),(76,'product',13),(77,'product',14),(78,'product',15),(79,'product',16),(80,'product',17),(81,'product',18),(82,'product',19),(83,'product',20),(84,'product',21),(85,'product',22),(86,'product',23),(87,'product',24),(88,'product',25),(89,'product',26),(90,'product',27),(91,'product',28),(92,'product',29),(93,'product',30),(94,'product',31),(95,'product',32),(96,'product',33),(97,'product',34),(98,'product',35),(99,'product',36),(100,'product',37),(101,'product',38),(102,'product',39),(103,'product',40),(104,'product',41),(105,'product',42),(106,'product',43),(107,'product',44),(108,'product',45),(109,'product',46),(110,'product',47),(111,'product',48);
/*!40000 ALTER TABLE `item_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `detail_id` int NOT NULL AUTO_INCREMENT,
  `fk_order_id` int NOT NULL,
  `fk_product_id` int NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`detail_id`),
  KEY `fk_product_id` (`fk_product_id`),
  KEY `order_details_ibfk_1` (`fk_order_id`),
  CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`fk_order_id`) REFERENCES `order_mst` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`fk_product_id`) REFERENCES `product_mst` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (8,2,1,2.00,85.00,170.00),(9,5,2,2.00,60.00,120.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_before_order_details_prevent_negative` BEFORE INSERT ON `order_details` FOR EACH ROW BEGIN
    DECLARE current_stock DECIMAL(10,2);
    SET @branch_id = (SELECT fk_branch_id FROM order_mst WHERE order_id = NEW.fk_order_id);
    
    SELECT quantity INTO current_stock 
    FROM inventory_mst 
    WHERE fk_branch_id = @branch_id 
    AND fk_item_id = (SELECT item_id FROM item_mst WHERE item_type = 'product' AND ref_id = NEW.fk_product_id);

    IF current_stock < NEW.quantity THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Insufficient Stock: Production or Purchase entry required first.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_order_details_insert` AFTER INSERT ON `order_details` FOR EACH ROW BEGIN
    
    SET @branch_id = (SELECT fk_branch_id FROM order_mst WHERE order_id = NEW.fk_order_id);

    UPDATE inventory_mst 
    SET quantity = quantity - NEW.quantity, 
        updated_at = NOW()
    WHERE fk_branch_id = @branch_id 
    AND fk_item_id = (SELECT item_id FROM item_mst WHERE item_type = 'product' AND ref_id = NEW.fk_product_id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `fk_order_id` int NOT NULL,
  `fk_product_id` int NOT NULL,
  `quantity` decimal(12,2) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_item_id`),
  KEY `fk_order_id` (`fk_order_id`),
  KEY `fk_product_id` (`fk_product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`fk_order_id`) REFERENCES `order_mst` (`order_id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`fk_product_id`) REFERENCES `product_mst` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,1,2.00,85.00,0.00,'2026-03-15 18:33:33'),(3,5,2,2.00,60.00,0.00,'2026-03-15 18:33:33'),(4,7,1,1.00,450.00,0.00,'2026-03-15 18:33:34'),(6,16,21,1.00,165.00,0.00,'2026-03-22 14:59:22'),(7,16,42,1.00,75.00,0.00,'2026-03-22 14:59:22'),(8,17,2,1.00,60.00,0.00,'2026-03-24 23:21:10'),(9,17,8,1.00,95.00,0.00,'2026-03-24 23:21:10'),(10,18,4,1.00,40.00,0.00,'2026-03-26 11:14:53'),(11,19,1,2.00,85.00,0.00,'2026-03-26 13:50:09'),(12,20,5,4.00,90.00,0.00,'2026-03-26 14:37:52'),(13,21,20,1.00,150.00,0.00,'2026-04-01 19:51:18'),(14,21,19,2.00,120.00,0.00,'2026-04-01 19:51:18'),(15,22,48,2.00,110.00,0.00,'2026-04-05 12:12:55');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_mst`
--

DROP TABLE IF EXISTS `order_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_mst` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_date` date NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `payment_status` enum('pending','paid','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_mode` enum('cash','card','net-banking','other') NOT NULL DEFAULT 'cash',
  `fk_branch_id` int NOT NULL,
  `fk_customer_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_user_id` int DEFAULT NULL,
  `payment_terms` varchar(50) DEFAULT 'Immediate',
  PRIMARY KEY (`order_id`),
  KEY `fk_branch_id` (`fk_branch_id`),
  KEY `fk_customer_id` (`fk_customer_id`),
  CONSTRAINT `order_mst_ibfk_1` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `order_mst_ibfk_2` FOREIGN KEY (`fk_customer_id`) REFERENCES `customer_mst` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_mst`
--

LOCK TABLES `order_mst` WRITE;
/*!40000 ALTER TABLE `order_mst` DISABLE KEYS */;
INSERT INTO `order_mst` VALUES (2,'2026-03-14',170.00,'paid','card',1,2,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(3,'2026-03-15',850.00,'paid','net-banking',2,6,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(4,'2026-03-15',65.00,'paid','cash',2,5,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(5,'2026-03-15',120.00,'paid','card',1,3,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(6,'2026-03-15',1300.00,'paid','cash',2,7,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(7,'2026-03-15',450.00,'paid','other',1,4,'2026-03-15 18:33:22','2026-03-15 18:33:22',NULL,'Immediate'),(16,'2026-03-22',240.00,'paid','cash',1,9,'2026-03-22 09:29:22','2026-03-22 09:29:22',NULL,'Immediate'),(17,'2026-03-24',155.00,'paid','cash',1,2,'2026-03-24 17:51:10','2026-03-24 17:51:10',NULL,'Immediate'),(18,'2026-03-26',40.00,'paid','cash',1,4,'2026-03-26 05:44:54','2026-03-26 05:44:54',4,'Immediate'),(19,'2026-03-26',170.00,'paid','cash',1,10,'2026-03-26 08:20:10','2026-03-26 08:20:10',4,'Immediate'),(20,'2026-03-26',360.00,'paid','cash',1,11,'2026-03-26 09:07:53','2026-03-26 09:07:53',4,'Immediate'),(21,'2026-04-01',390.00,'paid','cash',1,9,'2026-04-01 14:21:18','2026-04-01 14:21:18',4,'Immediate'),(22,'2026-04-05',220.00,'paid','cash',1,2,'2026-04-05 06:42:55','2026-04-05 06:42:55',4,'Immediate');
/*!40000 ALTER TABLE `order_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_orderitem`
--

DROP TABLE IF EXISTS `orders_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fk_product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `fk_order_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_orderitem_fk_order_id_93f8eb8a_fk_orders_or` (`fk_order_id`),
  CONSTRAINT `orders_orderitem_fk_order_id_93f8eb8a_fk_orders_or` FOREIGN KEY (`fk_order_id`) REFERENCES `orders_ordermst` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_orderitem`
--

LOCK TABLES `orders_orderitem` WRITE;
/*!40000 ALTER TABLE `orders_orderitem` DISABLE KEYS */;
INSERT INTO `orders_orderitem` VALUES (1,1,3,85.00,1),(2,1,2,85.00,2),(3,2,2,60.00,5),(4,1,1,450.00,7);
/*!40000 ALTER TABLE `orders_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_ordermst`
--

DROP TABLE IF EXISTS `orders_ordermst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_ordermst` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `fk_branch_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_ordermst`
--

LOCK TABLES `orders_ordermst` WRITE;
/*!40000 ALTER TABLE `orders_ordermst` DISABLE KEYS */;
INSERT INTO `orders_ordermst` VALUES (1,'Walk-in Customer',NULL,255.00,1,'2026-03-15 18:33:22.000000'),(2,'Aarav Patel',NULL,170.00,1,'2026-03-15 18:33:22.000000'),(3,'Ishaan Mehta',NULL,850.00,2,'2026-03-15 18:33:22.000000'),(4,'Walk-in Customer',NULL,65.00,2,'2026-03-15 18:33:22.000000'),(5,'Deepali Shah',NULL,120.00,1,'2026-03-15 18:33:22.000000'),(6,'Zoya Pathan',NULL,1300.00,2,'2026-03-15 18:33:22.000000'),(7,'Rajesh Varma',NULL,450.00,1,'2026-03-15 18:33:22.000000');
/*!40000 ALTER TABLE `orders_ordermst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_mst`
--

DROP TABLE IF EXISTS `product_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_mst` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) NOT NULL,
  `fk_category_id` int NOT NULL,
  `cost_price` decimal(12,2) NOT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `product_code` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `recipe_instructions` text,
  `unit` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_name` (`product_name`),
  UNIQUE KEY `product_code` (`product_code`),
  UNIQUE KEY `product_code_2` (`product_code`),
  KEY `fk_category` (`fk_category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`fk_category_id`) REFERENCES `category_mst` (`category_id`),
  CONSTRAINT `product_mst_ibfk_1` FOREIGN KEY (`fk_category_id`) REFERENCES `category_mst` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_mst`
--

LOCK TABLES `product_mst` WRITE;
/*!40000 ALTER TABLE `product_mst` DISABLE KEYS */;
INSERT INTO `product_mst` VALUES (1,'Artisan Bread',1,20.48,85.00,1,'BRD-ARTI','/media/artisan-bread.png','Flour 1000g, Sourdough Premix 150g (15%), Water 650g (65%), Yeast 5g (0.5%), Salt 20g (2%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(2,'Baguette',1,15.93,60.00,1,'BRD-BGT','/media/baguette.png','Classic French baguette.','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(3,'Brown Bread',1,18.20,50.00,1,'BRD-BRWN','/media/brown-bread.png','Flour 800g, Multigrain Premix 200g (20%), Water 600g (60%), Yeast 12g (1.2%), Oil 25g (2.5%), Sugar 30g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(4,'White Bread -',1,23.60,40.00,1,'BRD-WHT','/media/white-bread.png','Flour 1000g, Water 600g, Bread Premix 200g (20%), Yeast 20g (2%), Salt 18g (1.8%), Sugar 50g (5%), Oil 30g (3%)','PCS','2026-03-15 17:19:04','2026-04-04 15:37:56'),(5,'Rye Bread',1,20.48,90.00,1,'BRD-RYE','/media/rye-bread.png','Flour 1000g, Sourdough Premix 150g (15%), Water 650g (65%), Yeast 5g (0.5%), Salt 20g (2%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(6,'Multigrain Bread',1,20.48,75.00,1,'BRD-MLTI','/media/multigrain-bread.png','Flour 800g, Multigrain Premix 200g (20%), Water 600g (60%), Yeast 12g (1.2%), Oil 25g (2.5%), Sugar 30g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(7,'Ciabatta',1,13.65,80.00,1,'BRD-CBT','/media/ciabatta.png','Italian style ciabatta.','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(8,'Focaccia',1,18.20,95.00,1,'BRD-FOC','/media/focaccia.png','Herbed Italian flatbread.','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(9,'Flat Bread',1,9.10,35.00,1,'BRD-FLAT','/media/flat-bread.png','Flour 1000g, Water 550g, Yeast 10g (1%), Salt 18g, Sugar 20g, Oil 40g (4%), Improver 5g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(10,'Loaf',1,18.20,45.00,1,'BRD-LOAF','/media/loaf.png','Flour 1000g, Water 600g, Bread Premix 200g (20%), Yeast 20g (2%), Salt 18g (1.8%), Sugar 50g (5%), Oil 30g (3%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(11,'Sourdough',1,22.75,120.00,1,'BRD-SOUR','/media/sourdough.png','Flour 1000g, Sourdough Premix 150g (15%), Water 650g (65%), Yeast 5g (0.5%), Salt 20g (2%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(12,'Lavash',1,6.83,55.00,1,'BRD-LVSH','/media/lavash.png','Crispy thin bread.','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(13,'Pav',1,2.28,30.00,1,'BRD-PAV','/media/pav.png','Flour 1000g, Water 600g, Bread Premix 200g (20%), Yeast 20g (2%), Salt 18g (1.8%), Sugar 50g (5%), Oil 30g (3%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(14,'Naan',1,5.46,40.00,1,'BRD-NAAN','/media/naan.png','Flour 1000g, Water 550g, Yeast 10g (1%), Salt 18g, Sugar 20g, Oil 40g (4%), Improver 5g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(15,'Pita',1,4.55,35.00,1,'BRD-PITA','/media/pita.png','Flour 1000g, Water 550g, Yeast 10g (1%), Salt 18g, Sugar 20g, Oil 40g (4%), Improver 5g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(16,'Tortilla',1,3.64,25.00,1,'BRD-TORT','/media/tortilla.png','Flour 1000g, Water 550g, Yeast 10g (1%), Salt 18g, Sugar 20g, Oil 40g (4%), Improver 5g','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(17,'Dinner Rolls',1,1.82,45.00,1,'BRD-DNRL','/media/dinner-rolls.png','Flour 1000g, Water 600g, Bread Premix 200g (20%), Yeast 20g (2%), Salt 18g (1.8%), Sugar 50g (5%), Oil 30g (3%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(18,'Bread Rolls',1,2.73,45.00,1,'BRD-BDRL','/media/bread-rolls.png','Flour 1000g, Water 600g, Bread Premix 200g (20%), Yeast 20g (2%), Salt 18g (1.8%), Sugar 50g (5%), Oil 30g (3%)','pcs','2026-03-15 17:19:04','2026-04-04 18:43:42'),(19,'Biscuits',2,27.50,120.00,1,'COO-BSKT','/media/Biscuits.png','Flour 1000g, Biscuit Premix 100g (10%), Sugar 300g (30%), Fat 300g (30%), Milk Powder 50g, Baking Powder 10g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(20,'Butter Biscuit',2,23.00,150.00,1,'COO-BTTR','/media/Butter_Biscuit.png','Flour 1000g, Fat 400g (40%), Salt 15g, Sugar 100g, Premix 100g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(21,'Cheese Biscuit',2,22.00,165.00,1,'COO-CHZ','/media/Cheese_Biscuit.png','Flour 1000g, Fat 400g (40%), Salt 15g, Sugar 100g, Premix 100g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(22,'Bourbon Cream',2,16.50,140.00,1,'COO-BRBN','/media/Bourbon _ Cream.png','Chocolate sandwich biscuit.','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(23,'Marie Biscuit',2,22.00,100.00,1,'COO-MARI','/media/Marie_Biscuit.png','Flour 1000g, Biscuit Premix 100g (10%), Sugar 300g (30%), Fat 300g (30%), Milk Powder 50g, Baking Powder 10g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(24,'Digestive',2,27.50,130.00,1,'COO-DGST','/media/Digestive_Biscuits.png','Flour 1000g, Biscuit Premix 100g (10%), Sugar 300g (30%), Fat 300g (30%), Milk Powder 50g, Baking Powder 10g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(25,'Khari Biscuit',2,11.00,90.00,1,'COO-KHRI','/media/Khari_Biscuit.png','Flour 1000g, Fat 400g (40%), Salt 15g, Sugar 100g, Premix 100g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(26,'Classic Cookies',2,33.00,200.00,1,'COO-CLSC','/media/Classic_Cookies.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(27,'Chocolate Chips',2,33.00,220.00,1,'COO-CHIP','/media/Chocolate_Chips.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(28,'Oatmeal Cookies',2,38.50,210.00,1,'COO-OATM','/media/Oatmeal_Cookies.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(29,'Shortbread',2,44.00,250.00,1,'COO-SHRT','/media/Shortbread_Cookie.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(30,'Special Biscuits',2,55.00,300.00,1,'COO-SPEC','/media/Special_Biscuits.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(31,'Crackers',2,16.50,110.00,1,'COO-CRCK','/media/Crackers.png','Flour 1000g, Biscuit Premix 100g (10%), Sugar 300g (30%), Fat 300g (30%), Milk Powder 50g, Baking Powder 10g, Water 200g','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(32,'Ginger Bread',2,22.00,180.00,1,'COO-GNGR','/media/Ginger_Bread.png','Spiced gingerbread man.','pcs','2026-03-15 17:20:15','2026-04-04 18:43:42'),(33,'Almond Croissant',3,16.80,160.00,1,'PAS-ALMD','/media/Almond_Croissant.png','Flour 1000g, Croissant Premix 250g (25%), Water 500g, Yeast 30g (3%), Sugar 100g, Butter (lamination) 300g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(34,'Butter Croissant',3,11.20,120.00,1,'PAS-BTTR','/media/Butter_Croissant.png','Flour 1000g, Croissant Premix 250g (25%), Water 500g, Yeast 30g (3%), Sugar 100g, Butter (lamination) 300g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(35,'Chocolate Croissant',3,14.00,145.00,1,'PAS-CHOC','/media/Chocolate_Croissant.png','Flour 1000g, Croissant Premix 250g (25%), Water 500g, Yeast 30g (3%), Sugar 100g, Butter (lamination) 300g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(36,'Croissants',3,11.20,100.00,1,'PAS-CRSN','/media/Croissants.png','Flour 1000g, Croissant Premix 250g (25%), Water 500g, Yeast 30g (3%), Sugar 100g, Butter (lamination) 300g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(37,'Danish Pastry',3,15.40,135.00,1,'PAS-DNSH','/media/Danish.png','Flour 1000g, Croissant Premix 250g (25%), Water 500g, Yeast 30g (3%), Sugar 100g, Butter (lamination) 300g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(38,'Apple Turnover',3,16.80,110.00,1,'PAS-APPL','/media/Apple_turnover.png','Glazed apple filling.','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(39,'Éclairs Mix',3,21.00,180.00,1,'PAS-ECLR','/media/Éclairs & Profiteroles.png','Flour 500g, Butter 400g, Eggs 800g, Water 500g, Sugar 50g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(40,'Chocolate Éclair',3,8.40,95.00,1,'PAS-CECLR','/media/Chocolate Éclair.png','Flour 500g, Butter 400g, Eggs 800g, Water 500g, Sugar 50g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(41,'Coffee Éclair',3,8.40,95.00,1,'PAS-COFE','/media/Coffee Éclair.png','Flour 500g, Butter 400g, Eggs 800g, Water 500g, Sugar 50g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(42,'Cream Horn',3,9.80,75.00,1,'PAS-HORN','/media/cream_horn.png','Flour 500g, Butter 400g, Eggs 800g, Water 500g, Sugar 50g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(43,'Profiteroles',3,7.00,85.00,1,'PAS-PROF','/media/cream_filled_profiteroles.png','Flour 500g, Butter 400g, Eggs 800g, Water 500g, Sugar 50g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(44,'Cherry Custard Tart',3,18.20,130.00,1,'PAS-CHRY','/media/Cherry_Custard_Tart.png','Flour 1000g, Butter 500g, Sugar 300g, Eggs 200g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(45,'Lemon Tart',3,14.00,120.00,1,'PAS-LEMN','/media/Lemon_Tart.png','Flour 1000g, Butter 500g, Sugar 300g, Eggs 200g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(46,'Fruit Tart',3,19.60,140.00,1,'PAS-FRUT','/media/Fruit_Tart.png','Flour 1000g, Butter 500g, Sugar 300g, Eggs 200g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(47,'Tart',3,11.20,90.00,1,'PAS-TART','/media/Tart.png','Flour 1000g, Butter 500g, Sugar 300g, Eggs 200g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(48,'Puff Pastries',3,14.00,110.00,1,'PAS-PUFF','/media/Puff_passtries.png','Flour 1000g, Water 500g, Salt 20g, Fat (lamination) 500g, Improver 5g','pcs','2026-03-15 17:23:02','2026-04-04 18:43:42'),(50,'chocolate crinkle cookies',2,43.00,50.00,1,NULL,'chocolate crinkle cookies.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-26 01:38:22','2026-04-04 18:43:42'),(51,'Cheesecake',4,120.00,200.00,1,NULL,'vanilla-cup-cake.png','Cake Premix 1000g, Water 400g, Oil 300g, Eggs 300g','pcs','2026-03-26 13:53:43','2026-04-04 18:43:42'),(52,'Vannilla Cup cake',4,20.00,50.00,1,NULL,'vanilla-cup-cake.png','Cake Premix 1000g, Water 400g, Oil 300g, Eggs 300g','pcs','2026-03-26 13:57:27','2026-04-04 18:43:42'),(53,'special cookies',6,100.00,200.00,1,NULL,'Special_Biscuits.png','Flour 1000g, Sugar 400g (40%), Butter 350g (35%), Eggs 200g, Premix 100g, Baking Powder 10g, Chocolate/Oats as required','pcs','2026-03-26 14:01:37','2026-04-04 18:43:42'),(54,'White Chocolate',6,23.68,45.00,1,'WCT','products/54_white-chocolate.png','Cocoa Butter, Sugar, Milk Solids, Vanilla, Emulsifier (Lecithin)','PCS','2026-04-03 18:28:37','2026-04-03 18:28:37'),(55,'Red Velvet Cheesecake Brownie',3,119.70,170.00,0,'RVC','products/55_red-velvet-cheesecake-brownie_qdsNCiF.png','Flour 500 g · Cocoa 150 g · Butter 300 g · Sugar 400 g · Eggs 250 g · Cream Cheese 300 g · Red Velvet Mix 200 g · Baking Powder 10 g · Salt 5 g · Vanilla 10 ml','PACKET','2026-04-04 17:02:38','2026-04-04 18:17:22');
/*!40000 ALTER TABLE `product_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_mst`
--

DROP TABLE IF EXISTS `production_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_mst` (
  `production_id` int NOT NULL AUTO_INCREMENT,
  `fk_production_plan_id` int NOT NULL,
  `fk_branch_id` int NOT NULL,
  `fk_product_id` int NOT NULL,
  `produced_quantity` decimal(12,2) NOT NULL,
  `production_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_produced_by` int DEFAULT NULL,
  PRIMARY KEY (`production_id`),
  KEY `fk_branch_id` (`fk_branch_id`),
  KEY `fk_product_id` (`fk_product_id`),
  KEY `fk_mst_to_plan` (`fk_production_plan_id`),
  KEY `fk_production_user` (`fk_produced_by`),
  CONSTRAINT `fk_mst_to_plan` FOREIGN KEY (`fk_production_plan_id`) REFERENCES `production_plan` (`production_plan_id`),
  CONSTRAINT `fk_production_user` FOREIGN KEY (`fk_produced_by`) REFERENCES `user_mst` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `production_mst_ibfk_1` FOREIGN KEY (`fk_production_plan_id`) REFERENCES `production_plan` (`production_plan_id`),
  CONSTRAINT `production_mst_ibfk_2` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `production_mst_ibfk_3` FOREIGN KEY (`fk_product_id`) REFERENCES `product_mst` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_mst`
--

LOCK TABLES `production_mst` WRITE;
/*!40000 ALTER TABLE `production_mst` DISABLE KEYS */;
INSERT INTO `production_mst` VALUES (1,5,2,40,40.00,'2026-03-15','2026-03-15 19:16:38','2026-03-15 19:16:38',NULL),(2,6,2,46,22.00,'2026-03-15','2026-03-15 19:16:38','2026-03-15 19:16:38',NULL),(4,9,2,46,22.00,'2026-03-15','2026-03-15 19:16:38','2026-03-15 19:16:38',NULL),(5,1,1,1,100.00,'2026-03-26','2026-03-26 22:48:24','2026-03-26 22:48:24',NULL);
/*!40000 ALTER TABLE `production_mst` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_production_insert` AFTER INSERT ON `production_mst` FOR EACH ROW BEGIN
    UPDATE inventory_mst 
    SET quantity = quantity + NEW.produced_quantity, 
        updated_at = NOW()
    WHERE fk_branch_id = NEW.fk_branch_id 
    AND fk_item_id = (SELECT item_id FROM item_mst WHERE item_type = 'product' AND ref_id = NEW.fk_product_id);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `production_plan`
--

DROP TABLE IF EXISTS `production_plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_plan` (
  `production_plan_id` int NOT NULL AUTO_INCREMENT,
  `fk_branch_id` int NOT NULL,
  `fk_product_id` int NOT NULL,
  `planned_quantity` decimal(5,2) NOT NULL,
  `plan_start_date` date NOT NULL,
  `plan_end_date` date NOT NULL,
  `plan_status` varchar(20) DEFAULT 'Pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `fk_assigned_to` int DEFAULT NULL,
  PRIMARY KEY (`production_plan_id`),
  KEY `fk_branch_id` (`fk_branch_id`),
  KEY `fk_product_id` (`fk_product_id`),
  KEY `fk_plan_assigned_user` (`fk_assigned_to`),
  CONSTRAINT `fk_plan_assigned_user` FOREIGN KEY (`fk_assigned_to`) REFERENCES `user_mst` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `production_plan_ibfk_1` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `production_plan_ibfk_2` FOREIGN KEY (`fk_product_id`) REFERENCES `product_mst` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_plan`
--

LOCK TABLES `production_plan` WRITE;
/*!40000 ALTER TABLE `production_plan` DISABLE KEYS */;
INSERT INTO `production_plan` VALUES (1,1,1,100.00,'2026-03-14','2026-04-02','Completed','2026-03-15 18:51:11','2026-03-15 18:51:11',3),(2,1,2,50.00,'2026-03-14','2026-03-30','In Progress','2026-03-15 18:51:11','2026-03-15 18:51:11',3),(3,1,33,40.00,'2026-03-15','2026-04-02','Pending','2026-03-15 18:51:11','2026-03-15 18:51:11',3),(4,2,34,60.00,'2026-03-15','2026-03-31','In Progress','2026-03-15 18:51:11','2026-03-15 18:51:11',6),(5,2,40,40.00,'2026-03-15','2026-03-19','In Progress','2026-03-15 19:13:41','2026-03-15 19:13:41',6),(6,2,46,25.00,'2026-03-15','2026-03-26','Pending','2026-03-15 19:13:41','2026-03-15 19:13:41',6),(9,2,46,25.00,'2026-03-15','2026-03-21','Pending','2026-03-15 19:16:12','2026-03-15 19:16:12',6),(10,1,18,45.00,'2026-03-22','2026-03-26','Completed','2026-03-26 15:57:04','2026-03-26 21:27:04',3),(14,1,1,50.00,'2026-04-01','2026-04-10','In Progress','2026-04-08 05:50:19','2026-04-08 11:20:18',3);
/*!40000 ALTER TABLE `production_plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_items` (
  `purchase_items_id` int NOT NULL AUTO_INCREMENT,
  `fk_purchase_id` int DEFAULT NULL,
  `fk_branch_id` int DEFAULT NULL,
  `fk_raw_material_id` int DEFAULT NULL,
  `quantity` decimal(7,2) NOT NULL,
  `unit_price` decimal(7,2) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_items_id`),
  KEY `fk_purchase` (`fk_purchase_id`),
  KEY `fk_purchase_branch` (`fk_branch_id`),
  KEY `fk_purchase_raw` (`fk_raw_material_id`),
  CONSTRAINT `fk_purchase` FOREIGN KEY (`fk_purchase_id`) REFERENCES `purchase_mst` (`purchase_id`),
  CONSTRAINT `fk_purchase_branch` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `fk_purchase_raw` FOREIGN KEY (`fk_raw_material_id`) REFERENCES `raw_material_mst` (`raw_material_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`fk_purchase_id`) REFERENCES `purchase_mst` (`purchase_id`),
  CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `purchase_items_ibfk_3` FOREIGN KEY (`fk_raw_material_id`) REFERENCES `raw_material_mst` (`raw_material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
INSERT INTO `purchase_items` VALUES (1,1,1,1,200.00,45.00,'2026-03-15 18:28:33'),(2,1,1,3,50.00,75.00,'2026-03-15 18:28:33'),(3,2,2,14,30.00,450.00,'2026-03-15 18:28:33'),(4,2,2,19,15.00,500.00,'2026-03-15 18:28:33'),(5,3,1,40,500.00,25.00,'2026-03-15 18:28:33'),(6,4,2,10,40.00,85.00,'2026-03-15 18:28:33'),(7,5,1,28,10.00,400.00,'2026-03-15 18:28:33'),(8,6,2,54,50.00,150.00,'2026-03-15 18:28:33');
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_purchase_insert` AFTER INSERT ON `purchase_items` FOR EACH ROW BEGIN
    
    UPDATE inventory_mst 
    SET quantity = quantity + NEW.quantity, 
        updated_at = NOW()
    WHERE fk_branch_id = NEW.fk_branch_id 
    AND fk_item_id = (SELECT item_id FROM item_mst WHERE item_type = 'raw' AND ref_id = NEW.fk_raw_material_id);
    
    
    UPDATE raw_material_mst 
    SET cost_price = NEW.unit_price 
    WHERE raw_material_id = NEW.fk_raw_material_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `purchase_mst`
--

DROP TABLE IF EXISTS `purchase_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_mst` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `fk_supplier_id` int DEFAULT NULL,
  `fk_branch_id` int DEFAULT NULL,
  `invoice_number` varchar(25) NOT NULL,
  `purchase_date` date NOT NULL,
  `payment_status` enum('pending','paid','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_mode` enum('cash','card','net-banking','other') NOT NULL DEFAULT 'cash',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`purchase_id`),
  KEY `fk_supplier_id` (`fk_supplier_id`),
  KEY `fk_branch_id` (`fk_branch_id`),
  CONSTRAINT `purchase_mst_ibfk_1` FOREIGN KEY (`fk_supplier_id`) REFERENCES `supplier_mst` (`supplier_id`),
  CONSTRAINT `purchase_mst_ibfk_2` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_mst`
--

LOCK TABLES `purchase_mst` WRITE;
/*!40000 ALTER TABLE `purchase_mst` DISABLE KEYS */;
INSERT INTO `purchase_mst` VALUES (1,1,1,'PUR/CG/001','2026-03-10','paid','net-banking','2026-03-15 18:28:21','2026-03-15 18:28:21'),(2,7,2,'PUR/SB/002','2026-03-11','paid','cash','2026-03-15 18:28:21','2026-03-15 18:28:21'),(3,11,1,'PUR/CG/003','2026-03-12','pending','card','2026-03-15 18:28:21','2026-03-15 18:28:21'),(4,4,2,'PUR/SB/004','2026-03-13','paid','other','2026-03-15 18:28:21','2026-03-15 18:28:21'),(5,2,1,'PUR/CG/005','2026-03-14','paid','net-banking','2026-03-15 18:28:21','2026-03-15 18:28:21'),(6,13,2,'PUR/SB/006','2026-03-15','pending','cash','2026-03-15 18:28:21','2026-03-15 18:28:21');
/*!40000 ALTER TABLE `purchase_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raw_material_mst`
--

DROP TABLE IF EXISTS `raw_material_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_material_mst` (
  `raw_material_id` int NOT NULL AUTO_INCREMENT,
  `raw_material_name` varchar(50) NOT NULL,
  `fk_unit_id` int NOT NULL,
  `cost_price` decimal(12,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`raw_material_id`),
  UNIQUE KEY `raw_material_name` (`raw_material_name`),
  UNIQUE KEY `raw_material_name_2` (`raw_material_name`),
  KEY `fk_raw_unit` (`fk_unit_id`),
  CONSTRAINT `fk_raw_unit` FOREIGN KEY (`fk_unit_id`) REFERENCES `unit_mst` (`unit_id`),
  CONSTRAINT `raw_material_mst_ibfk_1` FOREIGN KEY (`fk_unit_id`) REFERENCES `unit_mst` (`unit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raw_material_mst`
--

LOCK TABLES `raw_material_mst` WRITE;
/*!40000 ALTER TABLE `raw_material_mst` DISABLE KEYS */;
INSERT INTO `raw_material_mst` VALUES (1,'All-purpose flour',2,45.00,1,'Flours'),(2,'Whole wheat flour',2,55.00,1,'Flours'),(3,'Multigrain flour',2,75.00,1,'Flours'),(4,'Millet flour',2,80.00,1,'Flours'),(5,'Rye flour',2,95.00,1,'Flours'),(6,'Sourdough starter',2,120.00,1,'Leavening'),(7,'Pizza base premix',2,85.00,1,'Premixes'),(8,'Puff pastry premix',2,90.00,1,'Premixes'),(9,'Granulated sugar',2,40.00,1,'Sweeteners'),(10,'Brown sugar',2,85.00,1,'Sweeteners'),(11,'Jaggery',2,60.00,1,'Sweeteners'),(12,'Honey',2,400.00,1,'Sweeteners'),(13,'Sugar substitutes',2,900.00,1,'Sweeteners'),(14,'Butter',2,450.00,1,'Dairy'),(15,'Margarine',2,120.00,1,'Dairy'),(16,'Ghee',2,650.00,1,'Dairy'),(17,'Cream',4,180.00,1,'Dairy'),(18,'Whipping cream',4,220.00,1,'Dairy'),(19,'Cheese (Mixed)',2,500.00,1,'Dairy'),(20,'Milk powder',2,350.00,1,'Dairy'),(21,'Yeast',2,280.00,1,'Leavening'),(22,'Baking powder',2,150.00,1,'Leavening'),(23,'Baking soda',2,100.00,1,'Leavening'),(24,'Cocoa powder',2,550.00,1,'Chocolate'),(25,'Chocolate chips',2,450.00,1,'Chocolate'),(26,'Dark chocolate',2,650.00,1,'Chocolate'),(27,'White chocolate',2,680.00,1,'Chocolate'),(28,'Vanilla essence',4,400.00,1,'Flavourings'),(29,'Almonds',2,850.00,1,'Nuts & Fruits'),(30,'Cashews',2,900.00,1,'Nuts & Fruits'),(31,'Raisins',2,350.00,1,'Nuts & Fruits'),(32,'Pistachios',2,1200.00,1,'Nuts & Fruits'),(33,'Walnuts',2,1100.00,1,'Nuts & Fruits'),(34,'Fresh apples',2,150.00,1,'Nuts & Fruits'),(35,'Fresh cherries',2,400.00,1,'Nuts & Fruits'),(36,'Lemon zest',2,200.00,1,'Nuts & Fruits'),(37,'Fruit puree',2,300.00,1,'Nuts & Fruits'),(38,'Spices (Mixed)',2,800.00,1,'Spices'),(39,'Cake boxes (Small)',6,15.00,1,'Packaging'),(40,'Cake boxes (Medium)',6,25.00,1,'Packaging'),(41,'Cake boxes (Large)',6,40.00,1,'Packaging'),(42,'Cupcake liners',6,2.00,1,'Packaging'),(43,'Biscuit wrappers',6,1.00,1,'Packaging'),(44,'Bread bags (Loaf)',6,3.00,1,'Packaging'),(45,'Bread bags (Baguette)',6,4.00,1,'Packaging'),(46,'Pizza boxes (Veg)',6,12.00,1,'Packaging'),(47,'Pizza boxes (Chicken)',6,15.00,1,'Packaging'),(48,'Pie trays',6,8.00,1,'Packaging'),(49,'Tart boxes',6,10.00,1,'Packaging'),(50,'Puff pastry bags',6,2.00,1,'Packaging'),(51,'Rusk packaging',6,5.00,1,'Other'),(52,'Protein bar wrappers',6,1.00,1,'Packaging'),(53,'Carry bags (Paper)',6,6.00,1,'Packaging'),(54,'Transparent wraps',7,150.00,1,'Packaging'),(55,'Labels & Stickers',6,0.50,1,'Packaging'),(56,'Garlic premix',2,180.00,1,'Premixes'),(57,'Spinach premix',2,210.00,1,'Premixes'),(58,'Chicken premix',2,350.00,1,'Premixes'),(59,'Ham premix',2,380.00,1,'Premixes'),(60,'Meat premix',2,400.00,1,'Premixes');
/*!40000 ALTER TABLE `raw_material_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raw_material_recipe`
--

DROP TABLE IF EXISTS `raw_material_recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raw_material_recipe` (
  `recipe_id` int NOT NULL AUTO_INCREMENT,
  `fk_product_id` int NOT NULL COMMENT 'Finished good',
  `fk_raw_material_id` int NOT NULL COMMENT 'Raw material used',
  `required_quantity` decimal(12,3) NOT NULL COMMENT 'Quantity per unit of finished good',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`),
  UNIQUE KEY `fk_product_id` (`fk_product_id`,`fk_raw_material_id`),
  KEY `fk_raw_material_id` (`fk_raw_material_id`),
  CONSTRAINT `raw_material_recipe_ibfk_1` FOREIGN KEY (`fk_product_id`) REFERENCES `product_mst` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `raw_material_recipe_ibfk_2` FOREIGN KEY (`fk_raw_material_id`) REFERENCES `raw_material_mst` (`raw_material_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raw_material_recipe`
--

LOCK TABLES `raw_material_recipe` WRITE;
/*!40000 ALTER TABLE `raw_material_recipe` DISABLE KEYS */;
/*!40000 ALTER TABLE `raw_material_recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state_mst`
--

DROP TABLE IF EXISTS `state_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state_mst` (
  `state_id` int NOT NULL AUTO_INCREMENT,
  `state_name` varchar(50) NOT NULL,
  PRIMARY KEY (`state_id`),
  UNIQUE KEY `state_name` (`state_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state_mst`
--

LOCK TABLES `state_mst` WRITE;
/*!40000 ALTER TABLE `state_mst` DISABLE KEYS */;
INSERT INTO `state_mst` VALUES (1,'Gujarat'),(2,'Maharashtra'),(3,'Rajasthan');
/*!40000 ALTER TABLE `state_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movement`
--

DROP TABLE IF EXISTS `stock_movement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movement` (
  `movement_id` int NOT NULL AUTO_INCREMENT,
  `fk_branch_id` int NOT NULL,
  `fk_item_id` int NOT NULL,
  `movement_type` enum('purchase','sale','production_in','production_out') NOT NULL,
  `quantity` decimal(5,2) NOT NULL,
  `movement_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movement_id`),
  KEY `fk_branch_id` (`fk_branch_id`),
  KEY `fk_item_id` (`fk_item_id`),
  CONSTRAINT `stock_movement_ibfk_1` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `stock_movement_ibfk_2` FOREIGN KEY (`fk_item_id`) REFERENCES `item_mst` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movement`
--

LOCK TABLES `stock_movement` WRITE;
/*!40000 ALTER TABLE `stock_movement` DISABLE KEYS */;
INSERT INTO `stock_movement` VALUES (8,1,1,'purchase',50.00,'2026-03-15 20:04:25'),(9,1,1,'production_out',-5.00,'2026-03-15 20:04:25'),(10,1,64,'production_in',10.00,'2026-03-15 20:04:25'),(11,1,64,'sale',-2.00,'2026-03-15 20:04:25'),(15,2,14,'production_out',-2.00,'2026-03-15 20:04:33');
/*!40000 ALTER TABLE `stock_movement` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_after_stock_movement_insert` AFTER INSERT ON `stock_movement` FOR EACH ROW BEGIN
    
    UPDATE inventory_mst 
    SET quantity = quantity + NEW.quantity, 
        updated_at = NOW()
    WHERE fk_branch_id = NEW.fk_branch_id 
    AND fk_item_id = NEW.fk_item_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `supplier_branch_map`
--

DROP TABLE IF EXISTS `supplier_branch_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_branch_map` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supplier_id` int NOT NULL,
  `branch_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier_id` (`supplier_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `supplier_branch_map_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier_mst` (`supplier_id`) ON DELETE CASCADE,
  CONSTRAINT `supplier_branch_map_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch_mst` (`branch_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_branch_map`
--

LOCK TABLES `supplier_branch_map` WRITE;
/*!40000 ALTER TABLE `supplier_branch_map` DISABLE KEYS */;
INSERT INTO `supplier_branch_map` VALUES (1,1,1),(16,1,2),(31,1,3),(2,2,1),(17,2,2),(32,2,3),(3,3,1),(18,3,2),(33,3,3),(4,4,1),(19,4,2),(34,4,3),(5,5,1),(20,5,2),(35,5,3),(6,6,1),(21,6,2),(38,6,4),(7,7,1),(22,7,2),(39,7,4),(8,8,1),(23,8,2),(40,8,4),(9,9,1),(24,9,2),(41,9,4),(10,10,1),(25,10,2),(42,10,4),(11,11,1),(26,11,2),(12,12,1),(27,12,2),(13,13,1),(28,13,2),(14,14,1),(29,14,2),(15,15,1),(30,15,2);
/*!40000 ALTER TABLE `supplier_branch_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_mst`
--

DROP TABLE IF EXISTS `supplier_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_mst` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `fk_city_id` int NOT NULL,
  `address` varchar(100) NOT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_city_id` (`fk_city_id`),
  CONSTRAINT `supplier_mst_ibfk_1` FOREIGN KEY (`fk_city_id`) REFERENCES `city_mst` (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_mst`
--

LOCK TABLES `supplier_mst` WRITE;
/*!40000 ALTER TABLE `supplier_mst` DISABLE KEYS */;
INSERT INTO `supplier_mst` VALUES (1,'Flour & Co.','5401758124',1,'Ahmedabad GIDC','24FLCO1234A1Z5','contact@flourco.com',1),(2,'Global Grains','9000000002',1,'Sanand, Ahmedabad','24GLGR1234B1Z6','sales@globalgrains.com',1),(3,'Premix World','9000000003',1,'Asarwa, Ahmedabad','24PMWR1234C1Z7','info@premixworld.com',1),(4,'Sugar Mills','9000000004',1,'Ahmedabad','24SGML1234D1Z8','orders@sugarmills.com',1),(5,'Eco Farms','9000000005',1,'Rural Ahmedabad','24ECFM1234E1Z9','fresh@ecofarms.com',1),(6,'HealthLine','9000000006',1,'C.G. Road','24HLTH1234F1Z1','support@healthline.com',1),(7,'Dairy Fresh','9000000007',1,'Ahmedabad Dairy Circle','24DRFR1234G1Z2','delivery@dairyfresh.com',1),(8,'Choco Delights','9000000008',1,'Satellite, Ahmedabad','24CHDL1234H1Z3','cocoa@chocodelights.com',1),(9,'Nutty Farms','9000000009',1,'Ahmedabad','24NTFM1234I1Z4','nuts@nuttyfarms.com',1),(10,'Local Produce','9000000010',1,'Ahmedabad Market','24LCPR1234J1Z5','vendor@localproduce.com',1),(11,'Pack-It','9000000011',1,'Naroda, Ahmedabad','24PKIT1234K1Z6','box@packit.com',1),(12,'EcoPack','9000000012',1,'Ahmedabad','24ECPK1234L1Z7','green@ecopack.com',1),(13,'PackRight','9000000013',1,'Ahmedabad','24PKRT1234M1Z8','wrap@packright.com',1),(14,'Cokiee and Co.','9990009909',1,'Bapunagar Ahmedabad','24CKCO1234N1Z9','contact@candc.com',1),(15,'Fresh Harvest','9000000015',1,'Shop No. 12, Shreeji Plaza, Thaltej Cross Road, Ahmedabad, Gujarat – 380059','24FRHVS1234A1Z5','contact@freshharvest.com',1);
/*!40000 ALTER TABLE `supplier_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit_mst`
--

DROP TABLE IF EXISTS `unit_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit_mst` (
  `unit_id` int NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(50) NOT NULL,
  PRIMARY KEY (`unit_id`),
  UNIQUE KEY `unit_name` (`unit_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit_mst`
--

LOCK TABLES `unit_mst` WRITE;
/*!40000 ALTER TABLE `unit_mst` DISABLE KEYS */;
INSERT INTO `unit_mst` VALUES (1,'grams'),(2,'kg'),(4,'ltr'),(3,'ml'),(5,'packet'),(6,'pcs'),(7,'roll');
/*!40000 ALTER TABLE `unit_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_mst`
--

DROP TABLE IF EXISTS `user_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_mst` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `fk_city_id` int NOT NULL,
  `designation` enum('admin','branch manager','baker','service staff') DEFAULT NULL,
  `fk_branch_id` int NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `date_of_birth` date DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `date_of_resign` date DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_first_login` tinyint(1) DEFAULT '1',
  `security_key` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_branch` (`fk_branch_id`),
  KEY `fk_city` (`fk_city_id`),
  CONSTRAINT `fk_branch` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`),
  CONSTRAINT `fk_city` FOREIGN KEY (`fk_city_id`) REFERENCES `city_mst` (`city_id`),
  CONSTRAINT `user_mst_ibfk_1` FOREIGN KEY (`fk_city_id`) REFERENCES `city_mst` (`city_id`),
  CONSTRAINT `user_mst_ibfk_2` FOREIGN KEY (`fk_branch_id`) REFERENCES `branch_mst` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_mst`
--

LOCK TABLES `user_mst` WRITE;
/*!40000 ALTER TABLE `user_mst` DISABLE KEYS */;
INSERT INTO `user_mst` VALUES (1,'admin','pbkdf2_sha256$1200000$dEXznQozjLRuy3yQlOLalR$i3KFzVjW0tsYrR9cwWJVipN3v9xvhTwF48rdL5bXyrA=','2026-04-08 05:49:26','admin@bakery.in',1,'admin',1,1,'1990-01-01','2026-03-10',NULL,'9876543210','A-46 Wind Park, CG Road, Navrangpura, Ahmedabad, Gujarat - 380009','2026-03-10 19:54:56','2026-04-08 11:19:25',0,'121212'),(2,'cg_mgr','pbkdf2_sha256$1200000$4hMUvoGe4vhajTRCsSHC8A$aR7EAn0W5JgpjBjfMYPsMkae6bA+beJZNKxJEx+JlUY=','2026-04-05 05:42:49','mgr.cg@bakery.in',1,'branch manager',1,1,'1992-08-20','2023-03-12',NULL,'9876543220','Office No. 12, CG Road, Navrangpura, Ahmedabad, Gujarat - 380009','2026-03-15 18:23:42','2026-04-05 11:12:49',0,'121212'),(3,'cg_bkr','pbkdf2_sha256$1200000$iENMScG8J45WcIS3bR4n4E$Fjv6YsD5gAUGwDm+aqw/TqqiuABYoUXVbUeoDSSy4VY=','2026-04-08 05:45:10','bkr.cg@bakery.in',1,'baker',1,1,'1995-02-10','2024-01-10',NULL,'9876543211','C-45, Bhavnath Complex, Ahmedabad East, Gujarat - 380008','2026-03-15 18:23:42','2026-04-08 11:15:10',0,'121212'),(4,'cg_stf','pbkdf2_sha256$1200000$VisSxl1vE06csKsxQU2LkK$4NW3v2JmEbX8ggfgDAcfc+hZScwOSZ+O1b18wpnN4N4=','2026-04-08 05:17:51','stf.cg@bakery.in',1,'service staff',1,1,'1998-11-20','2024-02-01',NULL,'9876543215','Flat 302, Sunrise Apartments, Navrangpura, Ahmedabad, Gujarat - 380009','2026-03-15 18:23:42','2026-04-08 10:47:51',0,'121212'),(5,'sb_mgr','pbkdf2_sha256$1200000$wn9YvFRnq6dV6inJRrSRD6$WKXpQiSMFVQnIYYTMciYsOu/box0wB32uQ5koDazStQ=',NULL,'mgr.sb@bakery.in',1,'branch manager',2,1,'1988-12-05','2023-03-15',NULL,'9876543212','Shop No. 7, SB Road Market, Satellite, Ahmedabad, Gujarat - 380015','2026-03-15 18:23:42','2026-03-31 15:55:06',1,'121212'),(6,'sb_bkr','pbkdf2_sha256$1200000$cJmhgPYoSCenBztb7PD9Bl$LL2zOu9S3+YhDAQN1vSESIA58B/kWKFFhBaCexYxnSg=',NULL,'bkr.sb@bakery.in',1,'baker',2,1,'1996-03-15','2024-01-12',NULL,'9876543214','House No. 21, Shantiniketan Society, Ahmedabad West, Gujarat - 380061','2026-03-15 18:23:42','2026-03-31 15:55:07',1,'121212'),(7,'sb_stf','pbkdf2_sha256$1200000$QwlI6WRnQiVVoobrogDVKe$3YMIJ+y7yQtuuTXRljzMFKhAG7Pwo4yWvbw8vAkjhqA=',NULL,'stf.sb@bakery.in',1,'service staff',2,1,NULL,NULL,NULL,'9876543216','Plot No. 88, Maninagar Extension, Ahmedabad, Gujarat - 380008','2026-03-28 01:01:52','2026-03-29 23:11:28',1,'967157'),(8,'kk_stf','pbkdf2_sha256$1200000$ftJXWrasoXiuZAEPzf5SQU$f4XF5ES2O6LXVXz4DR/f4MRpYjt9OE3C46OTHdA3EeY=',NULL,'stf.kk@bakery.in',1,'service staff',3,1,NULL,NULL,NULL,'9876543217','Block A-12, Kalupur Tower, Kalupur, Ahmedabad, Gujarat - 380002','2026-03-29 16:22:31','2026-03-29 23:11:28',1,'960325'),(9,'bp_bkr','pbkdf2_sha256$1200000$EeReBUw3iubEMJOT4CDVXi$bME8911zzoHNUe2OPgs9zePsZr/g+dcbdmg0C9ap8GU=',NULL,'bp.bkr@bakery.in',1,'baker',4,1,NULL,NULL,NULL,'9778787200',NULL,'2026-04-04 13:17:42','2026-04-04 15:43:19',1,'809775'),(10,'cg_stf2','pbkdf2_sha256$1200000$CUh9fomh9FAtWXo6oBMGkx$JdD73NYkCEFjJrW5X3zhRROGDbq1SSqrubRIFJ8M/Pw=',NULL,'stf2.cg@bakery.in',1,'service staff',1,1,NULL,NULL,NULL,'7888999000',NULL,'2026-04-05 11:14:45','2026-04-05 11:14:46',1,'247454');
/*!40000 ALTER TABLE `user_mst` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'testbms'
--

--
-- Dumping routines for database 'testbms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 22:04:18
