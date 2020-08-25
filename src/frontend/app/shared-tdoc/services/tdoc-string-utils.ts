export class TourDocStringUtils {
    public static createReplacementsFromConfigArray(config: [any, any][]): [RegExp, string][] {
        const replacementConfig = [];
        if (Array.isArray(config)) {
            for (const replacement of config) {
                if (Array.isArray(replacement) && replacement.length === 2) {
                    replacementConfig.push([new RegExp(replacement[0]), replacement[1]]);
                }
            }
        }

        return replacementConfig;
    }

    public static doReplacements(src: string, nameReplacements: [RegExp, string][]): string {
        if (src === undefined || src === null || !nameReplacements || !Array.isArray(nameReplacements)) {
            return src;
        }

        let name = src;
        for (const replacement of nameReplacements) {
            name = name.replace(replacement[0], replacement[1]);
        }

        return name;
    }
}
