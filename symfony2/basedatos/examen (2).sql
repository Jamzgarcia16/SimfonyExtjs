-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-03-2019 a las 21:15:33
-- Versión del servidor: 10.1.37-MariaDB
-- Versión de PHP: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `examen`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `idtipo` int(2) NOT NULL,
  `nombre_tipo` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`idtipo`, `nombre_tipo`) VALUES
(1, 'administrador'),
(2, 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(2) NOT NULL,
  `usu_login` varchar(20) NOT NULL,
  `usu_password` varchar(40) NOT NULL,
  `usu_timelive_contrasena` int(11) NOT NULL,
  `usu_fecha_expiracion` date NOT NULL,
  `usu_fecha_mod_contrasena` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `usu_login`, `usu_password`, `usu_timelive_contrasena`, `usu_fecha_expiracion`, `usu_fecha_mod_contrasena`) VALUES
(1, 'jamzgarcia', '321654', 200, '2019-03-30', '2019-03-29'),
(2, 'andrescardenas', '321456', 2000, '2019-03-30', '2019-03-29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario2`
--

CREATE TABLE `usuario2` (
  `id` int(2) NOT NULL,
  `usu_login` varchar(20) NOT NULL,
  `usu_password` varchar(20) NOT NULL,
  `usu_timelive_contrasena` varchar(20) NOT NULL,
  `usu_fecha_expiracion` date NOT NULL,
  `usu_fecha_mod_contrasena` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario2`
--

INSERT INTO `usuario2` (`id`, `usu_login`, `usu_password`, `usu_timelive_contrasena`, `usu_fecha_expiracion`, `usu_fecha_mod_contrasena`) VALUES
(1, 'jamzgarcia', '321654', '200', '2019-03-30', '2019-03-29'),
(2, 'andrescardenas', '321456', '2000', '2019-03-30', '2019-03-29'),
(3, 'new', '321', '60', '2019-12-01', '2019-04-01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(2) NOT NULL,
  `nombre_usuario` varchar(30) NOT NULL,
  `apellido_usuario` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `contrasena` varchar(30) NOT NULL,
  `genero` varchar(1) NOT NULL,
  `fecnac` date NOT NULL,
  `idtipo` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `apellido_usuario`, `email`, `contrasena`, `genero`, `fecnac`, `idtipo`) VALUES
(1, 'Jimmy Fernando', 'Cantor Garcia', 'jamzgarcia16@gmail.com', 'Sena2019', 'M', '1992-04-25', 1),
(2, 'Jimmy Fernando', 'Cantor Garcia', 'jamzgarcia@misena.edu.co', 'Sena2019', 'M', '1992-04-25', 2),
(6, 'Prueba', 'nuevo', 'new22@gmail.com', '123456', 'F', '2014-01-01', 1),
(7, 'Prueba3', 'aaa', 'qqq@ffff', '123', 'F', '2019-01-01', 1),
(10, 'Jimmy Fernando', 'nuevo', 'new22@gmail.com', '123456', 'F', '2014-01-01', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`idtipo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario2`
--
ALTER TABLE `usuario2`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idtipo` (`idtipo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `idtipo` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario2`
--
ALTER TABLE `usuario2`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`idtipo`) REFERENCES `tipo_usuario` (`idtipo`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
