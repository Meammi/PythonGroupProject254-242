-- ============================================================================
-- TULóng — Campus Navigator
-- Seed Data Script (PostgreSQL)
-- ============================================================================
-- Description : Populates the database with real SC1 building data.
--               Safe to run multiple times (idempotent via TRUNCATE).
--
-- Prerequisite: Tables must already exist (created by Alembic / ORM).
--               DO NOT include any CREATE TABLE statements here.
--
-- Usage       : psql -U postgres -d clean_fastapi -f seed.sql
--               Or mount in docker-compose (see instructions at bottom).
-- ============================================================================

BEGIN;

-- ============================================================================
-- CLEAN SLATE
-- ----------------------------------------------------------------------------
-- Truncate in reverse dependency order. CASCADE propagates to child tables,
-- ensuring no FK violations. RESTART IDENTITY resets auto-increment counters
-- so IDs start from 1 on every run.
-- ============================================================================

TRUNCATE TABLE temperatures  RESTART IDENTITY CASCADE;
TRUNCATE TABLE facilities    RESTART IDENTITY CASCADE;
TRUNCATE TABLE floors        RESTART IDENTITY CASCADE;
TRUNCATE TABLE facility_types RESTART IDENTITY CASCADE;
TRUNCATE TABLE buildings     RESTART IDENTITY CASCADE;


-- ============================================================================
-- 1. BUILDINGS
-- ----------------------------------------------------------------------------
-- SC1 — Social Sciences Building 1, Thammasat University (Rangsit Campus)
-- ============================================================================

INSERT INTO buildings (id, code, name, latitude, longitude, description)
VALUES
    (1, 'SC1', 'Social Sciences Building 1', 14.071580, 100.604750,
     'A four-storey academic building in the Faculty of Social Sciences at Thammasat University, Rangsit Campus. Houses classrooms, faculty offices, and student service areas.');


-- ============================================================================
-- 2. FLOORS
-- ----------------------------------------------------------------------------
-- Four floors: 1F through 4F, ordered by sort_order for UI display.
-- ============================================================================

INSERT INTO floors (id, building_id, floor_code, floor_name, sort_order)
VALUES
    (1, 1, '1F', 'Floor 1', 1),
    (2, 1, '2F', 'Floor 2', 2),
    (3, 1, '3F', 'Floor 3', 3),
    (4, 1, '4F', 'Floor 4', 4);


-- ============================================================================
-- 3. FACILITY TYPES
-- ----------------------------------------------------------------------------
-- Three categories for the SC1 building facilities.
-- Icon values correspond to frontend marker identifiers.
-- ============================================================================

INSERT INTO facility_types (id, name, icon)
VALUES
    (1, 'toilet',      'icon-toilet'),
    (2, 'store',       'icon-store'),
    (3, 'health-care', 'icon-health');


-- ============================================================================
-- 4. FACILITIES
-- ----------------------------------------------------------------------------
-- Real facilities inside SC1, grouped by type.
--
--   Toilets      : 2 per floor × 4 floors = 8 restrooms
--   Stores       : Friend Coffee, Fresh Me, Frosty Box
--   Health-care  : Well Being Clinic
--
-- Coordinates are approximate WGS-84 positions within the building footprint.
-- ============================================================================

-- ── 4a. Toilets (type_id = 1) ───────────────────────────────────────────────

INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    -- Floor 1
    ( 1, 1, 1, 1, 'Restroom 1F-A', 14.071620, 100.604700,
      'Accessible restroom located near the main entrance on the first floor.', true),
    ( 2, 1, 1, 1, 'Restroom 1F-B', 14.071540, 100.604800,
      'Restroom situated at the rear wing of the first floor, adjacent to the stairwell.', true),

    -- Floor 2
    ( 3, 1, 2, 1, 'Restroom 2F-A', 14.071625, 100.604705,
      'Main restroom on the second floor, near the central corridor.', true),
    ( 4, 1, 2, 1, 'Restroom 2F-B', 14.071545, 100.604805,
      'Secondary restroom on the second floor, east wing.', true),

    -- Floor 3
    ( 5, 1, 3, 1, 'Restroom 3F-A', 14.071630, 100.604710,
      'Restroom on the third floor, located opposite the lecture hall.', true),
    ( 6, 1, 3, 1, 'Restroom 3F-B', 14.071550, 100.604810,
      'Restroom at the west end of the third floor corridor.', true),

    -- Floor 4
    ( 7, 1, 4, 1, 'Restroom 4F-A', 14.071635, 100.604715,
      'Top-floor restroom near the faculty offices.', true),
    ( 8, 1, 4, 1, 'Restroom 4F-B', 14.071555, 100.604815,
      'Restroom on the fourth floor, east side near the elevator.', true);


-- ── 4b. Stores (type_id = 2) ────────────────────────────────────────────────

INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    ( 9, 1, 1, 2, 'Friend Coffee', 14.071600, 100.604730,
      'A cozy campus café on the ground floor serving specialty coffee, pastries, and light meals. Popular student hangout spot.', true),

    (10, 1, 1, 2, 'Fresh Me', 14.069166, 100.604760,
      'A fresh juice and smoothie bar offering healthy beverages and quick snacks near the building lobby.', true),

    (11, 1, 1, 2, 'Frosty Box', 14.071560, 100.604680,
      'A compact frozen-treat kiosk serving ice cream, shaved ice, and cold desserts at the ground-floor entrance.', true);


-- ── 4c. Health-care (type_id = 3) ───────────────────────────────────────────

INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    (12, 1, 1, 3, 'Well Being Clinic', 14.071590, 100.604770,
      'On-site student wellness clinic providing basic health check-ups, first aid, and mental-health counselling services.', true);


-- ============================================================================
-- RESET SEQUENCES
-- ----------------------------------------------------------------------------
-- After explicit-ID inserts, advance the sequences so the next auto-generated
-- ID doesn't collide with seeded data.
-- ============================================================================

SELECT setval('buildings_id_seq',      (SELECT COALESCE(MAX(id), 0) FROM buildings));
SELECT setval('floors_id_seq',         (SELECT COALESCE(MAX(id), 0) FROM floors));
SELECT setval('facility_types_id_seq', (SELECT COALESCE(MAX(id), 0) FROM facility_types));
SELECT setval('facilities_id_seq',     (SELECT COALESCE(MAX(id), 0) FROM facilities));

COMMIT;

-- ============================================================================
-- DOCKER-COMPOSE MOUNTING INSTRUCTIONS
-- ============================================================================
--
-- To auto-run this seed script when the PostgreSQL container starts for the
-- first time, mount it into /docker-entrypoint-initdb.d/:
--
--   services:
--     postgres:
--       image: postgres:16-alpine
--       environment:
--         POSTGRES_DB: clean_fastapi
--         POSTGRES_USER: postgres
--         POSTGRES_PASSWORD: postgres
--       ports:
--         - "5432:5432"
--       volumes:
--         - postgres_data:/var/lib/postgresql/data
--         - ./seed.sql:/docker-entrypoint-initdb.d/02-seed.sql   # <-- ADD THIS
--
-- NOTE: Files in /docker-entrypoint-initdb.d/ only run on FIRST container
--       initialization (when the data volume is empty). To re-seed an
--       existing database, run manually:
--
--         docker exec -i <container> psql -U postgres -d clean_fastapi < seed.sql
--
-- ============================================================================
