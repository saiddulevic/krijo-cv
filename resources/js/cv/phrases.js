import { PHRASES_DE_ES, VERBS_DE_ES } from './phrases-de-es.js';

/**
 * Writing help without AI: ready-made summaries, achievement bullets and
 * skills per profession, plus action verbs, in Albanian, English and Italian.
 * Text in [square brackets] is a placeholder the visitor replaces; the
 * quality check reports any placeholder left in the CV.
 *
 * Loaded on demand (dynamic import) so it does not weigh on the first page load.
 */

export const PROFESSIONS = [
    {
        id: 'it',
        label: { sq: 'IT dhe zhvillim softueri', en: 'IT and software development', it: 'IT e sviluppo software' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në zhvillimin e aplikacioneve web dhe mobile, punoj kryesisht me [teknologjitë] dhe shkruaj kod të pastër, të testuar dhe të lehtë për t’u mirëmbajtur.',
                'Kam përvojë në mirëmbajtjen e sistemeve, rrjeteve dhe në mbështetjen teknike të përdoruesve. Zgjidh problemet shpejt, dokumentoj çdo ndërhyrje dhe kujdesem që sistemet të jenë të sigurta dhe të disponueshme.',
            ],
            en: [
                'Software developer with [X] years of experience building web and mobile applications. I work mainly with [technologies] and write clean, tested and maintainable code.',
                'IT specialist experienced in maintaining systems and networks and supporting users. I solve problems quickly, document every intervention and keep systems secure and available.',
            ],
            it: [
                'Con [X] anni di esperienza nello sviluppo di applicazioni web e mobile, lavoro principalmente con [tecnologie] e scrivo codice pulito, testato e facile da mantenere.',
                'Ho esperienza nella gestione di sistemi e reti e nel supporto tecnico agli utenti. Risolvo i problemi rapidamente, documento ogni intervento e mantengo i sistemi sicuri e disponibili.',
            ],
        },
        bullets: {
            sq: [
                'Zhvillova [numër] funksionalitete të reja për [produktin], të përdorura nga mbi [X] përdorues.',
                'Ula kohën e ngarkimit të faqes me [X]% duke optimizuar pyetjet në bazën e të dhënave.',
                'Automatizova procese manuale dhe kursova rreth [X] orë pune në javë për ekipin.',
                'Shkrova teste automatike dhe rrita mbulimin e kodit nga [X]% në [Y]%.',
                'Bashkëpunova me dizajnerët dhe klientët për të përcaktuar kërkesat dhe prioritetet.',
                'Mbështeta [X] përdorues në ditë me probleme teknike, me kohë mesatare zgjidhjeje prej [X] orësh.',
            ],
            en: [
                'Developed [number] new features for [product], used by more than [X] users.',
                'Reduced page load time by [X]% by optimising database queries.',
                'Automated manual processes, saving the team around [X] hours of work per week.',
                'Wrote automated tests and increased code coverage from [X]% to [Y]%.',
                'Worked with designers and clients to define requirements and priorities.',
                'Supported [X] users a day with technical issues, with an average resolution time of [X] hours.',
            ],
            it: [
                'Ho sviluppato [numero] nuove funzionalità per [prodotto], utilizzate da oltre [X] utenti.',
                'Ho ridotto del [X]% il tempo di caricamento delle pagine ottimizzando le query al database.',
                'Ho automatizzato processi manuali, facendo risparmiare al team circa [X] ore di lavoro a settimana.',
                'Ho scritto test automatici e aumentato la copertura del codice dal [X]% al [Y]%.',
                'Ho collaborato con designer e clienti per definire requisiti e priorità.',
                'Ho supportato [X] utenti al giorno con problemi tecnici, con un tempo medio di risoluzione di [X] ore.',
            ],
        },
        skills: {
            sq: ['JavaScript', 'PHP', 'Python', 'SQL', 'Git', 'Docker', 'Zgjidhje problemesh', 'Punë në ekip'],
            en: ['JavaScript', 'PHP', 'Python', 'SQL', 'Git', 'Docker', 'Problem solving', 'Teamwork'],
            it: ['JavaScript', 'PHP', 'Python', 'SQL', 'Git', 'Docker', 'Problem solving', 'Lavoro di squadra'],
        },
    },
    {
        id: 'sales',
        label: { sq: 'Shitje dhe shërbim klienti', en: 'Sales and customer service', it: 'Vendite e servizio clienti' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në shitje dhe shërbim klienti, kam ndërtuar marrëdhënie afatgjata me klientët dhe kam tejkaluar rregullisht objektivat mujore të shitjeve.',
                'Komunikoj qartë dhe me mirësjellje, i dëgjoj klientët me vëmendje dhe gjej zgjidhjen e duhur për nevojat e tyre, edhe në situata me presion.',
            ],
            en: [
                'With [X] years of experience in sales and customer service, I have built long-term relationships with customers and regularly exceeded monthly sales targets.',
                'I communicate clearly and politely, listen carefully to customers and find the right solution for their needs, even under pressure.',
            ],
            it: [
                'Con [X] anni di esperienza nelle vendite e nel servizio clienti, ho costruito rapporti duraturi con la clientela e superato regolarmente gli obiettivi mensili di vendita.',
                'Comunico in modo chiaro e cortese, ascolto con attenzione i clienti e trovo la soluzione giusta per le loro esigenze, anche sotto pressione.',
            ],
        },
        bullets: {
            sq: [
                'Tejkalova objektivin mujor të shitjeve me [X]% për [X] muaj radhazi.',
                'Shërbeva mesatarisht [X] klientë në ditë, me vlerësim kënaqësie prej [X]/5.',
                'Rrita shitjet e produkteve plotësuese me [X]% përmes rekomandimeve të personalizuara.',
                'Menaxhova arkën, inventarin dhe porositë e furnitorëve pa mospërputhje.',
                'Zgjidha ankesat e klientëve dhe ula kthimet e produkteve me [X]%.',
                'Trajnova [X] punonjës të rinj mbi produktet dhe standardet e shërbimit.',
            ],
            en: [
                'Exceeded the monthly sales target by [X]% for [X] consecutive months.',
                'Served an average of [X] customers a day with a satisfaction score of [X]/5.',
                'Increased sales of add-on products by [X]% through personalised recommendations.',
                'Managed the till, stock and supplier orders without discrepancies.',
                'Resolved customer complaints and reduced product returns by [X]%.',
                'Trained [X] new staff members on products and service standards.',
            ],
            it: [
                'Ho superato l’obiettivo mensile di vendita del [X]% per [X] mesi consecutivi.',
                'Ho servito in media [X] clienti al giorno con una valutazione di soddisfazione di [X]/5.',
                'Ho aumentato del [X]% le vendite di prodotti complementari grazie a consigli personalizzati.',
                'Ho gestito cassa, magazzino e ordini ai fornitori senza discrepanze.',
                'Ho risolto i reclami dei clienti e ridotto i resi del [X]%.',
                'Ho formato [X] nuovi colleghi su prodotti e standard di servizio.',
            ],
        },
        skills: {
            sq: ['Negocim', 'Komunikim', 'Shërbim klienti', 'Menaxhim arke', 'CRM', 'Shitje aktive', 'Punë nën presion', 'Njohje e produkteve'],
            en: ['Negotiation', 'Communication', 'Customer service', 'Cash handling', 'CRM', 'Active selling', 'Working under pressure', 'Product knowledge'],
            it: ['Negoziazione', 'Comunicazione', 'Servizio clienti', 'Gestione cassa', 'CRM', 'Vendita attiva', 'Lavoro sotto pressione', 'Conoscenza dei prodotti'],
        },
    },
    {
        id: 'callcenter',
        label: { sq: 'Qendër thirrjesh', en: 'Call centre', it: 'Call center' },
        summaries: {
            sq: [
                'Kam [X] vjet përvojë në qendër thirrjesh, në shërbim klienti dhe mbështetje teknike në [gjuhët]. Trajtoj thirrjet me qetësi dhe profesionalizëm dhe arrij rregullisht objektivat e cilësisë.',
                'Flas rrjedhshëm [gjuhët], shkruaj shpejt dhe saktë dhe punoj me sisteme CRM dhe bileta. Përshtatem lehtë me oraret me turne dhe me fushata të reja.',
            ],
            en: [
                'I have [X] years of experience in call centres, customer service and technical support in [languages]. I handle calls calmly and professionally and regularly meet quality targets.',
                'I speak [languages] fluently, type quickly and accurately and work with CRM and ticketing systems. I adapt easily to shift work and new campaigns.',
            ],
            it: [
                'Ho [X] anni di esperienza in call center, servizio clienti e supporto tecnico in [lingue]. Gestisco le chiamate con calma e professionalità e raggiungo regolarmente gli obiettivi di qualità.',
                'Parlo fluentemente [lingue], scrivo in modo rapido e preciso e lavoro con sistemi CRM e di ticketing. Mi adatto facilmente ai turni e alle nuove campagne.',
            ],
        },
        bullets: {
            sq: [
                'Trajtova mesatarisht [X] thirrje në ditë në [gjuhën], me zgjidhje në thirrjen e parë prej [X]%.',
                'Arrita vlerësim cilësie prej [X]% në kontrollet mujore të thirrjeve.',
                'Regjistrova çdo kërkesë në sistemin CRM dhe ndoqa rastet deri në zgjidhje.',
                'Shita shërbime shtesë dhe tejkalova objektivin e konvertimit me [X]%.',
                'Mbështeta [X] kolegë të rinj si mentor gjatë javëve të para.',
                'Trajtova klientë të pakënaqur dhe ula përshkallëzimet te mbikëqyrësi me [X]%.',
            ],
            en: [
                'Handled an average of [X] calls a day in [language], with a first-call resolution rate of [X]%.',
                'Achieved a quality score of [X]% in monthly call reviews.',
                'Logged every request in the CRM system and followed cases through to resolution.',
                'Sold additional services and exceeded the conversion target by [X]%.',
                'Mentored [X] new colleagues during their first weeks.',
                'Handled dissatisfied customers and reduced escalations to supervisors by [X]%.',
            ],
            it: [
                'Ho gestito in media [X] chiamate al giorno in [lingua], con una risoluzione al primo contatto del [X]%.',
                'Ho ottenuto un punteggio di qualità del [X]% nelle verifiche mensili delle chiamate.',
                'Ho registrato ogni richiesta nel CRM e seguito i casi fino alla risoluzione.',
                'Ho venduto servizi aggiuntivi superando l’obiettivo di conversione del [X]%.',
                'Ho fatto da mentore a [X] nuovi colleghi nelle prime settimane.',
                'Ho gestito clienti insoddisfatti riducendo del [X]% le escalation ai supervisori.',
            ],
        },
        skills: {
            sq: ['Komunikim në telefon', 'CRM', 'Shkrim i shpejtë', 'Zgjidhje problemesh', 'Shitje me telefon', 'Menaxhim kohe', 'Durim', 'Punë me turne'],
            en: ['Telephone communication', 'CRM', 'Fast typing', 'Problem solving', 'Telesales', 'Time management', 'Patience', 'Shift work'],
            it: ['Comunicazione telefonica', 'CRM', 'Digitazione veloce', 'Problem solving', 'Vendita telefonica', 'Gestione del tempo', 'Pazienza', 'Lavoro su turni'],
        },
    },
    {
        id: 'office',
        label: { sq: 'Administratë dhe zyrë', en: 'Administration and office', it: 'Amministrazione e ufficio' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në administratë dhe punë zyre, organizoj dokumentet, kalendarët dhe komunikimin e brendshëm në mënyrë të saktë dhe të strukturuar.',
                'Punoj me Microsoft Office dhe Google Workspace, menaxhoj korrespondencën me klientë dhe institucione dhe kujdesem që afatet të respektohen.',
            ],
            en: [
                'With [X] years of experience in administration and office work, I organise documents, calendars and internal communication accurately and in a structured way.',
                'I work with Microsoft Office and Google Workspace, handle correspondence with clients and institutions and make sure deadlines are met.',
            ],
            it: [
                'Con [X] anni di esperienza in amministrazione e lavoro d’ufficio, organizzo documenti, agende e comunicazione interna in modo preciso e strutturato.',
                'Lavoro con Microsoft Office e Google Workspace, gestisco la corrispondenza con clienti ed enti e mi assicuro che le scadenze vengano rispettate.',
            ],
        },
        bullets: {
            sq: [
                'Organizova kalendarin dhe takimet e [X] drejtuesve, pa përplasje orari.',
                'Arkivova dhe digjitalizova mbi [X] dokumente, duke ulur kohën e kërkimit me [X]%.',
                'Përgatita raporte mujore në Excel për drejtuesit e departamentit.',
                'Menaxhova furnizimet e zyrës dhe ula shpenzimet me [X]% përmes ofertave të reja.',
                'Koordinova udhëtimet e punës dhe logjistikën e [X] eventeve.',
                'U përgjigja telefonatave dhe email-eve dhe i drejtova kërkesat te personat përgjegjës.',
            ],
            en: [
                'Managed the calendars and meetings of [X] executives without scheduling conflicts.',
                'Archived and digitised more than [X] documents, cutting search time by [X]%.',
                'Prepared monthly Excel reports for department heads.',
                'Managed office supplies and reduced costs by [X]% through new offers.',
                'Coordinated business travel and the logistics of [X] events.',
                'Answered phone calls and emails and routed requests to the right people.',
            ],
            it: [
                'Ho gestito l’agenda e gli appuntamenti di [X] dirigenti senza sovrapposizioni.',
                'Ho archiviato e digitalizzato oltre [X] documenti, riducendo del [X]% i tempi di ricerca.',
                'Ho preparato report mensili in Excel per i responsabili di reparto.',
                'Ho gestito le forniture d’ufficio riducendo i costi del [X]% grazie a nuove offerte.',
                'Ho coordinato trasferte e logistica di [X] eventi.',
                'Ho risposto a telefonate ed email smistando le richieste alle persone competenti.',
            ],
        },
        skills: {
            sq: ['Microsoft Office', 'Excel', 'Google Workspace', 'Arkivim', 'Korrespondencë', 'Organizim', 'Saktësi', 'Menaxhim kalendari'],
            en: ['Microsoft Office', 'Excel', 'Google Workspace', 'Filing', 'Correspondence', 'Organisation', 'Accuracy', 'Calendar management'],
            it: ['Microsoft Office', 'Excel', 'Google Workspace', 'Archiviazione', 'Corrispondenza', 'Organizzazione', 'Precisione', 'Gestione agenda'],
        },
    },
    {
        id: 'finance',
        label: { sq: 'Financë dhe kontabilitet', en: 'Finance and accounting', it: 'Finanza e contabilità' },
        summaries: {
            sq: [
                'Kam [X] vjet përvojë në kontabilitet dhe financë, me njohuri të mira të standardeve të raportimit dhe të legjislacionit tatimor. Punoj me saktësi dhe respektoj afatet e mbylljeve mujore dhe vjetore.',
                'Përgatis pasqyra financiare, analizoj shpenzimet dhe jap rekomandime të qarta që i ndihmojnë drejtuesit të marrin vendime të mira.',
            ],
            en: [
                'I have [X] years of experience in accounting and finance, with good knowledge of reporting standards and tax legislation. I work accurately and meet monthly and year-end closing deadlines.',
                'I prepare financial statements, analyse costs and give clear recommendations that help managers make good decisions.',
            ],
            it: [
                'Ho [X] anni di esperienza in contabilità e finanza, con una buona conoscenza dei principi contabili e della normativa fiscale. Lavoro con precisione e rispetto le scadenze delle chiusure mensili e annuali.',
                'Preparo bilanci, analizzo i costi e fornisco raccomandazioni chiare che aiutano la direzione a prendere buone decisioni.',
            ],
        },
        bullets: {
            sq: [
                'Përgatita pasqyrat financiare mujore dhe vjetore për [X] kompani klientë.',
                'Ula kohën e mbylljes mujore nga [X] në [Y] ditë duke automatizuar rakordimet.',
                'Menaxhova pagesat dhe arkëtimet me vlerë mbi [X] € në muaj.',
                'Përgatita deklaratat tatimore dhe të TVSH-së pa gjoba apo vonesa.',
                'Identifikova kursime prej [X] € në vit përmes analizës së shpenzimeve.',
                'Bashkëpunova me auditorët e jashtëm gjatë auditimit vjetor.',
            ],
            en: [
                'Prepared monthly and annual financial statements for [X] client companies.',
                'Shortened the monthly close from [X] to [Y] days by automating reconciliations.',
                'Managed payments and collections worth more than €[X] a month.',
                'Prepared tax and VAT returns with no penalties or delays.',
                'Identified savings of €[X] a year through cost analysis.',
                'Worked with external auditors during the annual audit.',
            ],
            it: [
                'Ho preparato i bilanci mensili e annuali per [X] aziende clienti.',
                'Ho ridotto la chiusura mensile da [X] a [Y] giorni automatizzando le riconciliazioni.',
                'Ho gestito pagamenti e incassi per oltre [X] € al mese.',
                'Ho preparato dichiarazioni fiscali e IVA senza sanzioni né ritardi.',
                'Ho individuato risparmi di [X] € all’anno grazie all’analisi dei costi.',
                'Ho collaborato con i revisori esterni durante la revisione annuale.',
            ],
        },
        skills: {
            sq: ['Kontabilitet', 'Excel i avancuar', 'Pasqyra financiare', 'Legjislacion tatimor', 'Analizë financiare', 'Programe kontabiliteti', 'Buxhetim', 'Saktësi'],
            en: ['Accounting', 'Advanced Excel', 'Financial statements', 'Tax legislation', 'Financial analysis', 'Accounting software', 'Budgeting', 'Accuracy'],
            it: ['Contabilità', 'Excel avanzato', 'Bilanci', 'Normativa fiscale', 'Analisi finanziaria', 'Software gestionali', 'Budgeting', 'Precisione'],
        },
    },
    {
        id: 'education',
        label: { sq: 'Arsim', en: 'Education', it: 'Istruzione' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në mësimdhënien e lëndës [lënda], krijoj orë mësimi interaktive që i motivojnë nxënësit dhe i përshtas sipas nevojave të secilit.',
                'Komunikoj rregullisht me prindërit dhe kolegët, përdor teknologjinë në klasë dhe ndjek me përkushtim zhvillimin profesional.',
            ],
            en: [
                'With [X] years of experience teaching [subject], I create interactive lessons that motivate students and adapt them to each student’s needs.',
                'I communicate regularly with parents and colleagues, use technology in the classroom and am committed to professional development.',
            ],
            it: [
                'Con [X] anni di esperienza nell’insegnamento di [materia], creo lezioni interattive che motivano gli studenti e le adatto alle esigenze di ciascuno.',
                'Comunico regolarmente con genitori e colleghi, uso la tecnologia in classe e curo con impegno la mia formazione professionale.',
            ],
        },
        bullets: {
            sq: [
                'Dhashë mësim [lënda] në [X] klasa me gjithsej rreth [X] nxënës.',
                'Rrita rezultatet mesatare të nxënësve në provime me [X]%.',
                'Përgatita nxënës për gara dhe olimpiada, ku [X] prej tyre fituan çmime.',
                'Përdora platforma digjitale si [platforma] për detyra dhe vlerësim.',
                'Organizova [X] aktivitete jashtëkurrikulare dhe ekskursione mësimore.',
                'Bashkëpunova me prindërit dhe psikologun e shkollës për nxënës me nevoja të veçanta.',
            ],
            en: [
                'Taught [subject] to [X] classes with about [X] students in total.',
                'Raised students’ average exam results by [X]%.',
                'Prepared students for competitions and olympiads, where [X] of them won prizes.',
                'Used digital platforms such as [platform] for homework and assessment.',
                'Organised [X] extracurricular activities and educational trips.',
                'Worked with parents and the school psychologist to support students with special needs.',
            ],
            it: [
                'Ho insegnato [materia] in [X] classi con circa [X] studenti in totale.',
                'Ho migliorato del [X]% i risultati medi degli studenti agli esami.',
                'Ho preparato studenti a gare e olimpiadi, dove [X] di loro hanno vinto premi.',
                'Ho usato piattaforme digitali come [piattaforma] per compiti e valutazioni.',
                'Ho organizzato [X] attività extracurricolari e uscite didattiche.',
                'Ho collaborato con genitori e psicologo scolastico per studenti con bisogni speciali.',
            ],
        },
        skills: {
            sq: ['Planifikim mësimi', 'Menaxhim klase', 'Vlerësim i nxënësve', 'Mësimdhënie digjitale', 'Komunikim me prindërit', 'Durim', 'Kreativitet', 'Punë në ekip'],
            en: ['Lesson planning', 'Classroom management', 'Student assessment', 'Digital teaching', 'Communication with parents', 'Patience', 'Creativity', 'Teamwork'],
            it: ['Progettazione didattica', 'Gestione della classe', 'Valutazione degli studenti', 'Didattica digitale', 'Comunicazione con le famiglie', 'Pazienza', 'Creatività', 'Lavoro di squadra'],
        },
    },
    {
        id: 'health',
        label: { sq: 'Shëndetësi dhe kujdes', en: 'Healthcare', it: 'Sanità e assistenza' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në kujdesin shëndetësor në [repartin/institucionin], ofroj kujdes të sigurt dhe njerëzor për pacientët dhe bashkëpunoj ngushtë me ekipin mjekësor.',
                'Ndjek me përpikëri protokollet klinike dhe të higjienës, dokumentoj saktë çdo ndërhyrje dhe ruaj qetësinë në situata urgjente.',
            ],
            en: [
                'With [X] years of experience in healthcare at [ward/institution], I provide safe and compassionate patient care and work closely with the medical team.',
                'I strictly follow clinical and hygiene protocols, document every intervention accurately and stay calm in emergencies.',
            ],
            it: [
                'Con [X] anni di esperienza in ambito sanitario presso [reparto/struttura], offro un’assistenza sicura e umana ai pazienti e collaboro strettamente con l’équipe medica.',
                'Seguo con rigore i protocolli clinici e igienici, documento con precisione ogni intervento e mantengo la calma nelle emergenze.',
            ],
        },
        bullets: {
            sq: [
                'U kujdesa çdo turn për rreth [X] pacientë në repartin e [repartit].',
                'Administrova terapinë dhe monitorova shenjat vitale sipas protokolleve.',
                'Dokumentova saktë kujdesin në sistemin elektronik të pacientëve.',
                'Informova pacientët dhe familjarët për trajtimin dhe kujdesin në shtëpi.',
                'Mbështeta ekipin gjatë rasteve urgjente dhe ndërhyrjeve të vogla.',
                'Mora pjesë në trajnime për kontrollin e infeksioneve dhe ndihmën e parë.',
            ],
            en: [
                'Cared for about [X] patients per shift on the [ward] ward.',
                'Administered medication and monitored vital signs according to protocols.',
                'Documented care accurately in the electronic patient record system.',
                'Informed patients and families about treatment and home care.',
                'Supported the team during emergencies and minor procedures.',
                'Completed training in infection control and first aid.',
            ],
            it: [
                'Ho assistito circa [X] pazienti per turno nel reparto di [reparto].',
                'Ho somministrato terapie e monitorato i parametri vitali secondo i protocolli.',
                'Ho documentato con precisione l’assistenza nella cartella clinica elettronica.',
                'Ho informato pazienti e familiari su terapie e assistenza a domicilio.',
                'Ho supportato l’équipe durante emergenze e piccoli interventi.',
                'Ho completato corsi su controllo delle infezioni e primo soccorso.',
            ],
        },
        skills: {
            sq: ['Kujdes ndaj pacientit', 'Monitorim i shenjave vitale', 'Administrim terapie', 'Higjienë dhe sterilizim', 'Ndihmë e parë', 'Dokumentim klinik', 'Empati', 'Punë me turne'],
            en: ['Patient care', 'Vital signs monitoring', 'Medication administration', 'Hygiene and sterilisation', 'First aid', 'Clinical documentation', 'Empathy', 'Shift work'],
            it: ['Assistenza al paziente', 'Monitoraggio dei parametri vitali', 'Somministrazione di terapie', 'Igiene e sterilizzazione', 'Primo soccorso', 'Documentazione clinica', 'Empatia', 'Lavoro su turni'],
        },
    },
    {
        id: 'hospitality',
        label: { sq: 'Turizëm, hoteleri dhe gastronomi', en: 'Hospitality and tourism', it: 'Turismo e ristorazione' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në hoteleri dhe gastronomi, krijoj një atmosferë mikpritëse për mysafirët dhe punoj shpejt edhe në sezonin e lartë.',
                'Flas [gjuhët] me mysafirë ndërkombëtarë, njoh standardet e higjienës dhe të shërbimit dhe punoj mirë në ekip nën presion.',
            ],
            en: [
                'With [X] years of experience in hospitality and food service, I create a welcoming atmosphere for guests and work quickly even in peak season.',
                'I speak [languages] with international guests, know hygiene and service standards and work well in a team under pressure.',
            ],
            it: [
                'Con [X] anni di esperienza nel turismo e nella ristorazione, creo un’atmosfera accogliente per gli ospiti e lavoro con rapidità anche in alta stagione.',
                'Parlo [lingue] con ospiti internazionali, conosco gli standard di igiene e di servizio e lavoro bene in squadra sotto pressione.',
            ],
        },
        bullets: {
            sq: [
                'Shërbeva deri në [X] mysafirë në turn në një restorant me [X] vende.',
                'Menaxhova check-in dhe check-out për [X] dhoma në ditë në recepsion.',
                'Rrita vlerësimet e mysafirëve në [platforma] nga [X] në [Y].',
                'Përgatita gatime sipas recetave dhe standardeve HACCP.',
                'Trajnova stafin sezonal mbi menunë dhe standardet e shërbimit.',
                'Trajtova rezervimet dhe kërkesat e veçanta të mysafirëve me email dhe telefon.',
            ],
            en: [
                'Served up to [X] guests per shift in a [X]-seat restaurant.',
                'Handled check-in and check-out for [X] rooms a day at reception.',
                'Raised guest ratings on [platform] from [X] to [Y].',
                'Prepared dishes according to recipes and HACCP standards.',
                'Trained seasonal staff on the menu and service standards.',
                'Managed bookings and special guest requests by email and phone.',
            ],
            it: [
                'Ho servito fino a [X] ospiti per turno in un ristorante da [X] coperti.',
                'Ho gestito check-in e check-out per [X] camere al giorno alla reception.',
                'Ho portato le valutazioni degli ospiti su [piattaforma] da [X] a [Y].',
                'Ho preparato piatti secondo ricette e standard HACCP.',
                'Ho formato il personale stagionale su menu e standard di servizio.',
                'Ho gestito prenotazioni e richieste speciali degli ospiti via email e telefono.',
            ],
        },
        skills: {
            sq: ['Shërbim ndaj mysafirëve', 'Recepsion', 'Shërbim në sallë', 'HACCP', 'Sisteme rezervimi', 'Gjuhë të huaja', 'Punë në ekip', 'Punë nën presion'],
            en: ['Guest service', 'Reception', 'Table service', 'HACCP', 'Booking systems', 'Foreign languages', 'Teamwork', 'Working under pressure'],
            it: ['Accoglienza degli ospiti', 'Reception', 'Servizio in sala', 'HACCP', 'Sistemi di prenotazione', 'Lingue straniere', 'Lavoro di squadra', 'Lavoro sotto pressione'],
        },
    },
    {
        id: 'trades',
        label: { sq: 'Ndërtim dhe zanate teknike', en: 'Construction and skilled trades', it: 'Edilizia e mestieri tecnici' },
        summaries: {
            sq: [
                'Kam [X] vjet përvojë si [profesioni] në projekte ndërtimi banesash dhe objektesh tregtare. Punoj me përpikëri, lexoj vizatime teknike dhe respektoj rregullat e sigurisë në punë.',
                'Njoh mirë materialet, mjetet dhe makineritë e punës dhe e përfundoj punën në kohë dhe me cilësi, në ekip ose në mënyrë të pavarur.',
            ],
            en: [
                'I have [X] years of experience as a [trade] on residential and commercial construction projects. I work carefully, read technical drawings and follow health and safety rules.',
                'I know materials, tools and machinery well and finish work on time and to a high standard, in a team or independently.',
            ],
            it: [
                'Ho [X] anni di esperienza come [mestiere] in cantieri residenziali e commerciali. Lavoro con precisione, leggo disegni tecnici e rispetto le norme di sicurezza sul lavoro.',
                'Conosco bene materiali, attrezzi e macchinari e porto a termine il lavoro nei tempi e con qualità, in squadra o in autonomia.',
            ],
        },
        bullets: {
            sq: [
                'Punova në [X] projekte banimi dhe tregtare me sipërfaqe deri në [X] m².',
                'Instalova dhe mirëmbajta sisteme [elektrike/hidraulike] sipas standardeve.',
                'Lexova vizatime teknike dhe llogarita sasitë e materialeve për çdo fazë.',
                'Përfundova punimet [X] ditë para afatit pa kosto shtesë.',
                'Drejtova një grup prej [X] punëtorësh dhe organizova punën ditore.',
                'Respektova rregullat e sigurisë, pa asnjë aksident në punë gjatë [X] viteve.',
            ],
            en: [
                'Worked on [X] residential and commercial projects of up to [X] m².',
                'Installed and maintained [electrical/plumbing] systems to standard.',
                'Read technical drawings and calculated material quantities for each phase.',
                'Completed work [X] days ahead of schedule with no extra cost.',
                'Led a team of [X] workers and organised the daily work.',
                'Followed safety rules with no workplace accidents over [X] years.',
            ],
            it: [
                'Ho lavorato a [X] progetti residenziali e commerciali fino a [X] m².',
                'Ho installato e mantenuto impianti [elettrici/idraulici] a norma.',
                'Ho letto disegni tecnici e calcolato le quantità di materiale per ogni fase.',
                'Ho completato i lavori [X] giorni prima della scadenza senza costi aggiuntivi.',
                'Ho guidato una squadra di [X] operai organizzando il lavoro quotidiano.',
                'Ho rispettato le norme di sicurezza, senza alcun infortunio in [X] anni.',
            ],
        },
        skills: {
            sq: ['Lexim i vizatimeve teknike', 'Siguri në punë', 'Instalime elektrike', 'Hidraulikë', 'Përdorim makinerish', 'Matje dhe llogaritje', 'Saktësi', 'Punë në ekip'],
            en: ['Reading technical drawings', 'Health and safety', 'Electrical installation', 'Plumbing', 'Operating machinery', 'Measuring and estimating', 'Accuracy', 'Teamwork'],
            it: ['Lettura di disegni tecnici', 'Sicurezza sul lavoro', 'Impianti elettrici', 'Idraulica', 'Uso di macchinari', 'Misure e computi', 'Precisione', 'Lavoro di squadra'],
        },
    },
    {
        id: 'marketing',
        label: { sq: 'Marketing dhe media sociale', en: 'Marketing and social media', it: 'Marketing e social media' },
        summaries: {
            sq: [
                'Me [X] vjet përvojë në marketing digjital, planifikoj dhe drejtoj fushata në rrjetet sociale që rrisin ndjekësit, angazhimin dhe shitjet.',
                'Krijoj përmbajtje të qartë dhe tërheqëse, analizoj rezultatet me të dhëna dhe i përshtas strategjitë sipas objektivave të biznesit.',
            ],
            en: [
                'With [X] years of experience in digital marketing, I plan and run social media campaigns that grow followers, engagement and sales.',
                'I create clear, engaging content, analyse results with data and adapt strategies to business goals.',
            ],
            it: [
                'Con [X] anni di esperienza nel marketing digitale, pianifico e gestisco campagne sui social media che aumentano follower, coinvolgimento e vendite.',
                'Creo contenuti chiari e coinvolgenti, analizzo i risultati con i dati e adatto le strategie agli obiettivi aziendali.',
            ],
        },
        bullets: {
            sq: [
                'Rrita ndjekësit në Instagram nga [X] në [Y] brenda [X] muajve.',
                'Drejtova fushata me pagesë me buxhet [X] € në muaj dhe kthim [X] herë më të madh.',
                'Krijova [X] postime, video dhe materiale grafike në muaj.',
                'Rrita normën e hapjes së email-eve me [X]% përmes segmentimit.',
                'Analizova rezultatet në Google Analytics dhe Meta Business Suite dhe raportova çdo muaj.',
                'Bashkëpunova me [X] influencues për lansimin e produkteve të reja.',
            ],
            en: [
                'Grew Instagram followers from [X] to [Y] within [X] months.',
                'Ran paid campaigns with a budget of €[X] a month and a [X]x return.',
                'Created [X] posts, videos and graphics a month.',
                'Increased email open rates by [X]% through segmentation.',
                'Analysed results in Google Analytics and Meta Business Suite and reported monthly.',
                'Worked with [X] influencers on new product launches.',
            ],
            it: [
                'Ho aumentato i follower su Instagram da [X] a [Y] in [X] mesi.',
                'Ho gestito campagne a pagamento con un budget di [X] € al mese e un ritorno di [X] volte.',
                'Ho creato [X] post, video e grafiche al mese.',
                'Ho aumentato del [X]% il tasso di apertura delle email grazie alla segmentazione.',
                'Ho analizzato i risultati in Google Analytics e Meta Business Suite con report mensili.',
                'Ho collaborato con [X] influencer per il lancio di nuovi prodotti.',
            ],
        },
        skills: {
            sq: ['Meta Ads', 'Google Ads', 'Krijim përmbajtjeje', 'Canva', 'Google Analytics', 'SEO', 'Copywriting', 'Planifikim fushatash'],
            en: ['Meta Ads', 'Google Ads', 'Content creation', 'Canva', 'Google Analytics', 'SEO', 'Copywriting', 'Campaign planning'],
            it: ['Meta Ads', 'Google Ads', 'Creazione di contenuti', 'Canva', 'Google Analytics', 'SEO', 'Copywriting', 'Pianificazione di campagne'],
        },
    },
    {
        id: 'logistics',
        label: { sq: 'Transport dhe logjistikë', en: 'Transport and logistics', it: 'Trasporti e logistica' },
        summaries: {
            sq: [
                'Kam [X] vjet përvojë në transport dhe logjistikë, me patentë të kategorisë [kategoria] dhe njohje të mirë të rrugëve në [rajoni]. Dorëzoj mallrat në kohë dhe në gjendje të mirë.',
                'Organizoj ngarkimin, magazinimin dhe dokumentacionin e mallrave me saktësi dhe respektoj rregullat e qarkullimit dhe të sigurisë.',
            ],
            en: [
                'I have [X] years of experience in transport and logistics, a category [X] driving licence and good knowledge of the roads in [region]. I deliver goods on time and in good condition.',
                'I organise loading, warehousing and shipping documents accurately and follow traffic and safety rules.',
            ],
            it: [
                'Ho [X] anni di esperienza nel trasporto e nella logistica, patente [categoria] e una buona conoscenza delle strade in [zona]. Consegno le merci in tempo e in buono stato.',
                'Organizzo carico, magazzino e documenti di spedizione con precisione e rispetto le norme di circolazione e sicurezza.',
            ],
        },
        bullets: {
            sq: [
                'Kreva mesatarisht [X] dorëzime në ditë me saktësi [X]%.',
                'Planifikova itineraret dhe ula konsumin e karburantit me [X]%.',
                'Menaxhova inventarin e magazinës me mbi [X] artikuj në sistemin [sistemi].',
                'Ngarkova dhe shkarkova mallra me pirun ngritës sipas rregullave të sigurisë.',
                'Përgatita dokumentet e transportit dhe të doganës pa gabime.',
                'Përshkova mbi [X] km pa asnjë aksident.',
            ],
            en: [
                'Made an average of [X] deliveries a day with [X]% accuracy.',
                'Planned routes and reduced fuel consumption by [X]%.',
                'Managed a warehouse stock of more than [X] items in [system].',
                'Loaded and unloaded goods with a forklift following safety rules.',
                'Prepared transport and customs documents without errors.',
                'Drove more than [X] km without accidents.',
            ],
            it: [
                'Ho effettuato in media [X] consegne al giorno con un’accuratezza del [X]%.',
                'Ho pianificato i percorsi riducendo il consumo di carburante del [X]%.',
                'Ho gestito un magazzino con oltre [X] articoli nel sistema [sistema].',
                'Ho caricato e scaricato merci con il carrello elevatore nel rispetto delle norme di sicurezza.',
                'Ho preparato documenti di trasporto e doganali senza errori.',
                'Ho guidato per oltre [X] km senza incidenti.',
            ],
        },
        skills: {
            sq: ['Patentë e kategorisë [X]', 'Pirun ngritës', 'Menaxhim magazine', 'Planifikim itinerari', 'Dokumente transporti', 'Përpikëri', 'Siguri rrugore', 'Punë e pavarur'],
            en: ['Category [X] driving licence', 'Forklift', 'Warehouse management', 'Route planning', 'Transport documents', 'Punctuality', 'Road safety', 'Working independently'],
            it: ['Patente [categoria]', 'Carrello elevatore', 'Gestione del magazzino', 'Pianificazione dei percorsi', 'Documenti di trasporto', 'Puntualità', 'Sicurezza stradale', 'Lavoro in autonomia'],
        },
    },
    {
        id: 'student',
        label: { sq: 'Student ose puna e parë', en: 'Student or first job', it: 'Studente o primo impiego' },
        summaries: {
            sq: [
                'Në vitin e [X] të studimeve për [fusha] në [universiteti], kërkoj një praktikë ose punën e parë ku të zbatoj njohuritë dhe të mësoj nga profesionistë me përvojë.',
                'Kam përvojë nga projektet universitare, vullnetarizmi dhe punët sezonale. Mësoj shpejt, punoj mirë në ekip dhe i marr seriozisht detyrat dhe afatet.',
            ],
            en: [
                'In my [X] year of studying [field] at [university], I am looking for an internship or first job where I can apply my knowledge and learn from experienced professionals.',
                'I have experience from university projects, volunteering and seasonal jobs. I learn quickly, work well in a team and take tasks and deadlines seriously.',
            ],
            it: [
                'Al [X] anno di studi in [ambito] presso [università], cerco un tirocinio o un primo impiego in cui applicare le mie conoscenze e imparare da professionisti esperti.',
                'Ho esperienza grazie a progetti universitari, volontariato e lavori stagionali. Imparo in fretta, lavoro bene in squadra e prendo sul serio compiti e scadenze.',
            ],
        },
        bullets: {
            sq: [
                'Realizova projektin [emri] në kuadër të lëndës [lënda], me notë [X].',
                'Punova si [roli] gjatë verës dhe shërbeva mesatarisht [X] klientë në ditë.',
                'Mora pjesë në organizimin e [eventi] me mbi [X] pjesëmarrës.',
                'Përfundova kursin [kursi] dhe mora certifikatën [certifikata].',
                'Prezantova punimin për [tema] para [X] studentëve dhe profesorëve.',
                'Bashkëpunova në një ekip prej [X] studentësh për ta përfunduar projektin në afat.',
            ],
            en: [
                'Completed the [name] project as part of the [course] course, graded [X].',
                'Worked as a [role] over the summer, serving an average of [X] customers a day.',
                'Helped organise [event] with more than [X] participants.',
                'Completed the [course] course and earned the [certificate] certificate.',
                'Presented my paper on [topic] to [X] students and professors.',
                'Worked in a team of [X] students to finish the project on time.',
            ],
            it: [
                'Ho realizzato il progetto [nome] per il corso di [materia], con voto [X].',
                'Ho lavorato come [ruolo] durante l’estate, servendo in media [X] clienti al giorno.',
                'Ho partecipato all’organizzazione di [evento] con oltre [X] partecipanti.',
                'Ho completato il corso [corso] ottenendo la certificazione [certificazione].',
                'Ho presentato la mia tesina su [tema] davanti a [X] studenti e docenti.',
                'Ho collaborato in un gruppo di [X] studenti per completare il progetto nei tempi.',
            ],
        },
        skills: {
            sq: ['Microsoft Office', 'Komunikim', 'Punë në ekip', 'Mësim i shpejtë', 'Menaxhim kohe', 'Anglisht', 'Prezantim', 'Kërkim dhe analizë'],
            en: ['Microsoft Office', 'Communication', 'Teamwork', 'Fast learning', 'Time management', 'English', 'Presentation', 'Research and analysis'],
            it: ['Microsoft Office', 'Comunicazione', 'Lavoro di squadra', 'Apprendimento rapido', 'Gestione del tempo', 'Inglese', 'Presentazione', 'Ricerca e analisi'],
        },
    },
];

/** Verbs that open strong achievement lines. */
export const ACTION_VERBS = {
    sq: ['Drejtova', 'Zhvillova', 'Organizova', 'Rrita', 'Ula', 'Përmirësova', 'Krijova', 'Menaxhova', 'Koordinova', 'Trajnova', 'Analizova', 'Lansova', 'Negociova', 'Zgjidha', 'Automatizova', 'Prezantova', 'Ndërtova', 'Optimizova', 'Mbështeta', 'Arrita'],
    en: ['Led', 'Developed', 'Organised', 'Increased', 'Reduced', 'Improved', 'Created', 'Managed', 'Coordinated', 'Trained', 'Analysed', 'Launched', 'Negotiated', 'Resolved', 'Automated', 'Presented', 'Built', 'Optimised', 'Supported', 'Achieved'],
    it: ['Ho guidato', 'Ho sviluppato', 'Ho organizzato', 'Ho aumentato', 'Ho ridotto', 'Ho migliorato', 'Ho creato', 'Ho gestito', 'Ho coordinato', 'Ho formato', 'Ho analizzato', 'Ho lanciato', 'Ho negoziato', 'Ho risolto', 'Ho automatizzato', 'Ho presentato', 'Ho realizzato', 'Ho ottimizzato', 'Ho supportato', 'Ho raggiunto'],
};

// German and Spanish are kept in their own module and merged here.
for (const profession of PROFESSIONS) {
    const extra = PHRASES_DE_ES[profession.id];
    if (!extra) continue;
    Object.assign(profession.label, extra.label);
    for (const key of ['summaries', 'bullets', 'skills']) {
        Object.assign(profession[key], extra[key]);
    }
}
Object.assign(ACTION_VERBS, VERBS_DE_ES);

export function findProfession(id) {
    return PROFESSIONS.find((p) => p.id === id) ?? PROFESSIONS[0];
}

/** Adds a line to a description as a "- " bullet, keeping existing text. */
export function appendBullet(description, line) {
    const text = (description ?? '').replace(/\s+$/, '');
    const bullet = `- ${line.trim()}`;
    return text ? `${text}\n${bullet}` : bullet;
}

/** Adds a summary sentence, separated from existing text by a space. */
export function appendSentence(text, sentence) {
    const current = (text ?? '').trim();
    return current ? `${current} ${sentence.trim()}` : sentence.trim();
}
