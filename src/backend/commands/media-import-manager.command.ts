import * as fs from 'fs';
import {utils} from 'js-data';
import {TourDocFileUtils} from '../shared/tdoc-commons/services/tdoc-file.utils';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import * as Promise_serial from 'promise-serial';
import {NameUtils} from '@dps/mycms-commons/dist/commons/utils/name.utils';

export class MediaImportManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            defaultLocationName: new SimpleFilePathValidationRule(false),
            sourceDir: new SimpleFilePathValidationRule(false),
            groupedDir: new SimpleFilePathValidationRule(false),
            readyImageDir: new SimpleFilePathValidationRule(false),
            readyVideoDir: new SimpleFilePathValidationRule(false),
            archiveImageDir: new SimpleFilePathValidationRule(false),
            archiveVideoDir: new SimpleFilePathValidationRule(false),
            targetImageDir: new SimpleFilePathValidationRule(false),
            targetVideoDir: new SimpleFilePathValidationRule(false)
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'copyFilesToDateFolder',
            'moveVideosToVideoFolder',
            'copyDirsWithPrefixPathAndBackup'];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['sourceDir'] = TourDocFileUtils.normalizeCygwinPath(argv['sourceDir']);
        argv['groupedDir'] = TourDocFileUtils.normalizeCygwinPath(argv['groupedDir']);
        argv['readyImageDir'] = TourDocFileUtils.normalizeCygwinPath(argv['readyImageDir']);
        argv['readyVideoDir'] = TourDocFileUtils.normalizeCygwinPath(argv['readyVideoDir']);
        argv['targetImageDir'] = TourDocFileUtils.normalizeCygwinPath(argv['targetImageDir']);
        argv['targetVideoDir'] = TourDocFileUtils.normalizeCygwinPath(argv['targetVideoDir']);
        argv['archiveImageDir'] = TourDocFileUtils.normalizeCygwinPath(argv['archiveImageDir']);
        argv['archiveVideoDir'] = TourDocFileUtils.normalizeCygwinPath(argv['archiveVideoDir']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];

        const sourceDir = argv['sourceDir'];
        const groupedDir = argv['groupedDir'];
        const readyImageDir = argv['readyImageDir'];
        const readyVideoDir = argv['readyVideoDir'];
        const targetImageDir = argv['targetImageDir'];
        const targetVideoDir = argv['targetVideoDir'];
        const archiveImageDir = argv['archiveImageDir'];
        const archiveVideoDir = argv['archiveVideoDir'];
        const defaultLocationName = NameUtils.normalizeKwNames(
            NameUtils.normalizeFileNames(argv['defaultLocationName'] || 'name-the-location-here'));

        let promise: Promise<any>;
        switch (action) {
            case 'copyFilesToDateFolder':
                console.log('START processing: copyFilesToDateFolder', sourceDir, groupedDir, defaultLocationName);

                console.log('do: copyFilesToDateFolder', sourceDir, groupedDir, defaultLocationName);
                promise = this.checkRequiredDirs([sourceDir, groupedDir, archiveImageDir]).catch(error => {
                    console.error('ERROR while checking prerequisites copyFilesToDateFolder', error);
                    return utils.reject(error);
                }).then(() => {
                    return this.copyFilesToDateFolder(sourceDir, groupedDir, defaultLocationName).catch(error => {
                        console.error('ERROR while copyFilesToDateFolder', sourceDir, groupedDir, defaultLocationName, error);
                        return utils.reject(error);
                    });
                }).then(() => {
                    const firstPrefix = this.createUniqueDirPrefix([archiveImageDir + '/SOURCE_']);
                    const concreteArchiveDir = archiveImageDir + '/SOURCE_' + firstPrefix;
                    console.log('do: backup source', sourceDir, concreteArchiveDir);
                    return this.doArchiveDir(sourceDir, concreteArchiveDir + '/').catch(error => {
                        console.error('ERROR while backup source', sourceDir, concreteArchiveDir, error);
                        return utils.reject(error);
                    });
                });

                break;
            case 'moveVideosToVideoFolder':
                console.log('START processing: moveVideosToVideoFolder', readyImageDir, readyVideoDir);

                console.log('do: moveVideosToVideoFolder', readyImageDir, readyVideoDir);
                promise =  this.checkRequiredDirs([readyImageDir, readyVideoDir]).catch(error => {
                    console.error('ERROR while checking prerequisites copyFilesToDateFolder', error);
                    return utils.reject(error);
                }).then(() => {
                    return this.moveVideosToVideoFolder(readyImageDir, readyVideoDir).catch(error => {
                        console.error('ERROR while moveVideosToVideoFolder', readyImageDir, readyVideoDir, error);
                        return utils.reject(error);
                    });
                });

                break;
            case 'copyDirsWithPrefixPathAndBackup':
                console.log('START processing: copyDirsWithPrefixPathAndBackup', readyImageDir, readyVideoDir);

                const prefix =  this.createUniqueDirPrefix([archiveImageDir + '/IMAGE_READY_',
                    archiveVideoDir + '/VIDEO_READY_']);
                const importPrefix =  'import-' + prefix + '_';

                promise =  this.checkRequiredDirs([readyImageDir, readyVideoDir, targetImageDir, targetVideoDir,
                    archiveImageDir, archiveVideoDir]
                ).catch(error => {
                    console.error('ERROR while checking prerequisites copyFilesToDateFolder', error);
                    return utils.reject(error);
                }).then(() => {
                    console.log('do: copyDirsWithPrefixPath', readyImageDir, targetImageDir, importPrefix);
                    return this.copyDirsWithPrefixPath(readyImageDir, targetImageDir, importPrefix).catch(error => {
                        console.error('ERROR while copyDirsWithPrefixPath', readyImageDir, targetImageDir, error);
                        return utils.reject(error);
                    });
                }).then(() => {
                    const concreteArchiveDir = archiveImageDir + '/IMAGE_READY_' + prefix;
                    console.log('do: backup readyImageDir', readyImageDir, concreteArchiveDir);
                    return this.doArchiveDir(readyImageDir, concreteArchiveDir + '/')
                        .catch(error => {
                            console.error('ERROR while backup readyImageDir', readyImageDir, concreteArchiveDir, error);
                            return utils.reject(error);
                        });
                }).then(() => {
                    console.log('do: copyDirsWithPrefixPath', readyVideoDir, targetVideoDir, importPrefix);
                    return this.copyDirsWithPrefixPath(readyVideoDir, targetVideoDir, importPrefix)
                        .catch(error => {
                            console.error('ERROR while copyDirsWithPrefixPath', readyVideoDir, targetVideoDir, error);
                            return utils.reject(error);
                        });
                }).then(() => {
                    const concreteArchiveDir = archiveVideoDir + '/VIDEO_READY_' + prefix;
                    console.log('do: backup readyVideoDir', readyVideoDir, concreteArchiveDir);
                    return this.doArchiveDir(readyVideoDir, concreteArchiveDir + '/')
                        .catch(error => {
                            console.error('ERROR while backup readyImageDir', readyVideoDir, concreteArchiveDir, error);
                            return utils.reject(error);
                        });
                });

                break;
            default:
                console.error('unknown action:', argv);
                promise = utils.reject('unknown action');
        }

        return promise;
    }

    protected checkRequiredDirs(dirsToCheck: string []): Promise<string> {
        for (const dir of dirsToCheck) {
            const err = FileUtils.checkDirPath(dir, false,  false, true, true);
            if (err) {
                return utils.reject(err);
            }
        }

        return utils.resolve('dirs exists');
    }

    protected createUniqueDirPrefix(dirsToCheck: string []): string {
        const origPrefix = StringUtils.formatToShortFileNameDate(new Date(), '');

        let prefix = origPrefix;
        let alreadyExists = false;
        let summand = 1;
        do {
            alreadyExists = false;

            for (const dir of dirsToCheck) {
                if (FileUtils.checkDirPath(dir + prefix, false, true, false, true)) {
                    alreadyExists = true;
                    break;
                }
            }

            if (!alreadyExists) {
                break;
            }

            prefix = origPrefix + '_' + summand;
            summand = summand + 1;
        } while (true);

        return prefix;
    }

    protected copyFilesToDateFolder(srcDir: string, destDir: string, defaultLocationName: string): Promise<any> {
        const files = fs.readdirSync(srcDir);
        const promises = [];
        for (const file of files) {
            const srcStat: fs.Stats = fs.lstatSync(srcDir + '/' + file);
            if (!srcStat.isFile()) {
                console.log('SKPIPPED - copyFilesToDateFolder no file:', srcDir + '/' + file)
                continue;
            }

            const datePrefix = StringUtils.formatToShortFileNameDate(srcStat.mtime, '');

            promises.push(function () {
                const prefixedDestDir = destDir + '/' + datePrefix + (defaultLocationName ? '-' + defaultLocationName : '');
                const err = FileUtils.checkDirPath(prefixedDestDir, true,  false, false, true);
                if (err) {
                    return Promise.reject('destDir is invalid: ' + err);
                }

                return FileUtils.copyFile(srcDir + '/' + file, prefixedDestDir + '/' + file, true, true, true, false);
            });
        }

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - copyFilesToDateFolder');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected moveVideosToVideoFolder(srcDir: string, destDir: string): Promise<any> {
        const me = this;
        const promises = [];

        const files = fs.readdirSync(srcDir);
        for (const file of files) {
            const srcStat: fs.Stats = fs.lstatSync(srcDir + '/' + file);
            if (srcStat.isDirectory()) {
                console.log('RECURSIVE - moveVideosToVideoFolder directory:', srcDir + '/' + file)
                promises.push(function () {
                    return me.moveVideosToVideoFolder(srcDir + '/' + file, destDir + '/' + file)
                });

                continue;
            }

            if (!srcStat.isFile()) {
                console.log('SKPIPPED - moveVideosToVideoFolder no file:', srcDir + '/' + file)
                continue;
            }

            if (!file.toLowerCase().endsWith('.mp4') && !file.toLowerCase().endsWith('.mov')) {
                console.log('SKPIPPED - moveVideosToVideoFolder no video file:', srcDir + '/' + file)
                continue;
            }

            promises.push(function () {
                const err = FileUtils.checkDirPath(destDir, true, false,  false, true);
                if (err) {
                    return utils.reject(err);
                }

                return FileUtils.moveFile(srcDir + '/' + file, destDir + '/' + file, false, true);
            });
        }

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - moveVideosToVideoFolder');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected copyDirsWithPrefixPath(srcDir: string, destDir: string, prefix: string): Promise<any> {
        const dirs = fs.readdirSync(srcDir);
        const promises = [];
        for (const dir of dirs) {
            const srcStat: fs.Stats = fs.lstatSync(srcDir + '/' + dir);
            if (!srcStat.isDirectory()) {
                console.log('SKPIPPED - copyDirsWithPrefixPath no directory:', srcDir + '/' + dir)
                continue;
            }

            promises.push(function () {
                const tmpDir = fs.mkdtempSync(destDir + '/' + prefix + dir);
                return FileUtils.copyDir(srcDir + '/' + dir, tmpDir, true, true)
                    .then(() => {
                        return FileUtils.moveDir(tmpDir, destDir + '/' + prefix + dir, false, true);
                    });
            });
        }

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - copyFilesToDateFolder');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }

    protected doArchiveDir(srcDir: string, destDir: string): Promise<any> {
        return FileUtils.moveDir(srcDir, destDir, false, true)
            .then(() => {
                const err = FileUtils.checkDirPath(srcDir, true, true,  false, true);
                if (err) {
                    return utils.reject(err);
                }

                return utils.resolve('moved to archive');
            });
    }

}
