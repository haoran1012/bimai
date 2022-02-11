

// # class Polygon

import CuttingPlane from "./CuttingPlane";

// Represents a convex polygon. The vertices used to initialize a polygon must
// be coplanar and form a convex loop. They do not have to be `Vertex`
// instances but they must behave similarly (duck typing can be used for
// customization).

export default class Polygon {
    public vertices: any[];
    public plane: any;
    constructor(vertices: any[]) {
        this.vertices = vertices;
        this.plane = new CuttingPlane().fromPoints(
            vertices[0].pos.clone(),
            vertices[1].pos.clone(),
            vertices[2].pos.clone(),
        );
    }

    clone() {
        const vertices = this.vertices.map(function (v) {
            return v.clone();
        });
        return new Polygon(vertices);
    }

    negate() {
        this.vertices.reverse().map(function (v) {
            v.negate();
        });
        this.plane.negate();
    }
}
