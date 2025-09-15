export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  const [act, fresh, drink] = await Promise.all([
    fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records?order_by=arrondissement&limit=50')
      .then(res => res.json()),
    fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records?order_by=arrondissement&limit=50')
      .then(res => res.json()),
    fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records?limit=50')
      .then(res => res.json()),
  ]);

  let all = [];
  if (act.results) all = all.concat(act.results);
  if (fresh.results) all = all.concat(fresh.results);
  if (drink.results) all = all.concat(drink.results);

  const filtered = all.filter(item => {
    const fields = [
      item.nom,
      item.name,
      item.voie,
      item.adresse,
      item.commune,
      item.type,
      item.type_objet,
    ];
    return fields.some(f => (f || '').toLowerCase().includes(q));
  });

  return Response.json({ results: filtered });
}