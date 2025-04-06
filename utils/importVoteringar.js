import { supabase } from "./supabase.js";
import fetch from "node-fetch";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function importVoteringar() {
  console.log("🗳️ Hämtar voteringar...");

  const url = "https://data.riksdagen.se/voteringlista/?rm=2023/24&utformat=json";
  const res = await fetch(url);
  const json = await res.json();
  const voteringar = json.voteringlista.votering;

  for (const vot of voteringar) {
    const {
      hangar_id, votering_id, punkt, namn,
      intressent_id, parti, valkrets, valkretsnummer,
      rost, avser, datum
    } = vot;

    const { error } = await supabase.from("votering").upsert([{
      rm: "2023/24",
      hangar_id: parseInt(hangar_id),
      votering_id,
      punkt: parseInt(punkt),
      namn,
      intressent_id,
      parti,
      valkrets,
      valkretsnummer: parseInt(valkretsnummer),
      rost,
      avser,
      datum
    }], {
      onConflict: ['votering_id', 'intressent_id']
    });

    if (error) console.error(`❌ ${votering_id}: ${error.message}`);
    else console.log(`✅ Votering: ${votering_id}`);

    await sleep(100); // för att inte spamma API:t
  }

  console.log("✅ Klar med voteringar");
}
