import fetch from "node-fetch";
import { supabase } from "./utils/supabase.js";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function importDocuments() {
  console.log("📄 Hämtar dokument...");

  const res = await fetch("https://data.riksdagen.se/dokumentlista/?sort=datum&sortorder=desc&utformat=json&antal=100");
  const json = await res.json();
  const docs = json.dokumentlista.dokument;

  for (const doc of docs) {
    const {
      id, rm, beteckning, typ, subtyp, doktyp,
      dokumentnamn, titel, publicerad, systemdatum
    } = doc;

    const { error } = await supabase.from("dokument").upsert([{
      dok_id: id,
      rm,
      beteckning,
      typ,
      subtyp,
      doktyp,
      dokumentnamn,
      titel,
      publicerad,
      systemdatum,
    }], { onConflict: ['dok_id'] });

    if (error) console.error(`❌ Fel på ${id}: ${error.message}`);
    else console.log(`✅ Dokument: ${id}`);

    await sleep(300);
  }

  console.log("✅ Klar med dokument");
}

async function importVotes() {
  console.log("🗳️ Hämtar voteringar...");

  const res = await fetch("https://data.riksdagen.se/voteringlista/?rm=2023/24&utformat=json");
  const json = await res.json();
  const votes = json.voteringlista.votering;

  for (const vote of votes) {
    const {
      hangar_id, votering_id, intressent_id, namn,
      parti, valkrets, rost, datum
    } = vote;

    const { error } = await supabase.from("votering").upsert([{
      hangar_id: parseInt(hangar_id),
      votering_id,
      intressent_id,
      namn,
      parti,
      valkrets,
      rost,
      datum
    }], { onConflict: ['votering_id', 'intressent_id'] });

    if (error) console.error(`❌ Fel på votering: ${votering_id} – ${error.message}`);
    else console.log(`✅ Votering: ${votering_id}`);

    await sleep(200);
  }

  console.log("✅ Klar med voteringar");
}

async function runAll() {
  console.log("🚀 Startar importAll.js");
  try {
    await importDocuments();
    await importVotes();
    console.log("🎉 Allt färdigt!");
  } catch (err) {
    console.error("💥 Fel vid körning:", err);
  }
}

runAll();
