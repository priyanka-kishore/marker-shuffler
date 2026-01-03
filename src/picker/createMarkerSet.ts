import type {MarkerSet} from "../models/MarkerSet.ts";
import sfaih from "../assets/sfaih-101-marker-set.json";


export function createMarkerSet(): MarkerSet {
    console.log("in createMarkerSet");

    const sfaihSet: MarkerSet = {
        name: "SFAIH Alcohol Markers (101 count)",
        markers: sfaih
    }

    console.log(sfaihSet);
    return sfaihSet;
}