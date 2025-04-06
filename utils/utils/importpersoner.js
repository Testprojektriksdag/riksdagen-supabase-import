import { supabase } from "./supabase.js";
import fetch from "node-fetch";

export async function importPersoner() {
  console.log("👥 Hämtar personer...");

  const url = "https://data.riksdagen.se/personlista/?utformat=json";
  const res = await fetch(url);
  const json = await res.json();
  const personer = json.personlista.person;

  for (const p of personer) {
    const {
      intressent_id, fodd_ar, kon, efternamn,
      tilltalsnamn, sorteringsnamn, iort, parti,
      valkrets, status
    } = p;

    const { error } = await supabase.from("person").upsert([{
      intressent_id,
      född_år: parseInt(fodd_ar),
      kön: kon,
      efternamn,
      tilltalsnamn,
      sorteringsnamn,
      iort,
      parti,
      valkrets,
      status
    }], {
      onConflict: ['intressent_id']
    });

    if (error) console.error(`❌ ${intressent_id}: ${error.message}`);
    else console.log(`✅ Person: ${tilltalsnamn} ${efternamn}`);
  }

  console.log("✅ Klar med personer");
}
