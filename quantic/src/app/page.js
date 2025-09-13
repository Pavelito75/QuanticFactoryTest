// FILTRE PAR TRUCS (ACTIVITES, JARDIN, FONTAINE)
// RAJOUTER FILTRE GRATUIT OU NON
// FILTRE OUVERT OU NON
// FILTRE PAR ARRONDISSEMENT (FILTRE OU L'ON PEUT CHOISIR LE NUMERO EN ECRIVANT ET CA ME RAMENE DESSUS)
// PK PAS UN SYSTEME DE SORT PAR DEPARTEMENT, TYPE
// SI JAMAIS J'AI LE TEMPS FAIRE UN INPUT OU TU PEUX METTRE TON ADRESSE ET CA TE RENVOIE LES TRUCS LES PLUS PROCHES

"use client";

import { useState, useEffect, useRef } from "react";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          let url;
          if (query) {
            url = `/api/search?q=${query}`;
          } else {
            url = "/api/search";
          }

          const res = await fetch(url);
          const json = await res.json();

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
      };
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
      {(() => {
        if (loading) {
          return <div>Chargement...</div>;
        } else {
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
                {(() => {
                  if (data.length > 0) {
                    return data.map((item, index) => {
                      let lieu = "-";
                      if (item.nom || item.name || item.voie) {
                        lieu = (
                          <a href={`https://www.google.com/search?q=${(item.nom || item.name || item.voie || "")}`} target="_blank">
                            {item.nom || item.name || item.voie}
                          </a>
                        );
                      }

                      let adresse = "-";
                      if (item.adresse || item.no_voirie_pair || item.no_voirie_impair) {
                        adresse = (
                          <a href={`https://www.google.com/maps/search/?api=1&query=${([item.adresse, item.no_voirie_pair, item.no_voirie_impair, item.commune].filter(Boolean).join(" "))}`} target="_blank">
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
                        <tr key={item.identifiant || item.gid || index}>
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
                        <td>
                          Aucun résultat trouvé.
                        </td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          );
        }
      })()}
    </div>
  );
}