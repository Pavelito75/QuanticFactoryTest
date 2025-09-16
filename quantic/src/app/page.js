"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import FilterCheckbox from "@/components/FilterCheckbox";
import FilterActivite from "@/components/FilterActivite";
import FilterArrondissement from "@/components/FilterArrondissement";
import GeolocationButton from "@/components/GeolocationButton";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterGratuit, setFilterGratuit] = useState(false);
  const [filterOuvert, setFilterOuvert] = useState(false);
  const [filterActivite, setFilterActivite] = useState("");
  const [filterArrondissement, setFilterArrondissement] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const searchTimeoutRef = useRef(null);

  useEffect(
     () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(function () {
        async function fetchData() {
          setLoading(true);
          try {
            let url;
            if (query) {
              url = `/api/search?q=${query}`;
            } else {
              url = "/api/search";
            }
            let res = await fetch(url);
            let json = await res.json();
            if (json.results) {
              setData(json.results);
            } else {
              setData([]);
            }
          } catch (e) {
            setData([]);
          } finally {
            setLoading(false);
          }
        }
        fetchData();
      }, 400);
      return function () {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    },
    [query]
  );

  function handleResetFilters() {
    setFilterGratuit(false);
    setFilterOuvert(false);
    setFilterActivite("");
    setFilterArrondissement("");
    setCurrentPage(1);
    setUserLocation(null);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c;
    }

  return (
    <div className="container">
      <SearchBar onQueryChange={setQuery} />
      <div className="filters-row">
        <FilterCheckbox checked={filterGratuit} onChange={function(e) { setFilterGratuit(e.target.checked); }} label="Gratuit uniquement"/>
        <FilterCheckbox checked={filterOuvert} onChange={function(e) { setFilterOuvert(e.target.checked); }} label="Ouvert actuellement"/>
      </div>
      <div className="filters-row">
        <FilterActivite data={data} value={filterActivite} onChange={function(e) { setFilterActivite(e.target.value); }}/>
        <FilterArrondissement data={data} value={filterArrondissement} onChange={function(e) { setFilterArrondissement(e.target.value); }}/>
        <button className="reset-button" onClick={handleResetFilters}>Reset Filtres</button>
        <GeolocationButton onLocationUpdate={setUserLocation} />
      </div>

      {
        (() => {
          
          if (loading) {
            return <div className="loading">Chargement...</div>;
          }

          let filteredData = [];

          for (let i = 0; i < data.length; i++) {
            let item = data[i];
            let keepItem = true;

            if (filterGratuit && String(item.payant).toLowerCase() !== "non") {
              keepItem = false;
            }

            if (filterOuvert && String(item.statut_ouverture).toLowerCase() !== "ouvert") {
              keepItem = false;
            }

            if (filterActivite && item.type !== filterActivite) {
              keepItem = false;
            }

            if (filterArrondissement && item.arrondissement !== filterArrondissement) {
              keepItem = false;
            }

            if (keepItem) {
              filteredData.push(item);
            }
          }

          if (userLocation) {
            for (var j = 0; j < filteredData.length; j++) {
              var item = filteredData[j];
              var lat, lon;

              if (item.geo_point_2d && item.geo_point_2d.lat && item.geo_point_2d.lon) {
                lat = item.geo_point_2d.lat;
                lon = item.geo_point_2d.lon;
              } else if (item.coordonnees_geographiques && item.coordonnees_geographiques.lat && item.coordonnees_geographiques.lon) {
                lat = item.coordonnees_geographiques.lat;
                lon = item.coordonnees_geographiques.lon;
              }

              if (lat && lon) {
                item._sortDistance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lon);
              } else {
                item._sortDistance = 999999;
              }
            }
            
            filteredData.sort(function(a, b) {
              return a._sortDistance - b._sortDistance;
            });
          }

          let totalPages = Math.ceil(filteredData.length / itemsPerPage);
          let startIndex = (currentPage - 1) * itemsPerPage;
          let endIndex = startIndex + itemsPerPage;
          let paginatedData = filteredData.slice(startIndex, endIndex);

          return (
            <div className="results-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>LIEUX</th>
                    <th>ACTIVITES</th>
                    <th>PAYANT</th>
                    <th>ADRESSE</th>
                    <th>ARRONDISSEMENT</th>
                    <th>HORAIRES D'OUVERTURES</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (() => {
                      if (paginatedData.length > 0) {
                        return paginatedData.map(function(item) {
                          let lieu = "-";
                          if (item.nom || item.name || item.voie) {
                            lieu = (
                              <a
                                href={"https://www.google.com/search?q=" + encodeURIComponent(item.nom || item.name || item.voie || "")}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.nom || item.name || item.voie}
                              </a>
                            );
                          }

                          let adresse = "-";
                          if (item.adresse || item.no_voirie_pair || item.no_voirie_impair) {
                            adresse = (
                              <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent([item.adresse, item.no_voirie_pair, item.no_voirie_impair, item.commune].filter(Boolean).join(" "))} target="_blank">
                                {item.adresse || item.no_voirie_pair || item.no_voirie_impair}
                              </a>
                            );
                          }

                          let activite = "Fontaine";
                          if (item.type) {
                            activite = item.type;
                          }

                          let payant = "Non";
                          if (item.payant) {
                            payant = item.payant;
                          }

                          let arrondissement = "-";
                          if (item.arrondissement) {
                            arrondissement = item.arrondissement;
                          } else if (item.commune) {
                            arrondissement = item.commune;
                          }
                          
                          let horaires = "-";
                          if (item.horaires_periode) {
                            horaires = item.horaires_periode;
                          }

                          return (
                            <tr key={item.identifiant || item.gid || item.index}>
                              <td>{lieu}</td>
                              <td>{activite}</td>
                              <td>{payant}</td>
                              <td>{adresse}</td>
                              <td>{arrondissement}</td>
                              <td>{horaires}</td>
                            </tr>
                          );
                        });
                      } else {
                        return (
                          <tr>
                            <td colSpan="6">Aucun résultat trouvé.</td>
                          </tr>
                        );
                      }
                    })()
                  }
                </tbody>
              </table>
              <div className="pagination-container">
                <div className="pagination-info">
                  Affichage de {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} résultats
                </div>
                <div className="pagination-buttons">
                  <button className="pagination-btn" onClick={function() { setCurrentPage(1); }} disabled={currentPage === 1}>Première</button>
                  <button className="pagination-btn" onClick={function() { setCurrentPage(currentPage - 1); }} disabled={currentPage === 1}>Précédente</button>
                  <span className="pagination-current">Page {currentPage} sur {totalPages}</span>
                  <button className="pagination-btn" onClick={function() { setCurrentPage(currentPage + 1); }} disabled={currentPage === totalPages}>Suivante</button>
                  <button className="pagination-btn" onClick={function() { setCurrentPage(totalPages); }}disabled={currentPage === totalPages}>Dernière</button>
                </div>
              </div>
            </div>
          );
        })()
      }
    </div>
  );
}