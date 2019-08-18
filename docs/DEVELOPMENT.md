# Develop MyTourBook

## add database-migrations
- create new migration-files for mediadb driver: sqlite
```bash
db-migrate create add-blocked --sql-file --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
- compare with migrations/mediadb/20190804164718-add-blocked.js and add driver to path
- move sql-files to specific folder: mysql|sqlite3
- copy sql-files to the other folder: mysql|sqlite3
- add sql to sql-files
- do migration
```bash
db-migrate up --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
db-migrate down --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
- insert migrations manually if scripts dont pass but model is ready 
```sql
INSERT INTO migrations (id, name, run_on) VALUES (10, '/20190804164718-add-blocked', '2019-08-04 22:38:39');
INSERT INTO migrations (id, name, run_on) VALUES (11, '/20190804165743-add-l-id-for-trip', '2019-08-04 22:38:39');
INSERT INTO migrations (id, name, run_on) VALUES (12, '/20190804170003-extend-image-video-object', '2019-08-04 22:39:01');
```
