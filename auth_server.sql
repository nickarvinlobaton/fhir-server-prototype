-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2020 at 11:22 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auth_server`
--

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2016_06_01_000001_create_oauth_auth_codes_table', 2),
(5, '2016_06_01_000002_create_oauth_access_tokens_table', 2),
(6, '2016_06_01_000003_create_oauth_refresh_tokens_table', 2),
(7, '2016_06_01_000004_create_oauth_clients_table', 2),
(8, '2016_06_01_000005_create_oauth_personal_access_clients_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_access_tokens`
--

INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('05a795f61dd95579beb73fcd4e6715e2c0fb7a196f02582805a228ded52dfade8f20e21d8bcd5740', 1, 3, NULL, '[]', 0, '2020-08-20 00:38:26', '2020-08-20 00:38:26', '2021-08-20 08:38:26'),
('1219f4604c1c0db1b59ef3497782dd7465aff040d2b51d946a9d88c4d93df44b2319ec35e1c3d2ca', 1, 3, NULL, '[]', 0, '2020-08-20 00:43:49', '2020-08-20 00:43:49', '2021-08-20 08:43:49'),
('4d0bd06950df417b3f3883f79c19bd2a8568c8f9b53ad7069fe73fb00e49e5cd68a69cb9e2a9af8e', 1, 3, NULL, '[]', 0, '2020-08-20 00:52:52', '2020-08-20 00:52:52', '2021-08-20 08:52:52'),
('5eeebbf31272c14564a46e09f235cdddf3a4a4d3c94d862abc5a8529e2705624805072f34c2d7e23', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-21 00:27:05', '2020-08-21 00:27:05', '2021-08-21 08:27:05'),
('68a6dc7709b3a9f99c9f13c90eedb6405f97dbeda643038bb866c35c46c238b8383f9e16faa1c4b5', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-20 22:13:16', '2020-08-20 22:13:16', '2021-08-21 06:13:16'),
('6dd73181ae47edd7593b130290afeddad985b2e5fe5beffe4c447afbd49c94c3da08aa3a40b2e423', 1, 3, NULL, '[]', 0, '2020-08-20 00:45:35', '2020-08-20 00:45:35', '2021-08-20 08:45:35'),
('74ccc268b94f994b03b3a35ad4e0e483286e9ea7b2b0fa2d484c58d34eed0b53ea98efa648ef2e1e', 1, 3, NULL, '[]', 0, '2020-08-20 00:52:42', '2020-08-20 00:52:42', '2021-08-20 08:52:42'),
('841528be2187e3519fc5f1d5c8132ab5e259b26c6399d0a4e4c9e0b733d8069fc2c3c4299af41b66', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-20 01:45:46', '2020-08-20 01:45:46', '2021-08-20 09:45:46'),
('86521ad6bed38792397e01a97c4653a2413316c6cdb8918a1753fc42699593fe7dd13ce0b0f67441', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-20 17:16:58', '2020-08-20 17:16:58', '2021-08-21 01:16:58'),
('c51eae43b5c362eb2afe67cb9e1b4160aa564fff2554ac4d7ea579c62096519682d87bc51d66ea39', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-20 17:35:25', '2020-08-20 17:35:25', '2021-08-21 01:35:25'),
('d3e0d1e46ff0b24a229827297d66c4fe6f6200a58eddb26c45bef9e086acf007c3d5d77aeef198ba', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-21 00:48:00', '2020-08-21 00:48:00', '2021-08-21 08:48:00'),
('da5ffb0768f4ba2a37e3edc20d3b61102f7177bd526ef4b8c6d916d3a8c344c4430bcdaf1f40ae06', 1, 3, NULL, '[]', 0, '2020-08-20 22:10:16', '2020-08-20 22:10:16', '2021-08-21 06:10:16'),
('f0e77809e35ce2daab94bcdd4700fb44c456feec97a711208d4b0f9ff31bb5e871f3352dc9136980', 1, 3, NULL, '[\"user\\/*.read\"]', 0, '2020-08-20 01:08:26', '2020-08-20 01:08:26', '2021-08-20 09:08:26'),
('f3aad9809b8d2d3640980352d2a90395bb83616e57d707adcdb667bb14421a3efd5e73a7a17df56a', 1, 3, NULL, '[]', 0, '2020-08-20 00:53:38', '2020-08-20 00:53:38', '2021-08-20 08:53:38');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_auth_codes`
--

INSERT INTO `oauth_auth_codes` (`id`, `user_id`, `client_id`, `scopes`, `revoked`, `expires_at`) VALUES
('15b039ef4abb9f4b9691c3699ca3ad3590074da63ef2f30ed40c8debfa820a5adb121c10331bbea9', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-21 08:37:03'),
('5319fb8d95dd9023eb710889eb09da72e9b550f0feb7653723fafcc1a0f0822fd1fc34ef277903cb', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-21 08:57:58'),
('56ed2fa78672a52adfdecc740051fb3a0ac4cc3493d00020790bcf53ca2ac1b4fbd7c1d03a1790c1', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-20 09:18:24'),
('59bba10a5abcd2401a0b64bd42f046bcc3e4caeaf245dad264d66e9c4617f30717e4057f1612165f', 1, 3, '[]', 1, '2020-08-20 09:02:41'),
('67f1d5a0a653720616e1e1904ff6d8e6595ef0fb425d30ec6e954eb83e91678132c6d0957693902e', 1, 3, '[]', 1, '2020-08-20 08:48:24'),
('73158c99b586d1f9ee6a36f629b8d4d1bf5cd37f79ba547067ad1c037922119799139f27e97676c8', 1, 3, '[]', 1, '2020-08-21 06:20:13'),
('744a68b37255eb415160f4967f27b3155bde5715dd84d7d4137058920598a6861941dc090838bc86', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-21 06:23:13'),
('8bece470a1b8d648304899ec2866c56d2a81f007cdb6af758f8cdfebcd630fd34f98ca86211b5308', 1, 3, '[]', 1, '2020-08-20 09:02:51'),
('99da70e33fc582e3e069654deb0e8b353a0199b41d33cc91df89e83b9426babf24a46b61865a4601', 1, 3, '[]', 1, '2020-08-20 09:03:37'),
('a6cca2a71d8e5f9c1bdf6129762b9e28f7afe367d1f7706ff715084b38908434cd46ec05436aad1c', 1, 3, '[]', 1, '2020-08-20 08:53:46'),
('ada7d144222bd7da6d422bc36a64a459d7d98a327fa715d9d2759674ed2fa84a56ceb068dc3980c1', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-21 01:26:52'),
('c2582bcd76160b125b9c2adc71592c7a7f24382f621cba3ba147a2070bea63174cf0d2d72aa324d9', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-21 01:45:23'),
('d4a720f88860f993e6c41febaeaef09d8e78aba2f32410397ff4d992b0ffec48c03d097720c1649c', 1, 3, '[\"user\\/*.read\"]', 1, '2020-08-20 09:55:45'),
('f8cb71e25d5b549e81736cf631f49c1eb43aa2c83b2fad44d40456084953a54d1abb06b246b52768', 1, 3, '[]', 1, '2020-08-20 08:55:34');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Laravel Personal Access Client', 's652vOkj6NQQqONuUf0F9iQaiPq8e1w2LarokG8d', NULL, 'http://localhost', 1, 0, 0, '2020-08-20 00:18:37', '2020-08-20 00:18:37'),
(2, NULL, 'Laravel Password Grant Client', 'WdE88CqmJBe5cBFaWZ0rGHr25T8gkVIkAgCAw1Pb', 'users', 'http://localhost', 0, 1, 0, '2020-08-20 00:18:37', '2020-08-20 00:18:37'),
(3, 1, 'client_app', 'FjoQQkBHsZeLeQvawG5mfveOQqnBofE7LHobCf1H', NULL, 'http://localhost/auth/callback', 0, 0, 0, '2020-08-20 00:29:50', '2020-08-20 00:29:50');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_personal_access_clients`
--

INSERT INTO `oauth_personal_access_clients` (`id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2020-08-20 00:18:37', '2020-08-20 00:18:37'),
(2, 4, '2020-08-21 00:26:41', '2020-08-21 00:26:41');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_refresh_tokens`
--

INSERT INTO `oauth_refresh_tokens` (`id`, `access_token_id`, `revoked`, `expires_at`) VALUES
('097473a99ad4d8dbce26b1e107d6809b988cd2f43014c27f888bbd80d5820936195072b7ce809edb', 'da5ffb0768f4ba2a37e3edc20d3b61102f7177bd526ef4b8c6d916d3a8c344c4430bcdaf1f40ae06', 0, '2021-08-21 06:10:16'),
('09dae93b27fedb45343fca589e584cdcf3af2e8e2e079663133c44a2ddd5145fbe535c4dfc7e50a1', '4d0bd06950df417b3f3883f79c19bd2a8568c8f9b53ad7069fe73fb00e49e5cd68a69cb9e2a9af8e', 0, '2021-08-20 08:52:52'),
('0a9bfc2d7ad2d5336b1b2c8827eaffe1cdc407d5aa86bf06e94aaca559545cdd997516e5d152829e', '86521ad6bed38792397e01a97c4653a2413316c6cdb8918a1753fc42699593fe7dd13ce0b0f67441', 0, '2021-08-21 01:17:00'),
('28dbb4423aa614e17747a01f5e8b958a69566b3f02f8d6805ccf9a16e5abb901480467aae2ee68be', '74ccc268b94f994b03b3a35ad4e0e483286e9ea7b2b0fa2d484c58d34eed0b53ea98efa648ef2e1e', 0, '2021-08-20 08:52:43'),
('2eb476610cf2dd637bbaf3603bb4fe21cbff3a857d2c3fead73ee27780d017a72ccdd5ac3e738de1', 'f3aad9809b8d2d3640980352d2a90395bb83616e57d707adcdb667bb14421a3efd5e73a7a17df56a', 0, '2021-08-20 08:53:39'),
('3bca3b916a8548bc465f8b56cb0ce557c469b95bc93d11975912925c4a3f2e5fc767adf336318b5a', '6dd73181ae47edd7593b130290afeddad985b2e5fe5beffe4c447afbd49c94c3da08aa3a40b2e423', 0, '2021-08-20 08:45:35'),
('668819b0e2258641073e81ef626bf8f64478460e6de1068c1e648c31d2834f243b9e8447235f2648', 'd3e0d1e46ff0b24a229827297d66c4fe6f6200a58eddb26c45bef9e086acf007c3d5d77aeef198ba', 0, '2021-08-21 08:48:00'),
('6910039bf3d97592cf2a8d13833a8390d77254a0a4ab259d4f3d8cc997a14524d828ec2274f09947', '5eeebbf31272c14564a46e09f235cdddf3a4a4d3c94d862abc5a8529e2705624805072f34c2d7e23', 0, '2021-08-21 08:27:05'),
('816504f7bf062c5ddce1a1709ec3026434aff304fa2afa93382650375a7639f2396aa995bd0c5eb4', 'c51eae43b5c362eb2afe67cb9e1b4160aa564fff2554ac4d7ea579c62096519682d87bc51d66ea39', 0, '2021-08-21 01:35:25'),
('8c8c6a57965a1b35d029e1cbfeb1fae40583194848c91c53732ef612a01b9003bf4a050e9e117340', '841528be2187e3519fc5f1d5c8132ab5e259b26c6399d0a4e4c9e0b733d8069fc2c3c4299af41b66', 0, '2021-08-20 09:45:46'),
('a6853460d41246f441f280075a5130a537d93b5748cd7505583299bedd72a0fb0128b0193262ff9e', '1219f4604c1c0db1b59ef3497782dd7465aff040d2b51d946a9d88c4d93df44b2319ec35e1c3d2ca', 0, '2021-08-20 08:43:50'),
('b96de5bf1ecfe35e35680795fc07221615a124934fd47e329c7af02a54e769e72d090be620daf16e', 'f0e77809e35ce2daab94bcdd4700fb44c456feec97a711208d4b0f9ff31bb5e871f3352dc9136980', 0, '2021-08-20 09:08:27'),
('c187a148d41d677c2f15e6677e26fdbf0540984b5ffae237e7644d46077264673a622955a2148fbe', '05a795f61dd95579beb73fcd4e6715e2c0fb7a196f02582805a228ded52dfade8f20e21d8bcd5740', 0, '2021-08-20 08:38:26'),
('f407178010ed544c2d9a1a3d478a68cd8ed39d1ccff1b6012726b4562cf8c946e6f889455c7a3163', '68a6dc7709b3a9f99c9f13c90eedb6405f97dbeda643038bb866c35c46c238b8383f9e16faa1c4b5', 0, '2021-08-21 06:13:16');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'John Doe', 'jd@gmail.com', NULL, '$2y$10$m7s7hpQjEKFrlpHiYvpUMeLGUWfrkY7KT2dm5g7uA9lpH.ub6BIHS', NULL, '2020-08-20 00:37:52', '2020-08-20 00:37:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
