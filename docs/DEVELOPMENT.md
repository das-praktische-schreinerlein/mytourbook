# Develop MyTourBook

## Development server
Run initially to copy overrides into project
```bash
bash
npm prune && npm install && ./build-dev.bash
```

Run scripts to initially reset database-passwords... 
```bash
npm run backend-prepare-appenv-beforebuild
```

Run to build and start the backend. Navigate to [api](http://localhost:4100/api/v1/de/pdoc/) to get the pdocs.
```bash
npm run backend-build-and-serve-dev
```

Run for a dev server. Navigate to [startpage](http://localhost:4200/).
```bash
npm start
```

## Running unit tests
Run to execute the unit tests via [Karma](https://karma-runner.github.io).
```bash
npm test
```

## Running end-to-end tests
Run to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `npm start`.
```bash
npm e2e
```

## add database-migrations
- create new migration-files for mytbdb driver: sqlite
```bash
db-migrate create add-blocked --sql-file --migrations-dir migrations\mytbdb --config config\db-migrate-database.json --env mytbdb_sqlite3
```
- compare with migrations/mytbdb/20190804164718-add-blocked.js and add driver to path
- move sql-files to specific folder: mysql|sqlite3
- copy sql-files to the other folder: mysql|sqlite3
- add sql to sql-files
- do migration
```bash
db-migrate up --migrations-dir migrations\mytbdb --config config\db-migrate-database.json --env mytbdb_sqlite3
db-migrate down --migrations-dir migrations\mytbdb --config config\db-migrate-database.json --env mytbdb_sqlite3
```
- insert migrations manually if scripts dont pass but model is ready 
```sql
INSERT INTO migrations (id, name, run_on) VALUES (10, '/20190804164718-add-blocked', '2019-08-04 22:38:39');
INSERT INTO migrations (id, name, run_on) VALUES (11, '/20190804165743-add-l-id-for-trip', '2019-08-04 22:38:39');
INSERT INTO migrations (id, name, run_on) VALUES (12, '/20190804170003-extend-image-video-object', '2019-08-04 22:39:01');
```
