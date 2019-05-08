import { getSnapshot } from "mobx-state-tree";
import { Point, Box, Scene } from "./mst";

describe("mst error boundaries test", () => {
  test("basic point falls back to 0 0 ", () => {
    const point = Point.create({} as any);

    expect(getSnapshot(point)).toMatchInlineSnapshot(`
      Object {
        "x": 0,
        "y": 0,
      }
    `);
  });

  test("basic box falls back to ??", () => {
    const box = Box.create({
      height: "333" as any,
      origin: "bottom-left",
      width: 333,
      point: {
        x: "5",
        y: "5"
      } as any
    });

    expect(getSnapshot(box)).toMatchInlineSnapshot(`
            Object {
              "height": 100,
              "origin": "center",
              "point": Object {
                "x": 1,
                "y": 1,
              },
              "width": 100,
            }
        `);
  });

  test("basic Scene falls back to ??", () => {
    const scene = Scene.create({
      boxes: [
        {
          height: 50,
          origin: "bottom-left",
          width: 45,
          point: {
            x: "5",
            y: "5"
          } as any
        },
        {
          height: 50,
          origin: "bottom-left",
          width: 45,
          point: {
            x: "5",
            y: "5"
          } as any
        }
      ]
    });

    expect(getSnapshot(scene)).toMatchInlineSnapshot(`
                              Object {
                                "boxes": Array [
                                  Object {
                                    "height": 50,
                                    "origin": "bottom-left",
                                    "point": Object {
                                      "x": 0,
                                      "y": 0,
                                    },
                                    "width": 45,
                                  },
                                  Object {
                                    "height": 50,
                                    "origin": "bottom-left",
                                    "point": Object {
                                      "x": 0,
                                      "y": 0,
                                    },
                                    "width": 45,
                                  },
                                ],
                              }
                    `);
  });
});
