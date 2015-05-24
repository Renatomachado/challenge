CREATE DATABASE  IF NOT EXISTS `challenge` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `challenge`;
-- MySQL dump 10.13  Distrib 5.6.19, for linux-glibc2.5 (x86_64)
--
-- Host: localhost    Database: challenge
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

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
-- Table structure for table `caracteristicas`
--

DROP TABLE IF EXISTS `caracteristicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `caracteristicas` (
  `nome` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personagens`
--

DROP TABLE IF EXISTS `personagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personagens` (
  `nome` varchar(200) NOT NULL,
  `sexo` varchar(50) NOT NULL,
  `idade` int(10) unsigned NOT NULL,
  `cabelo` varchar(50) DEFAULT NULL,
  `olhos` varchar(50) DEFAULT NULL,
  `origem` varchar(200) DEFAULT NULL,
  `atividade` varchar(50) DEFAULT NULL,
  `voz` varchar(50) DEFAULT NULL,
  `mae` varchar(200) DEFAULT NULL,
  `pai` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`nome`),
  UNIQUE KEY `new_tablecol_UNIQUE` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `personagens_caracteristicas`
--

DROP TABLE IF EXISTS `personagens_caracteristicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personagens_caracteristicas` (
  `personagem` varchar(200) NOT NULL,
  `caracteristica` varchar(50) NOT NULL,
  PRIMARY KEY (`personagem`,`caracteristica`),
  KEY `fk_perso_caract_caracteristica_idx` (`caracteristica`),
  CONSTRAINT `fk_perso_caract_personagem` FOREIGN KEY (`personagem`) REFERENCES `personagens` (`nome`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_perso_caract_caracteristica` FOREIGN KEY (`caracteristica`) REFERENCES `caracteristicas` (`nome`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `relacionamentos`
--

DROP TABLE IF EXISTS `relacionamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relacionamentos` (
  `personagem` varchar(200) NOT NULL,
  `relacionado` varchar(200) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  KEY `fk_personagem_idx` (`personagem`),
  KEY `fk_relacionado_idx` (`relacionado`),
  CONSTRAINT `fk_personagem` FOREIGN KEY (`personagem`) REFERENCES `personagens` (`nome`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_relacionado` FOREIGN KEY (`relacionado`) REFERENCES `personagens` (`nome`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-05-24 10:41:33
