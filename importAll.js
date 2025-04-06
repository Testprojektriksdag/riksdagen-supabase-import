import { config } from "dotenv";
config();

import { importDocuments } from "./utils/importdocuments.js";
import { importPersoner } from "./utils/importpersoner.js";
import { importPersonuppdrag } from "./utils/importpersonuppdrag.js";
import { importVoteringar } from "./utils/importvoteringar.js";
import { importDokintressenter } from "./utils/importdokintressenter.js";
import { importDokforslag } from "./utils/importdokforslag.js";

async function runAll() {
  console.log("🚀 Startar riksdagsimport...");

  try {
    await importDocuments();
    await importPersoner();
    await importPersonuppdrag();
    await importVoteringar();
    await importDokintressenter();
    await importDokforslag();
  } catch (error) {
    console.error("❌ Fel vid import:", error.message);
  }

  console.log("✅ All import klar!");
}

runAll();
