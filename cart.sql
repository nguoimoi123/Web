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

-- Dumping structure for table mydata.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `cart_code` varchar(100) DEFAULT NULL,
  `state` int(11) DEFAULT 0,
  `payment` varchar(50) DEFAULT NULL,
  `id_shipping` int(11) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FK_cart_users` (`id_user`),
  KEY `FK_cart_shipping` (`id_shipping`),
  CONSTRAINT `FK_cart_shipping` FOREIGN KEY (`id_shipping`) REFERENCES `shipping` (`id_shipping`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cart_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table mydata.cart: ~12 rows (approximately)
REPLACE INTO `cart` (`cart_id`, `id_user`, `cart_code`, `state`, `payment`, `id_shipping`) VALUES
	(90, 1, 'CART-1738560331833-mz6h1n', 3, 'cash_on_delivery', 22),
	(91, 1, 'CART-1738741160059-e3cb26', 3, 'paypal', 22),
	(92, 1, 'CART-1739930545049-7lije3', 4, 'credit_card', 22),
	(93, 1, 'CART-1739976432027-bnvclt', 1, 'cash_on_delivery', 22),
	(94, 1, 'CART-1740818179374-5xby4f', 0, 'cash_on_delivery', 22),
	(95, 1, 'CART-1740980766531-4q0xbv', 0, 'qr_payment', 22),
	(96, 1, 'CART-1740980963336-3vuslm', 0, 'qr_payment', 22),
	(97, 1, 'CART-1740981042647-y6nzzc', 0, 'cash_on_delivery', 22),
	(98, 1, 'CART-1740981217550-hl2as2', 0, 'cash_on_delivery', 22),
	(99, 1, 'CART-1740981308600-krfvse', 0, 'qr_payment', 22),
	(100, 1, 'CART-1740981459537-yap8ux', 0, 'qr_payment', 22),
	(101, 1, 'CART-1740981470568-f9a9g0', 0, 'qr_payment', 22);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
