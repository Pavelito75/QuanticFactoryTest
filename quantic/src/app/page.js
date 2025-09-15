// PAGINATION
// SI JAMAIS J'AI LE TEMPS FAIRE UN INPUT OU TU PEUX METTRE TON ADRESSE ET CA TE RENVOIE LES TRUCS LES PLUS PROCHES
// UN BON README 

"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import FilterCheckbox from "@/components/FilterCheckbox";
import FilterActivite from "@/components/FilterActivite";
import FilterArrondissement from "@/components/FilterArrondissement";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterGratuit, setFilterGratuit] = useState(false);
  const [filterOuvert, setFilterOuvert] = useState(false);
  const [filterActivite, setFilterActivite] = useState("");
  const [filterArrondissement, setFilterArrondissement] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(function() {

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(function() {
      async function fetchData() {
        setLoading(true);

        try {
          var url;

          if (query) {
            url = `/api/search?q=${query}`;
          } else {
            url = "/api/search";
          }

          var res = await fetch(url);
          var json = await res.json();

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

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  return (
    <div id="true">
      <SearchBar onQueryChange={setQuery} />
      <div>
        <FilterCheckbox checked={filterGratuit} onChange={function(e) { setFilterGratuit(e.target.checked); }} label="Gratuit uniquement" />
        <FilterCheckbox checked={filterOuvert} onChange={function(e) { setFilterOuvert(e.target.checked); }} label="Ouvert actuellement" />
      </div>
      <div>
        <FilterActivite data={data} value={filterActivite} onChange={function(e) { setFilterActivite(e.target.value); }} />
        <FilterArrondissement data={data} value={filterArrondissement} onChange={function(e) { setFilterArrondissement(e.target.value); }} />
        <button onClick={() => {setFilterGratuit(false);setFilterOuvert(false); setFilterActivite(""); setFilterArrondissement("");}}>Reinitialiser les filtres</button>
      </div>
      {
        (() => {

          if (loading) {
            return <div>Chargement...</div>;
          }
          
          var filteredData = [];
          
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var keepItem = true;
            
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
          
            return (
              <table>
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
                    if (filteredData.length > 0) {
                      return filteredData.map(function(item, index) {
                        return (
                          <tr key={index}>
                            <td>{item.nom || item.name || item.voie || "-"}</td>
                            <td>{item.type || "Fontaine"}</td>
                            <td>{item.payant || "Non"}</td>
                            <td>{item.adresse || item.no_voirie_pair || item.no_voirie_impair || "-"}</td>
                            <td>{item.arrondissement || item.commune || "-"}</td>
                            <td>{item.horaires_periode || "-"}</td>
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
          );
        })()
      }
    </div>
  );
}