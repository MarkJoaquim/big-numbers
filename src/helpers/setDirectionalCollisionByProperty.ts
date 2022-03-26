import { Tilemaps } from "phaser";

export const setDirectionalCollisionByProperty = (layer: Tilemaps.TilemapLayer, properties: {[key: string]: any}, left: boolean, right: boolean, up: boolean, down: boolean, recalculateFaces?: boolean): Tilemaps.TilemapLayer => {
    
    if (recalculateFaces === undefined) { recalculateFaces = true; }

    for (let ty = 0; ty < layer.height; ty++) {
        for (let tx = 0; tx < layer.width; tx++) {
            let tile = layer.getTileAt(tx, ty);

            if (!tile) { continue; }

            for (let property in properties) {
                if (tile.properties[property] === undefined) { continue; }

                var values = properties[property];

                if (!Array.isArray(values)) {
                    values = [ values ];
                }

                for (var i = 0; i < values.length; i++) {
                    if (tile.properties[property] === values[i]) {
                        tile.setCollision(left, right, up, down);
                    }
                }
            }
        }
    }

    if (recalculateFaces)
    {
        layer.calculateFacesWithin(0, 0, layer.width, layer.height);
    }

    return layer;
};
