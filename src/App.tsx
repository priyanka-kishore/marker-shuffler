import './App.css'
import {createMarkerSet} from "./picker/createMarkerSet.ts";
import type {MarkerSet} from "./models/MarkerSet.ts";
import {useState} from "react";
import {pickRandomMarker} from "./picker/pickRandomMarker.ts";
import type {Marker} from "./models/Marker.ts";

function App() {
    const [markerSet, setMarkerSet] = useState<MarkerSet>();
    const [markerPick, setMarkerPick] = useState<Marker>();

    const handleCreateMarketSet = () => {
        const newSet = createMarkerSet();
        setMarkerSet(newSet);
    };

    const handleMarkerPicker = () => {
        const newPick = pickRandomMarker(markerSet ? markerSet.markers : []);
        setMarkerPick(newPick);
    };

    return (
        <>
            <h1>Marker Picker</h1>
            <button onClick={handleCreateMarketSet}>
                Create SFAIH set
            </button>

            {/* Select random color */}
            <button onClick={handleMarkerPicker} disabled={!markerSet}>
                Random pick!
            </button>
            {markerPick && (
                <div>
                    <h2>Randomly selected marker:</h2>
                    <div style={{fontWeight: "bold", color: markerPick.hex}}>
                        <h3>{markerPick.code}: {markerPick.name}!</h3>
                        <h4>Happy coloring!!!</h4>
                    </div>
                </div>
            )}

            {/* List of SFAIH Markers */}
            {markerSet && (
                <div>
                    <h2>{markerSet.name}</h2>
                    <p>Count: {markerSet.markers.length}</p>
                    <div className="deck-container">
                        {markerSet.markers.map((marker, idx) => (
                            <div key={idx} className="deck-card">
                                <strong>{marker.name}</strong>
                                <div style={{fontSize: "12px", color: marker.hex}}>
                                    {marker.code}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default App
