import './App.css'
import {createMarkerSet} from "./utils/createMarkerSet";
import type {MarkerSet} from "./models/MarkerSet";
import {useState} from "react";
import {pickRandomMarker} from "./utils/pickRandomMarker";
import type {Marker} from "./models/Marker";

function App() {
    const [markerSet] = useState<MarkerSet>(() => createMarkerSet());
    const [markerPick, setMarkerPick] = useState<Marker>();

    const handleMarkerPicker = () => {
        const newPick = pickRandomMarker(markerSet ? markerSet.markers : []);
        setMarkerPick(newPick);
    };

    // Function to determine if a color is light or dark
    const isLightColor = (hex: string): boolean => {
        // Remove # if present
        const color = hex.replace('#', '');
        // Convert to RGB
        const r = parseInt(color.substring(0, 2), 16);
        const g = parseInt(color.substring(2, 4), 16);
        const b = parseInt(color.substring(4, 6), 16);
        // Calculate luminance using relative luminance formula
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        // Return true if light (luminance > 0.5), false if dark
        return luminance > 0.5;
    };

    // Split markers into two halves (50 each)
    const firstHalf = markerSet?.markers.slice(0, 50) || [];
    const secondHalf = markerSet?.markers.slice(50, 100) || [];

    return (
        <div className="app-container">
            <h1 className="app-title">Marker Picker</h1>
            
            {/* Top half: Random Pick */}
            <div className="top-section">
                <div className="random-pick-section">
                    <h2>Random Pick</h2>
                    <button 
                        className="random-pick-button" 
                        onClick={handleMarkerPicker} 
                        disabled={!markerSet}
                    >
                        Random pick!
                    </button>
                    
                    {markerPick && (
                        <div className="random-pick-result">
                            <h3>Randomly selected marker:</h3>
                            <div className="selected-marker" style={{color: markerPick.hex}}>
                                <div className="selected-marker-code">{markerPick.code}</div>
                                <div className="selected-marker-name">{markerPick.name}</div>
                                <div className="selected-marker-hex">{markerPick.hex}</div>
                            </div>
                            <div className="happy-coloring">Happy coloring!!!</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom half: Two marker grids */}
            <div className="bottom-section">
                <div className="marker-grid-header">
                    <h2>{markerSet?.name || "Loading markers..."}</h2>
                    <p className="marker-count">Count: {markerSet?.markers.length || 0}</p>
                </div>
                <div className="grids-container">
                    {/* Left grid: 5 columns × 10 rows */}
                    <div className="marker-grid-left">
                        {firstHalf.map((marker, idx) => {
                            const textColor = isLightColor(marker.hex) ? '#000000' : '#FFFFFF';
                            return (
                                <div key={idx} className="marker-card" style={{backgroundColor: marker.hex}}>
                                    <div className="marker-code" style={{color: textColor}}>{marker.code}</div>
                                    <div className="marker-name" style={{color: textColor}}>{marker.name}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right grid: 5 columns × 10 rows */}
                    <div className="marker-grid-right">
                        {secondHalf.map((marker, idx) => {
                            const textColor = isLightColor(marker.hex) ? '#000000' : '#FFFFFF';
                            return (
                                <div key={idx + 50} className="marker-card" style={{backgroundColor: marker.hex}}>
                                    <div className="marker-code" style={{color: textColor}}>{marker.code}</div>
                                    <div className="marker-name" style={{color: textColor}}>{marker.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <footer className="app-footer">
                <p>Created by Priyanka Kishore - Jan 2026</p>
            </footer>
        </div>
    )
}

export default App
