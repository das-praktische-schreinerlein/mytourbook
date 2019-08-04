# Develop MyTourBook

## add database-migrations
- create new migration-files for mediadb driver: sqlite
```
db-migrate create add-blocked --sql-file --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
- compare with migrations/mediadb/20190804164718-add-blocked.js and add driver to path
- move sql-files to specific folder: mysql|sqlite3
- copy sql-files to the other folder: mysql|sqlite3
- add sql to sql-files
- do migration
```
db-migrate up --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
db-migrate down --migrations-dir migrations\mediadb --config config\db-migrate-database.json --env mediadb_sqlite3
```
