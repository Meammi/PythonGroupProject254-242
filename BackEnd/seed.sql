-- ============================================================================
-- TULóng — Campus Navigator
-- Seed Data Script (PostgreSQL) - UPDATED COORDINATES
-- ============================================================================
-- Description : Populates the database with real SC1 building data.
--               Safe to run multiple times (idempotent via TRUNCATE).
-- ============================================================================

BEGIN;

-- ============================================================================
-- CLEAN SLATE
-- ============================================================================
TRUNCATE TABLE temperatures    RESTART IDENTITY CASCADE;
TRUNCATE TABLE facilities      RESTART IDENTITY CASCADE;
TRUNCATE TABLE floors          RESTART IDENTITY CASCADE;
TRUNCATE TABLE facility_types  RESTART IDENTITY CASCADE;
TRUNCATE TABLE buildings       RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. BUILDINGS (SC1)
-- ============================================================================
INSERT INTO buildings (id, code, name, latitude, longitude, description)
VALUES
    (1, 'SC1', 'Social Sciences Building 1', 14.069254, 100.603439,
     'A four-storey academic building in the Faculty of Social Sciences at Thammasat University, Rangsit Campus. Houses classrooms, faculty offices, and student service areas.');

-- ============================================================================
-- 2. FLOORS
-- ============================================================================
INSERT INTO floors (id, building_id, floor_code, floor_name, sort_order)
VALUES
    (1, 1, '1F', 'Floor 1', 1),
    (2, 1, '2F', 'Floor 2', 2),
    (3, 1, '3F', 'Floor 3', 3),
    (4, 1, '4F', 'Floor 4', 4);

-- ============================================================================
-- 3. FACILITY TYPES
-- ============================================================================
INSERT INTO facility_types (id, name, icon)
VALUES
    (1, 'toilet',      'icon-toilet'),
    (2, 'store',       'icon-store'),
    (3, 'health-care', 'icon-health');

-- ============================================================================
-- 4. FACILITIES (REAL COORDINATES)
-- ============================================================================

-- ── 4a. Toilets (type_id = 1) ───────────────────────────────────────────────
INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    -- Floor 1 Toilets
    (1, 1, 1, 1, 'Toilet 1', 14.069806, 100.603862, 'No description', true),
    (2, 1, 1, 1, 'Toilet 2', 14.069322, 100.604066, 'No description', true),
    (3, 1, 1, 1, 'Toilet 3', 14.068599, 100.603391, 'No description', true),
    (4, 1, 1, 1, 'Toilet 4', 14.068812, 100.602860, 'No description', true),
    
    -- Floor 2 Toilets
    (5, 1, 2, 1, 'Toilet 5', 14.069806, 100.603862, 'No description', true),
    (6, 1, 2, 1, 'Toilet 6', 14.069322, 100.604066, 'No description', true),
    (7, 1, 2, 1, 'Toilet 7', 14.068599, 100.603391, 'No description', true),
    (8, 1, 2, 1, 'Toilet 8', 14.068812, 100.602860, 'No description', true),

    -- Floor 3 Toilets
    (9, 1, 3, 1, 'Toilet 9', 14.069806, 100.603862, 'No description', true),
    (10, 1, 3, 1, 'Toilet 10', 14.069322, 100.604066, 'No description', true),
    (11, 1, 3, 1, 'Toilet 11', 14.068599, 100.603391, 'No description', true),
    (12, 1, 3, 1, 'Toilet 12', 14.068812, 100.602860, 'No description', true),

    -- Floor 4 Toilets
    (13, 1, 4, 1, 'Toilet 13', 14.069806, 100.603862, 'No description', true),
    (14, 1, 4, 1, 'Toilet 14', 14.069322, 100.604066, 'No description', true),
    (15, 1, 4, 1, 'Toilet 15', 14.068599, 100.603391, 'No description', true),
    (16, 1, 4, 1, 'Toilet 16', 14.068812, 100.602860, 'No description', true);


-- ── 4b. Stores (type_id = 2) ────────────────────────────────────────────────
INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    (17, 1, 1, 2, 'Friend Coffee (Yellow Store)', 14.069161, 100.602763, 
     'Favorite store for food and coffee for TU students.', true),

    (18, 1, 1, 2, 'Fresh Me', 14.069179745455557, 100.60390735068994, 
     'Refreshing Thai-style bubble tea and signature beverages.', true),

    (19, 1, 1, 2, 'Frosty Box', 14.069062, 100.603868, 
     'Popular ice cream shop at TU Rangsit, famous for its variety of soft serve and gelato.', true);

-- ── 4c. Health-care (type_id = 3) ───────────────────────────────────────────
INSERT INTO facilities (id, building_id, floor_id, facility_type_id, name, latitude, longitude, description, is_active)
VALUES
    (20, 1, 1, 3, 'Well Being', 14.068859, 100.603707, 
     'Small clinic for TU students providing basic health services.', true);

-- ============================================================================
-- RESET SEQUENCES
-- ============================================================================
SELECT setval('buildings_id_seq',      (SELECT COALESCE(MAX(id), 0) FROM buildings));
SELECT setval('floors_id_seq',         (SELECT COALESCE(MAX(id), 0) FROM floors));
SELECT setval('facility_types_id_seq', (SELECT COALESCE(MAX(id), 0) FROM facility_types));
SELECT setval('facilities_id_seq',     (SELECT COALESCE(MAX(id), 0) FROM facilities));

COMMIT;