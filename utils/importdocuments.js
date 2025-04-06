import { supabase } from "./supabase.js";
import fetch from "node-fetch";

export async function importDocuments() {
  console.log("📄 Hämtar dokument...");

  const url = "https://data.riksdagen.se/dokumentlista/?sort=datum&sortorder=desc&utformat=json&antal=100";
  const res = await fetch(url);
  const json = await res.json();

  const dokument = json.dokumentlista.dokument;

  for (const d of dokument) {
    const {
      hangar_id, dok_id, rm, beteckning, typ, subtyp, doktyp, typrubrik,
      dokumentnamn, debattnamn, tempbeteckning, organ, mottagare,
      nummer, slutnummer, datum, systemdatum, publicerad,
      titel, undertitel, status, htmlformat, relaterat_id,
      source, sourceid, dokument_url_text, dokument_url_html,
      dokumentstatus_url_xml, utskottsforslag_url_xml, html
    } = d;

    const { error } = await supabase.from("dokument").upsert([{
      hangar_id: parseInt(hangar_id),
      dok_id,
      rm,
      beteckning,
      typ,
      subtyp,
      doktyp,
      typrubrik,
      dokumentnamn,
      debattnamn,
      tempbeteckning,
      organ,
      mottagare,
      nummer: nummer ? parseInt(nummer) : null,
      slutnummer: slutnummer ? parseInt(slutnummer) : null,
      datum,
      systemdatum,
      publicerad,
      titel,
      undertitel,
      status,
      htmlformat,
      relaterat_id,
      source,
      sourceid,
      dokument_url_text,
      dokument_url_html,
      dokumentstatus_url_xml,
      utskottsforslag_url_xml,
      html
