export default function FilterArrondissement({ data, value, onChange }) {
  function generateOptions() {
    var lieux = [];
    
    for (var i = 0; i < data.length; i++) {
      var lieu = data[i].arrondissement;
      if (lieu && lieux.indexOf(lieu) === -1) {
        lieux.push(lieu);
      }
    }

    lieux.sort();
    
    var options = [];
    if (lieux.length > 0) {
      for (var j = 0; j < lieux.length; j++) {
        options.push(<option key={lieux[j]} value={lieux[j]}>{lieux[j]}</option>);
      }
    }
    return options;
  }

  return (
    <div>
      <label>Filtrer par lieu:</label>
      <select value={value} onChange={onChange}>
        <option value="">Tous les lieux</option>
        {generateOptions()}
      </select>
    </div>
  );
}