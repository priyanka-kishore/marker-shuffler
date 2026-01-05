import './App.css'
import {createMarkerSet} from "./utils/createMarkerSet";
import type {MarkerSet} from "./models/MarkerSet";
import {useState, useRef} from "react";
import {pickRandomMarker} from "./utils/pickRandomMarker";
import type {Marker} from "./models/Marker";

function App() {
    const [markerSet] = useState<MarkerSet>(() => createMarkerSet());
    const [markerPick, setMarkerPick] = useState<Marker>();
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [stripKey, setStripKey] = useState(0);
    const stripRef = useRef<HTMLDivElement>(null);
    const cardWidth = 120; // Width of each marker card in the strip (100px + 20px gap)

    const handleMarkerPicker = () => {
        if (!markerSet || isScrolling) return;
        
        setIsScrolling(true);
        setMarkerPick(undefined); // Clear previous result
        
        const newPick = pickRandomMarker(markerSet.markers);
        
        // Find the index of the selected marker
        const selectedIndex = markerSet.markers.findIndex(m => m.code === newPick.code);
        
        const totalMarkers = markerSet.markers.length;
        
        // Change the key to force remount - this resets everything cleanly
        setStripKey(prev => prev + 1);
        setScrollPosition(0); // Start from 0
        
        // Calculate final position: multiple full scrolls + position of selected marker
        // We have 5 sets of markers (0-4), so we need to ensure we stay within bounds
        const maxSets = 5;
        const fullScrolls = 3 + Math.random() * 2; // 3-5 full scrolls
        
        // Target the selected marker in set 2 (middle set) - safe choice
        const targetSet = 2;
        
        // Calculate the position of the selected marker in the target set (left edge)
        // Each set has totalMarkers markers, so set 2 starts at 2 * totalMarkers
        const targetMarkerIndex = (targetSet * totalMarkers) + selectedIndex;
        const targetPosition = targetMarkerIndex * cardWidth;
        
        // Calculate scroll distance - scroll through multiple full sets, but wrap to stay within bounds
        const maxPosition = maxSets * totalMarkers * cardWidth;
        const rawScrollDistance = fullScrolls * totalMarkers * cardWidth;
        const wrappedScrollDistance = rawScrollDistance % maxPosition;
        
        // Final position: wrapped scroll distance + target position
        // If this exceeds max, use modulo to wrap
        let finalPosition = wrappedScrollDistance + targetPosition;
        if (finalPosition >= maxPosition) {
            // Wrap: use the target position in set 0 instead
            finalPosition = selectedIndex * cardWidth;
        }
        
        // Wait for remount to get accurate viewport width
        setTimeout(() => {
            const viewportWidth = stripRef.current?.parentElement?.clientWidth || window.innerWidth;
            const actualCardWidth = 100; // Card width is 100px (cardWidth includes 20px margin)
            
            // Center the selected marker in the viewport
            // finalPosition is the left edge, so card center is finalPosition + (actualCardWidth / 2)
            const markerCenterPosition = finalPosition + (actualCardWidth / 2);
            // Scroll position to center: align marker center with viewport center
            const centeredPosition = markerCenterPosition - (viewportWidth / 2);
            
            setScrollPosition(centeredPosition);
        }, 50);
        
        
        // Wait for animation to complete
        setTimeout(() => {
            setMarkerPick(newPick);
            setIsScrolling(false);
        }, 3050); // Match animation duration + buffer
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
                        disabled={!markerSet || isScrolling}
                    >
                        {isScrolling ? 'Spinning...' : 'Random pick!'}
                    </button>
                    
                    {/* Scrolling Strip */}
                    <div className="strip-container">
                        <div 
                            key={stripKey}
                            ref={stripRef}
                            className={`scrolling-strip ${isScrolling ? 'scrolling' : ''}`}
                            style={{ transform: `translateX(-${scrollPosition}px)` }}
                        >
                            {/* Duplicate markers for seamless scrolling - 5 sets to ensure we never run out */}
                            {markerSet?.markers && [
                                ...markerSet.markers.map((marker, idx) => ({ marker, set: 0, idx })),
                                ...markerSet.markers.map((marker, idx) => ({ marker, set: 1, idx })),
                                ...markerSet.markers.map((marker, idx) => ({ marker, set: 2, idx })),
                                ...markerSet.markers.map((marker, idx) => ({ marker, set: 3, idx })),
                                ...markerSet.markers.map((marker, idx) => ({ marker, set: 4, idx }))
                            ].map((item) => {
                                const textColor = isLightColor(item.marker.hex) ? '#000000' : '#FFFFFF';
                                return (
                                    <div 
                                        key={`${item.set}-${item.idx}`}
                                        className="strip-card"
                                        style={{
                                            backgroundColor: item.marker.hex,
                                            color: textColor
                                        }}
                                    >
                                        <div className="strip-card-code">{item.marker.code}</div>
                                        <div className="strip-card-name">{item.marker.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="strip-indicator-left"></div>
                        <div className="strip-indicator-right"></div>
                        <div className="strip-pointer"></div>
                    </div>
                    
                    {markerPick && !isScrolling && (
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
