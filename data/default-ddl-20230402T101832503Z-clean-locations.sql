ALTER TABLE TBL_LOC_ADDRESSES DROP FOREIGN KEY TBL_LOC_ADDRESSES_country_FK;
ALTER TABLE TBL_LOC_ADDRESSES DROP FOREIGN KEY TBL_LOC_ADDRESSES_area_FK;
ALTER TABLE TBL_LOC_AREAS DROP FOREIGN KEY TBL_LOC_AREAS_country_FK;
UPDATE TBL_LOC_AREAS a SET PARENT = NULL;
ALTER TABLE TBL_LOC_AREAS DROP FOREIGN KEY TBL_LOC_AREAS_parent_FK;
DROP TABLE IF EXISTS TBL_LOC_ADDRESSES;
DROP TABLE IF EXISTS TBL_LOC_AREAS;
DROP TABLE IF EXISTS TBL_LOC_COUNTRIES;