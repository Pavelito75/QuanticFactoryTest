export default function FilterActivite({ data, value, onChange }) {
  function generateOptions() {
    var activites = [];
    for (var i = 0; i < data.length; i++) {
      var type = data[i].type;
      if (type && activites.indexOf(type) === -1) {
        activites.push(type);
      }
    }
    activites.sort();
    
    var options = [];
    for (var j = 0; j < activites.length; j++) {
      options.push(
        <option key={activites[j]} value={activites[j]}>
            {activites[j]}
        </option>
      );
    }
    return options;
  }

  return (
    <div>
      <label>Filtrer par activité:</label>
      <select value={value} onChange={onChange}>
        <option value="">Toutes les activités</option>
        {generateOptions()}
      </select>
    </div>
  );
}