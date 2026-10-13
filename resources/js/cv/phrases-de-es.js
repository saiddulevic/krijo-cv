/**
 * German and Spanish versions of the phrase library (see phrases.js). Same
 * profession ids, same number of summaries, bullets and skills per profession,
 * and the same [bracket] placeholders.
 */

export const PHRASES_DE_ES = {
    it: {
        label: { de: 'IT und Softwareentwicklung', es: 'TI y desarrollo de software' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung in der Entwicklung von Web- und Mobilanwendungen arbeite ich hauptsächlich mit [Technologien] und schreibe sauberen, getesteten und gut wartbaren Code.',
                'IT-Fachkraft mit Erfahrung in der Betreuung von Systemen und Netzwerken und im Anwendersupport. Ich löse Probleme schnell, dokumentiere jeden Eingriff und halte Systeme sicher und verfügbar.',
            ],
            es: [
                'Con [X] años de experiencia desarrollando aplicaciones web y móviles, trabajo principalmente con [tecnologías] y escribo código limpio, probado y fácil de mantener.',
                'Especialista en TI con experiencia en el mantenimiento de sistemas y redes y en el soporte a usuarios. Resuelvo problemas con rapidez, documento cada intervención y mantengo los sistemas seguros y disponibles.',
            ],
        },
        bullets: {
            de: [
                '[Anzahl] neue Funktionen für [Produkt] entwickelt, die von mehr als [X] Nutzern verwendet werden.',
                'Die Ladezeit der Seite um [X] % verkürzt, indem Datenbankabfragen optimiert wurden.',
                'Manuelle Abläufe automatisiert und dem Team rund [X] Arbeitsstunden pro Woche gespart.',
                'Automatisierte Tests geschrieben und die Testabdeckung von [X] % auf [Y] % erhöht.',
                'Mit Designern und Kunden zusammengearbeitet, um Anforderungen und Prioritäten festzulegen.',
                'Täglich [X] Nutzer bei technischen Problemen unterstützt, mit einer durchschnittlichen Lösungszeit von [X] Stunden.',
            ],
            es: [
                'Desarrollé [número] funcionalidades nuevas para [producto], utilizadas por más de [X] usuarios.',
                'Reduje un [X] % el tiempo de carga de la página optimizando las consultas a la base de datos.',
                'Automaticé procesos manuales y ahorré al equipo unas [X] horas de trabajo a la semana.',
                'Escribí pruebas automáticas y aumenté la cobertura de código del [X] % al [Y] %.',
                'Colaboré con diseñadores y clientes para definir requisitos y prioridades.',
                'Atendí a [X] usuarios al día con incidencias técnicas, con un tiempo medio de resolución de [X] horas.',
            ],
        },
        skills: {
            de: ['JavaScript', 'PHP', 'Python', 'SQL', 'Git', 'Docker', 'Problemlösung', 'Teamarbeit'],
            es: ['JavaScript', 'PHP', 'Python', 'SQL', 'Git', 'Docker', 'Resolución de problemas', 'Trabajo en equipo'],
        },
    },
    sales: {
        label: { de: 'Vertrieb und Kundenservice', es: 'Ventas y atención al cliente' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung in Vertrieb und Kundenservice habe ich langfristige Kundenbeziehungen aufgebaut und die monatlichen Verkaufsziele regelmäßig übertroffen.',
                'Ich kommuniziere klar und freundlich, höre Kunden aufmerksam zu und finde auch unter Druck die passende Lösung für ihre Bedürfnisse.',
            ],
            es: [
                'Con [X] años de experiencia en ventas y atención al cliente, he construido relaciones duraderas con los clientes y he superado con regularidad los objetivos mensuales de ventas.',
                'Me comunico con claridad y cortesía, escucho con atención a los clientes y encuentro la solución adecuada a sus necesidades, incluso bajo presión.',
            ],
        },
        bullets: {
            de: [
                'Das monatliche Verkaufsziel [X] Monate in Folge um [X] % übertroffen.',
                'Durchschnittlich [X] Kunden pro Tag betreut, bei einer Zufriedenheit von [X]/5.',
                'Den Verkauf von Zusatzprodukten durch persönliche Empfehlungen um [X] % gesteigert.',
                'Kasse, Warenbestand und Lieferantenbestellungen ohne Abweichungen geführt.',
                'Kundenbeschwerden gelöst und die Rückgaben um [X] % gesenkt.',
                '[X] neue Mitarbeitende zu Produkten und Servicestandards geschult.',
            ],
            es: [
                'Superé el objetivo mensual de ventas en un [X] % durante [X] meses consecutivos.',
                'Atendí en promedio a [X] clientes al día con una puntuación de satisfacción de [X]/5.',
                'Aumenté un [X] % las ventas de productos complementarios mediante recomendaciones personalizadas.',
                'Gestioné caja, inventario y pedidos a proveedores sin discrepancias.',
                'Resolví reclamaciones de clientes y reduje las devoluciones un [X] %.',
                'Formé a [X] nuevos compañeros en productos y estándares de servicio.',
            ],
        },
        skills: {
            de: ['Verhandlungsgeschick', 'Kommunikation', 'Kundenservice', 'Kassenführung', 'CRM', 'Aktiver Verkauf', 'Belastbarkeit', 'Produktkenntnis'],
            es: ['Negociación', 'Comunicación', 'Atención al cliente', 'Manejo de caja', 'CRM', 'Venta activa', 'Trabajo bajo presión', 'Conocimiento de producto'],
        },
    },
    callcenter: {
        label: { de: 'Callcenter', es: 'Centro de llamadas' },
        summaries: {
            de: [
                'Ich habe [X] Jahre Erfahrung im Callcenter, im Kundenservice und im technischen Support auf [Sprachen]. Ich führe Gespräche ruhig und professionell und erreiche regelmäßig die Qualitätsziele.',
                'Ich spreche fließend [Sprachen], schreibe schnell und genau und arbeite mit CRM- und Ticketsystemen. Schicht- und Kampagnenwechsel bereiten mir keine Schwierigkeiten.',
            ],
            es: [
                'Tengo [X] años de experiencia en centros de llamadas, atención al cliente y soporte técnico en [idiomas]. Atiendo las llamadas con calma y profesionalidad y alcanzo con regularidad los objetivos de calidad.',
                'Hablo con fluidez [idiomas], escribo con rapidez y precisión y trabajo con sistemas CRM y de tickets. Me adapto fácilmente a los turnos rotativos y a nuevas campañas.',
            ],
        },
        bullets: {
            de: [
                'Durchschnittlich [X] Anrufe pro Tag auf [Sprache] bearbeitet, mit einer Erstlösungsquote von [X] %.',
                'In den monatlichen Gesprächsbewertungen eine Qualitätsquote von [X] % erreicht.',
                'Jede Anfrage im CRM-System erfasst und Fälle bis zur Lösung verfolgt.',
                'Zusatzleistungen verkauft und das Konversionsziel um [X] % übertroffen.',
                '[X] neue Kolleginnen und Kollegen in den ersten Wochen als Mentor begleitet.',
                'Unzufriedene Kunden betreut und die Eskalationen an Vorgesetzte um [X] % gesenkt.',
            ],
            es: [
                'Atendí una media de [X] llamadas al día en [idioma], con una resolución en la primera llamada del [X] %.',
                'Alcancé una puntuación de calidad del [X] % en las revisiones mensuales de llamadas.',
                'Registré cada solicitud en el sistema CRM y seguí los casos hasta su resolución.',
                'Vendí servicios adicionales y superé el objetivo de conversión en un [X] %.',
                'Fui mentor de [X] compañeros nuevos durante sus primeras semanas.',
                'Atendí a clientes insatisfechos y reduje un [X] % las escaladas a supervisores.',
            ],
        },
        skills: {
            de: ['Telefonische Kommunikation', 'CRM', 'Schnelles Tippen', 'Problemlösung', 'Telefonverkauf', 'Zeitmanagement', 'Geduld', 'Schichtarbeit'],
            es: ['Comunicación telefónica', 'CRM', 'Mecanografía rápida', 'Resolución de problemas', 'Televenta', 'Gestión del tiempo', 'Paciencia', 'Trabajo por turnos'],
        },
    },
    office: {
        label: { de: 'Verwaltung und Büro', es: 'Administración y oficina' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung in Verwaltung und Büroarbeit organisiere ich Dokumente, Kalender und interne Kommunikation genau und strukturiert.',
                'Ich arbeite mit Microsoft Office und Google Workspace, führe die Korrespondenz mit Kunden und Behörden und achte darauf, dass Fristen eingehalten werden.',
            ],
            es: [
                'Con [X] años de experiencia en administración y trabajo de oficina, organizo documentos, agendas y comunicación interna con precisión y de forma estructurada.',
                'Trabajo con Microsoft Office y Google Workspace, gestiono la correspondencia con clientes e instituciones y me aseguro de que se cumplan los plazos.',
            ],
        },
        bullets: {
            de: [
                'Kalender und Termine von [X] Führungskräften ohne Terminüberschneidungen organisiert.',
                'Über [X] Dokumente archiviert und digitalisiert und die Suchzeit um [X] % verkürzt.',
                'Monatliche Excel-Berichte für die Abteilungsleitung erstellt.',
                'Büromaterial verwaltet und die Kosten durch neue Angebote um [X] % gesenkt.',
                'Dienstreisen und die Logistik von [X] Veranstaltungen koordiniert.',
                'Telefonate und E-Mails beantwortet und Anfragen an die richtigen Ansprechpartner weitergeleitet.',
            ],
            es: [
                'Organicé las agendas y reuniones de [X] directivos sin conflictos de horario.',
                'Archivé y digitalicé más de [X] documentos, reduciendo un [X] % el tiempo de búsqueda.',
                'Preparé informes mensuales en Excel para los responsables de departamento.',
                'Gestioné el material de oficina y reduje los costes un [X] % con nuevas ofertas.',
                'Coordiné viajes de trabajo y la logística de [X] eventos.',
                'Atendí llamadas y correos y derivé las solicitudes a las personas responsables.',
            ],
        },
        skills: {
            de: ['Microsoft Office', 'Excel', 'Google Workspace', 'Ablage', 'Korrespondenz', 'Organisation', 'Genauigkeit', 'Terminverwaltung'],
            es: ['Microsoft Office', 'Excel', 'Google Workspace', 'Archivo', 'Correspondencia', 'Organización', 'Precisión', 'Gestión de agendas'],
        },
    },
    finance: {
        label: { de: 'Finanzen und Buchhaltung', es: 'Finanzas y contabilidad' },
        summaries: {
            de: [
                'Ich habe [X] Jahre Erfahrung in Buchhaltung und Finanzwesen und kenne die Rechnungslegungsstandards und das Steuerrecht gut. Ich arbeite genau und halte die Fristen für Monats- und Jahresabschlüsse ein.',
                'Ich erstelle Jahresabschlüsse, analysiere Kosten und gebe klare Empfehlungen, die der Führung bei guten Entscheidungen helfen.',
            ],
            es: [
                'Tengo [X] años de experiencia en contabilidad y finanzas, con buen conocimiento de las normas de información financiera y de la legislación fiscal. Trabajo con precisión y cumplo los plazos de los cierres mensuales y anuales.',
                'Preparo estados financieros, analizo costes y doy recomendaciones claras que ayudan a la dirección a tomar buenas decisiones.',
            ],
        },
        bullets: {
            de: [
                'Monats- und Jahresabschlüsse für [X] Mandanten erstellt.',
                'Den Monatsabschluss von [X] auf [Y] Tage verkürzt, indem Abstimmungen automatisiert wurden.',
                'Zahlungen und Zahlungseingänge von mehr als [X] € pro Monat verwaltet.',
                'Steuer- und Umsatzsteuererklärungen ohne Verspätungen oder Strafen erstellt.',
                'Durch Kostenanalysen Einsparungen von [X] € pro Jahr identifiziert.',
                'Bei der Jahresprüfung mit den externen Prüfern zusammengearbeitet.',
            ],
            es: [
                'Preparé los estados financieros mensuales y anuales de [X] empresas clientes.',
                'Reduje el cierre mensual de [X] a [Y] días automatizando las conciliaciones.',
                'Gestioné pagos y cobros por más de [X] € al mes.',
                'Preparé las declaraciones de impuestos y de IVA sin sanciones ni retrasos.',
                'Identifiqué ahorros de [X] € al año mediante el análisis de costes.',
                'Colaboré con los auditores externos durante la auditoría anual.',
            ],
        },
        skills: {
            de: ['Buchhaltung', 'Excel für Fortgeschrittene', 'Jahresabschlüsse', 'Steuerrecht', 'Finanzanalyse', 'Buchhaltungssoftware', 'Budgetierung', 'Genauigkeit'],
            es: ['Contabilidad', 'Excel avanzado', 'Estados financieros', 'Legislación fiscal', 'Análisis financiero', 'Software contable', 'Presupuestos', 'Precisión'],
        },
    },
    education: {
        label: { de: 'Bildung', es: 'Educación' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung im Unterricht des Fachs [Fach] gestalte ich interaktive Stunden, die Schülerinnen und Schüler motivieren, und passe sie an die Bedürfnisse jedes Einzelnen an.',
                'Ich stehe regelmäßig im Austausch mit Eltern und Kollegen, setze Technologie im Unterricht ein und bilde mich beruflich konsequent weiter.',
            ],
            es: [
                'Con [X] años de experiencia impartiendo [asignatura], creo clases interactivas que motivan al alumnado y las adapto a las necesidades de cada estudiante.',
                'Me comunico con regularidad con familias y colegas, uso la tecnología en el aula y me comprometo con la formación profesional continua.',
            ],
        },
        bullets: {
            de: [
                '[Fach] in [X] Klassen mit insgesamt rund [X] Schülerinnen und Schülern unterrichtet.',
                'Die durchschnittlichen Prüfungsergebnisse der Klasse um [X] % verbessert.',
                'Schüler auf Wettbewerbe und Olympiaden vorbereitet, bei denen [X] von ihnen Preise gewannen.',
                'Digitale Plattformen wie [Plattform] für Hausaufgaben und Bewertung eingesetzt.',
                '[X] außerschulische Aktivitäten und Lernausflüge organisiert.',
                'Mit Eltern und der Schulpsychologie zusammengearbeitet, um Schüler mit besonderem Förderbedarf zu unterstützen.',
            ],
            es: [
                'Impartí [asignatura] en [X] grupos con un total aproximado de [X] estudiantes.',
                'Mejoré un [X] % los resultados medios del alumnado en los exámenes.',
                'Preparé a estudiantes para concursos y olimpiadas, en los que [X] de ellos ganaron premios.',
                'Utilicé plataformas digitales como [plataforma] para tareas y evaluación.',
                'Organicé [X] actividades extraescolares y excursiones educativas.',
                'Colaboré con las familias y el psicólogo del centro para apoyar a estudiantes con necesidades especiales.',
            ],
        },
        skills: {
            de: ['Unterrichtsplanung', 'Klassenführung', 'Leistungsbewertung', 'Digitales Unterrichten', 'Elternkommunikation', 'Geduld', 'Kreativität', 'Teamarbeit'],
            es: ['Planificación de clases', 'Gestión del aula', 'Evaluación del alumnado', 'Enseñanza digital', 'Comunicación con las familias', 'Paciencia', 'Creatividad', 'Trabajo en equipo'],
        },
    },
    health: {
        label: { de: 'Gesundheit und Pflege', es: 'Sanidad y cuidados' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung im Gesundheitswesen auf [Station/Einrichtung] biete ich sichere und einfühlsame Patientenversorgung und arbeite eng mit dem medizinischen Team zusammen.',
                'Ich halte klinische und hygienische Protokolle konsequent ein, dokumentiere jede Maßnahme genau und bleibe in Notfällen ruhig.',
            ],
            es: [
                'Con [X] años de experiencia en el ámbito sanitario en [planta/centro], ofrezco una atención segura y humana a los pacientes y colaboro estrechamente con el equipo médico.',
                'Sigo con rigor los protocolos clínicos y de higiene, documento con precisión cada intervención y mantengo la calma en situaciones de urgencia.',
            ],
        },
        bullets: {
            de: [
                'In jeder Schicht rund [X] Patientinnen und Patienten auf der Station [Station] betreut.',
                'Medikamente verabreicht und Vitalzeichen nach Protokoll überwacht.',
                'Die Pflege im elektronischen Patientensystem genau dokumentiert.',
                'Patienten und Angehörige über Behandlung und häusliche Pflege informiert.',
                'Das Team bei Notfällen und kleineren Eingriffen unterstützt.',
                'An Schulungen zu Infektionsschutz und Erster Hilfe teilgenommen.',
            ],
            es: [
                'Atendí a unos [X] pacientes por turno en la planta de [planta].',
                'Administré medicación y controlé las constantes vitales según los protocolos.',
                'Documenté con precisión los cuidados en el sistema electrónico de historias clínicas.',
                'Informé a pacientes y familiares sobre el tratamiento y los cuidados en casa.',
                'Apoyé al equipo durante urgencias e intervenciones menores.',
                'Completé formación en control de infecciones y primeros auxilios.',
            ],
        },
        skills: {
            de: ['Patientenversorgung', 'Überwachung der Vitalzeichen', 'Medikamentengabe', 'Hygiene und Sterilisation', 'Erste Hilfe', 'Klinische Dokumentation', 'Empathie', 'Schichtarbeit'],
            es: ['Atención al paciente', 'Control de constantes vitales', 'Administración de medicación', 'Higiene y esterilización', 'Primeros auxilios', 'Documentación clínica', 'Empatía', 'Trabajo por turnos'],
        },
    },
    hospitality: {
        label: { de: 'Gastronomie und Tourismus', es: 'Hostelería y turismo' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung in Hotellerie und Gastronomie schaffe ich eine einladende Atmosphäre für Gäste und arbeite auch in der Hochsaison zügig.',
                'Ich spreche [Sprachen] mit internationalen Gästen, kenne Hygiene- und Servicestandards und arbeite unter Druck gut im Team.',
            ],
            es: [
                'Con [X] años de experiencia en hostelería y restauración, creo un ambiente acogedor para los clientes y trabajo con rapidez incluso en temporada alta.',
                'Hablo [idiomas] con clientes internacionales, conozco los estándares de higiene y servicio y trabajo bien en equipo bajo presión.',
            ],
        },
        bullets: {
            de: [
                'Pro Schicht bis zu [X] Gäste in einem Restaurant mit [X] Plätzen bedient.',
                'Check-in und Check-out für [X] Zimmer pro Tag an der Rezeption abgewickelt.',
                'Die Gästebewertungen auf [Plattform] von [X] auf [Y] verbessert.',
                'Gerichte nach Rezept und HACCP-Standards zubereitet.',
                'Saisonkräfte zu Speisekarte und Servicestandards geschult.',
                'Reservierungen und besondere Gästewünsche per E-Mail und Telefon bearbeitet.',
            ],
            es: [
                'Serví hasta [X] clientes por turno en un restaurante de [X] plazas.',
                'Gestioné el check-in y el check-out de [X] habitaciones al día en recepción.',
                'Aumenté las valoraciones de los clientes en [plataforma] de [X] a [Y].',
                'Preparé platos según recetas y estándares APPCC.',
                'Formé al personal de temporada sobre la carta y los estándares de servicio.',
                'Gestioné reservas y peticiones especiales de los clientes por correo y teléfono.',
            ],
        },
        skills: {
            de: ['Gästebetreuung', 'Rezeption', 'Service im Restaurant', 'HACCP', 'Buchungssysteme', 'Fremdsprachen', 'Teamarbeit', 'Belastbarkeit'],
            es: ['Atención al cliente', 'Recepción', 'Servicio de sala', 'APPCC', 'Sistemas de reservas', 'Idiomas', 'Trabajo en equipo', 'Trabajo bajo presión'],
        },
    },
    trades: {
        label: { de: 'Bau und Handwerk', es: 'Construcción y oficios técnicos' },
        summaries: {
            de: [
                'Ich habe [X] Jahre Erfahrung als [Beruf] auf Wohn- und Gewerbebaustellen. Ich arbeite sorgfältig, lese technische Zeichnungen und halte die Arbeitsschutzvorschriften ein.',
                'Ich kenne Materialien, Werkzeuge und Maschinen gut und erledige meine Arbeit termingerecht und in hoher Qualität, im Team oder selbstständig.',
            ],
            es: [
                'Tengo [X] años de experiencia como [oficio] en obras residenciales y comerciales. Trabajo con precisión, leo planos técnicos y cumplo las normas de seguridad laboral.',
                'Conozco bien los materiales, las herramientas y la maquinaria y termino el trabajo a tiempo y con calidad, en equipo o de forma autónoma.',
            ],
        },
        bullets: {
            de: [
                'An [X] Wohn- und Gewerbeprojekten mit bis zu [X] m² gearbeitet.',
                '[Elektro-/Sanitär-]Anlagen nach Norm installiert und gewartet.',
                'Technische Zeichnungen gelesen und die Materialmengen für jede Bauphase berechnet.',
                'Arbeiten [X] Tage vor dem Termin ohne Mehrkosten abgeschlossen.',
                'Ein Team von [X] Arbeitern geleitet und die tägliche Arbeit organisiert.',
                'Sicherheitsregeln eingehalten, ohne Arbeitsunfall in [X] Jahren.',
            ],
            es: [
                'Trabajé en [X] proyectos residenciales y comerciales de hasta [X] m².',
                'Instalé y mantuve instalaciones [eléctricas/de fontanería] conforme a la normativa.',
                'Leí planos técnicos y calculé las cantidades de material para cada fase.',
                'Terminé las obras [X] días antes del plazo sin costes adicionales.',
                'Dirigí un equipo de [X] operarios y organicé el trabajo diario.',
                'Cumplí las normas de seguridad, sin ningún accidente laboral en [X] años.',
            ],
        },
        skills: {
            de: ['Technische Zeichnungen lesen', 'Arbeitssicherheit', 'Elektroinstallation', 'Sanitärinstallation', 'Maschinenbedienung', 'Aufmaß und Kalkulation', 'Genauigkeit', 'Teamarbeit'],
            es: ['Lectura de planos técnicos', 'Seguridad laboral', 'Instalación eléctrica', 'Fontanería', 'Manejo de maquinaria', 'Mediciones y presupuestos', 'Precisión', 'Trabajo en equipo'],
        },
    },
    marketing: {
        label: { de: 'Marketing und Social Media', es: 'Marketing y redes sociales' },
        summaries: {
            de: [
                'Mit [X] Jahren Erfahrung im digitalen Marketing plane und steuere ich Social-Media-Kampagnen, die Reichweite, Interaktion und Umsatz steigern.',
                'Ich erstelle klare, ansprechende Inhalte, werte Ergebnisse anhand von Daten aus und passe Strategien an die Unternehmensziele an.',
            ],
            es: [
                'Con [X] años de experiencia en marketing digital, planifico y dirijo campañas en redes sociales que aumentan los seguidores, la interacción y las ventas.',
                'Creo contenidos claros y atractivos, analizo los resultados con datos y adapto las estrategias a los objetivos del negocio.',
            ],
        },
        bullets: {
            de: [
                'Die Instagram-Follower innerhalb von [X] Monaten von [X] auf [Y] gesteigert.',
                'Bezahlte Kampagnen mit einem Budget von [X] € pro Monat und dem [X]-fachen Ertrag betreut.',
                'Pro Monat [X] Beiträge, Videos und Grafiken erstellt.',
                'Die Öffnungsrate von E-Mails durch Segmentierung um [X] % erhöht.',
                'Ergebnisse in Google Analytics und Meta Business Suite ausgewertet und monatlich berichtet.',
                'Mit [X] Influencern bei der Einführung neuer Produkte zusammengearbeitet.',
            ],
            es: [
                'Aumenté los seguidores de Instagram de [X] a [Y] en [X] meses.',
                'Gestioné campañas de pago con un presupuesto de [X] € al mes y un retorno de [X] veces.',
                'Creé [X] publicaciones, vídeos y gráficos al mes.',
                'Aumenté un [X] % la tasa de apertura de los correos mediante segmentación.',
                'Analicé los resultados en Google Analytics y Meta Business Suite y elaboré informes mensuales.',
                'Colaboré con [X] influencers en el lanzamiento de nuevos productos.',
            ],
        },
        skills: {
            de: ['Meta Ads', 'Google Ads', 'Content-Erstellung', 'Canva', 'Google Analytics', 'SEO', 'Copywriting', 'Kampagnenplanung'],
            es: ['Meta Ads', 'Google Ads', 'Creación de contenidos', 'Canva', 'Google Analytics', 'SEO', 'Copywriting', 'Planificación de campañas'],
        },
    },
    logistics: {
        label: { de: 'Transport und Logistik', es: 'Transporte y logística' },
        summaries: {
            de: [
                'Ich habe [X] Jahre Erfahrung in Transport und Logistik, einen Führerschein der Klasse [Klasse] und gute Ortskenntnis in [Region]. Ich liefere Waren pünktlich und in einwandfreiem Zustand aus.',
                'Ich organisiere Verladung, Lagerung und Versandpapiere genau und halte Verkehrs- und Sicherheitsvorschriften ein.',
            ],
            es: [
                'Tengo [X] años de experiencia en transporte y logística, carné de conducir de la categoría [categoría] y buen conocimiento de las carreteras de [zona]. Entrego la mercancía a tiempo y en buen estado.',
                'Organizo la carga, el almacenaje y la documentación de envío con precisión y cumplo las normas de circulación y seguridad.',
            ],
        },
        bullets: {
            de: [
                'Durchschnittlich [X] Lieferungen pro Tag mit einer Genauigkeit von [X] % ausgeführt.',
                'Routen geplant und den Kraftstoffverbrauch um [X] % gesenkt.',
                'Einen Lagerbestand von mehr als [X] Artikeln im System [System] verwaltet.',
                'Waren mit dem Gabelstapler unter Beachtung der Sicherheitsregeln be- und entladen.',
                'Transport- und Zolldokumente fehlerfrei erstellt.',
                'Mehr als [X] km ohne Unfall zurückgelegt.',
            ],
            es: [
                'Realicé una media de [X] entregas al día con una precisión del [X] %.',
                'Planifiqué rutas y reduje el consumo de combustible un [X] %.',
                'Gestioné un almacén con más de [X] artículos en el sistema [sistema].',
                'Cargué y descargué mercancía con carretilla elevadora cumpliendo las normas de seguridad.',
                'Preparé documentos de transporte y aduanas sin errores.',
                'Conduje más de [X] km sin accidentes.',
            ],
        },
        skills: {
            de: ['Führerschein Klasse [X]', 'Gabelstapler', 'Lagerverwaltung', 'Routenplanung', 'Transportdokumente', 'Pünktlichkeit', 'Verkehrssicherheit', 'Selbstständiges Arbeiten'],
            es: ['Carné de la categoría [X]', 'Carretilla elevadora', 'Gestión de almacén', 'Planificación de rutas', 'Documentos de transporte', 'Puntualidad', 'Seguridad vial', 'Trabajo autónomo'],
        },
    },
    student: {
        label: { de: 'Studium oder erster Job', es: 'Estudiante o primer empleo' },
        summaries: {
            de: [
                'Im [X]. Studienjahr [Fachrichtung] an der [Hochschule] suche ich ein Praktikum oder einen ersten Job, in dem ich mein Wissen anwenden und von erfahrenen Fachleuten lernen kann.',
                'Ich habe Erfahrung aus Hochschulprojekten, ehrenamtlichem Engagement und Saisonjobs. Ich lerne schnell, arbeite gern im Team und nehme Aufgaben und Fristen ernst.',
            ],
            es: [
                'En el [X] curso de [estudios] en [universidad], busco unas prácticas o un primer empleo en el que aplicar mis conocimientos y aprender de profesionales con experiencia.',
                'Tengo experiencia de proyectos universitarios, voluntariado y trabajos de temporada. Aprendo rápido, trabajo bien en equipo y me tomo en serio las tareas y los plazos.',
            ],
        },
        bullets: {
            de: [
                'Das Projekt [Name] im Rahmen des Moduls [Modul] umgesetzt, Note [X].',
                'Im Sommer als [Rolle] gearbeitet und durchschnittlich [X] Kunden pro Tag bedient.',
                'An der Organisation von [Veranstaltung] mit mehr als [X] Teilnehmenden mitgewirkt.',
                'Den Kurs [Kurs] abgeschlossen und das Zertifikat [Zertifikat] erhalten.',
                'Meine Arbeit zum Thema [Thema] vor [X] Studierenden und Lehrenden präsentiert.',
                'In einem Team von [X] Studierenden gearbeitet, um das Projekt termingerecht abzuschließen.',
            ],
            es: [
                'Realicé el proyecto [nombre] dentro de la asignatura [asignatura], con una nota de [X].',
                'Trabajé como [puesto] durante el verano, atendiendo a una media de [X] clientes al día.',
                'Participé en la organización de [evento] con más de [X] asistentes.',
                'Completé el curso [curso] y obtuve el certificado [certificado].',
                'Presenté mi trabajo sobre [tema] ante [X] estudiantes y profesores.',
                'Trabajé en un equipo de [X] estudiantes para terminar el proyecto en plazo.',
            ],
        },
        skills: {
            de: ['Microsoft Office', 'Kommunikation', 'Teamarbeit', 'Schnelle Auffassungsgabe', 'Zeitmanagement', 'Englisch', 'Präsentation', 'Recherche und Analyse'],
            es: ['Microsoft Office', 'Comunicación', 'Trabajo en equipo', 'Aprendizaje rápido', 'Gestión del tiempo', 'Inglés', 'Presentaciones', 'Investigación y análisis'],
        },
    },
};

export const VERBS_DE_ES = {
    de: ['Geleitet', 'Entwickelt', 'Organisiert', 'Gesteigert', 'Gesenkt', 'Verbessert', 'Erstellt', 'Verwaltet', 'Koordiniert', 'Geschult', 'Analysiert', 'Eingeführt', 'Verhandelt', 'Gelöst', 'Automatisiert', 'Präsentiert', 'Aufgebaut', 'Optimiert', 'Unterstützt', 'Erreicht'],
    es: ['Dirigí', 'Desarrollé', 'Organicé', 'Aumenté', 'Reduje', 'Mejoré', 'Creé', 'Gestioné', 'Coordiné', 'Formé', 'Analicé', 'Lancé', 'Negocié', 'Resolví', 'Automaticé', 'Presenté', 'Construí', 'Optimicé', 'Apoyé', 'Logré'],
};
