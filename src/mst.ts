import { types, typecheck, IAnyModelType } from "mobx-state-tree";

export function addMSTErrorBoundary<IT extends IAnyModelType>(
  Model: IT,
  /**
   * Supply a valid snapshot to use, instead of the failing one
   * We also give you the validation error of the snapshot, and the bad snapshot.
   */
  getFallbackSnapshot: (
    error: unknown,
    originalButBadSnapshot: unknown
  ) => IT["CreationType"]
) {
  return types.snapshotProcessor(Model, {
    preProcessor(snMaybeBad: IT["CreationType"]): IT["CreationType"] {
      try {
        typecheck(Model, snMaybeBad);
        return snMaybeBad;
      } catch (e) {
        return getFallbackSnapshot(e, snMaybeBad);
      }
    }
  });
}

function makeTuple<TARGS extends (string | number)[]>(...args: TARGS) {
  return args;
}

export const Point = addMSTErrorBoundary(
  types.model("Point", {
    x: types.number,
    y: types.number
  }),
  (_error, _originalBadSnapshot) => {
    //console.warn(_error)
    return {
      x: 0,
      y: 0
    };
  }
);

export const Box = addMSTErrorBoundary(
  types.model("Box", {
    point: Point,
    width: types.number,
    height: types.number,
    origin: types.enumeration(
      "Origin",
      makeTuple(
        "top-left",
        "top-right",
        "center",
        "bottom-left",
        "bottom-right"
      )
    )
  }),
  () => ({
    point: { x: 1, y: 1 } as any,
    width: 100,
    height: 100,
    origin: "center" as const
  })
);

export const Scene = addMSTErrorBoundary(
  types.model("Scene", {
    boxes: types.array(Box)
  }),
  () => ({
    boxes: []
  })
);
