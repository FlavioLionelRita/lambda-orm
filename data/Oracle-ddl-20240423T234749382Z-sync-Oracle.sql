CREATE SEQUENCE SQ_CATEGORIES START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Categories (CategoryID NUMBER(10) ,CategoryName VARCHAR2(80) NOT NULL ,Description VARCHAR2(1000)  ,CONSTRAINT Categories_PK PRIMARY KEY (CategoryID));
ALTER TABLE Categories ADD CONSTRAINT Categories_UK UNIQUE (CategoryName);
CREATE TABLE Customers (CustomerID VARCHAR2(5) NOT NULL ,CompanyName VARCHAR2(80) NOT NULL ,ContactName VARCHAR2(80)  ,ContactTitle VARCHAR2(80)  ,Address VARCHAR2(80)  ,City VARCHAR2(80)  ,Region VARCHAR2(80)  ,PostalCode VARCHAR2(20)  ,Country VARCHAR2(80)  ,CONSTRAINT Customers_PK PRIMARY KEY (CustomerID));
CREATE SEQUENCE SQ_EMPLOYEES START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Employees (EmployeeID NUMBER(10) ,LastName VARCHAR2(80) NOT NULL ,FirstName VARCHAR2(80) NOT NULL ,Title VARCHAR2(80)  ,TitleOfCourtesy VARCHAR2(80)  ,BirthDate DATE  ,HireDate DATE  ,HomePhone VARCHAR2(80)  ,ReportsTo NUMBER(10)  ,Address VARCHAR2(80)  ,City VARCHAR2(80)  ,Region VARCHAR2(80)  ,PostalCode VARCHAR2(20)  ,Country VARCHAR2(80)  ,CONSTRAINT Employees_PK PRIMARY KEY (EmployeeID));
ALTER TABLE Employees ADD CONSTRAINT Employees_UK UNIQUE (LastName,FirstName);
CREATE SEQUENCE SQ_SHIPPERS START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Shippers (ShipperID NUMBER(10) ,CompanyName VARCHAR2(80) NOT NULL ,Phone VARCHAR2(20)  ,CONSTRAINT Shippers_PK PRIMARY KEY (ShipperID));
ALTER TABLE Shippers ADD CONSTRAINT Shippers_UK UNIQUE (CompanyName);
CREATE SEQUENCE SQ_SUPPLIERS START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Suppliers (SupplierID NUMBER(10) ,CompanyName VARCHAR2(80) NOT NULL ,ContactName VARCHAR2(80)  ,Phone VARCHAR2(20)  ,HomePage VARCHAR2(200)  ,Address VARCHAR2(80)  ,City VARCHAR2(80)  ,Region VARCHAR2(80)  ,PostalCode VARCHAR2(20)  ,Country VARCHAR2(80)  ,CONSTRAINT Suppliers_PK PRIMARY KEY (SupplierID));
ALTER TABLE Suppliers ADD CONSTRAINT Suppliers_UK UNIQUE (CompanyName);
CREATE SEQUENCE SQ_PRODUCTS START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Products (ProductID NUMBER(10) ,ProductName VARCHAR2(80) NOT NULL ,SupplierID NUMBER(10) NOT NULL ,CategoryID NUMBER(10)  ,QuantityPerUnit VARCHAR2(80)  ,UnitPrice NUMBER(19,4)  ,UnitsInStock NUMBER(19,4)  ,UnitsOnOrder NUMBER(19,4)  ,ReorderLevel NUMBER(19,4)  ,Discontinued CHAR(1)  ,CONSTRAINT Products_PK PRIMARY KEY (ProductID));
ALTER TABLE Products ADD CONSTRAINT Products_UK UNIQUE (ProductName,SupplierID);
CREATE SEQUENCE SQ_ORDERS START WITH 1 INCREMENT BY 1 MAXVALUE 999999999999 MINVALUE 1;
CREATE TABLE Orders (OrderID NUMBER(10) ,CustomerID VARCHAR2(5) NOT NULL ,EmployeeID NUMBER(10) NOT NULL ,OrderDate DATE  ,RequiredDate DATE  ,ShippedDate DATE  ,ShipVia NUMBER(10)  ,Freight NUMBER(19,4)  ,ShipName VARCHAR2(80)  ,ShipAddress VARCHAR2(80)  ,ShipCity VARCHAR2(80)  ,ShipRegion VARCHAR2(80)  ,ShipPostalCode VARCHAR2(20)  ,ShipCountry VARCHAR2(80)  ,CONSTRAINT Orders_PK PRIMARY KEY (OrderID));
CREATE TABLE "Order Details" (OrderID NUMBER(10) NOT NULL ,ProductID NUMBER(10) NOT NULL ,UnitPrice NUMBER(19,4)  ,Quantity NUMBER(19,4)  ,Discount NUMBER(19,4)  ,CONSTRAINT "Order Details_PK" PRIMARY KEY (OrderID,ProductID));
CREATE INDEX Customers_name ON Customers (CompanyName);
ALTER TABLE Employees ADD CONSTRAINT Employees_reportsTo_FK FOREIGN KEY (ReportsTo) REFERENCES Employees (EmployeeID);
ALTER TABLE Products ADD CONSTRAINT Products_supplier_FK FOREIGN KEY (SupplierID) REFERENCES Suppliers (SupplierID);
ALTER TABLE Products ADD CONSTRAINT Products_category_FK FOREIGN KEY (CategoryID) REFERENCES Categories (CategoryID);
CREATE INDEX Orders_orderDate ON Orders (OrderDate);
CREATE INDEX Orders_shippedDate ON Orders (ShippedDate);
ALTER TABLE Orders ADD CONSTRAINT Orders_customer_FK FOREIGN KEY (CustomerID) REFERENCES Customers (CustomerID);
ALTER TABLE Orders ADD CONSTRAINT Orders_employee_FK FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID);
ALTER TABLE "Order Details" ADD CONSTRAINT "Order Details_order_FK" FOREIGN KEY (OrderID) REFERENCES Orders (OrderID);
ALTER TABLE "Order Details" ADD CONSTRAINT "Order Details_product_FK" FOREIGN KEY (ProductID) REFERENCES Products (ProductID);