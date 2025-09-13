import styles from "./page.module.css";

export default async function Home() {
  let activities = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records?order_by=arrondissement&limit=20')
  let jsonAct = await activities.json()
  let postsAct = jsonAct.results

  let fresh = await fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records?order_by=arrondissement&limit=20')
  let jsonFresh = await fresh.json()
  let postsFresh = jsonFresh.results

  let drink = await fetch('https://parisdata.opendatasoft.com//api/explore/v2.1/catalog/datasets/fontaines-a-boire/records?limit=20')
  let jsonDrink = await drink.json()
  let postsDrink = jsonDrink.results


  return (
    <div id="true">
      {/* <h1>Activites :</h1> */}
      <h1>Tableau :</h1>
      <table>
        <tr>
          <td>LIEUX</td>
          <td>ACTIVITES</td>
          <td>PAYANT</td>
          <td>ADRESSE</td>
          <td>ARRONDISSEMENT</td>
          <td>HORAIRES D'OUVERTURES</td>
        </tr>
        {postsAct.map((post) => (
          <tr key={post.identifiant} className="activity">
            <td>{post.nom}</td>
            <td>{post.type}</td>
            <td>{post.payant}</td>
            <td>{post.adresse}</td>
            <td>{post.arrondissement}</td>
            <td>{post.horaires_periode || "On sait pas"}</td>
          </tr>
        ))}
      {/* <hr></hr>
      <h1>Espaces verts :</h1> */}
        {postsFresh.map((postFresh) => (
          <tr key={postFresh.identifiant} className="green-space">
            <td>{postFresh.nom}</td>
            <td>{postFresh.type}</td>
            <td>{postFresh.payant}</td>
            <td>{postFresh.adresse}</td>
            <td>{postFresh.arrondissement}</td>
            <td>{postFresh.horaires_periode || "On sait pas"}</td>
          </tr>
        ))}
      </table>
      <table>
        <tr>
          <td>N°</td>
          <td>VOIE</td>
          <td>COMMUNE</td>
        </tr>
      {/* <hr></hr>
      <h1>Fontaines :</h1> */}
        {postsDrink.map((postDrink) => (
          <tr key={postDrink.gid} className="fountain">
            <td>{postDrink.no_voirie_pair || postDrink.no_voirie_impair}</td>
            <td>{postDrink.voie}</td>
            <td>{postDrink.commune}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}