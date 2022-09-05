window.importStaticConfigJsonP = `{
    "staticPDocsFile": "assets/staticdata/static.mytbpdocs.js",
    "staticTDocsFiles": [
            "assets/staticdata/static.mytbtdocs_chunk0.js",
            "assets/staticdata/static.mytbtdocs_chunk1.js"
    ],
    "tracksBaseUrl": "assets/staticdata/tracks/",
    "picsBaseUrl": "assets/staticdata/",
    "videoBaseUrl": "assets/staticdata/",
    "components": {
        "cdoc-linked-playlists": {
            "showAvailable": true
        },
        "tdoc-keywords": {
            "possiblePrefixes": ["KW_", "", "kw_"],
            "structuredKeywords": [
                {"name": "Todos",
                    "keywords": ["TODOKEYWORDS"]},
                {"name": "Tourdauer",
                    "keywords": [
                        "Kurztour",
                        "Mehrtagestour",
                        "Tagestour"]},
                {"name": "Aktivität",
                    "keywords": [
                        "Alpinklettern", "Autofahrt",
                        "Baden", "Besichtigung", "Boofen", "Bootfahren", "Bouldern",
                        "Campen",
                        "Fliegen",
                        "Gassi", "Gletscherbegehung",
                        "Hochtour",
                        "Kanu", "Klettern", "Klettersteig",
                        "Museumsbesuch",
                        "Radfahren", "Rodeln",
                        "Sachsenklettern", "Schneeschuhwandern", "Skaten", "Skilanglauf", "Spaziergang", "Sportklettern", "Stadtbesichtigung",
                        "Wandern", "Wanderung", "Wildwasserschwimmen"]},
                {"name": "Veranstaltung",
                    "keywords": [
                        "Ausstellung",
                        "Konzert",
                        "Messe",
                        "Party"]},
                {"name": "Kultur",
                    "keywords": [
                        "Architektur",
                        "Burg",
                        "Denkmal", "Dom",
                        "Geschichte",
                        "Kirche", "Kunst",
                        "Museum",
                        "Park",
                        "Schloss",
                        "Technik",
                        "Zoo"]},
                {"name": "Landschaft",
                    "keywords": [
                        "Dorf",
                        "Kulturlandschaft",
                        "Landschaft",
                        "Natur", "Naturlandschaft",
                        "Stadt"
                    ]},
                {"name": "Leben",
                    "keywords": [
                        "Bäume", "Blumen",
                        "Fische",
                        "Menschen",
                        "Tiere"]},
                {"name": "Flachland",
                    "keywords": [
                        "Aue",
                        "Feld",
                        "Heide",
                        "Steppe",
                        "Wald", "Wiese"
                    ]},
                {"name": "Gebirge",
                    "keywords": [
                        "Alm",
                        "Berge",
                        "Felsen", "Felswand", "Firn",
                        "Gletscherschau",
                        "Hochgebirge",
                        "Höhle",
                        "Mittelgebirge",
                        "Schlucht", "Schneefelder",
                        "Tal"
                    ]},
                {"name": "Wasser",
                    "keywords": [
                        "Bach",
                        "Fluss",
                        "Meer", "Moor",
                        "Ozean",
                        "Sandstrand", "See", "Seenlandschaft", "Steilküste", "Steinstrand",
                        "Teich",
                        "Wasserfall"
                    ]},
                {"name": "Location",
                    "keywords": [
                        "Garten",
                        "Halle",
                        "Indoor",
                        "Wohnung",
                        "Zimmer"
                    ]},
                {"name": "Jahreszeit",
                    "keywords": [
                        "Frühling",
                        "Herbst",
                        "Sommer",
                        "Winter"
                    ]},
                {"name": "Wetter",
                    "keywords": [
                        "bedeckt",
                        "Eis",
                        "heiter",
                        "Mond",
                        "Nacht",
                        "Regen", "Regenbogen",
                        "Schnee", "Sonne", "Sonnenaufgang", "Sonnenuntergang", "sonnig", "Sterne"
                    ]}
            ],
            "blacklist": ["TODOKEYWORDS", "OFFEN", "Mom", "Pa", "Micha"]
        },
        "tdoc-persontags": {
            "possiblePrefixes": ["KW_", "", "kw_", "Pers_"],
            "structuredKeywords": [
                {"name": "mit Freunden",
                    "keywords": ["Freund1", "Freund2"]},
                {"name": "mit Familie",
                    "keywords": ["Micha", "Ich", "Frau", "Mann"]},
                {"name": "mit Hundis",
                    "keywords": ["Harry", "Buddy"]}
            ],
            "blacklist": []
        },
        "tdoc-actions": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "\u2764 local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current"
                    },
                    "showFilter": [
                        {
                            "property": "localalbum",
                            "command": "CSVIN",
                            "expectedValues": ["Current"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["IMAGE", "image", "VIDEO", "video", "LOCATION", "location", "TRACK", "track", "ROUTE", "route", "TRIP", "trip", "NEWS", "news", "INFO", "info"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "tdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                }
            ]
        },
        "tdoc-multiactionheader": {
            "actionTags": [
                {
                    "key": "local_album_current",
                    "type": "albumtag",
                    "name": "\u2764 set local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": true
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                        {
                            "property": "type",
                            "command": "NEQ",
                            "expectedValues": ["albumpage"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["IMAGE", "image", "VIDEO", "video", "LOCATION", "location", "TRACK", "track", "ROUTE", "route", "TRIP", "trip", "NEWS", "news", "INFO", "info"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "tdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                },
                {
                    "key": "unset_local_album_current",
                    "type": "albumtag",
                    "name": "\uD83D\uDC94 unset local Album",
                    "shortName": "&#x2764",
                    "payload": {
                        "albumkey": "Current",
                        "set": false
                    },
                    "showFilter": [
                    ],
                    "profileAvailability": [
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["IMAGE", "image", "VIDEO", "video", "LOCATION", "location", "TRACK", "track", "ROUTE", "route", "TRIP", "trip", "NEWS", "news", "INFO", "info"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "tdocMaxItemsPerAlbum",
                            "command": "GE",
                            "expectedValues": [10]
                        }
                    ]
                }
            ]
        },
        "tdoc-searchpage": {
        },
        "tdoc-showpage": {
            "showBigImages": false,
            "allowedQueryParams": [],
            "availableTabs": {
                "ALL_ENTRIES": true,
                "IMAGE": true,
                "INFO": true,
                "ODIMGOBJECT": true,
                "DESTINATION": true,
                "ROUTE": true,
                "TRACK": true,
                "LOCATION": true,
                "TRIP": true,
                "NEWS": true,
                "PLAYLIST": true,
                "VIDEO": true
            }
        },
        "tdoc-albumpage": {
            "allowAutoplay": false,
            "m3uAvailable": true
        },
        "cdoc-listheader": {
            "allowAutoplay": false
        },
        "pdoc-sectionpage": {
            "availableTabs": {
                "DESTINATION": true,
                "IMAGE": true,
                "INFO": true,
                "ROUTE": true,
                "TRACK": true,
                "LOCATION": true,
                "TRIP": true,
                "PLAYLIST": true,
                "ALL": true
            }
        },
        "cdoc-odobjectdetails": {
            "defaultShowKeyAsTooltip": true,
            "defaultFilterForNameToShowNameAndKey": ["bla", "Defa.*", "Default"]
        },
        "cdoc-extended-object-properties":  {
            "allowedExtendedObjectProperties": {
                "list-item-flat-big": ["IMAGE_COUNT", "IMAGE_TOP_COUNT", "IMAGE_FAV_COUNT", "VIDEO_COUNT", "ADDITIONAL_ROUTE_COUNT", "TRACK_COUNT", "ROUTE_COUNT", "TRIP_COUNT", "NEWS_COUNT", "INFO_COUNT", "LOCATION_COUNT"],
                "show-big": ["IMAGE_COUNT", "IMAGE_TOP_COUNT", "IMAGE_FAV_COUNT", "VIDEO_COUNT", "ADDITIONAL_ROUTE_COUNT", "TRACK_COUNT", "ROUTE_COUNT", "TRIP_COUNT", "NEWS_COUNT", "INFO_COUNT", "LOCATION_COUNT"]
            },
            "modes": {
                "list-item-flat-big": "short",
                "show-big": "long"
            }
        }
    },
    "services": {
        "seo": {
            "tdocIndexableTypes": [
                "INFO",
                "ROUTE",
                "LOCATION",
                "NEWS"
            ]
        }
    }
}
`;
