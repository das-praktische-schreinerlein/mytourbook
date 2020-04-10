/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

declare module vis {
    export class Graph3d {
        constructor(container: HTMLElement,
                    items: any,
                    options?: any);

        setCameraPosition(pos);
    }
}

type USVString = string;
declare type USVString = string;
