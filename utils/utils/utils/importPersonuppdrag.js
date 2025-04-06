import { supabase } from "./supabase.js";
import fetch from "node-fetch";

export async function importPersonuppdrag() {
  console.log("🧾 Hämtar personuppdrag...");

  const url = "https://data.riksdagen.se/personlista/?utformat=json";
  const res = await fetch(url);
  const json = await res.json();
  const personer = json.personlista.person;

  for (const person of personer) {
    const intressent_id = person.intressent_id;
    const detailUrl = `https://data.riksdagen.se/personlista/?iid=${intressent_id}&utformat=json`;
    const detailRes = await fetch(detailUrl);
    const detailJson = await detailRes.json();

    const uppdrag = detailJson.personlista.person[0]?.personuppdrag?.uppdrag || [];

    for (const u of uppdrag) {
      const {
        organ_kod, roll_kod, ordningsnummer,
        status, typ, from, tom, uppgift
      } = u;

      const { error } = await supabase.from("personuppdrag").upsert([{
        organ_kod,
        roll_kod,
        ordningsnummer: parseInt(ordningsnummer),
        status,
        typ,
        from: from || null,
        tom: tom || null,
        uppgift,
        intressent_id
      }], {
        onConflict: ['intressent_id', 'organ_kod', 'roll_kod', 'from']
      });

      if (error) console.error(`❌ Uppdrag: ${intressent_id} - ${organ_kod} | ${error.message}`);
      else console.log(`✅ Uppdrag: ${intressent_id} - ${organ_kod}`);
    }
  }

  console.log("✅ Klar med personuppdrag");
}
