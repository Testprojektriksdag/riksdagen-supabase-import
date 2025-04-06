import { config } from "dotenv";
config();

import { importDocuments } from "./utils/importDocuments.js";
import { importPersoner } from "./utils/importPersoner.js";
import { importVoteringar } from "./utils/importVoteringar.js";
import { importPersonuppdrag } from "./utils/importPersonuppdrag.js";
import { importDokintressenter } from "./utils/importDokintressenter.js";
import { importDokforslag } from "./utils/importDokforslag.js";

async function runAll() {
  console.log("🚀 Startar riksdagsimport...");

  try {
    await importDocuments();           // dokument
    await importPersoner();            // person
    await importPersonuppdrag();       // personuppdrag
    await importVoteringar();          // votering
    await importDokintressenter();     // dokintressent
    await importDokforslag();          // dokforslag
  } catch (error) {
    console.error("❌ Fel vid import:", error.message);
  }

  console.log("✅ All import klar!");
}

runAll();

