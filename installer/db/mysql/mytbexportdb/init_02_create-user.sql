-- ------------------------------------
-- create beta-user
-- ------------------------------------
CREATE USER IF NOT EXISTS testmytbexportbetadb@127.0.0.1 IDENTIFIED BY 'testmytbexportbetadb';
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportbetadb@127.0.0.1 IDENTIFIED BY 'testmytbexportbetadb';
CREATE USER IF NOT EXISTS testmytbexportbetadb@localhost IDENTIFIED BY 'testmytbexportbetadb';
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportbetadb@localhost IDENTIFIED BY 'testmytbexportbetadb';
-- CREATE USER IF NOT EXISTS testmytbexportbetadb@'%' IDENTIFIED BY 'testmytbexportbetadb';
-- GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportbetadb@'%' IDENTIFIED BY 'testmytbexportbetadb';
CREATE USER IF NOT EXISTS testmytbexportbetadb IDENTIFIED BY 'testmytbexportbetadb';
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportbetadb IDENTIFIED BY 'testmytbexportbetadb';

-- grant access to mytbdb to beta-user
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbexportbetadb@127.0.0.1 IDENTIFIED BY 'testmytbexportbetadb';
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbexportbetadb@localhost IDENTIFIED BY 'testmytbexportbetadb';
-- GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbexportbetadb@'%' IDENTIFIED BY 'testmytbexportbetadb';
GRANT ALL PRIVILEGES ON testmytbdb.* TO testmytbexportbetadb IDENTIFIED BY 'testmytbexportbetadb';

-- ------------------------------------
-- create prod-user
-- ------------------------------------
CREATE USER IF NOT EXISTS testmytbexportproddb@127.0.0.1 IDENTIFIED BY 'testmytbexportproddb';
GRANT ALL PRIVILEGES ON testmytbexportproddb.* TO testmytbexportproddb@127.0.0.1 IDENTIFIED BY 'testmytbexportproddb';
CREATE USER IF NOT EXISTS testmytbexportproddb@localhost IDENTIFIED BY 'testmytbexportproddb';
GRANT ALL PRIVILEGES ON testmytbexportproddb.* TO testmytbexportproddb@localhost IDENTIFIED BY 'testmytbexportproddb';
-- CREATE USER IF NOT EXISTS testmytbexportproddb@'%' IDENTIFIED BY 'testmytbexportproddb';
-- GRANT ALL PRIVILEGES ON testmytbexportproddb.* TO testmytbexportproddb@'%' IDENTIFIED BY 'testmytbexportproddb';
CREATE USER IF NOT EXISTS testmytbexportproddb IDENTIFIED BY 'testmytbexportproddb';
GRANT ALL PRIVILEGES ON testmytbexportproddb.* TO testmytbexportproddb IDENTIFIED BY 'testmytbexportproddb';

-- grant access to mytbexportbetadv to prod-user
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportproddb@127.0.0.1 IDENTIFIED BY 'testmytbexportproddb';
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportproddb@localhost IDENTIFIED BY 'testmytbexportproddb';
-- GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportproddb@'%' IDENTIFIED BY 'testmytbexportproddb';
GRANT ALL PRIVILEGES ON testmytbexportbetadb.* TO testmytbexportproddb IDENTIFIED BY 'testmytbexportproddb';

FLUSH PRIVILEGES;
