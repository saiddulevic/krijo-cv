/**
 * Clearly fictional sample data used by "Provo me një shembull" (in Albanian,
 * English or Italian), the template thumbnails and the automated template
 * tests. Every contact detail points to reserved example domains.
 */
import { emptyProject, newCustomSection, newEntry, normalizeLanguage, normalizeSectionOrder } from './schema.js';

function entry(section, values) {
    return Object.assign(newEntry(section), values);
}

const TEXT = {
    sq: {
        title: 'Zhvilluese softueri',
        summary:
            'Zhvilluese softueri me pesë vjet përvojë në ndërtimin e aplikacioneve web për kompani vendore dhe ndërkombëtare. ' +
            'Punoj me PHP, Laravel dhe JavaScript, kam përvojë në drejtimin e ekipeve të vogla dhe më pëlqen të shndërroj kërkesat e paqarta në produkte të qarta dhe të lehta për t’u përdorur.',
        jobs: [
            {
                title: 'Zhvilluese e lartë softueri',
                description:
                    '- Udhëheq zhvillimin e platformës së faturimit që përdoret nga mbi 200 biznese.\n' +
                    '- Ula kohën e përgjigjes së API-t me 40% duke rishkruar shtresën e cache-it.\n' +
                    '- Mentoroj tre zhvillues të rinj dhe drejtoj rishikimet e kodit.',
            },
            {
                title: 'Zhvilluese softueri',
                description:
                    '- Ndërtova module për dyqane online me Laravel dhe Vue.\n' +
                    '- Integrova sisteme pagese dhe raportim automatik për klientët.\n' +
                    '- Bashkëpunova me ekipin e dizajnit për ndërfaqe të aksesueshme.',
            },
            {
                title: 'Praktikante zhvillimi',
                description: 'Mbështeta ekipin në testimin e aplikacioneve dhe në dokumentimin e proceseve të zhvillimit.',
            },
        ],
        edu: [
            { qualification: 'Master i shkencave', field: 'Shkenca kompjuterike', description: 'Tema e diplomës: Optimizimi i aplikacioneve web për rrjete me kapacitet të ulët.' },
            { qualification: 'Bachelor i shkencave', field: 'Inxhinieri kompjuterike', description: '' },
        ],
        groups: { code: 'Gjuhë programimi', frameworks: 'Korniza', tools: 'Mjete', soft: 'Aftësi të buta' },
        soft: ['Drejtim ekipi', 'Komunikim me klientë'],
        languages: ['Shqip', 'Anglisht', 'Gjermanisht'],
        certs: ['Laravel Certified Developer', 'Bazat e sigurisë së aplikacioneve web'],
        projects: [
            { role: 'Zhvilluese kryesore', description: 'Aplikacion me kod të hapur për faturim të thjeshtë për biznese të vogla, me eksport PDF dhe raporte mujore.' },
            { role: 'Zhvilluese front-end', description: 'Hartë interaktive e bibliotekave publike me orare dhe shërbime, e ndërtuar me të dhëna të hapura.' },
        ],
        volunteer: { role: 'Mentore programimi', description: 'Mbaj punëtori mujore për nxënës të shkollave të mesme mbi bazat e programimit.' },
        publication: { title: 'Optimizimi i aplikacioneve web për rrjete me kapacitet të ulët', publisher: 'Revista Shembull e Informatikës', description: 'Artikull i bazuar në temën e diplomës master.' },
        referencePosition: 'Drejtor teknik',
        interests: { title: 'Interesat', items: ['Fotografi', 'Alpinizëm', 'Kod i hapur'], description: 'Kontribuoj rregullisht në projekte me kod të hapur.' },
        letter: {
            recipientName: 'Znj. Blerta Hoxha',
            recipientTitle: 'Drejtore e burimeve njerëzore',
            company: 'Inovacion Digjital Shembull sh.p.k.',
            address: 'Rruga e Shembullit 12, Prishtinë',
            date: '10 tetor 2026',
            subject: 'Aplikim për pozitën Zhvillues i lartë softueri',
            salutation: 'E nderuar znj. Hoxha,',
            body:
                'Me interes të madh pashë shpalljen tuaj për pozitën Zhvillues i lartë softueri dhe po ju dërgoj CV-në time për shqyrtim.\n\n' +
                'Në pesë vitet e fundit kam ndërtuar dhe drejtuar zhvillimin e platformave web me PHP dhe Laravel, duke ulur kohën e përgjigjes së sistemeve kryesore me 40% dhe duke mentoruar një ekip të vogël zhvilluesish. Më motivon kur një kërkesë e paqartë shndërrohet në një produkt të qartë, të sigurt dhe të lehtë për t’u përdorur.\n\n' +
                'Do të jem e kënaqur t’ju tregoj më në detaje se si përvoja ime mund të ndihmojë ekipin tuaj. Mbetem në pritje të një mundësie për t’u takuar.',
            closing: 'Me respekt,',
        },
    },
    en: {
        title: 'Software developer',
        summary:
            'Software developer with five years of experience building web applications for local and international companies. ' +
            'I work with PHP, Laravel and JavaScript, have led small teams and enjoy turning vague requirements into clear, easy-to-use products.',
        jobs: [
            {
                title: 'Senior software developer',
                description:
                    '- Lead development of the invoicing platform used by more than 200 businesses.\n' +
                    '- Cut API response time by 40% by rewriting the caching layer.\n' +
                    '- Mentor three junior developers and run code reviews.',
            },
            {
                title: 'Software developer',
                description:
                    '- Built online-shop modules with Laravel and Vue.\n' +
                    '- Integrated payment systems and automated client reporting.\n' +
                    '- Worked with the design team on accessible interfaces.',
            },
            {
                title: 'Development intern',
                description: 'Supported the team with application testing and documenting development processes.',
            },
        ],
        edu: [
            { qualification: 'Master of Science', field: 'Computer science', description: 'Thesis: Optimising web applications for low-bandwidth networks.' },
            { qualification: 'Bachelor of Science', field: 'Computer engineering', description: '' },
        ],
        groups: { code: 'Programming languages', frameworks: 'Frameworks', tools: 'Tools', soft: 'Soft skills' },
        soft: ['Team leadership', 'Client communication'],
        languages: ['Albanian', 'English', 'German'],
        certs: ['Laravel Certified Developer', 'Web application security fundamentals'],
        projects: [
            { role: 'Lead developer', description: 'Open-source application for simple invoicing for small businesses, with PDF export and monthly reports.' },
            { role: 'Front-end developer', description: 'Interactive map of public libraries with opening hours and services, built on open data.' },
        ],
        volunteer: { role: 'Coding mentor', description: 'Run monthly workshops on programming basics for high-school students.' },
        publication: { title: 'Optimising web applications for low-bandwidth networks', publisher: 'Example Journal of Informatics', description: 'Article based on the master’s thesis.' },
        referencePosition: 'Technical director',
        interests: { title: 'Interests', items: ['Photography', 'Mountaineering', 'Open source'], description: 'Regular contributor to open-source projects.' },
        letter: {
            recipientName: 'Ms Blerta Hoxha',
            recipientTitle: 'Head of Human Resources',
            company: 'Example Digital Innovation Ltd',
            address: '12 Example Street, Pristina',
            date: '10 October 2026',
            subject: 'Application for the Senior Software Developer position',
            salutation: 'Dear Ms Hoxha,',
            body:
                'I was very interested to see your advertisement for the Senior Software Developer position and I am sending you my CV for your consideration.\n\n' +
                'Over the last five years I have built and led the development of web platforms with PHP and Laravel, cutting the response time of core systems by 40% and mentoring a small team of developers. I am motivated when a vague requirement becomes a clear, secure and easy-to-use product.\n\n' +
                'I would be glad to explain in more detail how my experience can help your team. I look forward to the opportunity to meet.',
            closing: 'Yours sincerely,',
        },
    },
    de: {
        title: 'Softwareentwicklerin',
        summary:
            'Softwareentwicklerin mit fünf Jahren Erfahrung in der Entwicklung von Webanwendungen für lokale und internationale Unternehmen. ' +
            'Ich arbeite mit PHP, Laravel und JavaScript, habe kleine Teams geleitet und verwandle gern unklare Anforderungen in klare, leicht bedienbare Produkte.',
        jobs: [
            {
                title: 'Senior-Softwareentwicklerin',
                description:
                    '- Leite die Entwicklung der Rechnungsplattform, die von über 200 Unternehmen genutzt wird.\n' +
                    '- Habe die Antwortzeit der API um 40 % gesenkt, indem ich die Cache-Schicht neu geschrieben habe.\n' +
                    '- Betreue drei Nachwuchsentwickler und leite Code-Reviews.',
            },
            {
                title: 'Softwareentwicklerin',
                description:
                    '- Habe Module für Online-Shops mit Laravel und Vue entwickelt.\n' +
                    '- Habe Zahlungssysteme und automatische Berichte für Kunden integriert.\n' +
                    '- Habe mit dem Designteam an barrierefreien Oberflächen gearbeitet.',
            },
            {
                title: 'Praktikantin in der Entwicklung',
                description: 'Habe das Team beim Testen von Anwendungen und bei der Dokumentation der Entwicklungsprozesse unterstützt.',
            },
        ],
        edu: [
            { qualification: 'Master of Science', field: 'Informatik', description: 'Abschlussarbeit: Optimierung von Webanwendungen für Netzwerke mit geringer Bandbreite.' },
            { qualification: 'Bachelor of Science', field: 'Technische Informatik', description: '' },
        ],
        groups: { code: 'Programmiersprachen', frameworks: 'Frameworks', tools: 'Werkzeuge', soft: 'Soziale Kompetenzen' },
        soft: ['Teamleitung', 'Kundenkommunikation'],
        languages: ['Albanisch', 'Englisch', 'Deutsch'],
        certs: ['Laravel Certified Developer', 'Grundlagen der Websicherheit'],
        projects: [
            { role: 'Hauptentwicklerin', description: 'Open-Source-Anwendung für einfache Rechnungsstellung für kleine Unternehmen, mit PDF-Export und Monatsberichten.' },
            { role: 'Frontend-Entwicklerin', description: 'Interaktive Karte öffentlicher Bibliotheken mit Öffnungszeiten und Angeboten, auf Basis offener Daten.' },
        ],
        volunteer: { role: 'Programmier-Mentorin', description: 'Leite monatliche Workshops zu den Grundlagen des Programmierens für Oberstufenschüler.' },
        publication: { title: 'Optimierung von Webanwendungen für Netzwerke mit geringer Bandbreite', publisher: 'Beispielzeitschrift für Informatik', description: 'Artikel auf Basis der Masterarbeit.' },
        referencePosition: 'Technischer Leiter',
        interests: { title: 'Interessen', items: ['Fotografie', 'Bergsteigen', 'Open Source'], description: 'Regelmäßige Beiträge zu Open-Source-Projekten.' },
        letter: {
            recipientName: 'Frau Blerta Hoxha',
            recipientTitle: 'Leiterin Personal',
            company: 'Beispiel Digitale Innovation GmbH',
            address: 'Beispielstraße 12, Prishtinë',
            date: '10. Oktober 2026',
            subject: 'Bewerbung als Senior-Softwareentwicklerin',
            salutation: 'Sehr geehrte Frau Hoxha,',
            body:
                'mit großem Interesse habe ich Ihre Stellenanzeige für die Position Senior-Softwareentwicklerin gelesen und sende Ihnen meinen Lebenslauf.\n\n' +
                'In den letzten fünf Jahren habe ich Webplattformen mit PHP und Laravel entwickelt und geleitet, die Antwortzeit zentraler Systeme um 40 % gesenkt und ein kleines Entwicklerteam betreut. Es motiviert mich, wenn aus einer unklaren Anforderung ein klares, sicheres und leicht bedienbares Produkt wird.\n\n' +
                'Gern erläutere ich Ihnen in einem persönlichen Gespräch, wie meine Erfahrung Ihr Team unterstützen kann.',
            closing: 'Mit freundlichen Grüßen',
        },
    },
    es: {
        title: 'Desarrolladora de software',
        summary:
            'Desarrolladora de software con cinco años de experiencia creando aplicaciones web para empresas locales e internacionales. ' +
            'Trabajo con PHP, Laravel y JavaScript, he dirigido equipos pequeños y me gusta convertir requisitos poco claros en productos claros y fáciles de usar.',
        jobs: [
            {
                title: 'Desarrolladora de software sénior',
                description:
                    '- Dirijo el desarrollo de la plataforma de facturación que usan más de 200 empresas.\n' +
                    '- Reduje un 40 % el tiempo de respuesta de la API reescribiendo la capa de caché.\n' +
                    '- Oriento a tres desarrolladores junior y coordino las revisiones de código.',
            },
            {
                title: 'Desarrolladora de software',
                description:
                    '- Construí módulos para tiendas online con Laravel y Vue.\n' +
                    '- Integré sistemas de pago e informes automáticos para los clientes.\n' +
                    '- Colaboré con el equipo de diseño en interfaces accesibles.',
            },
            {
                title: 'Becaria de desarrollo',
                description: 'Apoyé al equipo en las pruebas de aplicaciones y en la documentación de los procesos de desarrollo.',
            },
        ],
        edu: [
            { qualification: 'Máster en Ciencias', field: 'Informática', description: 'Tesis: Optimización de aplicaciones web para redes de baja capacidad.' },
            { qualification: 'Grado en Ciencias', field: 'Ingeniería informática', description: '' },
        ],
        groups: { code: 'Lenguajes de programación', frameworks: 'Frameworks', tools: 'Herramientas', soft: 'Habilidades blandas' },
        soft: ['Liderazgo de equipos', 'Comunicación con clientes'],
        languages: ['Albanés', 'Inglés', 'Alemán'],
        certs: ['Laravel Certified Developer', 'Fundamentos de seguridad web'],
        projects: [
            { role: 'Desarrolladora principal', description: 'Aplicación de código abierto para facturación sencilla de pequeñas empresas, con exportación a PDF e informes mensuales.' },
            { role: 'Desarrolladora front-end', description: 'Mapa interactivo de bibliotecas públicas con horarios y servicios, creado con datos abiertos.' },
        ],
        volunteer: { role: 'Mentora de programación', description: 'Imparto talleres mensuales sobre los fundamentos de la programación para estudiantes de bachillerato.' },
        publication: { title: 'Optimización de aplicaciones web para redes de baja capacidad', publisher: 'Revista de Informática de Ejemplo', description: 'Artículo basado en la tesis de máster.' },
        referencePosition: 'Director técnico',
        interests: { title: 'Intereses', items: ['Fotografía', 'Montañismo', 'Código abierto'], description: 'Contribuyo con regularidad a proyectos de código abierto.' },
        letter: {
            recipientName: 'Sra. Blerta Hoxha',
            recipientTitle: 'Responsable de Recursos Humanos',
            company: 'Innovación Digital Ejemplo S.L.',
            address: 'Calle del Ejemplo 12, Prishtinë',
            date: '10 de octubre de 2026',
            subject: 'Candidatura al puesto de Desarrolladora de software sénior',
            salutation: 'Estimada Sra. Hoxha:',
            body:
                'He leído con gran interés su oferta para el puesto de Desarrolladora de software sénior y les envío mi CV para su consideración.\n\n' +
                'En los últimos cinco años he creado y dirigido el desarrollo de plataformas web con PHP y Laravel, he reducido un 40 % el tiempo de respuesta de los sistemas principales y he orientado a un pequeño equipo de desarrolladores. Me motiva ver cómo un requisito poco claro se convierte en un producto claro, seguro y fácil de usar.\n\n' +
                'Estaré encantada de explicarles con más detalle cómo mi experiencia puede ayudar a su equipo. Quedo a la espera de una oportunidad para reunirnos.',
            closing: 'Atentamente,',
        },
    },
    it: {
        title: 'Sviluppatrice software',
        summary:
            'Sviluppatrice software con cinque anni di esperienza nella creazione di applicazioni web per aziende locali e internazionali. ' +
            'Lavoro con PHP, Laravel e JavaScript, ho guidato piccoli team e mi piace trasformare requisiti poco chiari in prodotti chiari e facili da usare.',
        jobs: [
            {
                title: 'Sviluppatrice software senior',
                description:
                    '- Guido lo sviluppo della piattaforma di fatturazione usata da oltre 200 aziende.\n' +
                    '- Ho ridotto del 40% i tempi di risposta delle API riscrivendo il livello di cache.\n' +
                    '- Faccio da mentore a tre sviluppatori junior e coordino le revisioni del codice.',
            },
            {
                title: 'Sviluppatrice software',
                description:
                    '- Ho realizzato moduli per negozi online con Laravel e Vue.\n' +
                    '- Ho integrato sistemi di pagamento e reportistica automatica per i clienti.\n' +
                    '- Ho collaborato con il team di design per interfacce accessibili.',
            },
            {
                title: 'Tirocinante sviluppatrice',
                description: 'Ho supportato il team nel test delle applicazioni e nella documentazione dei processi di sviluppo.',
            },
        ],
        edu: [
            { qualification: 'Laurea magistrale', field: 'Informatica', description: 'Tesi: Ottimizzazione di applicazioni web per reti a bassa capacità.' },
            { qualification: 'Laurea triennale', field: 'Ingegneria informatica', description: '' },
        ],
        groups: { code: 'Linguaggi di programmazione', frameworks: 'Framework', tools: 'Strumenti', soft: 'Competenze trasversali' },
        soft: ['Guida del team', 'Comunicazione con i clienti'],
        languages: ['Albanese', 'Inglese', 'Tedesco'],
        certs: ['Laravel Certified Developer', 'Fondamenti di sicurezza delle applicazioni web'],
        projects: [
            { role: 'Sviluppatrice principale', description: 'Applicazione open source per fatturazione semplice per piccole imprese, con esportazione PDF e report mensili.' },
            { role: 'Sviluppatrice front-end', description: 'Mappa interattiva delle biblioteche pubbliche con orari e servizi, costruita su dati aperti.' },
        ],
        volunteer: { role: 'Mentore di programmazione', description: 'Tengo laboratori mensili sui fondamenti della programmazione per studenti delle superiori.' },
        publication: { title: 'Ottimizzazione di applicazioni web per reti a bassa capacità', publisher: 'Rivista di Informatica di Esempio', description: 'Articolo basato sulla tesi di laurea magistrale.' },
        referencePosition: 'Direttore tecnico',
        interests: { title: 'Interessi', items: ['Fotografia', 'Alpinismo', 'Open source'], description: 'Contribuisco regolarmente a progetti open source.' },
        letter: {
            recipientName: 'Dott.ssa Blerta Hoxha',
            recipientTitle: 'Responsabile Risorse Umane',
            company: 'Innovazione Digitale Esempio S.r.l.',
            address: 'Via dell’Esempio 12, Prishtinë',
            date: '10 ottobre 2026',
            subject: 'Candidatura per la posizione di Sviluppatrice software senior',
            salutation: 'Gentile dott.ssa Hoxha,',
            body:
                'Ho letto con grande interesse il vostro annuncio per la posizione di Sviluppatrice software senior e vi invio il mio CV per la valutazione.\n\n' +
                'Negli ultimi cinque anni ho realizzato e guidato lo sviluppo di piattaforme web con PHP e Laravel, riducendo del 40% i tempi di risposta dei sistemi principali e facendo da mentore a un piccolo team di sviluppatori. Mi motiva vedere un requisito poco chiaro diventare un prodotto chiaro, sicuro e facile da usare.\n\n' +
                'Sarò lieta di spiegarvi più nel dettaglio come la mia esperienza può aiutare il vostro team. Resto in attesa di un’occasione per incontrarci.',
            closing: 'Cordiali saluti,',
        },
    },
};

export function sampleProject(options = {}) {
    const language = normalizeLanguage(options.language);
    const t = TEXT[language];
    const project = emptyProject({ ...options, language });

    project.cv.personal = {
        firstName: 'Arta',
        lastName: 'Krasniqi',
        title: t.title,
        email: 'arta.krasniqi@example.com',
        phone: '+383 44 123 456',
        city: 'Prishtinë',
        country: language === 'sq' ? 'Kosovë' : 'Kosovo',
        linkedin: 'linkedin.com/in/arta-krasniqi-shembull',
        website: 'arta-krasniqi.example',
    };

    project.cv.summary = t.summary;

    const jobMeta = [
        { employer: 'Teknova Shembull sh.p.k.', location: 'Prishtinë', startDate: '03/2022', endDate: '', current: true },
        { employer: 'Digjitale Shembull', location: 'Tiranë', startDate: '09/2019', endDate: '02/2022', current: false },
        { employer: 'Inovacion Shembull', location: 'Prishtinë', startDate: '06/2018', endDate: '08/2019', current: false },
    ];
    project.cv.experience = t.jobs.map((job, index) => entry('experience', { ...jobMeta[index], ...job }));

    project.cv.education = [
        entry('education', { institution: 'Universiteti i Prishtinës', location: 'Prishtinë', startDate: '2019', endDate: '2021', current: false, ...t.edu[0] }),
        entry('education', { institution: 'Universiteti i Prishtinës', location: 'Prishtinë', startDate: '2015', endDate: '2019', current: false, ...t.edu[1] }),
    ];

    const g = t.groups;
    project.cv.skills = [
        entry('skills', { name: 'PHP', level: 'expert', group: g.code }),
        entry('skills', { name: 'JavaScript', level: 'advanced', group: g.code }),
        entry('skills', { name: 'SQL', level: 'advanced', group: g.code }),
        entry('skills', { name: 'Laravel', level: 'expert', group: g.frameworks }),
        entry('skills', { name: 'Vue.js', level: 'advanced', group: g.frameworks }),
        entry('skills', { name: 'Tailwind CSS', level: 'advanced', group: g.frameworks }),
        entry('skills', { name: 'Docker', level: 'intermediate', group: g.tools }),
        entry('skills', { name: 'Git', level: 'advanced', group: g.tools }),
        entry('skills', { name: 'MySQL', level: 'advanced', group: g.tools }),
        entry('skills', { name: t.soft[0], level: 'intermediate', group: g.soft }),
        entry('skills', { name: t.soft[1], level: 'advanced', group: g.soft }),
    ];

    project.cv.languages = [
        entry('languages', { name: t.languages[0], level: 'native' }),
        entry('languages', { name: t.languages[1], level: 'c1' }),
        entry('languages', { name: t.languages[2], level: 'b1' }),
    ];

    project.cv.certifications = [
        entry('certifications', { name: t.certs[0], issuer: 'Shembull Certifikimi', date: '2023', url: '' }),
        entry('certifications', { name: t.certs[1], issuer: 'Akademia Shembull', date: '2021', url: '' }),
    ];

    project.cv.projects = [
        entry('projects', {
            name: 'Krijo Faturë',
            role: t.projects[0].role,
            url: 'github.com/example/krijo-fature',
            date: '2023',
            technologies: 'Laravel, Vue, MySQL',
            description: t.projects[0].description,
        }),
        entry('projects', {
            name: 'Harta e Bibliotekave',
            role: t.projects[1].role,
            url: 'biblioteka.example',
            date: '2022',
            technologies: 'JavaScript, Leaflet',
            description: t.projects[1].description,
        }),
    ];

    project.cv.volunteer = [
        entry('volunteer', {
            role: t.volunteer.role,
            organization: 'Klubi i Kodimit Shembull',
            location: 'Prishtinë',
            startDate: '2020',
            endDate: '',
            current: true,
            description: t.volunteer.description,
        }),
    ];

    project.cv.publications = [
        entry('publications', {
            title: t.publication.title,
            publisher: t.publication.publisher,
            date: '2021',
            url: '',
            description: t.publication.description,
        }),
    ];

    project.cv.references = [
        entry('references', {
            name: 'Blerim Gashi',
            position: t.referencePosition,
            company: 'Teknova Shembull sh.p.k.',
            email: 'blerim.gashi@example.com',
            phone: '+383 44 987 654',
        }),
    ];

    const interests = newCustomSection(t.interests.title);
    interests.entries = [
        entry('custom', { title: t.interests.items[0], subtitle: '', date: '', description: '' }),
        entry('custom', { title: t.interests.items[1], subtitle: '', date: '', description: '' }),
        entry('custom', { title: t.interests.items[2], subtitle: '', date: '', description: t.interests.description }),
    ];
    project.cv.custom = [interests];

    project.coverLetter = {
        ...project.coverLetter,
        ...t.letter,
        city: 'Prishtinë',
    };

    project.design.sectionOrder = normalizeSectionOrder(project.design.sectionOrder, project.cv.custom);

    return project;
}

/**
 * A deliberately long CV (many entries, long descriptions) for pagination
 * tests. The generated text is Albanian whatever the language option is.
 */
export function longSampleProject(options = {}) {
    const project = sampleProject(options);
    const paragraph =
        'Përgjegjësi për analizën e kërkesave, planifikimin e sprinteve dhe koordinimin me palët e interesuara. ' +
        'Zbatova praktika të integrimit të vazhdueshëm, shkrova teste automatike dhe dokumentova arkitekturën e sistemit. ';

    const extraJobs = Array.from({ length: 7 }, (_, i) =>
        entry('experience', {
            title: `Zhvilluese softueri ${i + 1}`,
            employer: `Kompania Shembull ${i + 1}`,
            location: i % 2 ? 'Tiranë' : 'Prishtinë',
            startDate: `0${(i % 9) + 1}/20${10 + i}`,
            endDate: `0${(i % 9) + 1}/20${11 + i}`,
            current: false,
            description:
                paragraph.repeat(3) +
                '\n- Arritje e parë e matshme me përqindje dhe kontekst të mjaftueshëm për të mbushur rreshtin.\n' +
                '- Arritje e dytë e matshme me përqindje dhe kontekst të mjaftueshëm për të mbushur rreshtin.\n' +
                '- Arritje e tretë e matshme me përqindje dhe kontekst të mjaftueshëm për të mbushur rreshtin.',
        }),
    );
    project.cv.experience = [...project.cv.experience, ...extraJobs];

    project.cv.projects = [
        ...project.cv.projects,
        ...Array.from({ length: 5 }, (_, i) =>
            entry('projects', {
                name: `Projekti i gjatë ${i + 1}`,
                role: 'Zhvilluese',
                url: `projekti-${i + 1}.example`,
                date: `202${i}`,
                technologies: 'Laravel, Alpine.js, Tailwind CSS',
                description: paragraph.repeat(2),
            }),
        ),
    ];

    project.cv.publications = [
        ...project.cv.publications,
        ...Array.from({ length: 4 }, (_, i) =>
            entry('publications', {
                title: `Publikim shtesë numër ${i + 1} me titull mjaft të gjatë për të testuar thyerjen e rreshtave`,
                publisher: 'Konferenca Shembull',
                date: `202${i}`,
                url: '',
                description: paragraph,
            }),
        ),
    ];

    project.cv.summary = paragraph.repeat(4);

    // A long letter: many paragraphs so it spans more than one page.
    project.coverLetter.body = Array.from({ length: 14 }, () => paragraph.repeat(2).trim()).join('\n\n');

    return project;
}
