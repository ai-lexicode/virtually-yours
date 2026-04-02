import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const blogImages: Record<string, string> = {
  "wet-vbar-schijnzelfstandigheid": "/images/blog/blog-wetboeken.jpg",
  "voldoe-jij-aan-de-cookiewet": "/images/blog/blog-cookiewet.jpg",
  "gevolgen-deliveroo-arrest-voor-vas": "/images/blog/blog-deliveroo.jpg",
  "overeenkomst-van-opdracht-voor-vas": "/images/blog/blog-contract.jpg",
};

interface BlogPost {
  title: string;
  date: string;
  category: string;
  summary: string;
  content: React.ReactNode;
}

const categoryColors: Record<string, string> = {
  Arbeidsrecht: "bg-surface-container-high text-primary",
  Privacy: "bg-secondary-container/40 text-secondary",
  Ondernemingsrecht: "bg-surface-container text-primary-container",
};

function ArticleWetVbar() {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wet VBAR in het hoofdlijnenakkoord</h2>
      <p>De fractievoorzitters van PVV, VVD, NSC en BBB publiceerden het hoofdlijnenakkoord 2024-2028, dat maatregelen bevat tegen schijnzelfstandigheid. Het akkoord stelt: &ldquo;Zekerheid op de arbeidsmarkt wordt gestimuleerd, bijvoorbeeld voor echte zelfstandigen (zzp&apos;ers)&rdquo; en benadrukt dat &ldquo;de wetsbehandeling van de Wet verduidelijking beoordeling arbeidsrelaties en rechtsvermoeden (VBAR) en de Wet toelating terbeschikkingstelling van arbeidskrachten (WTTA) voortgezet&rdquo; zal worden.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Schijnzelfstandigheid</h2>
      <p>Er bestaat al lange tijd onduidelijkheid over het beoordelen van arbeidsrelaties tussen opdrachtgevers en opdrachtnemers. Wanneer is sprake van schijnzelfstandigheid? Als een ZZP&apos;er denkt voor een opdrachtgever te werken, maar de Belastingdienst stelt dat deze eigenlijk werknemer in loondienst is, kan dit grote gevolgen hebben voor beide partijen. De Wet VBAR beoogt dit helder te maken.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">De Wet VBAR en eerdere wetten</h2>
      <p>De overheid deed meerdere pogingen duidelijkheid te cre&euml;ren:</p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li><strong>2005</strong>: Verklaring Arbeidsrelatie (VAR) ingevoerd</li>
        <li><strong>2016</strong>: VAR vervangen door Wet Deregulering Beoordeling Arbeidsrelaties (Wet DBA)</li>
      </ul>
      <p>De Wet DBA bracht echter onvoldoende duidelijkheid. De Belastingdienst stelde daarom een handhavingsmoratorium in. Dit is in 2024 nog steeds van kracht, maar zal naar verwachting per 1 januari 2025 worden opgeheven.</p>
      <p className="mt-4">Het nieuwe wetsvoorstel VBAR ligt nu op tafel, maar kreeg veel kritiek van politici, werkgeversorganisaties en zzp-organisaties. Hoewel opgenomen in het hoofdlijnenakkoord, verschillen partijen nog stevig over de invulling. De oorspronkelijke ingangsdatum van 1 januari 2026 zal waarschijnlijk niet worden gehaald.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Het huidige wetsvoorstel VBAR</h2>
      <p>Het wetsvoorstel heeft twee hoofddoelen:</p>
      <ol className="list-decimal pl-6 space-y-2 my-4">
        <li>Te verduidelijken wanneer iemand werkt in dienst van een werkgever</li>
        <li>Een rechtsvermoeden voor arbeidsovereenkomsten in te voeren op basis van een tariefgrens</li>
      </ol>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Verduidelijking van &lsquo;werken in dienst van&rsquo;</h3>
      <p>Het toetsingskader bestaat uit drie hoofdelementen (Boek 7:610 BW):</p>
      <div className="my-4 space-y-4">
        <p><strong>A. Werkinhoudelijke aansturing</strong> &mdash; De werkgever stuurt de arbeid inhoudelijk aan</p>
        <p><strong>B. Organisatorische inbedding</strong> &mdash; De arbeid of werknemer is ingebed in de werkgeversorganisatie</p>
        <p><strong>C. Eigen rekening en risico</strong> &mdash; De werknemer verricht arbeid niet voor eigen rekening en risico</p>
      </div>
      <p>Er is geen arbeidsovereenkomst als situatie C hoofdzakelijk van toepassing is. Er is w&eacute;l een arbeidsovereenkomst als situaties A en B voornamelijk van toepassing zijn.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Rechtsvermoeden van arbeidsovereenkomst</h3>
      <p>Werknemers in loondienst verdienen doorgaans minder per uur dan zelfstandigen, omdat zelfstandigen extra kosten hebben voor verzekeringen, pensioenreserveringen en buffers voor periodes zonder opdrachten.</p>
      <p className="mt-4">Het wetsvoorstel stelt dat werkenden met lage tarieven weinig onderhandelingsmacht hebben en kwetsbaar zijn, waardoor risico op gedwongen schijnzelfstandigheid groot is. Om deze groep te beschermen, introduceert de Wet VBAR een rechtsvermoeden van arbeidsovereenkomst.</p>
      <p className="mt-4">Bij werkenden die na aftrek van kosten voor arbeidsongeschiktheidsverzekering en pensioenreservering minder dan 120% van het wettelijk minimumloon overhouden, ontstaat een rechtsvermoeden van arbeidsovereenkomst. Deze tariefgrens staat op &euro;32,24 (peildatum 1 juli 2023).</p>
      <p className="mt-4">Dit rechtsvermoeden betekent dat werkenden met lagere tarieven makkelijker een arbeidsovereenkomst kunnen opeisen, maar niet dat een arbeidsovereenkomst automatisch ontstaat. Ook betekent het niet dat tarieven boven deze grens automatisch zelfstandigheid impliceren.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Conclusie</h2>
      <p>De Wet VBAR formuleert criteria om te bepalen of sprake is van een arbeidsovereenkomst of zelfstandigheid. Gekeken wordt naar werkinhoudelijke aansturing, organisatorische inbedding en of de werknemer voor eigen rekening en risico werkt.</p>
    </>
  );
}

function ArticleCookiewet() {
  return (
    <>
      <p>Onlangs liet de Autoriteit Persoonsgegevens (AP) weten dat ze in 2024 vaker gaan controleren of websites op de juiste manier toestemming vragen voor (tracking) cookies of andere volgsoftware. Volgens de Cookiewet (Telecommunicatiewet) mogen bepaalde cookies uitsluitend geplaatst worden met toestemming van de websitebezoeker. Het is dus belangrijk dat je voldoet aan de Cookiewet.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat zijn cookies volgens de Cookiewet?</h2>
      <p>In de Cookiewet wordt het verplicht gesteld om toestemming te vragen voor: &ldquo;het via een elektronisch communicatienetwerk opslaan van of toegang verkrijgen tot informatie in de randapparatuur van een gebruiker&rdquo; (art. 11.7a Tw).</p>
      <p className="mt-4">Cookies vallen hieronder. Cookies zijn namelijk kleine tekstbestanden die op de computer of het mobiele apparaat van een websitebezoeker worden opgeslagen. De server van de website plaatst deze cookies tijdens het websitebezoek. Als de websitebezoeker dan een volgende keer de website bezoekt, ontvangt de server deze informatie weer, zodat de computer of het mobiele apparaat wordt herkend. Dit is bijvoorbeeld noodzakelijk voor een optimale gebruikerservaring van de website, maar cookies kunnen ook gebruikt worden voor andere, bijvoorbeeld commerci&euml;le, doeleinden.</p>
      <p className="mt-4">Er zijn drie soorten cookies: functionele cookies, analytische cookies en tracking cookies. Vanuit de Cookiewet en de Algemene Verordening Gegevensbescherming (AVG) bestaat er voor sommige van deze cookies een wettelijke plicht om toestemming van de websitebezoeker te vragen voordat deze geplaatst mogen worden.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat zijn functionele cookies?</h2>
      <p>Functionele cookies zijn cookies die noodzakelijk zijn om de website goed en veilig te laten werken. Deze cookies zorgen voor een optimale gebruikerservaring van de website, bijvoorbeeld door de taalkeuze of andere voorkeuren van de websitebezoeker te onthouden.</p>
      <p className="mt-4">Er zijn twee soorten functionele cookies: sessiecookies en permanente cookies. De sessiecookies worden automatisch verwijderd direct na het bezoek, zodra de sessie is ge&euml;indigd. Ze worden niet opgeslagen op de harde schijf van de computer of het mobiele apparaat. De permanente cookies worden wel opgeslagen. Functionele cookies mogen ongevraagd geplaatst worden, zolang de websitebezoeker daarvan op de hoogte wordt gebracht.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat zijn analytische cookies?</h2>
      <p>Analytische cookies zijn cookies die ervoor zorgen dat de website verbeterd kan worden. Door analytische cookies te gebruiken kan er bijvoorbeeld inzicht gekregen worden in hoe vaak een blogartikel wordt gelezen, hoelang het duurt voordat pagina&apos;s geladen zijn en waar de bezoekers van de website op klikken.</p>
      <p className="mt-4">Analytische cookies met weinig gevolgen voor de privacy van de websitebezoeker mogen zonder toestemming geplaatst worden, zolang de websitebezoeker daarvan op de hoogte wordt gebracht. Privacygevoelige analytische cookies mogen volgens de Cookiewet uitsluitend met toestemming worden geplaatst.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat zijn tracking cookies?</h2>
      <p>Tracking cookies zijn cookies die gebruikt kunnen worden om het surfgedrag van de websitebezoeker te volgen. Ze kunnen ook bij een bezoek aan een andere website worden uitgelezen. Dankzij tracking cookies kan de inhoud van de website op de interesses en voorkeuren van de websitebezoeker worden afgestemd. Bovendien kunnen tracking cookies ervoor zorgen dat de bezoeker op de website en op andere websites alleen relevante advertenties ziet. Tracking cookies mogen volgens de Cookiewet uitsluitend met toestemming worden geplaatst.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Hoe vraag je toestemming?</h2>
      <p>Als je gebruik maakt van tracking cookies of analytische cookies waar volgens de Cookiewet toestemming voor is vereist, moet je de websitebezoeker op de juiste manier om toestemming vragen. Dit doe je met een heldere cookiebanner. Met deze cookiebanner leg je aan je websitebezoekers uit hoe je hun persoonsgegevens verzamelt via cookies, en waarom je dat doet. De websitebezoeker kan met de cookiebanner aangeven of je toestemming krijgt om cookies te plaatsen, en voor welk type cookie je toestemming krijgt. Let er hierbij op dat het weigeren van cookies geen nadelige gevolgen mag hebben voor de websitebezoeker.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Cookiebanner conform de Cookiewet</h2>
      <p>Om een cookiebanner op te kunnen stellen die aan de Cookiewet voldoet, geeft de Autoriteit Persoonsgegevens op haar website negen vuistregels die helpen om een goede cookiebanner te maken:</p>
      <ul className="list-disc pl-6 space-y-2 my-4">
        <li>Geef informatie over het doel</li>
        <li>Zet vinkjes niet automatisch aan</li>
        <li>Gebruik duidelijke tekst</li>
        <li>Zet verschillende keuzes op &eacute;&eacute;n laag</li>
        <li>Verberg bepaalde keuzes niet</li>
        <li>Laat iemand niet extra klikken</li>
        <li>Gebruik geen onopvallende link in de tekst</li>
        <li>Wees helder over het intrekken van toestemming</li>
        <li>Verwar toestemming niet met gerechtvaardigd belang</li>
      </ul>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Cookieverklaring conform de Cookiewet</h2>
      <p>De Cookiewet stelt dat het noodzakelijk is om websitebezoekers te voorzien van duidelijke en volledige informatie overeenkomstig de AVG, in ieder geval over de doeleinden waarvoor de cookies worden gebruikt. Als je gebruik maakt van cookies waar toestemming voor is vereist, moet je naast de cookiebanner ook een cookieverklaring op je website plaatsen. In deze cookieverklaring leg je onder andere uit welke cookies je gebruikt, met welke doeleinden je cookies plaatst en op welke manier websitebezoekers hun toestemming kunnen geven voor het plaatsen ervan.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Handhaving Cookiewet</h2>
      <p>Als je als onderneming niet op de juiste manier, conform de Cookiewet, toestemming vraagt voor het plaatsen van cookies en andere volgsoftware, kan de Autoriteit Persoonsgegevens een onderzoek doen en je bijvoorbeeld een boete opleggen. Het is dus belangrijk dat je cookiebanner en je cookieverklaring op orde zijn.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Cookieverklaring nodig?</h2>
      <p>Heb je nog geen cookieverklaring? Ik help je hier graag mee. Neem <Link href="/contact" className="text-secondary hover:text-secondary/80 underline">contact</Link> op voor meer informatie.</p>
    </>
  );
}

function ArticleDeliveroo() {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Vervallen modelovereenkomst vrije vervanging</h2>
      <p>De Belastingdienst trekt de goedkeuring voor modelovereenkomsten gebaseerd op vrije vervanging per 1 januari 2024 in. De reden hiervoor is het oordeel van de Hoge Raad in het zogenaamde Deliveroo-arrest (ECLI:NL:HR:2023:443). Dit kan consequenties hebben voor jou als virtual assistant (VA). De gevolgen van het Deliveroo-arrest voor VA&apos;s worden hier besproken.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Werken met een overeenkomst van opdracht</h2>
      <p>Als je het goed aan wilt pakken als VA, werk je met een overeenkomst van opdracht (OvO) wanneer je voor een opdrachtgever gaat werken. Deze OvO dient voor het vastleggen van onderlinge afspraken, maar ook om de kans op schijnzelfstandigheid te verkleinen. De belangrijkste gevolgen van het Deliveroo-arrest voor VA&apos;s hebben betrekking op deze schijnzelfstandigheid.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Schijnzelfstandigheid</h2>
      <p>Als de Belastingdienst jou als schijnzelfstandige ziet, ben jij volgens de maatstaven van de fiscus in loondienst, terwijl jij denkt dat je als ondernemer werkt. Het feit dat je ingeschreven staat bij de KvK, en de intentie hebt om als zelfstandig opdrachtnemer te werken voor opdrachtgevers, betekent niet automatisch dat de Belastingdienst jou ook daadwerkelijk als ondernemer ziet. Als de Belastingdienst (achteraf) oordeelt dat jouw opdrachtgever eigenlijk jouw werkgever is, en jij dus feitelijk in loondienst bent, kan dit behoorlijke gevolgen hebben voor jullie. Denk hierbij onder andere aan naheffingsaanslagen en boetes.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Kenmerken van loondienst</h2>
      <p>Loondienst heeft drie kenmerken:</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Werkgeversgezag</h3>
      <p>Kan je opdrachtgever bepalen hoe, wanneer, waar, met wie, hoeveel uur of hoeveel dagen per week je aan de opdracht werkt?</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">De verplichting tot het leveren van (persoonlijke) arbeid</h3>
      <p>Kun je je vrij laten vervangen door iemand anders?</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Een beloning</h3>
      <p>Indien er aan alle kenmerken wordt voldaan is er in ieder geval sprake van loondienst. Als er aan &eacute;&eacute;n of meer kenmerken niet wordt voldaan, is er mogelijk geen sprake van loondienst. Echter, een van de gevolgen van het Deliveroo-arrest is, dat zelfs als aan een bepaald kenmerk niet wordt voldaan, er t&oacute;ch sprake kan zijn van loondienst.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Modelovereenkomsten</h2>
      <p>Het is niet altijd eenvoudig om te bepalen of er sprake is van loondienst of niet. Daarom heeft de Belastingdienst modelovereenkomsten opgesteld. De OvO die jij als VA gebruikt is waarschijnlijk gebaseerd op een door de Belastingdienst goedgekeurde modelovereenkomst.</p>
      <p className="mt-4">Er zijn verschillende modelovereenkomsten voor situaties waarbij &eacute;&eacute;n of meer kenmerken van loondienst ontbreken. De Belastingdienst stelt dat je zekerheid hebt dat er geen sprake is van loondienst, wanneer je een dergelijke modelovereenkomst gebruikt (en hier ook naar handelt).</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Gevolgen van het Deliveroo-arrest voor modelovereenkomsten</h2>
      <p>In het Deliveroo-arrest oordeelde de hoogste rechter (de Hoge Raad) echter, dat er t&oacute;ch sprake kan zijn van loondienst, z&eacute;lfs als je niet aan alle kenmerken van loondienst voldoet omdat je niet verplicht bent tot het leveren van persoonlijke arbeid.</p>
      <p className="mt-4">De bezorgers van Deliveroo waren namelijk een opdrachtovereenkomst overeengekomen, en konden zich in principe vrij laten vervangen. De Hoge Raad vond echter dat er toch sprake was van een arbeidsovereenkomst. In reactie hierop laat de Belastingdienst de modelovereenkomsten die zijn gebaseerd op vrije vervanging per 1 januari 2024 vervallen.</p>
      <p className="mt-4">Het vervallen van de modelovereenkomsten gebaseerd op vrije vervanging is dus een van de gevolgen van het Deliveroo-arrest. Dit kan ook consequenties hebben voor VA&apos;s.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Gevolgen van het Deliveroo-arrest voor VA&apos;s</h2>
      <p>Als jij werkt met een OvO die is gebaseerd op vrije vervanging, kunnen de gevolgen van het Deliveroo-arrest dus ook voor jou van belang zijn. Het is belangrijk dat je nagaat of jouw OvO deels of uitsluitend is gebaseerd op een modelovereenkomst vrije vervanging. Als dat het geval is, moet je de arbeidsrelatie met je opdrachtgever mogelijk aanpassen. Anders kan het zijn dat de Belastingdienst de arbeidsrelatie met jouw opdrachtgever ziet als een loondienstverband. Dit kan vervelende gevolgen hebben voor jullie.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">OvO laten checken?</h2>
      <p>Wil je zeker weten dat jouw Overeenkomst van Opdracht nog voldoet aan de eisen van de Belastingdienst? Neem <Link href="/contact" className="text-secondary hover:text-secondary/80 underline">contact</Link> op. Ik laat je dan weten of jouw overeenkomst nog bruikbaar is.</p>
    </>
  );
}

function ArticleOvereenkomst() {
  return (
    <>
      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat is een overeenkomst van opdracht voor VA&apos;s?</h2>
      <p>Een overeenkomst van opdracht voor VA&apos;s is een contract tussen een opdrachtgever en een virtuele assistent, waarbij wordt overeengekomen dat de VA specifieke taken of diensten voor de opdrachtgever gaat uitvoeren. Deze overeenkomst legt de wederzijdse rechten, plichten en verwachtingen vast.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Modelovereenkomst Belastingdienst</h2>
      <p>Een overeenkomst van opdracht voor VA&apos;s is vaak gebaseerd op een modelovereenkomst van de Belastingdienst. Volgens de wet DBA moeten opdrachtgever en opdrachtnemer samen bepalen hoe zij hun arbeidsrelatie invullen: als werkgever/werknemer (loondienst) of als opdrachtgever/opdrachtnemer (ondernemer).</p>
      <p className="mt-4">Er is sprake van schijnzelfstandigheid als een VA een opdracht heeft aangenomen als ondernemer, maar de Belastingdienst vindt dat de VA eigenlijk in loondienst is. Dit heeft vervelende fiscale gevolgen voor zowel de VA als de opdrachtgever. Door gebruik te maken van een modelovereenkomst van de Belastingdienst wordt de arbeidsrelatie minder snel gezien als een (verkapt) loondienstverband.</p>
      <p className="mt-4">Let op. De Belastingdienst kan goedkeuring voor modelovereenkomsten ook weer intrekken. Hou de geldigheid van de modelovereenkomsten dus altijd goed in de gaten, en pas zo nodig de arbeidsrelatie met je opdrachtgever aan.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Andere afspraken in de overeenkomst van opdracht voor VA&apos;s</h2>
      <p>Het is dus belangrijk dat de overeenkomst van opdracht voor VA&apos;s de benodigde elementen uit de modelovereenkomst van de Belastingdienst bevat. Daarnaast kunnen de VA en opdrachtgever ook nog andere afspraken vastleggen in de OvO.</p>
      <p className="mt-4">Vaak zijn dit afspraken specifiek voor de opdracht. Dit in tegenstelling tot algemene voorwaarden, die doorgaans meer van algemene aard zijn en/of van toepassing zijn op alle werkzaamheden en opdrachten van de betreffende ondernemer. Een OvO en algemene voorwaarden vullen elkaar daarom goed aan. Het is dan ook te adviseren om beide documenten te gebruiken bij het aannemen van een opdracht.</p>

      <h2 className="font-serif text-2xl font-bold text-on-surface mt-8 mb-4">Wat staat er in een overeenkomst van opdracht voor VA&apos;s?</h2>
      <p>Enkele zaken die geregeld kunnen worden in een overeenkomst van opdracht voor VA&apos;s zijn:</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Arbeidsrelatie</h3>
      <p>De elementen uit een modelovereenkomst van de Belastingdienst waarin een loondienstverband expliciet wordt uitgesloten. Hiermee wordt de kans op schijnzelfstandigheid beperkt.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Diensten en taken</h3>
      <p>Een duidelijke beschrijving van de taken en diensten die de virtuele assistent zal uitvoeren. Dit kan vari&euml;ren van administratieve taken, e-mailbeheer, planning, klantenservice tot andere taken op afstand.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Duur van de overeenkomst</h3>
      <p>De periode gedurende welke de overeenkomst van opdracht voor VA&apos;s van kracht is. Dit kan een bepaalde periode zijn of voor de duur van specifieke projecten.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Vergoeding en betalingsvoorwaarden</h3>
      <p>De vergoeding die de opdrachtgever aan de virtuele assistent zal betalen, evenals de betalingsvoorwaarden (bijvoorbeeld maandelijks, per project, etc.).</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Vertrouwelijkheid</h3>
      <p>Een clausule die de vertrouwelijkheid van eventuele gevoelige informatie regelt die tijdens de samenwerking wordt gedeeld.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Be&euml;indiging van de overeenkomst</h3>
      <p>Voorwaarden waaronder de overeenkomst van opdracht voor VA&apos;s kan worden be&euml;indigd, inclusief opzegtermijnen en redenen voor be&euml;indiging.</p>

      <h3 className="font-serif text-xl font-bold text-on-surface mt-6 mb-3">Algemene voorwaarden</h3>
      <p>Van toepassing verklaring van de algemene voorwaarden van &eacute;&eacute;n van de partijen. Vaak worden de algemene voorwaarden van de VA van toepassing verklaard, en worden die van de opdrachtgever buiten toepassing verklaard.</p>

      <div className="mt-8 p-6 rounded-lg bg-surface-container-low">
        <p>Als je als VA een opdracht aan wilt nemen, is het verstandig om dit door middel van een overeenkomst van opdracht voor VA&apos;s te doen. Het is daarbij belangrijk dat het een overeenkomst betreft die specifiek is toegespitst op de werkzaamheden van een VA. Een t&eacute; algemene overeenkomst van opdracht, of eentje uit een andere branche, zullen in veel gevallen niet voldoen.</p>
      </div>
    </>
  );
}

const blogPosts: Record<string, BlogPost> = {
  "wet-vbar-schijnzelfstandigheid": {
    title: "Wet VBAR en schijnzelfstandigheid",
    date: "25 mei 2024",
    category: "Arbeidsrecht",
    summary:
      "De Wet VBAR (Verduidelijking Beoordeling Arbeidsrelaties en Rechtsvermoeden) brengt belangrijke veranderingen voor zzp'ers en opdrachtgevers. De wet introduceert een rechtsvermoeden van een arbeidsovereenkomst wanneer het uurtarief onder een bepaald bedrag ligt. Dit heeft directe gevolgen voor VA's, OBM's en andere online professionals die als zzp'er werken.",
    content: <ArticleWetVbar />,
  },
  "voldoe-jij-aan-de-cookiewet": {
    title: "Voldoe jij aan de Cookiewet?",
    date: "25 februari 2024",
    category: "Privacy",
    summary:
      "Veel online ondernemers gebruiken cookies op hun website, maar voldoen niet aan de Cookiewet. De Telecommunicatiewet schrijft voor dat je vooraf toestemming moet vragen voor het plaatsen van tracking cookies. In dit artikel lees je wat je moet regelen om wel compliant te zijn en hoe je een correct cookiebeleid opstelt.",
    content: <ArticleCookiewet />,
  },
  "gevolgen-deliveroo-arrest-voor-vas": {
    title: "Gevolgen van het Deliveroo-arrest voor VA's",
    date: "13 december 2023",
    category: "Arbeidsrecht",
    summary:
      "Het Deliveroo-arrest van de Hoge Raad heeft grote gevolgen voor de beoordeling van arbeidsrelaties in Nederland. De Hoge Raad heeft verduidelijkt welke factoren meewegen bij het onderscheid tussen een arbeidsovereenkomst en een overeenkomst van opdracht. Voor VA's en hun opdrachtgevers is het belangrijk om te begrijpen wat dit arrest betekent voor hun werkrelatie.",
    content: <ArticleDeliveroo />,
  },
  "overeenkomst-van-opdracht-voor-vas": {
    title: "Overeenkomst van Opdracht voor VA's",
    date: "7 december 2023",
    category: "Ondernemingsrecht",
    summary:
      "Als VA werk je op basis van een overeenkomst van opdracht (artikel 7:400 BW). Maar wat moet er precies in staan? Een goede overeenkomst van opdracht beschermt zowel jou als je opdrachtgever en voorkomt dat de relatie als arbeidsovereenkomst kan worden aangemerkt. In dit artikel bespreken we de essentiële elementen.",
    content: <ArticleOvereenkomst />,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return { title: "Artikel niet gevonden — Virtually Yours" };
  return {
    title: `${post.title} — Virtually Yours`,
    description: post.summary.slice(0, 160),
  };
}

export default async function NieuwsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) notFound();

  return (
    <section className="py-12 sm:py-16">
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/nieuws" className="hover:text-secondary transition-colors">
            Nieuws
          </Link>{" "}
          &gt; {post.title}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <span
            className={`inline-block rounded-[0.25rem] px-3 py-1 text-xs font-medium font-label ${categoryColors[post.category] || "bg-surface-container text-muted"}`}
          >
            {post.category}
          </span>
          <span className="text-sm text-muted font-label">{post.date}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">{post.title}</h1>

        {blogImages[slug] && (
          <div className="relative w-full h-64 mt-6 rounded-lg overflow-hidden">
            <Image
              src={blogImages[slug]}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-8 text-muted leading-relaxed space-y-4">
          {post.content}
        </div>

        <div className="mt-10 pt-6">
          <Link
            href="/nieuws"
            className="text-sm text-secondary hover:text-secondary/80 font-medium"
          >
            &larr; Terug naar alle artikelen
          </Link>
        </div>
      </article>
    </section>
  );
}
