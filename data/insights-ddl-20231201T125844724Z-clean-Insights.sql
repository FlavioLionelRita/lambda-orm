ALTER TABLE "Order Details" DROP CONSTRAINT "Order Details_order_FK";
ALTER TABLE "Order Details" DROP CONSTRAINT "Order Details_product_FK";
UPDATE Products a SET CategoryID = NULL;
ALTER TABLE Products DROP CONSTRAINT Products_category_FK;
ALTER TABLE Orders DROP CONSTRAINT Orders_customer_FK;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS "Order Details";
DROP TABLE IF EXISTS Products;
DROP INDEX Orders_orderDate;
DROP TABLE IF EXISTS Orders;
DROP INDEX Customers_name;
DROP TABLE IF EXISTS Customers;