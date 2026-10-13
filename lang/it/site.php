<?php

/*
 * Valori predefiniti in italiano dei testi gestiti dal proprietario. Il
 * proprietario può sostituirli nel pannello di amministrazione (salvati come
 * impostazioni "<chiave>.it"); i valori in albanese sono in
 * App\Support\SiteSettings::DEFAULTS e nel database.
 */
return [
    'site' => [
        'headline' => 'Il tuo CV, pronto per candidarti.',
        'description' => 'Compila i dati, scegli il modello e scarica gratis il tuo CV.',
        'meta_description' => 'Crea un CV gratis online: compila i dati, scegli uno dei modelli e scaricalo in PDF. Senza registrazione, i tuoi dati restano nel tuo browser.',
    ],
    'footer' => [
        'text' => 'Creato da',
    ],
    'privacy' => [
        'text' => "Krijo CV è un servizio gratuito che funziona interamente nel tuo browser.\n\nI dati che scrivi nel CV (nome, contatti, esperienza, formazione, competenze e così via) e la tua foto non vengono inviati al nostro server e non vengono salvati in alcun database. Il PDF viene creato dal tuo browser e scaricato direttamente sul tuo dispositivo.\n\nSe attivi “Salva automaticamente su questo dispositivo”, il progetto (foto inclusa) viene salvato solo nella memoria locale del browser (IndexedDB) su questo dispositivo. Non viene sincronizzato online e puoi eliminarlo in qualsiasi momento con “Elimina i dati da questo dispositivo”. Per continuare su un altro dispositivo, scarica il file del progetto (.cv.json) e importalo lì.\n\nIl sito non usa servizi di analisi di terze parti e non imposta cookie di tracciamento. Caratteri, script e altre risorse sono serviti dal sito stesso.\n\nIl pannello di amministrazione è usato solo dal proprietario del sito per gestire testi, domande frequenti e modelli; non ha accesso al CV di alcun visitatore.",
    ],
];
