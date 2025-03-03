-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table mydata.cart_detail
CREATE TABLE IF NOT EXISTS `cart_detail` (
  `cart_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(100) NOT NULL,
  PRIMARY KEY (`cart_detail_id`) USING BTREE,
  KEY `FK_cart_detail_cart` (`cart_id`),
  KEY `FK_cart_detail_products` (`product_id`),
  CONSTRAINT `FK_cart_detail_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cart_detail_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table mydata.cart_detail: ~19 rows (approximately)
REPLACE INTO `cart_detail` (`cart_detail_id`, `cart_id`, `product_id`, `quantity`) VALUES
	(11, 90, 20, 1),
	(12, 90, 22, 1),
	(13, 90, 23, 1),
	(14, 91, 20, 1),
	(15, 91, 22, 1),
	(16, 92, 20, 1),
	(17, 93, 20, 1),
	(18, 94, 22, 1),
	(19, 94, 23, 1),
	(20, 95, 22, 1),
	(21, 95, 23, 1),
	(22, 96, 22, 1),
	(23, 96, 23, 1),
	(24, 97, 24, 1),
	(25, 97, 22, 1),
	(26, 98, 22, 1),
	(27, 99, 22, 1),
	(28, 100, 22, 1),
	(29, 101, 22, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
