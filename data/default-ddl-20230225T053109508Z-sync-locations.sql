CREATE TABLE TBL_LOC_COUNTRIES (ISO3 VARCHAR(3) NOT NULL ,NAME VARCHAR(60) NOT NULL ,ISO VARCHAR(2) NOT NULL ,NUMERIC_CODE VARCHAR(5) NOT NULL ,CONSTRAINT TBL_LOC_COUNTRIES_PK PRIMARY KEY (ISO3));
CREATE TABLE TBL_LOC_AREAS (CODE VARCHAR(16) NOT NULL ,PARENT VARCHAR(16)  ,COUNTRY VARCHAR(3) NOT NULL ,TYPE VARCHAR(16) NOT NULL ,NAME VARCHAR(200) NOT NULL ,CONSTRAINT TBL_LOC_AREAS_PK PRIMARY KEY (CODE));
CREATE TABLE TBL_LOC_ADDRESSES (ID INTEGER  AUTO_INCREMENT,COUNTRY VARCHAR(3) NOT NULL ,AREA VARCHAR(16) NOT NULL ,STREET VARCHAR(250)  ,STREET_TYPE VARCHAR(3)  ,NRO VARCHAR(20)  ,ZIP_CODE VARCHAR(30)  ,CITY VARCHAR(100)  ,ADDITIONAL_DATA VARCHAR(100)  ,CONSTRAINT TBL_LOC_ADDRESSES_PK PRIMARY KEY (ID));
ALTER TABLE TBL_LOC_AREAS ADD CONSTRAINT TBL_LOC_AREAS_country_FK FOREIGN KEY (COUNTRY) REFERENCES TBL_LOC_COUNTRIES (ISO3);
ALTER TABLE TBL_LOC_AREAS ADD CONSTRAINT TBL_LOC_AREAS_parent_FK FOREIGN KEY (PARENT) REFERENCES TBL_LOC_AREAS (CODE);
ALTER TABLE TBL_LOC_ADDRESSES ADD CONSTRAINT TBL_LOC_ADDRESSES_country_FK FOREIGN KEY (COUNTRY) REFERENCES TBL_LOC_COUNTRIES (ISO3);
ALTER TABLE TBL_LOC_ADDRESSES ADD CONSTRAINT TBL_LOC_ADDRESSES_area_FK FOREIGN KEY (AREA) REFERENCES TBL_LOC_AREAS (CODE);