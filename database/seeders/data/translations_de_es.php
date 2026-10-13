<?php

/*
 * German and Spanish versions of the default FAQ entries and CV template
 * names/descriptions. Used by FaqSeeder and CvTemplateSeeder: the values only
 * fill empty columns, so anything the owner has edited is never overwritten.
 */
return [

    // Keyed by the Albanian question, which identifies a default FAQ entry.
    'faqs' => [
        'A është Krijo CV falas?' => [
            'question_de' => 'Ist Krijo CV kostenlos?',
            'answer_de' => 'Ja, völlig kostenlos. Es sind weder Anmeldung noch Abo oder Zahlung nötig, und der heruntergeladene Lebenslauf enthält keine Werbung und keine Wasserzeichen.',
            'question_es' => '¿Krijo CV es gratis?',
            'answer_es' => 'Sí, completamente gratis. No hace falta registro, suscripción ni pago, y el CV descargado no lleva anuncios ni marcas de agua.',
        ],
        'Ku ruhen të dhënat e mia?' => [
            'question_de' => 'Wo werden meine Daten gespeichert?',
            'answer_de' => 'Deine Lebenslaufdaten und dein Foto bleiben in deinem Browser und werden nicht an den Server gesendet. Wenn du „Automatisch auf diesem Gerät speichern“ aktivierst, wird das Projekt nur im lokalen Speicher dieses Browsers abgelegt.',
            'question_es' => '¿Dónde se guardan mis datos?',
            'answer_es' => 'Los datos de tu CV y la foto permanecen en tu navegador y no se envían al servidor. Si activas «Guardar automáticamente en este dispositivo», el proyecto se guarda solo en el almacenamiento local de este navegador.',
        ],
        'Si mund të vazhdoj punën në një pajisje tjetër?' => [
            'question_de' => 'Wie kann ich auf einem anderen Gerät weiterarbeiten?',
            'answer_de' => 'Lade das Projekt mit der Schaltfläche „Projekt speichern“ herunter (eine .cv.json-Datei) und importiere es auf dem anderen Gerät mit „Projekt importieren“. Projekte werden nicht online synchronisiert, also bewahre die Datei auf.',
            'question_es' => '¿Cómo puedo continuar en otro dispositivo?',
            'answer_es' => 'Descarga el proyecto con el botón «Guardar proyecto» (un archivo .cv.json) e impórtalo en el otro dispositivo con «Importar proyecto». Los proyectos no se sincronizan en línea, así que conserva el archivo.',
        ],
        'Çfarë formati ka CV-ja e shkarkuar?' => [
            'question_de' => 'Welches Format hat der heruntergeladene Lebenslauf?',
            'answer_de' => 'A4-PDF mit auswählbarem und durchsuchbarem Text, anklickbaren Links für E-Mail, Telefon und Portfolio sowie Schriften, die Sonderzeichen wie ë, ç, ä und ö unterstützen.',
            'question_es' => '¿Qué formato tiene el CV descargado?',
            'answer_es' => 'PDF en formato A4 con texto seleccionable y con capacidad de búsqueda, enlaces clicables para correo, teléfono y portafolio, y tipos de letra que admiten caracteres como ë, ç y ñ.',
        ],
        'A mund ta ndryshoj modelin pasi kam plotësuar të dhënat?' => [
            'question_de' => 'Kann ich die Vorlage ändern, nachdem ich meine Daten eingegeben habe?',
            'answer_de' => 'Ja. Beim Wechsel der Vorlage wird nichts gelöscht: Alle Daten, das Foto und die Akzentfarbe bleiben erhalten und erscheinen in der neuen Vorlage.',
            'question_es' => '¿Puedo cambiar de plantilla después de rellenar mis datos?',
            'answer_es' => 'Sí. Cambiar de plantilla no borra nada: todos los datos, la foto y el color de acento se conservan y se muestran en la nueva plantilla.',
        ],
        'A duhet të jap datëlindjen apo adresën e plotë?' => [
            'question_de' => 'Muss ich mein Geburtsdatum oder meine vollständige Adresse angeben?',
            'answer_de' => 'Nein. Krijo CV verlangt weder Geburtsdatum noch Geschlecht, Personalausweisnummer oder vollständige Adresse. Stadt und Land genügen für einen modernen Lebenslauf.',
            'question_es' => '¿Tengo que indicar mi fecha de nacimiento o mi dirección completa?',
            'answer_es' => 'No. Krijo CV no pide fecha de nacimiento, género, número de identidad ni dirección completa. La ciudad y el país bastan para un CV moderno.',
        ],
        'A mund të shkruaj edhe një letër motivimi?' => [
            'question_de' => 'Kann ich auch ein Anschreiben verfassen?',
            'answer_de' => 'Ja. Im Schritt „Anschreiben“ schreibst du das Anschreiben im selben Projekt. Es übernimmt Name, Kontakte, Farbe und Schrift deines Lebenslaufs und wird als separate PDF heruntergeladen.',
            'question_es' => '¿Puedo escribir también una carta de presentación?',
            'answer_es' => 'Sí. El paso «Carta» te permite escribir la carta de presentación en el mismo proyecto. Toma el nombre, los contactos, el color y el tipo de letra de tu CV y se descarga como un PDF aparte.',
        ],
        'Në cilat gjuhë mund ta krijoj CV-në?' => [
            'question_de' => 'In welchen Sprachen kann ich meinen Lebenslauf erstellen?',
            'answer_de' => 'Oberfläche und Dokument gibt es auf Albanisch, Englisch, Italienisch, Deutsch und Spanisch. Die Sprache des Lebenslaufs wählst du im ersten Schritt; sie übersetzt Abschnittsüberschriften und Bezeichnungen im PDF, die Texte, die du schreibst, bleiben unverändert.',
            'question_es' => '¿En qué idiomas puedo crear mi CV?',
            'answer_es' => 'La interfaz y el documento están disponibles en albanés, inglés, italiano, alemán y español. El idioma del CV se elige en el primer paso y traduce los títulos de las secciones y las etiquetas del PDF; los textos que escribes se quedan como los has escrito.',
        ],
    ],

    // Keyed by template slug.
    'templates' => [
        'minimal' => [
            'name_de' => 'Minimal',
            'name_es' => 'Minimalista',
            'description_de' => 'Eine Spalte, schwarz-weiß, großer Name und schlichte Trennlinien zwischen den Abschnitten.',
            'description_es' => 'Una columna, en blanco y negro, nombre grande y separadores sencillos entre las secciones.',
        ],
        'modern' => [
            'name_de' => 'Modern',
            'name_es' => 'Moderna',
            'description_de' => 'Seitenleiste links für Kontakte und Fähigkeiten, Hauptinhalt rechts.',
            'description_es' => 'Barra lateral a la izquierda para contactos y habilidades, contenido principal a la derecha.',
        ],
        'professional' => [
            'name_de' => 'Professionell',
            'name_es' => 'Profesional',
            'description_de' => 'Kopfbereich in voller Breite, darunter ein Zweispaltenlayout im Verhältnis 65/35 für Erfahrung und Details.',
            'description_es' => 'Cabecera a todo el ancho seguida de un diseño de dos columnas 65/35 para experiencia y detalles.',
        ],
        'executive' => [
            'name_de' => 'Führungskraft',
            'name_es' => 'Ejecutiva',
            'description_de' => 'Eine Spalte mit Serifenschrift, großzügigen Abständen und Betonung der Berufserfahrung.',
            'description_es' => 'Una columna con tipografía serif, espaciado generoso y énfasis en la experiencia profesional.',
        ],
        'creative' => [
            'name_de' => 'Kreativ',
            'name_es' => 'Creativa',
            'description_de' => 'Rundes Foto im Kopfbereich, klar getrennte Inhaltsblöcke und Fähigkeiten in einem kompakten Raster.',
            'description_es' => 'Foto circular en la cabecera, bloques de contenido diferenciados y habilidades en una cuadrícula compacta.',
        ],
        'academic' => [
            'name_de' => 'Akademisch',
            'name_es' => 'Académica',
            'description_de' => 'Zuerst die Ausbildung, danach Forschung, Publikationen und Berufserfahrung.',
            'description_es' => 'Primero la formación, seguida de investigación, publicaciones y experiencia profesional.',
        ],
        'student' => [
            'name_de' => 'Student',
            'name_es' => 'Estudiante',
            'description_de' => 'Profil, Ausbildung, Projekte, Praktika, ehrenamtliches Engagement und Fähigkeiten, in dieser Reihenfolge.',
            'description_es' => 'Perfil, formación, proyectos, prácticas, voluntariado y habilidades, en ese orden.',
        ],
        'technology' => [
            'name_de' => 'Technologie',
            'name_es' => 'Tecnología',
            'description_de' => 'Hervorgehobene Projekte und Portfolio-Links, gruppierte technische Fähigkeiten und klare Berufserfahrung.',
            'description_es' => 'Proyectos y enlaces al portafolio destacados, habilidades técnicas agrupadas y experiencia clara.',
        ],
        'european' => [
            'name_de' => 'Europäisch',
            'name_es' => 'Europea',
            'description_de' => 'Daten und Abschnittsbezeichnungen in einer schmalen linken Spalte, Beschreibungen in einer breiteren rechten Spalte.',
            'description_es' => 'Fechas y títulos de sección en una columna estrecha a la izquierda, descripciones en una columna más ancha a la derecha.',
        ],
        'compact' => [
            'name_de' => 'Kompakt',
            'name_es' => 'Compacta',
            'description_de' => 'Platzsparende Abstände für kürzere Lebensläufe; bei langem Inhalt läuft der Text auf weitere Seiten.',
            'description_es' => 'Espaciado eficiente para CV más breves; continúa en páginas adicionales cuando el contenido es largo.',
        ],
        'elegant' => [
            'name_de' => 'Elegant',
            'name_es' => 'Elegante',
            'description_de' => 'Farbiges linkes Seitenfeld mit rundem Foto, Kontakte mit Symbolen und Fähigkeiten; Name und Überschriften in Serifenschrift mit Akzentbalken.',
            'description_es' => 'Panel de color a la izquierda con foto redonda, contactos con iconos y habilidades; nombre y títulos en serif con barras de acento.',
        ],
        'timeline' => [
            'name_de' => 'Zeitleiste',
            'name_es' => 'Cronológica',
            'description_de' => 'Erfahrung und Ausbildung auf einer senkrechten Zeitleiste mit Punkten, Kontakte mit Symbolen und Fähigkeiten als Tags.',
            'description_es' => 'Experiencia y formación en una línea de tiempo vertical con puntos, contactos con iconos y habilidades como etiquetas.',
        ],
        'bold' => [
            'name_de' => 'Markant',
            'name_es' => 'Audaz',
            'description_de' => 'Dunkler Kopfbereich in voller Breite mit Akzentstreifen, farbige Überschriften-Etiketten und Stufenbalken für Sprachen.',
            'description_es' => 'Cabecera oscura a todo el ancho con franja de acento, títulos con etiqueta de color y barras de nivel para los idiomas.',
        ],
        'duotone' => [
            'name_de' => 'Zweifarbig',
            'name_es' => 'Bicolor',
            'description_de' => 'Kopfbereich in zwei Farbblöcken, kurze Akzentbalken unter den Überschriften und Stufenbalken für Fähigkeiten.',
            'description_es' => 'Cabecera dividida en dos bloques de color, breves barras de acento bajo los títulos y barras de nivel para las habilidades.',
        ],
        'monogram' => [
            'name_de' => 'Monogramm',
            'name_es' => 'Monograma',
            'description_de' => 'Medaillon in der Mitte (Foto oder Initialen), zentrierter Name und Inhalt in zwei gleich breiten Spalten.',
            'description_es' => 'Medallón en el centro (foto o iniciales), nombre centrado y contenido en dos columnas iguales.',
        ],
    ],
];
