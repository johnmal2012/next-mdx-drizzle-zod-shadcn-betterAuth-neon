--
-- PostgreSQL database dump
--

-- Dumped from database version 17.11 (df1f1a3)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: physician_profile; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.physician_profile (id, logo, name, board_specialty, specialty, title, image, clinic_name, clinic_address, phone, email, location, link_name, footcare_link, expertise, created_at, updated_at, is_active, deleted_at, user_id, image_key) FROM stdin;
3	\N	name lam	Board specialty	Specialty	Title 	https://ffkf9c9vt3.ufs.sh/f/mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr	clinic name	clinic Address 	1234567890	Email@example.com	Office location 	Foot care	\N	["Apple", "orange"]	2026-05-22 00:11:34.176315	2026-05-24 15:22:44.595	f	2026-08-01 23:45:17.439	8c2a700c-3b36-405d-8049-492d89acfb75	mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr
4	john logo	john mal	john board sp	lam sp	john title	https://ffkf9c9vt3.ufs.sh/f/mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr	john clinic name	john clinic address	123-456-7890	john@gmail.com	john location	john care link	http://www.john.com	["test1", "test2", "test3"]	2026-07-17 23:08:25.454559	2026-07-17 23:17:44.898	f	2026-08-02 14:29:13.18	8c2a700c-3b36-405d-8049-492d89acfb75	mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr
1	Dr. Lam	Aaron Lam, MD	Board-Certified Foot & Ankle Specialist	Foot and Ankle Surgery, Orthopedic Surgery	Fellowship-Trained Orthopedic Foot & Ankle Surgeon	https://ffkf9c9vt3.ufs.sh/f/mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr	Maimonides Foot & Ankle	4802 Tenth Avenue Brooklyn, NY 11219	(718) 123-4568	draaronlam@gmail.com	 	Foot Care	https://www.footcaremd.org/	["Sports Injuries", "Foot Surgery", "Diabetic Foot Care", "Custom Orthotics"]	2026-05-19 23:07:31.855239	2026-08-18 15:32:11.265	t	\N	8c2a700c-3b36-405d-8049-492d89acfb75	mm5bHxn2kR9wBLUeXxKwE7VYc3bWkJGTm8nMHDsXACi6u4Kr
\.


--
-- Name: physician_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.physician_profile_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

