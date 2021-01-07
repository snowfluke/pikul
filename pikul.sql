-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2021 at 04:21 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pikul`
--

-- --------------------------------------------------------

--
-- Table structure for table `adm`
--

CREATE TABLE `adm` (
  `admId` int(11) NOT NULL,
  `usr` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `adm`
--

INSERT INTO `adm` (`admId`, `usr`, `pwd`) VALUES
(1, 'awal', 'icequeen');

-- --------------------------------------------------------

--
-- Table structure for table `brg`
--

CREATE TABLE `brg` (
  `idBarang` varchar(255) NOT NULL,
  `namaBarang` varchar(255) NOT NULL,
  `hargaBarang` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `brg`
--

INSERT INTO `brg` (`idBarang`, `namaBarang`, `hargaBarang`) VALUES
('KV2M15', 'Kabel VGA 2 Meter', 100000),
('LAP1B34', 'Lisensi Adobe Photoshop 1 Bulan', 300000),
('LLTT21', 'Laptop Lenovo Thinkpad T310', 2500000),
('MV52', 'Mouse Votre', 50000);

-- --------------------------------------------------------

--
-- Table structure for table `mhs`
--

CREATE TABLE `mhs` (
  `nim` int(9) NOT NULL,
  `nama` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mhs`
--

INSERT INTO `mhs` (`nim`, `nama`) VALUES
(195520001, 'Resti Rahmawati'),
(195520002, 'Putri Damayani'),
(195520004, 'Edgar Miko Fernanda'),
(195520005, 'Ristianingsih'),
(195520006, 'Amarulloh Miftahul Khoeri'),
(195520008, 'Nurfadhli Abdurrachman Hakim'),
(195520009, 'Elang Yakti Wirabuana'),
(195520011, 'Khusna Salsabila'),
(195520012, 'Henky Fajar Syafani'),
(195520013, 'Noval Aldo Robiyanto'),
(195520014, 'Rafiq Chasnan Habibi'),
(195520015, 'Ina Kurnia Sari'),
(195520018, 'Willy Setiawan'),
(195520019, 'Awal Ariansyah'),
(195520020, 'Diky Setiawan'),
(195520021, 'Sri Purnama Sari'),
(195520022, 'Imam Fahrudin'),
(195520023, 'Khoirul Zuhri'),
(195520024, 'Maknum Munib');

-- --------------------------------------------------------

--
-- Table structure for table `pjm`
--

CREATE TABLE `pjm` (
  `idPjm` int(5) NOT NULL,
  `idNm` int(9) NOT NULL,
  `idBrg` varchar(255) NOT NULL,
  `jmlPjm` int(8) DEFAULT NULL,
  `stsPjm` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pjm`
--

INSERT INTO `pjm` (`idPjm`, `idNm`, `idBrg`, `jmlPjm`, `stsPjm`) VALUES
(1, 195520022, 'MV52', 50000, 'telat'),
(2, 195520006, 'KV2M15', 100000, NULL),
(3, 195520024, 'LAP1B34', 300000, 'NULL'),
(4, 195520019, 'LLTT21', 500000, 'NULL');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adm`
--
ALTER TABLE `adm`
  ADD PRIMARY KEY (`admId`);

--
-- Indexes for table `brg`
--
ALTER TABLE `brg`
  ADD PRIMARY KEY (`idBarang`);

--
-- Indexes for table `mhs`
--
ALTER TABLE `mhs`
  ADD PRIMARY KEY (`nim`);

--
-- Indexes for table `pjm`
--
ALTER TABLE `pjm`
  ADD PRIMARY KEY (`idPjm`),
  ADD KEY `idNm` (`idNm`),
  ADD KEY `idBrg` (`idBrg`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adm`
--
ALTER TABLE `adm`
  MODIFY `admId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pjm`
--
ALTER TABLE `pjm`
  MODIFY `idPjm` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pjm`
--
ALTER TABLE `pjm`
  ADD CONSTRAINT `pjm_ibfk_1` FOREIGN KEY (`idNm`) REFERENCES `mhs` (`nim`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pjm_ibfk_2` FOREIGN KEY (`idBrg`) REFERENCES `brg` (`idBarang`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
