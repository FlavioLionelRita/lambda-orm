CREATE TABLE IF NOT EXISTS Tests (id serial,description VARCHAR(80)  ,testDate DATE  ,testDateTime TIMESTAMP  ,testDateTime2 TIMESTAMP  ,testDateTimeOffset TIMESTAMP  ,testString VARCHAR(30)  ,CONSTRAINT Tests_PK PRIMARY KEY (id));