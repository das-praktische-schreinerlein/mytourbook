window.importStaticDataPDocsJsonP = `
{
 "pdocs": [
  {
   "descMd": "Hauptmenü",
   "flags": "",
   "heading": "Hauptmenü",
   "key": "menu",
   "langkeys": "lang_de",
   "name": "Hauptmenü",
   "profiles": "profile_beta, profile_dev, profile_import, profile_prod, profile_static, profile_viewer",
   "subSectionIds": "sections,locations,statistics",
   "subtype": "SectionOverviewPage",
   "teaser": "Hauptmenü",
   "type": "PAGE",
   "id": "PAGE_3"
  },
  {
   "descMd": "Willkommen beim MyTB-Viewer. Hier kannst du dir eine Auswahl der Daten von Michas-Ausflugstupps auch offline ansehen :-)",
   "flags": "flgShowNews, flg_ShowSearch, flg_ShowTopTen",
   "heading": "Thats MyTB-Viewer",
   "key": "start",
   "langkeys": "lang_de, lang_en",
   "name": "Start MyTB-Viewer",
   "profiles": "profile_viewer",
   "subtype": "SectionOverviewPage",
   "teaser": "Willkommen beim MyTB-Viewer",
   "type": "PAGE",
   "id": "PAGE_45"
  },
  {
   "descMd": "Letztens bekam ich den \\"dezenten\\" Hinweis, dass jede Webseite im geschäftsmäßigen Betrieb laut Telemediengesetz ein Impressum benötigt. Nun war ich eigentlich nicht der Meinung, dass MyTourBook ein \\"Geschäft\\" ist. Aber \\"geschäftsmäßig\\" heißt im rechtlichen Sinne wohl, dass der Öffentlichkeit ein Dienst angeboten wird (in meinem Falle Informationen). Das dieser \\"Dienst\\" bei mir nichts kostet ist dabei nebensächlich... Fakt ist, meine Seite ist damit keine private Homepage mehr, sondern ein \\"Teledienst\\" und damit quasi ein \\"Geschäft\\" (wenn auch in meinem Falle ein Minusgeschäft\\" ;-). Und damit bin ich verpflichtet ein Impressum einzubauen, da man mir sonst eine \\"Abmahnung\\" aufhalsen könnte, die mich schnell ein paar TAUSEND Euro kostet. Also sollen sie doch ihr BESCHISSENES Impressum bekommen (und dran ver....., Ähm zufrieden sein ;-): \\n\\n",
   "flags": "",
   "heading": "Impressum/Datenschutz",
   "key": "impress",
   "langkeys": "lang_de, lang_en",
   "name": "Impressum/Datenschutz",
   "profiles": "profile_viewer",
   "subtype": "SimplePage",
   "teaser": "Impressum/Datenschutz - der rechtliche Teil",
   "type": "PAGE",
   "id": "PAGE_46"
  }
 ]
}`;
var script = document.createElement("script");
script.type='application/json';
script.id = 'assets/staticdata/static.mytbpdocs.js';
var text = document.createTextNode(importStaticDataPDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);