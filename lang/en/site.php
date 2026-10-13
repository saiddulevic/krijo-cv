<?php

/*
 * English defaults for the owner-managed site texts. The owner can override
 * any of them in the admin panel (stored as "<key>.en" settings); Albanian
 * values live in App\Support\SiteSettings::DEFAULTS and the database.
 */
return [
    'site' => [
        'headline' => 'Your CV, ready to apply.',
        'description' => 'Fill in your details, choose a template and download your CV for free.',
        'meta_description' => 'Create a free CV online: fill in your details, choose one of the templates and download it as a PDF. No sign-up, your data stays in your browser.',
    ],
    'footer' => [
        'text' => 'Created by',
    ],
    'privacy' => [
        'text' => "Krijo CV is a free service that runs entirely in your browser.\n\nThe data you type into your CV (name, contacts, experience, education, skills and so on) and your photo are not sent to our server and are not stored in any database. The PDF is created by your browser and downloaded straight to your device.\n\nIf you turn on “Save automatically on this device”, the project (including the photo) is stored only in your browser’s local storage (IndexedDB) on this device. It is not synchronised online and you can delete it at any time with “Delete data from this device”. To continue on another device, download the project file (.cv.json) and import it there.\n\nThe site does not use third-party analytics services and does not set tracking cookies. Fonts, scripts and other resources are served by this site itself.\n\nThe admin panel is used only by the site owner to manage the texts, FAQ and templates; it has no access to any visitor’s CV.",
    ],
];
