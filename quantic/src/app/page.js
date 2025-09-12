import styles from "./page.module.css";

export default async function Home() {
  let activities = await fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-equipements-activites/records?')
  let jsonAct = await activities.json()
  let postsAct = jsonAct.results

  let fresh = await fetch('https://parisdata.opendatasoft.com/api/explore/v2.1/catalog/datasets/ilots-de-fraicheur-espaces-verts-frais/records?')
  let jsonFresh = await fresh.json()
  let postsFresh = jsonFresh.results

  let drink = await fetch('https://parisdata.opendatasoft.com//api/explore/v2.1/catalog/datasets/fontaines-a-boire/records?')
  let jsonDrink = await drink.json()
  let postsDrink = jsonDrink.results



  return (
    <div>
      <h1>Activites :</h1>
      <ul>
        {postsAct.map((post) => (
          <li key={post.identifiant}>{post.nom}</li>
        ))}
      </ul>
      <hr></hr>
      <h1>Espaces verts :</h1>
      <ul>
        {postsFresh.map((postFresh) => (
          <li key={postFresh.identifiant}>{postFresh.nom}</li>
        ))}
      </ul>
      <hr></hr>
      <h1>Fontaines :</h1>
      <ul>
        {postsDrink.map((postDrink) => (
          <li key={postDrink.gid}>{postDrink.no_voirie_pair || postDrink.no_voirie_impair} {postDrink.voie} / {postDrink.commune}</li>
        ))}
      </ul>
    </div>
  )
}