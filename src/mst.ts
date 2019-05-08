import { types, typecheck } from "mobx-state-tree";

function makeTuple<TARGS extends (string | number)[]>(...args: TARGS) {
    return args;
}

export const PointBase = types.model("Point", {
    x: types.number,
    y: types.number
});

export const Point = types.snapshotProcessor(PointBase, {
    preProcessor(sn: typeof PointBase.SnapshotType): typeof PointBase.SnapshotType {
        try {
            typecheck(PointBase, sn)
            return sn;
        } catch (e) {
            // console.error(e);
            return {
                x: 0,
                y: 0
            }
        }
    }
});

export const BoxBase = types.model("Box", {
    point: Point,
    width: types.number,
    height: types.number,
    origin: types.enumeration("Origin", makeTuple("top-left", "top-right", "center", "bottom-left", "bottom-right")), 
});

export const Box = types.snapshotProcessor(BoxBase, {
    preProcessor(sn: typeof BoxBase.SnapshotType): typeof BoxBase.SnapshotType {
        try {
            typecheck(BoxBase, sn)
            return sn;
        } catch (e) {
            // console.error(e);
            return {
                point: {x: 1, y: 1} as any,
                width: 100,
                height: 100,
                origin: "center"
            }
        }
    }
});

export const SceneBase = types.model("Scene", {
    boxes: types.array(Box)
});

export const Scene = types.snapshotProcessor(SceneBase, {
    preProcessor(sn: typeof SceneBase.SnapshotType): typeof SceneBase.SnapshotType {
        try {
            typecheck(SceneBase, sn)
            return sn;
        } catch (e) {
            // console.error(e);
            return {
                boxes: []
            }
        }
    }
});
