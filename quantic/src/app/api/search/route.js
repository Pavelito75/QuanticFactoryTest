export async function GET(req) {
  const [act, fresh, drink] = await Promise.all([
    fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records?order_by=arrondissement&limit=100').then(r => r.json()),
    fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records?order_by=arrondissement&limit=100').then(r => r.json()),
    fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/fontaines-a-boire/records?limit=100').then(r => r.json()),
  ]);

  const all = [
    ...(act.results || []),
    ...(fresh.results || []),
    ...(drink.results || []),
  ];

  return Response.json({ results: all });
}