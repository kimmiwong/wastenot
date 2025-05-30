import React, { useState, useRef, useEffect } from "react";
import {
  AdvancedMarker,
  Map,
  Pin,
  APIProvider,
} from "@vis.gl/react-google-maps";
import {
  PlaceReviews,
  PlaceDataProvider,
  PlaceDirectionsButton,
  IconButton,
  PlaceOverview,
  SplitLayout,
  OverlayLayout,
  PlacePicker,
} from "@googlemaps/extended-component-library/react";

const googleAPIKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 38, lng: -98 };
const DEFAULT_ZOOM = 5;
const DEFAULT_ZOOM_WITH_LOCATION = 10;

const CompostMap = () => {
  const overlayLayoutRef = useRef(null);
  const pickerRef = useRef(null);
  const [compostMarkers, setCompostMarkers] = useState([]);
  const [compostLocation, setCompostLocation] = useState(undefined);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  useEffect(() => {
    if (!compostLocation?.location) return;

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: compostLocation.location,
      radius: 50000, // in meters
      keyword: "residential compost",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setCompostMarkers(results);
      } else {
        console.error("Nearby search failed:", status);
        setCompostMarkers([]);
      }
    });
  }, [compostLocation]);

  return (
    <div className="CompostMap">
      <APIProvider
        apiKey={googleAPIKey}
        version="beta"
      >
        <SplitLayout rowReverse rowLayoutMinWidth={700}>
          <div className="SlotDiv" slot="fixed">
            <OverlayLayout ref={overlayLayoutRef}>
              <div className="SlotDiv" slot="main">
                <PlacePicker
                  className="CompostPicker"
                  ref={pickerRef}
                  forMap="gmap"
                  country={["us", "ca"]}
                  placeholder="Enter your location"
                  onPlaceChange={() => {
                    const place = pickerRef.current?.value;
                    if (!place) {
                      setCompostLocation(undefined);
                      setMapCenter(DEFAULT_CENTER);
                      setMapZoom(DEFAULT_ZOOM);
                    } else {
                      setCompostLocation(place);
                      setMapCenter(place.location);
                      setMapZoom(DEFAULT_ZOOM_WITH_LOCATION);
                    }
                  }}
                />
                <PlaceOverview
                  size="large"
                  place={compostLocation}
                  googleLogoAlreadyDisplayed
                >
                  <div slot="action" className="SlotDiv">
                    <IconButton
                      slot="action"
                      variant="filled"
                      onClick={() => overlayLayoutRef.current?.showOverlay()}
                    >
                      See Reviews
                    </IconButton>
                  </div>
                  <div slot="action" className="SlotDiv">
                    <PlaceDirectionsButton slot="action" variant="filled">
                      Directions
                    </PlaceDirectionsButton>
                  </div>
                </PlaceOverview>
              </div>
              <div slot="overlay" className="SlotDiv">
                <IconButton
                  className="CloseButton"
                  onClick={() => overlayLayoutRef.current?.hideOverlay()}
                >
                  Close
                </IconButton>
                <PlaceDataProvider place={compostLocation}>
                  <PlaceReviews />
                </PlaceDataProvider>
              </div>
            </OverlayLayout>
          </div>
          <div className="SplitLayoutContainer" slot="main">
            <Map
              id="gmap"
              mapId="8c732c82e4ec29d9"
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              fullscreenControl={false}
              zoomControl={true}
              onCameraChanged={(ev) => {
              setMapCenter(ev.detail.center);
              setMapZoom(ev.detail.zoom);
              }}
            >
              {compostMarkers.map((compostPlace, i) => (
                <AdvancedMarker
                  key={i}
                  position={compostPlace.geometry.location}
                  onClick={() => setCompostLocation(compostPlace)}
                >
                <Pin background="#34A853" borderColor="#000" glyphColor="#fff" />
                </AdvancedMarker>
              ))}
            </Map>
          </div>
        </SplitLayout>
      </APIProvider>
    </div>
  );
};

export default CompostMap;
