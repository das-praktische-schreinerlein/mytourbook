window.importStaticDataPDocsJsonP = `{
 "pdocs": [
  {
   "id": "start",
   "descMd": "Willkommen beim MyTB-Viewer. Hier kannst du dir eine Auswahl der Daten von Michas-Ausflugstupps auch offline ansehen :-)",
   "flags": "flg_ShowTopTen, flg_ShowSearch, flgShowNews",
   "heading": "Thats MyTB",
   "langkeys": "lang_de",
   "name": "Start",
   "profiles": "profile_viewer",
   "subSectionIds": "",
   "teaser": "Willkommen bei MyTB",
   "type": "SectionOverviewPage",
   "theme": ""
  },
  {
   "id": "impress",
   "descMd": "Letztens bekam ich den \\"dezenten\\" Hinweis, dass jede Webseite im geschäftsmäßigen Betrieb laut Telemediengesetz ein Impressum benötigt. Nun war ich eigentlich nicht der Meinung, dass MyTourBook ein \\"Geschäft\\" ist. Aber \\"geschäftsmäßig\\" heißt im rechtlichen Sinne wohl, dass der Öffentlichkeit ein Dienst angeboten wird (in meinem Falle Informationen). Das dieser \\"Dienst\\" bei mir nichts kostet ist dabei nebensächlich... Fakt ist, meine Seite ist damit keine private Homepage mehr, sondern ein \\"Teledienst\\" und damit quasi ein \\"Geschäft\\" (wenn auch in meinem Falle ein Minusgeschäft\\" ;-). Und damit bin ich verpflichtet ein Impressum einzubauen, da man mir sonst eine \\"Abmahnung\\" aufhalsen könnte, die mich schnell ein paar TAUSEND Euro kostet. Also sollen sie doch ihr BESCHISSENES Impressum bekommen (und dran ver....., Ähm zufrieden sein ;-): \\n\\n",
   "heading": "Impressum/Datenschutz",
   "name": "Impressum/Datenschutz",
   "subSectionIds": "",
   "teaser": "Impressum/Datenschutz - der rechtliche Teil",
   "type": "SimplePage"
  }
 ]
}
`;

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mytbpdocs.js';
var text = document.createTextNode(importStaticDataPDocsJsonP);
script.appendChild(text);
document.head.appendChild(script);
