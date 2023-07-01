CREATE TABLE Countries (name VARCHAR(80) NOT NULL ,iso3 VARCHAR(3) NOT NULL ,native VARCHAR(80)  ,region VARCHAR(80)  ,subregion VARCHAR(80)  ,latitude DECIMAL(10,4)  ,longitude DECIMAL(10,4)  ,CONSTRAINT Countries_PK PRIMARY KEY (iso3));
ALTER TABLE Countries ADD CONSTRAINT Countries_UK UNIQUE (name);