import { getSnapshot } from "mobx-state-tree";
import { Point, Box, Scene } from "./mst";

// jest > 24.5 has annoying issue with inline snapshot formatting right now
// https://github.com/facebook/jest/issues/8424

describe("mst error boundaries test", () => {
  test("When creating a point from a bad snapshot, fallback to 0 0 ", () => {
    const badPointSnapshot: typeof Point.CreationType = {} as any;

    const point = Point.create(badPointSnapshot);

    expect(getSnapshot(point)).toMatchInlineSnapshot(`
      Object {
        "x": 0,
        "y": 0,
      }
    `);
  });

  test(
    "When creating box with bad point snapshot inside," +
      " the point will fallback to 0 0 as above," +
      "but the good values of the box will be used",
    () => {
      const box = Box.create({
        height: 333,
        origin: "bottom-left",
        width: 333,
        point: {
          // ops string and not a number
          x: "5",
          y: "5"
        } as any
      });

      expect(getSnapshot(box)).toMatchInlineSnapshot(`
        Object {
          "height": 333,
          "origin": "bottom-left",
          "point": Object {
            "x": 0,
            "y": 0,
          },
          "width": 333,
        }
      `);
    }
  );

  test("Now we create a bad box, with also bad point inside", () => {
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

  test(
    "Here we see a Scene, with one bad nested point inside," +
      " and the error boundary of the point selectively fix it" +
      "so we don't need to supply full fallback",
    () => {
      const scene = Scene.create({
        boxes: [
          {
            height: 50,
            origin: "bottom-left",
            width: 45,
            // im a bad point
            point: {
              x: "5",
              y: "5"
            } as any
          },
          {
            height: 66,
            origin: "bottom-left",
            width: 88,
            point: {
              x: 5,
              y: 5
            }
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
              "height": 66,
              "origin": "bottom-left",
              "point": Object {
                "x": 5,
                "y": 5,
              },
              "width": 88,
            },
          ],
        }
      `);
    }
  );
});
