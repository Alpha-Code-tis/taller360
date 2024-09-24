-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: tis_mariadb
-- Generation Time: Sep 24, 2024 at 02:43 PM
-- Server version: 10.6.3-MariaDB-1:10.6.3+maria~focal
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taller360`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrador`
--

CREATE TABLE `administrador` (
  `id_admi` int(11) NOT NULL,
  `nombre` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasenia` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `administrador`
--

INSERT INTO `administrador` (`id_admi`, `nombre`, `contrasenia`) VALUES
(1, 'Juan Perez', 'password123'),
(2, 'Maria Lopez', 'securepass456'),
(3, 'juan pérez', 'hashed_password_1'),
(4, 'ana gómez', 'hashed_password_2'),
(5, 'juan pérez', 'hashed_password_1'),
(6, 'ana gómez', 'hashed_password_2'),
(7, 'juan pérez', 'hashed_password_1'),
(8, 'ana gómez', 'hashed_password_2'),
(9, 'juan pérez', 'hashed_password_1'),
(10, 'ana gómez', 'hashed_password_2'),
(11, 'juan pérez', 'hashed_password_1'),
(12, 'ana gómez', 'hashed_password_2'),
(13, 'juan pérez', 'hashed_password_1'),
(14, 'ana gómez', 'hashed_password_2'),
(15, 'juan pérez', 'hashed_password_1'),
(16, 'ana gómez', 'hashed_password_2'),
(17, 'juan pérez', 'hashed_password_1'),
(18, 'ana gómez', 'hashed_password_2'),
(19, 'juan pérez', 'hashed_password_1'),
(20, 'ana gómez', 'hashed_password_2'),
(21, 'juan pérez', 'hashed_password_1'),
(22, 'ana gómez', 'hashed_password_2'),
(23, 'juan pérez', 'hashed_password_1'),
(24, 'ana gómez', 'hashed_password_2'),
(25, 'juan pérez', 'hashed_password_1'),
(26, 'ana gómez', 'hashed_password_2'),
(27, 'juan pérez', 'hashed_password_1'),
(28, 'ana gómez', 'hashed_password_2'),
(29, 'juan pérez', 'hashed_password_1'),
(30, 'ana gómez', 'hashed_password_2'),
(31, 'juan pérez', 'hashed_password_1'),
(32, 'ana gómez', 'hashed_password_2'),
(33, 'juan pérez', 'hashed_password_1'),
(34, 'ana gómez', 'hashed_password_2'),
(35, 'juan pérez', 'hashed_password_1'),
(36, 'ana gómez', 'hashed_password_2'),
(37, 'juan pérez', 'hashed_password_1'),
(38, 'ana gómez', 'hashed_password_2');

-- --------------------------------------------------------

--
-- Table structure for table `alcance`
--

CREATE TABLE `alcance` (
  `id_alcance` int(11) NOT NULL,
  `id_sprint` int(11) DEFAULT NULL,
  `descripcion` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `alcance`
--

INSERT INTO `alcance` (`id_alcance`, `id_sprint`, `descripcion`) VALUES
(5, 3, 'desarrollo de la api'),
(6, 4, 'diseño de la interfaz'),
(7, 3, 'desarrollo de la api'),
(8, 4, 'diseño de la interfaz'),
(9, 24, 'Desarrollo de modulo'),
(10, 25, 'Desarrollo de modulo'),
(11, 26, 'Desarrollo de modulo'),
(12, 27, 'Desarrollo de modulo'),
(13, 28, 'Desarrollo de modulo');

-- --------------------------------------------------------

--
-- Table structure for table `autoevaluacion`
--

CREATE TABLE `autoevaluacion` (
  `id_autoe` int(11) NOT NULL,
  `id_evaluacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cantidad`
--

CREATE TABLE `cantidad` (
  `id_cantidad` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `cant_min` int(11) DEFAULT NULL,
  `cant_max` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cantidad`
--

INSERT INTO `cantidad` (`id_cantidad`, `id_empresa`, `cantidad`, `cant_min`, `cant_max`) VALUES
(1, 1, 100, 50, 150),
(2, 2, 200, 150, 300),
(3, 1, 100, 50, 150),
(4, 2, 200, 150, 300),
(5, 1, 100, 50, 150),
(6, 2, 200, 150, 300),
(7, 1, 100, 50, 150),
(8, 2, 200, 150, 300),
(9, 1, 100, 50, 150),
(10, 2, 200, 150, 300),
(11, 1, 100, 50, 150),
(12, 2, 200, 150, 300),
(13, 1, 100, 50, 150),
(14, 2, 200, 150, 300),
(15, 1, 100, 50, 150),
(16, 2, 200, 150, 300),
(17, 1, 100, 50, 150),
(18, 2, 200, 150, 300),
(19, 1, 100, 50, 150),
(20, 2, 200, 150, 300),
(21, 1, 100, 50, 150),
(22, 2, 200, 150, 300),
(23, 1, 100, 50, 150),
(24, 2, 200, 150, 300);

-- --------------------------------------------------------

--
-- Table structure for table `cruzada`
--

CREATE TABLE `cruzada` (
  `id_cruzada` int(11) NOT NULL,
  `id_evaluacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_auto`
--

CREATE TABLE `detalle_auto` (
  `id_rep_auto` int(11) NOT NULL,
  `id_autoe` int(11) DEFAULT NULL,
  `descripcion_auto` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_par`
--

CREATE TABLE `detalle_par` (
  `id_det_par` int(11) NOT NULL,
  `id_pares` int(11) DEFAULT NULL,
  `descripcion_par` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detalle_reporte`
--

CREATE TABLE `detalle_reporte` (
  `id_rep_det` int(11) NOT NULL,
  `id_cruzada` int(11) DEFAULT NULL,
  `descripcion_cruzada` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `docente`
--

CREATE TABLE `docente` (
  `id_docente` int(11) NOT NULL,
  `id_noti` int(11) DEFAULT NULL,
  `id_admi` int(11) DEFAULT NULL,
  `id_grupo` int(11) DEFAULT NULL,
  `nombre_docente` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ap_pat` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ap_mat` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasenia` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `docente`
--

INSERT INTO `docente` (`id_docente`, `id_noti`, `id_admi`, `id_grupo`, `nombre_docente`, `ap_pat`, `ap_mat`, `contrasenia`, `correo`) VALUES
(1, NULL, 1, NULL, 'Carlos Gomez', 'Gomez', 'Martinez', 'teacherpass789', 'carlos.gomez@school.com'),
(2, NULL, 2, NULL, 'Laura Torres', 'Torres', 'Hernandez', 'mypassword101', 'laura.torres@school.com'),
(5, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(6, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(7, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(8, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(9, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(10, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(11, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(12, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(13, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(14, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(15, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(16, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(17, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(18, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(19, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(20, 1, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com'),
(21, 1, 1, 1, 'carlos martínez', 'martínez', 'sánchez', 'hashed_password_3', 'carlos@example.com'),
(22, 2, 2, 2, 'lucía fernández', 'fernández', 'lópez', 'hashed_password_4', 'lucia@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL,
  `id_cantidad` int(11) DEFAULT NULL,
  `id_representante` int(11) DEFAULT NULL,
  `id_planificacion` int(11) DEFAULT NULL,
  `nombre_empresa` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_corto` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_empresa` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `id_cantidad`, `id_representante`, `id_planificacion`, `nombre_empresa`, `nombre_corto`, `direccion`, `telefono`, `correo_empresa`, `logo`) VALUES
(1, NULL, NULL, NULL, 'Tech Solutions', 'TechSol', '1234 Tech Road', '555-0123', 'info@techsol.com', NULL),
(2, NULL, NULL, NULL, 'Green Innovations', 'GreenInc', '4321 Green Way', '555-0456', 'contact@greeninc.com', NULL),
(11, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(12, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(13, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(14, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(15, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(16, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(17, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(18, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(19, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(20, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(21, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(22, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(23, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(24, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(25, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(26, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(27, 1, 1, 1, 'empresa a', 'empa', 'calle 1', '123456789', 'contacto@empresaa.com', NULL),
(28, 2, 2, 2, 'empresa b', 'empb', 'calle 2', '987654321', 'contacto@empresab.com', NULL),
(29, NULL, NULL, NULL, 'ssad', 'asd', 'asd', '76910725', 'asd@gmail.copm', 'logos/grAP55AipnBuAN9YSws3CGphOiQsgay7sWPcQUOu.png'),
(30, NULL, NULL, NULL, 'ssad', 'asd', 'asd', '76910725', 'asd@gmail.copm', 'logos/o1RJMJ2AeZVcw0gLKZcBB8Ghxmk4Qv1oAQqimHMd.png'),
(31, NULL, NULL, NULL, 's', 'a', 'asd', '76810725', 'asd@gmail.com', 'logos/QLCDij5mtr996Fnqe0sih0AoYu1m2ehVYDN9AqpL.png'),
(32, NULL, NULL, NULL, 's', 'a', 'asd', '76810725', 'asd@gmail.com', 'logos/ITqXFW3Uq8VK39FVSaOtKS4iWUALG4VAPxdLXZFc.png'),
(33, NULL, NULL, NULL, 's', 'a', 'asd', '76810725', 'asd@gmail.com', 'logos/IXoAWdFUrBwRQHXYk7UmRXwSTSeShG2UXrNhRmNi.png'),
(34, NULL, NULL, NULL, 'sdfg', 'sdfgsdf', 'adsd', '45750248', 'asddd@gmail.com', 'logos/LhUWFNqR0EYQtpOLRMcncO7DNzfJEM03ns9YXnFd.png');

-- --------------------------------------------------------

--
-- Table structure for table `estudiante`
--

CREATE TABLE `estudiante` (
  `id_estudiante` int(11) NOT NULL,
  `id_notificacion` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_grupo` int(11) DEFAULT NULL,
  `id_representante` int(11) DEFAULT NULL,
  `id_empresa` int(10) UNSIGNED DEFAULT NULL,
  `nombre_estudiante` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ap_pat` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ap_mat` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_sis` int(11) DEFAULT NULL,
  `correo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasenia` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `estudiante`
--

INSERT INTO `estudiante` (`id_estudiante`, `id_notificacion`, `id_grupo`, `id_representante`, `id_empresa`, `nombre_estudiante`, `ap_pat`, `ap_mat`, `codigo_sis`, `correo`, `contrasenia`) VALUES
(3, 'not001', 1, 1, 34, 'pedro ruiz', 'ruiz', 'torres', 123456, 'pedro@example.com', 'hashed_password_5'),
(22, NULL, NULL, NULL, 33, 'Luis', 'Ramírez', 'Cruz', 56789012, 'luis.ramirez@example.com', '$2y$10$14FV74q.m0cC9KObyRGZGOhUa3D/v.0crCtLLnKtxoPs5UeIjQ7/u'),
(23, NULL, NULL, NULL, 34, 'Juan', 'Pérez', 'García', 12345678, 'juan.perez@example.com', '$2y$10$t1eH31W3vi3efhMxtOLuSO/irRjUtNvec/1LgMS/eYTTGD/EUBZsO'),
(24, NULL, NULL, NULL, 34, 'María', 'Gómez', 'López', 23456789, 'maria.gomez@example.com', '$2y$10$2dCihZv9RO7ut/upusuXOu6azjSAMcjtqfpH9aCcQU1lrl31baLLO'),
(25, NULL, NULL, NULL, NULL, 'Carlos', 'López', 'Morales', 34567890, 'carlos.lopez@example.com', '$2y$10$i1kZ7NDwAKrcvZlwW5DvDePrpg4DTHbbjwgVgNVSLBXLq487bqlIu'),
(26, NULL, NULL, NULL, NULL, 'Ana', 'Morales', 'Ramírez', 45678901, 'ana.morales@example.com', '$2y$10$XcvAh9kYTjfiVfQoDr7cV.JPO297NJlD7GrossAbLSS3uv0qHqvSy'),
(27, NULL, NULL, NULL, NULL, 'Luis', 'Ramírez', 'Cruz', 56789012, 'luis.ramirez@example.com', '$2y$10$qEccCE6PUbRbhSpvqF5tP.bcipARUqhG2/PMOZwBG2VDhebE2cPKa');

-- --------------------------------------------------------

--
-- Table structure for table `evaluacion`
--

CREATE TABLE `evaluacion` (
  `id_evaluacion` int(11) NOT NULL,
  `id_pares` int(11) DEFAULT NULL,
  `id_cruzada` int(11) DEFAULT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_autoe` int(11) DEFAULT NULL,
  `nota` int(11) DEFAULT NULL,
  `tiempo` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` int(11) NOT NULL,
  `id_docente` int(11) DEFAULT NULL,
  `nro_grupo` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `id_docente`, `nro_grupo`) VALUES
(1, 1, 'g1'),
(2, 2, 'g2'),
(3, 1, 'g1'),
(4, 2, 'g2'),
(5, 1, 'g1'),
(6, 2, 'g2'),
(7, 1, 'g1'),
(8, 2, 'g2'),
(9, 1, 'g1'),
(10, 2, 'g2'),
(11, 1, 'g1'),
(12, 2, 'g2'),
(13, 1, 'g1'),
(14, 2, 'g2'),
(15, 1, 'g1'),
(16, 2, 'g2'),
(17, 1, 'g1'),
(18, 2, 'g2'),
(19, 1, 'g1'),
(20, 2, 'g2'),
(21, 1, 'g1'),
(22, 2, 'g2'),
(23, 1, 'g1'),
(24, 2, 'g2');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2024_09_18_145105_create_administrador_table', 1),
(3, '2024_09_18_145105_create_alcance_table', 1),
(4, '2024_09_18_145105_create_autoevaluacion_table', 1),
(5, '2024_09_18_145105_create_cantidad_table', 1),
(6, '2024_09_18_145105_create_cruzada_table', 1),
(7, '2024_09_18_145105_create_detalle_auto_table', 1),
(8, '2024_09_18_145105_create_detalle_par_table', 1),
(9, '2024_09_18_145105_create_detalle_reporte_table', 1),
(10, '2024_09_18_145105_create_docente_table', 1),
(11, '2024_09_18_145105_create_empresa_table', 1),
(12, '2024_09_18_145105_create_estudiante_table', 1),
(13, '2024_09_18_145105_create_evaluacion_table', 1),
(14, '2024_09_18_145105_create_grupo_table', 1),
(15, '2024_09_18_145105_create_notificacion_doc_table', 1),
(16, '2024_09_18_145105_create_notificacion_table', 1),
(17, '2024_09_18_145105_create_pares_table', 1),
(18, '2024_09_18_145105_create_planificacion_table', 1),
(19, '2024_09_18_145105_create_representate_legal_table', 1),
(20, '2024_09_18_145105_create_sprint_table', 1),
(21, '2024_09_18_145105_create_tarea_table', 1),
(22, '2024_09_18_145108_add_foreign_keys_to_alcance_table', 1),
(23, '2024_09_18_145108_add_foreign_keys_to_autoevaluacion_table', 1),
(24, '2024_09_18_145108_add_foreign_keys_to_cantidad_table', 1),
(25, '2024_09_18_145108_add_foreign_keys_to_cruzada_table', 1),
(26, '2024_09_18_145108_add_foreign_keys_to_detalle_auto_table', 1),
(27, '2024_09_18_145108_add_foreign_keys_to_detalle_par_table', 1),
(28, '2024_09_18_145108_add_foreign_keys_to_detalle_reporte_table', 1),
(29, '2024_09_18_145108_add_foreign_keys_to_docente_table', 1),
(30, '2024_09_18_145108_add_foreign_keys_to_empresa_table', 1),
(31, '2024_09_18_145108_add_foreign_keys_to_estudiante_table', 1),
(32, '2024_09_18_145108_add_foreign_keys_to_evaluacion_table', 1),
(33, '2024_09_18_145108_add_foreign_keys_to_grupo_table', 1),
(34, '2024_09_18_145108_add_foreign_keys_to_pares_table', 1),
(35, '2024_09_18_145108_add_foreign_keys_to_planificacion_table', 1),
(36, '2024_09_18_145108_add_foreign_keys_to_representate_legal_table', 1),
(37, '2024_09_18_145108_add_foreign_keys_to_sprint_table', 1),
(38, '2024_09_18_145108_add_foreign_keys_to_tarea_table', 1),
(39, '2024_09_24_125043_add_logo_to_empresa_table', 2),
(40, '2024_09_24_131523_add_id_empresa_to_estudiantes_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notificacion`
--

CREATE TABLE `notificacion` (
  `id_notificacion` char(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notificacion`
--

INSERT INTO `notificacion` (`id_notificacion`, `descripcion`, `fecha`) VALUES
('not001', 'notificación 1', '2024-09-01'),
('not002', 'notificación 2', '2024-09-02');

-- --------------------------------------------------------

--
-- Table structure for table `notificacion_doc`
--

CREATE TABLE `notificacion_doc` (
  `id_noti` int(11) NOT NULL,
  `descripcion_not` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notificacion_doc`
--

INSERT INTO `notificacion_doc` (`id_noti`, `descripcion_not`) VALUES
(1, 'notificación para docentes 1'),
(2, 'notificación para docentes 2'),
(3, 'notificación para docentes 1'),
(4, 'notificación para docentes 2'),
(5, 'notificación para docentes 1'),
(6, 'notificación para docentes 2'),
(7, 'notificación para docentes 1'),
(8, 'notificación para docentes 2'),
(9, 'notificación para docentes 1'),
(10, 'notificación para docentes 2'),
(11, 'notificación para docentes 1'),
(12, 'notificación para docentes 2'),
(13, 'notificación para docentes 1'),
(14, 'notificación para docentes 2'),
(15, 'notificación para docentes 1'),
(16, 'notificación para docentes 2'),
(17, 'notificación para docentes 1'),
(18, 'notificación para docentes 2'),
(19, 'notificación para docentes 1'),
(20, 'notificación para docentes 2'),
(21, 'notificación para docentes 1'),
(22, 'notificación para docentes 2'),
(23, 'notificación para docentes 1'),
(24, 'notificación para docentes 2'),
(25, 'notificación para docentes 1'),
(26, 'notificación para docentes 2'),
(27, 'notificación para docentes 1'),
(28, 'notificación para docentes 2');

-- --------------------------------------------------------

--
-- Table structure for table `pares`
--

CREATE TABLE `pares` (
  `id_pares` int(11) NOT NULL,
  `id_evaluacion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `planificacion`
--

CREATE TABLE `planificacion` (
  `id_planificacion` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `cant_sprints` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `planificacion`
--

INSERT INTO `planificacion` (`id_planificacion`, `id_empresa`, `cant_sprints`) VALUES
(1, 1, 3),
(2, 2, 5),
(3, 1, 3),
(4, 2, 5),
(5, 1, 3),
(6, 2, 5),
(7, 1, 3),
(8, 2, 5),
(9, 1, 3),
(10, 2, 5),
(11, 1, 3),
(12, 2, 5),
(13, 1, 3),
(14, 2, 5),
(15, 1, 3),
(16, 2, 5),
(17, 1, 3),
(18, 2, 5),
(19, 29, 6),
(20, 30, 6),
(21, 31, 6),
(22, 32, 6),
(23, 33, 6),
(24, 34, 6);

-- --------------------------------------------------------

--
-- Table structure for table `representate_legal`
--

CREATE TABLE `representate_legal` (
  `id_representante` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `estado` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `representate_legal`
--

INSERT INTO `representate_legal` (`id_representante`, `id_empresa`, `estado`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 1, 1),
(4, 2, 1),
(5, 1, 1),
(6, 2, 1),
(7, 1, 1),
(8, 2, 1),
(9, 1, 1),
(10, 2, 1),
(11, 1, 1),
(12, 2, 1),
(13, 1, 1),
(14, 2, 1),
(15, 1, 1),
(16, 2, 1),
(17, 1, 1),
(18, 2, 1),
(19, 1, 1),
(20, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sprint`
--

CREATE TABLE `sprint` (
  `id_sprint` int(11) NOT NULL,
  `id_planificacion` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `color` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nro_sprint` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sprint`
--

INSERT INTO `sprint` (`id_sprint`, `id_planificacion`, `fecha_inicio`, `fecha_fin`, `color`, `nro_sprint`) VALUES
(3, 1, '2024-01-01', '2024-01-14', '#FF5733', 1),
(4, 1, '2024-01-15', '2024-01-28', '#33FF57', 2),
(24, 1, '2024-10-01', '2024-10-14', '#FF57d3', 1),
(25, 1, '2024-10-15', '2024-10-18', '#FF5743', 4),
(26, 1, '2024-11-15', '2024-11-18', '#FF3733', 5),
(27, 1, '2024-11-25', '2024-11-28', '#AA3733', 6),
(28, 1, '2024-11-25', '2024-11-28', '#AE3733', 7);

-- --------------------------------------------------------

--
-- Table structure for table `tarea`
--

CREATE TABLE `tarea` (
  `id_tarea` int(11) NOT NULL,
  `id_alcance` int(11) DEFAULT NULL,
  `nombre_tarea` varchar(35) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tarea`
--

INSERT INTO `tarea` (`id_tarea`, `id_alcance`, `nombre_tarea`) VALUES
(5, 5, 'crear endpoints'),
(6, 5, 'documentar api'),
(7, 6, 'diseñar mockups'),
(8, 6, 'implementar feedback del cliente'),
(9, NULL, 'Diseo de UI'),
(10, NULL, 'Implementacio de API'),
(11, NULL, 'Diseo de UI'),
(12, NULL, 'Implementacio de API'),
(13, NULL, 'Diseo de UI'),
(14, NULL, 'Implementacio de API'),
(15, NULL, 'Diseo'),
(16, NULL, 'API'),
(17, NULL, 'Diseo'),
(18, NULL, 'API'),
(19, NULL, 'Diseo'),
(20, NULL, 'API'),
(21, 9, 'Diseo'),
(22, 9, 'API'),
(23, 10, 'Diseo'),
(24, 10, 'API'),
(25, 11, 'Diseo'),
(26, 11, 'API'),
(27, 12, 'Diseo'),
(28, 12, 'API'),
(29, 13, 'Diseo'),
(30, 13, 'API');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_admi`),
  ADD UNIQUE KEY `administrador_pk` (`id_admi`);

--
-- Indexes for table `alcance`
--
ALTER TABLE `alcance`
  ADD PRIMARY KEY (`id_alcance`),
  ADD UNIQUE KEY `alcance_pk` (`id_alcance`),
  ADD KEY `tiene_sus_fk` (`id_sprint`);

--
-- Indexes for table `autoevaluacion`
--
ALTER TABLE `autoevaluacion`
  ADD PRIMARY KEY (`id_autoe`),
  ADD UNIQUE KEY `autoevaluacion_pk` (`id_autoe`),
  ADD KEY `es_una2_fk` (`id_evaluacion`);

--
-- Indexes for table `cantidad`
--
ALTER TABLE `cantidad`
  ADD PRIMARY KEY (`id_cantidad`),
  ADD UNIQUE KEY `cantidad_pk` (`id_cantidad`),
  ADD KEY `relationship_20_fk` (`id_empresa`);

--
-- Indexes for table `cruzada`
--
ALTER TABLE `cruzada`
  ADD PRIMARY KEY (`id_cruzada`),
  ADD UNIQUE KEY `cruzada_pk` (`id_cruzada`),
  ADD KEY `es_un2_fk` (`id_evaluacion`);

--
-- Indexes for table `detalle_auto`
--
ALTER TABLE `detalle_auto`
  ADD PRIMARY KEY (`id_rep_auto`),
  ADD UNIQUE KEY `detalle_rep_auto_pk` (`id_rep_auto`),
  ADD KEY `contiene_fk` (`id_autoe`);

--
-- Indexes for table `detalle_par`
--
ALTER TABLE `detalle_par`
  ADD PRIMARY KEY (`id_det_par`),
  ADD UNIQUE KEY `detalle_rep_par_pk` (`id_det_par`),
  ADD KEY `cuenta_con_fk` (`id_pares`);

--
-- Indexes for table `detalle_reporte`
--
ALTER TABLE `detalle_reporte`
  ADD PRIMARY KEY (`id_rep_det`),
  ADD UNIQUE KEY `reporte_detalle_pk` (`id_rep_det`),
  ADD KEY `cuenta_con_su_fk` (`id_cruzada`);

--
-- Indexes for table `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`id_docente`),
  ADD UNIQUE KEY `docente_pk` (`id_docente`),
  ADD KEY `le_llega_fk` (`id_noti`),
  ADD KEY `registra_a_fk` (`id_admi`),
  ADD KEY `tiene_su_fk` (`id_grupo`);

--
-- Indexes for table `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `empresa_pk` (`id_empresa`),
  ADD KEY `relationship_19_fk` (`id_cantidad`),
  ADD KEY `inscribe2_fk` (`id_representante`),
  ADD KEY `tiene_fk` (`id_planificacion`);

--
-- Indexes for table `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD UNIQUE KEY `estudiante_pk` (`id_estudiante`),
  ADD KEY `llega_fk` (`id_notificacion`),
  ADD KEY `pertenece_fk` (`id_grupo`),
  ADD KEY `registra_fk` (`id_representante`);

--
-- Indexes for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD UNIQUE KEY `evaluacion_pk` (`id_evaluacion`),
  ADD KEY `es_fk` (`id_pares`),
  ADD KEY `es_un_fk` (`id_cruzada`),
  ADD KEY `realiza_fk` (`id_empresa`),
  ADD KEY `es_una_fk` (`id_autoe`);

--
-- Indexes for table `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id_grupo`),
  ADD UNIQUE KEY `grupo_pk` (`id_grupo`),
  ADD KEY `tiene_su2_fk` (`id_docente`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD UNIQUE KEY `notificacion_pk` (`id_notificacion`);

--
-- Indexes for table `notificacion_doc`
--
ALTER TABLE `notificacion_doc`
  ADD PRIMARY KEY (`id_noti`),
  ADD UNIQUE KEY `notificacion_doc_pk` (`id_noti`);

--
-- Indexes for table `pares`
--
ALTER TABLE `pares`
  ADD PRIMARY KEY (`id_pares`),
  ADD UNIQUE KEY `pares_pk` (`id_pares`),
  ADD KEY `es2_fk` (`id_evaluacion`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `planificacion`
--
ALTER TABLE `planificacion`
  ADD PRIMARY KEY (`id_planificacion`),
  ADD UNIQUE KEY `planificacion_pk` (`id_planificacion`),
  ADD KEY `tiene_fk` (`id_empresa`);

--
-- Indexes for table `representate_legal`
--
ALTER TABLE `representate_legal`
  ADD PRIMARY KEY (`id_representante`),
  ADD UNIQUE KEY `representate_legal_pk` (`id_representante`),
  ADD KEY `inscribe_fk` (`id_empresa`);

--
-- Indexes for table `sprint`
--
ALTER TABLE `sprint`
  ADD PRIMARY KEY (`id_sprint`),
  ADD UNIQUE KEY `sprint_pk` (`id_sprint`),
  ADD KEY `cuent_fk` (`id_planificacion`);

--
-- Indexes for table `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`id_tarea`),
  ADD UNIQUE KEY `tarea_pk` (`id_tarea`),
  ADD KEY `tiene_varias_fk` (`id_alcance`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrador`
--
ALTER TABLE `administrador`
  MODIFY `id_admi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `alcance`
--
ALTER TABLE `alcance`
  MODIFY `id_alcance` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `autoevaluacion`
--
ALTER TABLE `autoevaluacion`
  MODIFY `id_autoe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cantidad`
--
ALTER TABLE `cantidad`
  MODIFY `id_cantidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `cruzada`
--
ALTER TABLE `cruzada`
  MODIFY `id_cruzada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `detalle_auto`
--
ALTER TABLE `detalle_auto`
  MODIFY `id_rep_auto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_par`
--
ALTER TABLE `detalle_par`
  MODIFY `id_det_par` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `detalle_reporte`
--
ALTER TABLE `detalle_reporte`
  MODIFY `id_rep_det` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `docente`
--
ALTER TABLE `docente`
  MODIFY `id_docente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id_estudiante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `id_evaluacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id_grupo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `notificacion_doc`
--
ALTER TABLE `notificacion_doc`
  MODIFY `id_noti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `pares`
--
ALTER TABLE `pares`
  MODIFY `id_pares` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `planificacion`
--
ALTER TABLE `planificacion`
  MODIFY `id_planificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `representate_legal`
--
ALTER TABLE `representate_legal`
  MODIFY `id_representante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `sprint`
--
ALTER TABLE `sprint`
  MODIFY `id_sprint` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `tarea`
--
ALTER TABLE `tarea`
  MODIFY `id_tarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alcance`
--
ALTER TABLE `alcance`
  ADD CONSTRAINT `fk_alcance_tiene_sus_sprint` FOREIGN KEY (`id_sprint`) REFERENCES `sprint` (`id_sprint`);

--
-- Constraints for table `autoevaluacion`
--
ALTER TABLE `autoevaluacion`
  ADD CONSTRAINT `fk_autoeval_es_una2_evaluaci` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacion` (`id_evaluacion`);

--
-- Constraints for table `cantidad`
--
ALTER TABLE `cantidad`
  ADD CONSTRAINT `fk_cantidad_relations_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);

--
-- Constraints for table `cruzada`
--
ALTER TABLE `cruzada`
  ADD CONSTRAINT `fk_cruzada_es_un2_evaluaci` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacion` (`id_evaluacion`);

--
-- Constraints for table `detalle_auto`
--
ALTER TABLE `detalle_auto`
  ADD CONSTRAINT `fk_detalle__contiene_autoeval` FOREIGN KEY (`id_autoe`) REFERENCES `autoevaluacion` (`id_autoe`);

--
-- Constraints for table `detalle_par`
--
ALTER TABLE `detalle_par`
  ADD CONSTRAINT `fk_detalle__cuenta_co_pares` FOREIGN KEY (`id_pares`) REFERENCES `pares` (`id_pares`);

--
-- Constraints for table `detalle_reporte`
--
ALTER TABLE `detalle_reporte`
  ADD CONSTRAINT `fk_detalle__cuenta_co_cruzada` FOREIGN KEY (`id_cruzada`) REFERENCES `cruzada` (`id_cruzada`);

--
-- Constraints for table `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `fk_docente_le_llega_notifica` FOREIGN KEY (`id_noti`) REFERENCES `notificacion_doc` (`id_noti`),
  ADD CONSTRAINT `fk_docente_registra__administ` FOREIGN KEY (`id_admi`) REFERENCES `administrador` (`id_admi`),
  ADD CONSTRAINT `fk_docente_tiene_su_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Constraints for table `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `fk_empresa_inscribe2_represen` FOREIGN KEY (`id_representante`) REFERENCES `representate_legal` (`id_representante`),
  ADD CONSTRAINT `fk_empresa_relations_cantidad` FOREIGN KEY (`id_cantidad`) REFERENCES `cantidad` (`id_cantidad`),
  ADD CONSTRAINT `fk_empresa_tiene_planific` FOREIGN KEY (`id_planificacion`) REFERENCES `planificacion` (`id_planificacion`);

--
-- Constraints for table `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `fk_estudian_llega_notifica` FOREIGN KEY (`id_notificacion`) REFERENCES `notificacion` (`id_notificacion`),
  ADD CONSTRAINT `fk_estudian_pertenece_grupo` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `fk_estudian_registra_represen` FOREIGN KEY (`id_representante`) REFERENCES `representate_legal` (`id_representante`);

--
-- Constraints for table `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD CONSTRAINT `fk_evaluaci_es_pares` FOREIGN KEY (`id_pares`) REFERENCES `pares` (`id_pares`),
  ADD CONSTRAINT `fk_evaluaci_es_un_cruzada` FOREIGN KEY (`id_cruzada`) REFERENCES `cruzada` (`id_cruzada`),
  ADD CONSTRAINT `fk_evaluaci_es_una_autoeval` FOREIGN KEY (`id_autoe`) REFERENCES `autoevaluacion` (`id_autoe`),
  ADD CONSTRAINT `fk_evaluaci_realiza_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);

--
-- Constraints for table `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `fk_grupo_tiene_su2_docente` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`);

--
-- Constraints for table `pares`
--
ALTER TABLE `pares`
  ADD CONSTRAINT `fk_pares_es2_evaluaci` FOREIGN KEY (`id_evaluacion`) REFERENCES `evaluacion` (`id_evaluacion`);

--
-- Constraints for table `planificacion`
--
ALTER TABLE `planificacion`
  ADD CONSTRAINT `fk_planific_tiene2_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);

--
-- Constraints for table `representate_legal`
--
ALTER TABLE `representate_legal`
  ADD CONSTRAINT `fk_represen_inscribe_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);

--
-- Constraints for table `sprint`
--
ALTER TABLE `sprint`
  ADD CONSTRAINT `fk_sprint_cuent_planific` FOREIGN KEY (`id_planificacion`) REFERENCES `planificacion` (`id_planificacion`);

--
-- Constraints for table `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `fk_tarea_tiene_var_alcance` FOREIGN KEY (`id_alcance`) REFERENCES `alcance` (`id_alcance`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
