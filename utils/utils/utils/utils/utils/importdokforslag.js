import { supabase } from "./supabase.js";
import fetch from "node-fetch";

export async function importDokforslag() {
  console.log("📜 Hämtar dokförslag...");

  const listUrl = "https://data.riksdagen.se/dokumentlista/?sok=&sort=datum&sortorder=desc&doktyp=mot,prop,bet&utformat=json&antal=100";
  const res = await fetch(listUrl);
  const json = await res.json();
  const dokument = json.dokumentlista.dokument;

  for (const doc of dokument) {
    const { hangar_id, dok_id } = doc;

    const detailUrl = `https://data.riksdagen.se/dokument/${dok_id}.json`;
    const detailRes = await fetch(detailUrl);
    const detailJson = await detailRes.json();
    const forslag = detailJson.dokument?.dokforslag || [];

    if (!Array.isArray(forslag)) continue;

    for (const f of forslag) {
      const {
        nummer,
        beteckning,
        lydelse,
        lydelse2,
        utskottet,
        kammaren,
        behandlas_i,
        behandlas_i_punkt,
        kammarbeslutstyp,
        intressent,
        avsnitt,
        grundforfattning,
        andringsforfattning
      } = f;

      const { error } = await supabase.from("dokforslag").upsert([{
        hangar_id: parseInt(hangar_id),
        nummer: parseInt(nummer),
        beteckning,
        lydelse,
        lydelse2,
        utskottet,
        kammaren,
        behandlas_i,
        behandlas_i_punkt,
        kammarbeslutstyp,
        intressent,
        avsnitt,
        grundforfattning,
        andringsforfattning
      }], {
        onConflict: ['hangar_id', 'nummer']
      });

      if (error) console.error(`❌ Förslag: ${beteckning} - ${error.message}`);
      else console.log(`✅ Förslag: ${beteckning}`);
    }
  }

  console.log("✅ Klar med dokförslag");
}
