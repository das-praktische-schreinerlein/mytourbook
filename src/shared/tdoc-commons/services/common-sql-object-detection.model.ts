export const OBJECTDETECTION_KEY_DEFAULT = 'Default';
export const OBJECTDETECTION_NAME_DEFAULT = 'Default';

export interface ObjectDetectionEntityDatastoreConfiguration {
    entityType: string;
}

export interface ObjectDetectionSqlTableConfiguration extends ObjectDetectionEntityDatastoreConfiguration {
    baseTable: string;
    baseFieldFileDir: string;
    baseFieldFileName: string;
    baseFieldFilePath: string;
    baseFieldId: string;
    detailFieldNames: string[];
    id: string;
    detectedFieldDetector: string;
    detectedFieldKey: string;
    detectedFieldPrecision: string;
    detectedFieldState: string;
    detectedTable: string;
    table: string;
}

export interface ObjectDetectionModelObjectTableConfigType {
    fieldCategory: string;
    fieldId: string;
    fieldKey: string;
    fieldName: string;
    fieldPicasaKey: string;
    table: string;
}

export interface ObjectDetectionModelDetectedObjectTableConfigType {
    fieldDetector: string;
    fieldKey: string;
    fieldId: string;
    fieldPrecision: string;
    fieldState: string;
    table: string;
}

export interface ObjectDetectionModelDetectedObjectsTablesConfigType {
    [key: string]: ObjectDetectionModelDetectedObjectTableConfigType;
}

export interface ObjectDetectionModelConfigJoinsType {
    [key: string]: ObjectDetectionSqlTableConfiguration;
}

export interface ObjectDetectionModelObjectKeyTableConfigType {
    fieldId: string;
    fieldKey: string;
    fieldDetector: string;
    table: string;
}

export interface ObjectDetectionModelConfigType {
    objectTable: ObjectDetectionModelObjectTableConfigType;
    objectKeyTable: ObjectDetectionModelObjectKeyTableConfigType;
    detectionTables: ObjectDetectionModelConfigJoinsType;
    detectedObjectsTables: ObjectDetectionModelDetectedObjectsTablesConfigType;
}

