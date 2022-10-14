export class FormUtils {
    public static getNumberFormValue(values: {}, formKey: string): number {
        if (!values[formKey]) {
            return undefined;
        }

        if (Array.isArray(values[formKey])) {
            return Number(values[formKey][0]);
        } else {
            return Number(values[formKey]);
        }
    }

    public static getStringFormValue(values: {}, formKey: string): string {
        if (!values[formKey]) {
            return undefined;
        }

        if (Array.isArray(values[formKey])) {
            return values[formKey][0] + '';
        } else {
            return values[formKey] + '';
        }
    }

    public static getStringArrayFormValue(values: {}, formKey: string): string[] {
        if (!values[formKey]) {
            return undefined;
        }
        if (Array.isArray(values[formKey])) {
            return values[formKey];
        } else {
            return [values[formKey]];
        }
    }
}
