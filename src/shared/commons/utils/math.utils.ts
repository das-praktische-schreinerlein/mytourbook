export class MathUtils {
    public static round(i: number): number {
        if (i === undefined) {
            return i;
        }

        return Math.round(i);
    }

    public static min(i: number, o: number): number {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }

        return Math.min(i, o);
    }

    public static max(i: number, o: number): number {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }

        return Math.max(i, o);
    }

    public static sum(i: number, o: number): number {
        if (i === undefined) {
            return o;
        }
        if (o === undefined) {
            return i;
        }

        return i + o;
    }

    public static sub(i: number, o: number): number {
        if (i === undefined) {
            return -o;
        }
        if (o === undefined) {
            return i;
        }

        return i - o;
    }
}
