import { supabase } from "./supabase.js";
import fetch from "node-fetch";

export async function importDokintressenter() {
  console.log("📎 Hämtar dokintressenter...");

  const listUrl = "https://data.riksdagen.se/dokumentlista/?sok=&sort=datum&sortorder=desc&doktyp=mot,prop,skr,ip,bet&utformat=json&antal=100";
  const res = await fetch(listUrl);
  const json = await res.json();
  const dokument = json.dokumentlista.dokument;

  for (const doc of dokument) {
    const { hangar_id, dok_id } = doc;

    const detailUrl = `https://data.riksdagen.se/dokument/${dok_id}.json`;
    const detailRes = await fetch(detailUrl);
    const detailJson = await detailRes.json();
    const intressenter = detailJson.dokument?.dokintressent || [];

    if (!Array.isArray(intressenter)) continue;

    for (const i of intressenter) {
      const {
        intressent_id,
        namn,
        partibet,
        ordning,
        roll
      } = i;

      const { error } = await supabase.from("dokintressent").upsert([{
        hangar_id: parseInt(hangar_id),
        intressent_id,
        namn,
        partibet,
        ordning: parseInt(ordning),
        roll
      }], {
        onConflict: ['hangar_id', 'intressent_id']
      });

      if (error) console.error(`❌ Intressent: ${intressent_id} - ${error.message}`);
      else console.log(`✅ Intressent: ${namn} (${partibet})`);
    }
  }

  console.log("✅ Klar med dokintressenter");
}
