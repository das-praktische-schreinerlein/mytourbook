-- MySQL dump 10.16  Distrib 10.1.13-MariaDB, for Win32 (AMD64)
--
-- Host: localhost    Database: mytb
-- ------------------------------------------------------
-- Server version	10.1.13-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image` (
  `I_ID` int(11) NOT NULL AUTO_INCREMENT,
  `K_ID` int(11) NOT NULL,
  `T_ID` int(11) DEFAULT NULL,
  `I_KATNAME` text COLLATE latin1_general_ci,
  `I_KATDESC` text COLLATE latin1_general_ci,
  `I_GESPERRT` int(11) DEFAULT NULL,
  `I_LOCHIRARCHIE` text COLLATE latin1_general_ci,
  `I_DATE` datetime DEFAULT NULL,
  `I_DIR` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `I_FILE` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `I_KEYWORDS` text COLLATE latin1_general_ci,
  `I_GPS_LAT` float DEFAULT NULL,
  `I_GPS_LON` float DEFAULT NULL,
  `I_GPS_ELE` float DEFAULT NULL,
  `I_RATE` int(11) DEFAULT NULL,
  `I_RATE_MOTIVE` int(11) DEFAULT NULL,
  `I_RATE_WICHTIGKEIT` int(11) DEFAULT NULL,
  PRIMARY KEY (`I_ID`),
  KEY `idx_I__I_ID` (`I_ID`),
  KEY `idx_I__K_ID` (`K_ID`),
  KEY `idx_I__T_ID` (`T_ID`),
  KEY `I_GPS_LAT` (`I_GPS_LAT`),
  KEY `I_GPS_LON` (`I_GPS_LON`),
  KEY `I_DATE` (`I_DATE`),
  KEY `I_RATE` (`I_RATE`),
  KEY `I_RATE_MOTIVE` (`I_RATE_MOTIVE`),
  KEY `I_RATE_WICHTIGKEIT` (`I_RATE_WICHTIGKEIT`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

LOCK TABLES `image` WRITE;
/*!40000 ALTER TABLE `image` DISABLE KEYS */;
/*!40000 ALTER TABLE `image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kategorie_full`
--

DROP TABLE IF EXISTS `kategorie_full`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kategorie_full` (
  `K_ID` int(11) NOT NULL AUTO_INCREMENT,
  `T_ID` int(11) NOT NULL,
  `K_T_IDS` varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  `K_T_IDS_FULL` varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  `I_ID` int(11) DEFAULT NULL,
  `L_ID` int(11) NOT NULL,
  `TR_ID` int(11) NOT NULL,
  `K_GESPERRT` int(11) DEFAULT NULL,
  `K_DATEBIS` datetime DEFAULT NULL,
  `K_DATEVON` datetime DEFAULT NULL,
  `K_GPSTRACKS_BASEFILE` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `K_GPS_LAT` float DEFAULT NULL,
  `K_GPS_LON` float DEFAULT NULL,
  `K_META_SHORTDESC` mediumtext COLLATE latin1_general_ci,
  `K_NAME` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `K_HTML` mediumtext COLLATE latin1_general_ci,
  `K_KEYWORDS` mediumtext COLLATE latin1_general_ci,
  `K_DISTANCE` float DEFAULT NULL,
  `K_ALTITUDE_ASC` float DEFAULT NULL,
  `K_ALTITUDE_DESC` float DEFAULT NULL,
  `K_ALTITUDE_MIN` float DEFAULT NULL,
  `K_ALTITUDE_MAX` float DEFAULT NULL,
  `K_RATE_SCHWIERIGKEIT` int(11) DEFAULT NULL,
  `K_RATE_AUSDAUER` int(11) DEFAULT NULL,
  `K_RATE_KRAFT` int(11) DEFAULT NULL,
  `K_RATE_MENTAL` int(11) DEFAULT NULL,
  `K_RATE_BILDUNG` int(11) DEFAULT NULL,
  `K_RATE_MOTIVE` int(11) DEFAULT NULL,
  `K_RATE_WICHTIGKEIT` int(11) DEFAULT NULL,
  `K_RATE_GESAMT` int(11) DEFAULT NULL,
  `K_TYPE` int(11) DEFAULT NULL,
  PRIMARY KEY (`K_ID`),
  KEY `idx_K__K_ID` (`K_ID`),
  KEY `idx_K__T_ID` (`T_ID`),
  KEY `idx_K__L_ID` (`L_ID`),
  KEY `K_GPS_LAT` (`K_GPS_LAT`),
  KEY `K_GPS_LON` (`K_GPS_LON`),
  KEY `K_RATE_SCHWIERIGKEIT` (`K_RATE_SCHWIERIGKEIT`),
  KEY `K_RATE_AUSDAUER` (`K_RATE_AUSDAUER`),
  KEY `K_RATE_KRAFT` (`K_RATE_KRAFT`),
  KEY `K_RATE_MENTAL` (`K_RATE_MENTAL`),
  KEY `K_RATE_BILDUNG` (`K_RATE_BILDUNG`),
  KEY `K_RATE_MOTIVE` (`K_RATE_MOTIVE`),
  KEY `K_RATE_WICHTIGKEIT` (`K_RATE_WICHTIGKEIT`),
  KEY `K_RATE_GESAMT` (`K_RATE_GESAMT`),
  KEY `K_TYPE` (`K_TYPE`),
  KEY `K_DATEVON` (`K_DATEVON`),
  KEY `K_DATEBIS` (`K_DATEBIS`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategorie_full`
--

LOCK TABLES `kategorie_full` WRITE;
/*!40000 ALTER TABLE `kategorie_full` DISABLE KEYS */;
/*!40000 ALTER TABLE `kategorie_full` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `L_ID` int(11) DEFAULT NULL,
  `L_LOCHIRARCHIE` text COLLATE latin1_general_ci,
  `L_LOCHIRARCHIETXT` text COLLATE latin1_general_ci,
  `L_META_SHORTDESC` text COLLATE latin1_general_ci,
  `L_NAME` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `L_URL_HOMEPAGE` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `L_HTML` mediumtext COLLATE latin1_general_ci,
  `L_PARENT_ID` int(11) DEFAULT NULL,
  `L_GPS_LAT` float DEFAULT NULL,
  `L_GPS_LON` float DEFAULT NULL,
  `L_GEO_AREA` text COLLATE latin1_general_ci,
  `L_TYP` int(11) DEFAULT NULL,
  `L_KATIDS` text COLLATE latin1_general_ci,
  `L_TIDS` text COLLATE latin1_general_ci,
  KEY `L_ID` (`L_ID`),
  KEY `L_GPS_LAT` (`L_GPS_LAT`),
  KEY `L_GPS_LON` (`L_GPS_LON`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rates` (
  `R_ID` int(11) NOT NULL,
  `R_FIELDNAME` varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  `R_FIELDVALUE` int(11) DEFAULT NULL,
  `R_GRADE` varchar(80) COLLATE latin1_general_ci DEFAULT NULL,
  `R_GRADE_DESC` varchar(80) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tour` (
  `T_ID` int(11) NOT NULL AUTO_INCREMENT,
  `L_ID` int(11) NOT NULL,
  `K_ID` int(11) DEFAULT NULL,
  `T_K_IDS` varchar(2000) COLLATE latin1_general_ci DEFAULT NULL,
  `T_DATEVON` date DEFAULT NULL,
  `T_NAME` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_DESC_GEFAHREN` text COLLATE latin1_general_ci,
  `T_DESC_FUEHRER` text COLLATE latin1_general_ci,
  `T_DESC_FUEHRER_FULL` text COLLATE latin1_general_ci,
  `T_DESC_GEBIET` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_DESC_TALORT` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_DESC_ZIEL` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_META_SHORTDESC` mediumtext COLLATE latin1_general_ci,
  `T_KEYWORDS` text COLLATE latin1_general_ci,
  `T_ELE_MAX` double DEFAULT NULL,
  `T_GPS_LAT` float DEFAULT NULL,
  `T_GPS_LON` float DEFAULT NULL,
  `T_GPSTRACKS_BASEFILE` char(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_HTML_LIST` mediumtext COLLATE latin1_general_ci,
  `T_RATE` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_KS` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_FIRN` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_GLETSCHER` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_KLETTERN` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_BERGTOUR` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_SCHNEESCHUH` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_RATE_AUSDAUER` int(11) DEFAULT '0',
  `T_RATE_BILDUNG` int(11) DEFAULT '0',
  `T_RATE_GESAMT` int(11) DEFAULT '0',
  `T_RATE_KRAFT` int(11) DEFAULT '0',
  `T_RATE_MENTAL` int(11) DEFAULT '0',
  `T_RATE_MOTIVE` int(11) DEFAULT '0',
  `T_RATE_SCHWIERIGKEIT` int(11) DEFAULT '0',
  `T_RATE_WICHTIGKEIT` int(11) DEFAULT '0',
  `T_ROUTE_AUFSTIEG_NAME` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_ROUTE_AUFSTIEG_DAUER` double DEFAULT NULL,
  `T_ROUTE_AUFSTIEG_HM` double DEFAULT NULL,
  `T_ROUTE_AUFSTIEG_KM` double DEFAULT NULL,
  `T_ROUTE_AUFSTIEG_SL` double DEFAULT NULL,
  `T_ROUTE_AUFSTIEG_M` double DEFAULT NULL,
  `T_ROUTE_ABSTIEG_NAME` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_ROUTE_ABSTIEG_DAUER` double DEFAULT NULL,
  `T_ROUTE_ABSTIEG_HM` double DEFAULT NULL,
  `T_ROUTE_ABSTIEG_M` double DEFAULT NULL,
  `T_ROUTE_HUETTE_NAME` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `T_ROUTE_HUETTE_DAUER` double DEFAULT NULL,
  `T_ROUTE_HUETTE_HM` double DEFAULT NULL,
  `T_ROUTE_HUETTE_M` double DEFAULT NULL,
  `T_ROUTE_ZUSTIEG_DAUER` double DEFAULT NULL,
  `T_ROUTE_ZUSTIEG_HM` double DEFAULT NULL,
  `T_ROUTE_ZUSTIEG_M` double DEFAULT NULL,
  `T_ROUTE_DAUER` double DEFAULT NULL,
  `T_ROUTE_HM` double DEFAULT NULL,
  `T_ROUTE_M` double DEFAULT NULL,
  `T_TYP` int(11) DEFAULT NULL,
  PRIMARY KEY (`T_ID`),
  KEY `idx_T__T_ID` (`T_ID`),
  KEY `idx_T__L_ID` (`L_ID`),
  KEY `T_GPS_LAT` (`T_GPS_LAT`),
  KEY `T_GPS_LON` (`T_GPS_LON`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour`
--

LOCK TABLES `tour` WRITE;
/*!40000 ALTER TABLE `tour` DISABLE KEYS */;
/*!40000 ALTER TABLE `tour` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-04 20:36:21
