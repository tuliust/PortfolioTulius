-- Credit metadata is no longer used by the frontend, admin or synthetic API.
-- PRODUCTION GATE: do NOT apply until the original SQL dumps have been
-- restored and validated on an isolated PostgreSQL 17 instance, the 128 Storage
-- objects have a verified physical backup, and rollback/recovery have passed.
-- Owner has authorized the eventual removal; this file alone is not proof
-- that the technical gate is satisfied.
-- No historical value is copied into the public migration or repository.
alter table public.media_assets drop column credit;
