-- MySQL dump 10.11
--
-- Host: localhost    Database: yourock
-- ------------------------------------------------------
-- Server version	5.0.54-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES cp1251 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `files` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `uid` int(10) unsigned NOT NULL,
  `oid` int(10) unsigned NOT NULL COMMENT 'owner id',
  `name` varchar(255) collate utf8_unicode_ci NOT NULL,
  `date` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `uid` (`uid`,`oid`,`date`)
) ENGINE=MyISAM AUTO_INCREMENT=77 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (2,1,1,'iAlertU_Capture.jpg',1219263600),(3,1,1,'avatar.jpg',1219264614),(4,1,1,'oblojka.jpg',1219264643),(5,1,1,'posting.php',1219265974),(6,1,1,'address.txt',1219266725),(8,1,1,'20.08.2008 21-20-15 as.txt',1219267215),(9,1,1,'20.08.2008 21-20-51 as.txt',1219267251),(75,1,1,'Garden Defense.exe',1219955540),(13,3,3,'avatar-small.jpg',1219363562),(12,3,3,'21.08.2008 23-34-47 mpi.c',1219361687),(14,3,3,'22.08.2008 00-30-22 avatar-small.jpg',1219365022),(15,3,3,'map.gif',1219366899),(63,1,1,'Doors.jpg',1219854242),(18,3,3,'preved-preved.png',1219367788),(28,2,3,'preved.png',1219370565),(22,4,4,'atheros4229.zip',1219368354),(23,4,3,'preved.png',1219368696),(30,3,1,'oblojka.jpg',1219371269),(32,1,1,'avatar-small.jpg',1219372093),(34,3,1,'iAlertU_Capture.jpg',1219372215),(37,3,1,'22.08.2008 02-37-50 avatar-small.jpg',1219372670),(45,1,3,'26.08.2008 02-03-55 avatar-small.jpg',1219716235),(47,1,1,'ohhh.jpg',1219717167),(50,1,1,' о работе проекта.rtf',1219709619),(51,2,1,' о работе проекта.rtf',1219709667),(76,1,1,'28.08.2008 20-37-31 26.08.2008 02-03-55 avatar-small.jpg',1219955851),(54,1,1,'26.08.2008 19-27-51 сиськи.jpg',1219778871),(55,1,1,'as.txt',1219778985),(56,1,1,'mpi.c',1219778986),(57,1,1,'test.c',1219778987),(58,1,1,'index.php5',1219778992),(59,1,1,'26.08.2008 19-32-25 as.txt',1219779145),(60,1,1,'26.08.2008 19-32-41 as.txt',1219779161),(61,1,1,'26.08.2008 19-53-45 as.txt',1219780425),(62,1,1,'26.08.2008 19-54-28 address.txt',1219780468),(66,1,1,'27.08.2008 19-10-02 Doors.jpg',1219864202),(68,1,1,'27.08.2008 19-13-31 iAlertU_Capture.jpg',1219864411),(69,1,1,'27.08.2008 19-52-28 as.txt',1219866748),(70,1,1,'27.08.2008 19-53-01 as.txt',1219866781),(71,1,1,'27.08.2008 19-53-19 as.txt',1219866799),(72,2,2,'Voc..xls',1219871077),(73,5,5,'me_150x150.gif',1219946312),(74,5,1,'сиськи.jpg',1219946331);
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `groups` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` text collate utf8_unicode_ci NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups_users`
--

DROP TABLE IF EXISTS `groups_users`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `groups_users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `uid` int(10) unsigned NOT NULL,
  `gid` int(10) unsigned NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `uid` (`uid`,`gid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `groups_users`
--

LOCK TABLES `groups_users` WRITE;
/*!40000 ALTER TABLE `groups_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `email` varchar(255) collate utf8_unicode_ci NOT NULL,
  `password` char(73) collate utf8_unicode_ci NOT NULL COMMENT 'md5 + ":" + sha1',
  `name` text collate utf8_unicode_ci NOT NULL,
  `other` mediumtext collate utf8_unicode_ci NOT NULL COMMENT 'serialize(array(...))',
  `used` bigint(20) NOT NULL COMMENT 'used space (in bytes)',
  `quota` bigint(20) NOT NULL COMMENT 'quota, in bytes',
  PRIMARY KEY  (`id`),
  KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SET character_set_client = @saved_cs_client;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nasretdinov@gmail.com','84ba3f9ccd518d8807228c43639053a4:d6542eac87a572bc4643a28885eefb0206f60446','Насретдинов Юрий Алексеевич','a:1:{s:5:\"color\";s:6:\"46de70\";}',2354344,2147483648),(2,'rkrivchenkov@gmail.com','81133164567231d6db00c463c2562927:9c1efe8321afad384be8cb245e178b0f9fc22904','Krivchenkov Roman Igorevich','a:1:{s:5:\"color\";s:6:\"3e5334\";}',13824,2147483648),(3,'support@microsoft.com','84ba3f9ccd518d8807228c43639053a4:d6542eac87a572bc4643a28885eefb0206f60446','Гейтс Билл Алексеевич','a:1:{s:5:\"color\";s:6:\"f85cf2\";}',0,0),(4,'ramzeska@gmail.com','67614aacd469da7f9d611c9be60462f1:8166ea861e992cbd48dc4088713c9705a14b0641','Рамзес Тутанхомончег','a:1:{s:5:\"color\";s:6:\"7b98f2\";}',0,0),(5,'push@me.com','e10adc3949ba59abbe56e057f20f883e:7c4a8d09ca3762af61e59520943dc26494f8941b','Кокорин Кирилл','a:1:{s:5:\"color\";s:6:\"9f2c8f\";}',20378,2147483648);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2008-08-30 17:39:35
