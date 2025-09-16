import { useState } from "react";

export default function GeolocationButton({ onLocationUpdate }) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [locationSuccess, setLocationSuccess] = useState(false);

  function getUserLocation() {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      setLocationError("");
      setLocationSuccess(false);

      navigator.geolocation.getCurrentPosition(
        
        function(position) {
          var location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          onLocationUpdate(location);
          setLocationSuccess(true);
          setIsGettingLocation(false);
        },

        function(error) {
          var errorMessage = "";

          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Permission refusée";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Position indisponible.";
          } else if (error.code === error.TIMEOUT) {
            errorMessage = "time out";
          } else {
            errorMessage = "Erreur";
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
        }
      );

    } else {
      setLocationError("Géolocalisation non supportée par ce navigateur.");
    }
  }

  return (
    <div className="geolocation-container">
      <button className="geolocation-button" onClick={getUserLocation} disabled={isGettingLocation}>Trouver près de moi</button>
      {locationError && (
        <div className="location-error">
          {locationError}
        </div>
      )}
      {locationSuccess && (
        <div className="location-success">
          Position trouvée ! Résultats triés par distance.
        </div>
      )}
    </div>
  );
}