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

-- Dumping structure for table mydata.products
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL DEFAULT 0,
  `product_name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `img_url` varchar(100) NOT NULL,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK_products_category` (`category_id`),
  CONSTRAINT `FK_products_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table mydata.products: ~5 rows (approximately)
REPLACE INTO `products` (`product_id`, `category_id`, `product_name`, `price`, `stock`, `description`, `img_url`, `title`) VALUES
	(20, 3, 'thịt heo', 1234, 324, 'sadasd', '/uploads/af71977c-f6ff-4e1a-97e7-5d1d0e52022b-thitbouc.jpg', 'sadas'),
	(22, 6, 'thịt bò', 14124, 141, 'dưaqa', '/uploads/b4cbc83d-0f15-4b61-8649-eea32db5ea98-thitbo.jpg', 'adaw'),
	(23, 4, 'thịt cá', 1313131, 123, 'sadas', '/uploads/0d23a274-5a78-4269-89af-029c6a883df7-cahoi.jpg', 'đâs'),
	(24, 2, 'thịt gà', 1000000, 11, 'ssss', '/uploads/4ad5c84d-a6be-4782-a557-2acda41eebce-thitbo.jpg', 'sss'),
	(25, 1, 'rau', 123123, 222, 'ss', '/uploads/3e1cda35-d878-4bc8-b635-794801c5c2ec-thitbouc.jpg', 'ss');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
