/**
 * Starter texts for the cover letter, per application type and language.
 * {company} and {title} are filled from the project when known; everything in
 * [square brackets] is for the visitor to replace (the quality check flags
 * any bracket left over).
 */
import { normalizeLanguage } from './schema.js';

export const LETTER_TYPES = [
    { id: 'general', label: { sq: 'Aplikim për një pozitë të shpallur', en: 'Application for an advertised job', it: 'Candidatura a un annuncio', de: 'Bewerbung auf eine Stellenanzeige', es: 'Candidatura a una oferta' } },
    { id: 'internship', label: { sq: 'Praktikë ose puna e parë', en: 'Internship or first job', it: 'Tirocinio o primo impiego', de: 'Praktikum oder erster Job', es: 'Prácticas o primer empleo' } },
    { id: 'career-change', label: { sq: 'Ndryshim karriere', en: 'Career change', it: 'Cambio di carriera', de: 'Berufswechsel', es: 'Cambio de carrera' } },
    { id: 'spontaneous', label: { sq: 'Aplikim spontan', en: 'Speculative application', it: 'Candidatura spontanea', de: 'Initiativbewerbung', es: 'Candidatura espontánea' } },
];

const FALLBACK = {
    sq: { company: '[Kompania]', title: '[titulli yt profesional]' },
    en: { company: '[Company]', title: '[your job title]' },
    it: { company: '[Azienda]', title: '[il tuo ruolo]' },
    de: { company: '[Unternehmen]', title: '[deine Berufsbezeichnung]' },
    es: { company: '[Empresa]', title: '[tu puesto]' },
};

const DEFAULTS = {
    sq: { salutation: 'Të nderuar,', closing: 'Me respekt,' },
    en: { salutation: 'Dear Hiring Manager,', closing: 'Yours sincerely,' },
    it: { salutation: 'Spettabile Ufficio Risorse Umane,', closing: 'Cordiali saluti,' },
    de: { salutation: 'Sehr geehrte Damen und Herren,', closing: 'Mit freundlichen Grüßen' },
    es: { salutation: 'Estimados señores:', closing: 'Atentamente,' },
};

const TEXTS = {
    general: {
        sq: {
            subject: 'Aplikim për pozitën [Pozita]',
            body: [
                'Me interes të madh ju shkruaj për pozitën [Pozita] në {company}. Si {title} me përvojë në [fusha], besoj se mund të kontribuoj menjëherë në ekipin tuaj.',
                'Në rolin tim të fundit në [kompania e fundit], [arritja kryesore, p.sh. rrita shitjet me 20%]. Kjo përvojë më ka mësuar [aftësia], një aftësi që e shoh si thelbësore për këtë pozitë.',
                'Më tërheq veçanërisht {company} sepse [arsyeja: produktet, vlerat, reputacioni]. Do të më gëzonte shumë mundësia për t’ju takuar dhe për të diskutuar se si mund t’ju ndihmoj.',
                'Ju falënderoj për kohën dhe vëmendjen. CV-ja ime është bashkëngjitur.',
            ],
        },
        en: {
            subject: 'Application for the [Position] position',
            body: [
                'I am writing to apply for the [Position] role at {company}. As a {title} with experience in [field], I believe I can make an immediate contribution to your team.',
                'In my most recent role at [last company], I [key achievement, e.g. increased sales by 20%]. This experience taught me [skill], which I see as essential for this position.',
                'I am particularly drawn to {company} because [reason: products, values, reputation]. I would welcome the opportunity to meet and discuss how I can help.',
                'Thank you for your time and consideration. My CV is attached.',
            ],
        },
        it: {
            subject: 'Candidatura per la posizione di [Posizione]',
            body: [
                'Vi scrivo per candidarmi alla posizione di [Posizione] presso {company}. Come {title} con esperienza in [ambito], credo di poter dare un contributo immediato al vostro team.',
                'Nel mio ultimo ruolo presso [ultima azienda], [risultato principale, ad es. ho aumentato le vendite del 20%]. Questa esperienza mi ha insegnato [competenza], che ritengo essenziale per questa posizione.',
                'Mi interessa in particolare {company} perché [motivo: prodotti, valori, reputazione]. Mi farebbe piacere avere l’opportunità di incontrarvi e di spiegare come posso essere d’aiuto.',
                'Vi ringrazio per il tempo e l’attenzione. In allegato trovate il mio CV.',
            ],
        },
    },
    internship: {
        sq: {
            subject: 'Aplikim për praktikë: [Pozita]',
            body: [
                'Ju shkruaj për t’u interesuar për praktikën [Pozita] në {company}. Aktualisht jam në vitin e [X] të studimeve për [fusha] në [universiteti] dhe dëshiroj ta zbatoj atë që kam mësuar në një mjedis profesional.',
                'Gjatë studimeve kam punuar në [projekti ose puna sezonale], ku [çfarë bëre dhe çfarë mësove]. Mësoj shpejt, punoj mirë në ekip dhe i marr me përgjegjësi detyrat që më besohen.',
                'Do ta vlerësoja shumë mundësinë për të mësuar nga ekipi juaj dhe për të kontribuar në projektet tuaja. Jam në dispozicion për një takim në çdo kohë që ju përshtatet.',
                'Ju falënderoj për vëmendjen.',
            ],
        },
        en: {
            subject: 'Internship application: [Position]',
            body: [
                'I am writing to express my interest in the [Position] internship at {company}. I am currently in the [X] year of my studies in [field] at [university] and would like to apply what I have learned in a professional environment.',
                'During my studies I worked on [project or seasonal job], where I [what you did and learned]. I learn quickly, work well in a team and take responsibility for the tasks I am given.',
                'I would greatly value the opportunity to learn from your team and contribute to your projects. I am available for an interview at any time that suits you.',
                'Thank you for your consideration.',
            ],
        },
        it: {
            subject: 'Candidatura per tirocinio: [Posizione]',
            body: [
                'Vi scrivo per manifestare il mio interesse per il tirocinio [Posizione] presso {company}. Attualmente frequento il [X] anno di [ambito] presso [università] e desidero applicare quanto appreso in un contesto professionale.',
                'Durante gli studi ho lavorato a [progetto o lavoro stagionale], dove [cosa hai fatto e imparato]. Imparo in fretta, lavoro bene in squadra e svolgo con responsabilità i compiti che mi vengono affidati.',
                'Apprezzerei molto l’opportunità di imparare dal vostro team e di contribuire ai vostri progetti. Sono disponibile per un colloquio in qualsiasi momento.',
                'Vi ringrazio per l’attenzione.',
            ],
        },
    },
    'career-change': {
        sq: {
            subject: 'Aplikim për pozitën [Pozita]',
            body: [
                'Ju shkruaj për pozitën [Pozita] në {company}. Pas [X] vjet përvojë në [fusha e mëparshme], kam vendosur ta çoj karrierën time drejt [fusha e re] dhe jam përgatitur me [kurse, certifikata ose projekte].',
                'Shumë nga aftësitë që kam zhvilluar, si [aftësia 1] dhe [aftësia 2], janë drejtpërdrejt të vlefshme për këtë rol. Për shembull, në [kompania] [arritja që lidhet me rolin e ri].',
                'Sjell një këndvështrim të freskët dhe gatishmëri për të mësuar shpejt. Do të më gëzonte mundësia për t’ju shpjeguar më në detaje se si mund të kontribuoj.',
                'Ju falënderoj për kohën dhe konsideratën.',
            ],
        },
        en: {
            subject: 'Application for the [Position] position',
            body: [
                'I am writing to apply for the [Position] role at {company}. After [X] years in [previous field], I have decided to move my career towards [new field] and have prepared through [courses, certificates or projects].',
                'Many of the skills I have developed, such as [skill 1] and [skill 2], are directly relevant to this role. For example, at [company] I [achievement related to the new role].',
                'I bring a fresh perspective and a willingness to learn quickly. I would welcome the chance to explain in more detail how I can contribute.',
                'Thank you for your time and consideration.',
            ],
        },
        it: {
            subject: 'Candidatura per la posizione di [Posizione]',
            body: [
                'Vi scrivo per candidarmi alla posizione di [Posizione] presso {company}. Dopo [X] anni in [settore precedente], ho deciso di orientare la mia carriera verso [nuovo settore] e ho completato [corsi, certificazioni o progetti] per prepararmi.',
                'Molte delle competenze che ho sviluppato, come [competenza 1] e [competenza 2], sono direttamente utili per questo ruolo. Ad esempio, presso [azienda] [risultato legato al nuovo ruolo].',
                'Porto un punto di vista nuovo e la voglia di imparare rapidamente. Mi farebbe piacere spiegarvi più nel dettaglio come posso contribuire.',
                'Vi ringrazio per il tempo e la considerazione.',
            ],
        },
    },
    spontaneous: {
        sq: {
            subject: 'Aplikim spontan',
            body: [
                'Ju shkruaj për t’ju paraqitur kandidaturën time në {company}, edhe pse për momentin nuk keni shpallur një pozitë të hapur. Ndjek me interes punën tuaj në [fusha ose projekti] dhe besoj se përvoja ime si {title} mund të jetë e dobishme për ekipin tuaj.',
                'Kam [X] vjet përvojë në [fusha], ku [arritja kryesore]. Do të më interesonte veçanërisht një rol në [departamenti ose lloji i rolit].',
                'Do të më gëzonte të takoheshim, qoftë edhe për një bisedë të shkurtër, për të parë nëse ka mundësi bashkëpunimi tani ose në të ardhmen. CV-ja ime është bashkëngjitur.',
                'Ju falënderoj për vëmendjen.',
            ],
        },
        en: {
            subject: 'Speculative application',
            body: [
                'I am writing to put myself forward for a role at {company}, even though you have not advertised an open position at the moment. I follow your work in [field or project] with interest and believe my experience as a {title} could be useful to your team.',
                'I have [X] years of experience in [field], where I [key achievement]. I would be particularly interested in a role in [department or type of role].',
                'I would be glad to meet, even for a short conversation, to see whether there is an opportunity to work together now or in the future. My CV is attached.',
                'Thank you for your consideration.',
            ],
        },
        it: {
            subject: 'Candidatura spontanea',
            body: [
                'Vi scrivo per propormi presso {company}, anche se al momento non avete pubblicato posizioni aperte. Seguo con interesse il vostro lavoro in [ambito o progetto] e credo che la mia esperienza come {title} possa essere utile al vostro team.',
                'Ho [X] anni di esperienza in [ambito], dove [risultato principale]. Mi interesserebbe in particolare un ruolo in [reparto o tipo di ruolo].',
                'Sarebbe un piacere incontrarvi, anche per un breve colloquio, per capire se ci sono possibilità di collaborazione ora o in futuro. In allegato trovate il mio CV.',
                'Vi ringrazio per l’attenzione.',
            ],
        },
    },
};

// German and Spanish starter texts, merged into TEXTS above.
const MORE = {
    general: {
        de: {
            subject: 'Bewerbung als [Position]',
            body: [
                'mit großem Interesse habe ich Ihre Stellenanzeige für die Position [Position] bei {company} gelesen. Als {title} mit Erfahrung in [Bereich] bin ich überzeugt, Ihr Team von Anfang an unterstützen zu können.',
                'In meiner letzten Position bei [letztes Unternehmen] habe ich [wichtigstes Ergebnis, z. B. den Umsatz um 20 % gesteigert]. Dabei habe ich [Fähigkeit] vertieft, die ich für diese Stelle als wesentlich ansehe.',
                'Besonders reizt mich {company}, weil [Grund: Produkte, Werte, Ruf]. Über die Gelegenheit zu einem persönlichen Gespräch würde ich mich sehr freuen.',
                'Vielen Dank für Ihre Zeit und Ihre Aufmerksamkeit. Meinen Lebenslauf finden Sie im Anhang.',
            ],
        },
        es: {
            subject: 'Candidatura al puesto de [Puesto]',
            body: [
                'Les escribo con gran interés para presentar mi candidatura al puesto de [Puesto] en {company}. Como {title} con experiencia en [ámbito], creo que puedo aportar valor a su equipo desde el primer día.',
                'En mi último puesto en [última empresa], [logro principal, p. ej. aumenté las ventas un 20 %]. Esa experiencia me ha enseñado [habilidad], que considero esencial para este puesto.',
                'Me atrae especialmente {company} porque [motivo: productos, valores, reputación]. Me encantaría tener la oportunidad de reunirme con ustedes y explicarles cómo puedo ayudar.',
                'Les agradezco su tiempo y su atención. Adjunto mi CV.',
            ],
        },
    },
    internship: {
        de: {
            subject: 'Bewerbung um ein Praktikum: [Position]',
            body: [
                'hiermit bewerbe ich mich um das Praktikum [Position] bei {company}. Derzeit studiere ich im [X]. Semester [Fachrichtung] an der [Hochschule] und möchte mein Wissen in der Praxis anwenden.',
                'Während des Studiums habe ich an [Projekt oder Nebenjob] gearbeitet und dabei [was du getan und gelernt hast]. Ich lerne schnell, arbeite gern im Team und übernehme Verantwortung für meine Aufgaben.',
                'Ich würde mich sehr freuen, von Ihrem Team zu lernen und zu Ihren Projekten beizutragen. Für ein Gespräch stehe ich Ihnen jederzeit zur Verfügung.',
                'Vielen Dank für Ihre Aufmerksamkeit.',
            ],
        },
        es: {
            subject: 'Candidatura a prácticas: [Puesto]',
            body: [
                'Les escribo para mostrar mi interés en las prácticas de [Puesto] en {company}. Actualmente curso el [X] año de [estudios] en [universidad] y quiero aplicar lo aprendido en un entorno profesional.',
                'Durante mis estudios trabajé en [proyecto o trabajo de temporada], donde [qué hiciste y qué aprendiste]. Aprendo rápido, trabajo bien en equipo y asumo con responsabilidad las tareas que se me encomiendan.',
                'Valoraría mucho la oportunidad de aprender de su equipo y de contribuir a sus proyectos. Estoy disponible para una entrevista cuando les convenga.',
                'Les agradezco su atención.',
            ],
        },
    },
    'career-change': {
        de: {
            subject: 'Bewerbung als [Position]',
            body: [
                'ich bewerbe mich bei {company} um die Position [Position]. Nach [X] Jahren in [bisheriger Bereich] habe ich mich entschieden, beruflich in Richtung [neuer Bereich] zu wechseln, und mich durch [Kurse, Zertifikate oder Projekte] darauf vorbereitet.',
                'Viele meiner Fähigkeiten, etwa [Fähigkeit 1] und [Fähigkeit 2], sind für diese Stelle direkt relevant. So habe ich bei [Unternehmen] beispielsweise [Erfolg mit Bezug zur neuen Rolle].',
                'Ich bringe eine neue Perspektive und die Bereitschaft mit, schnell dazuzulernen. Gern erläutere ich Ihnen in einem Gespräch, wie ich Ihr Team unterstützen kann.',
                'Vielen Dank für Ihre Zeit und Ihre Überlegungen.',
            ],
        },
        es: {
            subject: 'Candidatura al puesto de [Puesto]',
            body: [
                'Les escribo para presentar mi candidatura al puesto de [Puesto] en {company}. Tras [X] años en [ámbito anterior], he decidido orientar mi carrera hacia [nuevo ámbito] y me he preparado con [cursos, certificados o proyectos].',
                'Muchas de las habilidades que he desarrollado, como [habilidad 1] y [habilidad 2], son directamente útiles para este puesto. Por ejemplo, en [empresa] [logro relacionado con el nuevo puesto].',
                'Aporto una perspectiva nueva y ganas de aprender rápido. Me gustaría explicarles con más detalle cómo puedo contribuir.',
                'Les agradezco su tiempo y su consideración.',
            ],
        },
    },
    spontaneous: {
        de: {
            subject: 'Initiativbewerbung',
            body: [
                'hiermit möchte ich mich bei {company} initiativ vorstellen, auch wenn derzeit keine passende Stelle ausgeschrieben ist. Ich verfolge Ihre Arbeit in [Bereich oder Projekt] mit Interesse und bin überzeugt, dass meine Erfahrung als {title} Ihr Team bereichern kann.',
                'Ich bringe [X] Jahre Erfahrung in [Bereich] mit, in denen ich [wichtigstes Ergebnis]. Besonders interessiert wäre ich an einer Aufgabe in [Abteilung oder Art der Rolle].',
                'Über ein kurzes Gespräch, um zu klären, ob jetzt oder in Zukunft eine Zusammenarbeit möglich ist, würde ich mich freuen. Meinen Lebenslauf finden Sie im Anhang.',
                'Vielen Dank für Ihre Aufmerksamkeit.',
            ],
        },
        es: {
            subject: 'Candidatura espontánea',
            body: [
                'Les escribo para presentar mi candidatura en {company}, aunque en este momento no tengan publicada ninguna vacante. Sigo con interés su trabajo en [ámbito o proyecto] y creo que mi experiencia como {title} puede ser útil para su equipo.',
                'Cuento con [X] años de experiencia en [ámbito], donde [logro principal]. Me interesaría especialmente un puesto en [departamento o tipo de puesto].',
                'Me encantaría reunirme con ustedes, aunque sea para una breve conversación, para ver si existe la posibilidad de colaborar ahora o en el futuro. Adjunto mi CV.',
                'Les agradezco su atención.',
            ],
        },
    },
};

for (const [id, languages] of Object.entries(MORE)) {
    Object.assign(TEXTS[id], languages);
}

/**
 * Builds the starter letter fields for a project. Only empty fields are meant
 * to be overwritten by the caller except the body, which the caller replaces
 * after asking for confirmation.
 *
 * @returns {{ subject: string, salutation: string, closing: string, body: string }}
 */
export function letterSkeleton(typeId, project) {
    const lang = normalizeLanguage(project.design?.language);
    const texts = (TEXTS[typeId] ?? TEXTS.general)[lang];
    const company = (project.coverLetter?.company ?? '').trim() || FALLBACK[lang].company;
    const title = (project.cv?.personal?.title ?? '').trim() || FALLBACK[lang].title;
    const fill = (text) => text.replaceAll('{company}', company).replaceAll('{title}', title);

    return {
        subject: fill(texts.subject),
        salutation: DEFAULTS[lang].salutation,
        closing: DEFAULTS[lang].closing,
        body: texts.body.map(fill).join('\n\n'),
    };
}

export function letterTypeLabel(type, lang) {
    return type.label[normalizeLanguage(lang)] ?? type.label.sq;
}
