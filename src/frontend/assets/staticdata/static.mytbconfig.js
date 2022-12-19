window.importStaticConfigJsonP = `{
    "skipMediaCheck": false,
    "staticPDocsFile": "assets/staticdata/static.mytbpdocs.js",
    "staticTDocsFiles": [
            "assets/staticdata/static.mytbtdocs_searchresult.js",
            "assets/staticdata/samples-static.mytbtdocs_images_export_chunk0.js",
            "assets/staticdata/samples-static.mytbtdocs_videos_export_chunk0.js"
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
                    "keywords": ["TODOKEYWORDS", "TODOPOISTART", "TODOPOIMAIN", "TODOPOIEND"]},
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
                    ]},
                {"name": "POI",
                    "keywords": [
                        "SOURCE_mytb",
                        "SOURCE_openstreetmap",
                        "SOURCE_GeoJson",

                        "aerialway_station",
                        "amenity_alp",
                        "amenity_bar",
                        "amenity_bbq",
                        "amenity_bench",
                        "amenity_biergarten",
                        "amenity_boat_rental",
                        "amenity_cafe",
                        "amenity_clubhouse",
                        "amenity_drinking_water",
                        "amenity_exhibition_centre",
                        "amenity_fast_food",
                        "amenity_fast_foodtoilets",
                        "amenity_fountain",
                        "amenity_grave_yard",
                        "amenity_hunting_stand",
                        "amenity_internet_access_yes",
                        "amenity_mountain_rescue",
                        "amenity_peak",
                        "amenity_place_of_worship",
                        "amenity_pub",
                        "amenity_public_bath",
                        "amenity_restaurant",
                        "amenity_restaurantbar",
                        "amenity_restaurantcafe",
                        "amenity_shelter",
                        "amenity_ski_school",
                        "amenity_toilets",
                        "amenity_townhall",
                        "amenity_watering_place",
                        "climbing_crag",
                        "climbing_no",
                        "climbing_prohibited",
                        "climbing_route_bottom",
                        "climbing_route_top",
                        "climbing_sport_climbing",
                        "climbing_trad_climbing",
                        "climbing_yes",
                        "condition_dormant",
                        "man_made_adit",
                        "man_made_antenna",
                        "man_made_beacon",
                        "man_made_borderstone",
                        "man_made_boundary_stone",
                        "man_made_cairn",
                        "man_made_campanile",
                        "man_made_cross",
                        "man_made_flagpole",
                        "man_made_guy_wire",
                        "man_made_mast",
                        "man_made_pole",
                        "man_made_reservoir",
                        "man_made_reservoir_covered",
                        "man_made_summit",
                        "man_made_summit_cross",
                        "man_made_survey_point",
                        "man_made_survey_pointcairn",
                        "man_made_tower",
                        "man_made_water_works",
                        "man_made_wayside_cross",
                        "man_made_yes",
                        "mountain_pass_no",
                        "mountain_pass_yes",
                        "natural_cave_entrance",
                        "natural_col",
                        "natural_glacier",
                        "natural_pass",
                        "natural_peak",
                        "natural_rock",
                        "natural_saddle",
                        "natural_water",
                        "place_city",
                        "place_hamlet",
                        "place_isolated_dwelling",
                        "place_locality",
                        "place_suburb",
                        "place_town",
                        "place_village",
                        "place_yes",
                        "sport_climbing",
                        "sport_free_flying",
                        "sport_ice_skating",
                        "sport_no",
                        "sport_scuba_diving",
                        "sport_skiing",
                        "sport_swimming",
                        "sport_swimmingfishing",
                        "sport_swimmingscuba_diving",
                        "sport_yoga",
                        "surface_asphalt",
                        "surface_concrete",
                        "surface_ground",
                        "surface_scree",
                        "surface_wood",
                        "tourism_alpine_hut",
                        "tourism_artwork",
                        "tourism_attraction",
                        "tourism_information",
                        "tourism_Luftkurort",
                        "tourism_picnic_site",
                        "tourism_pointview",
                        "tourism_register",
                        "tourism_viewpoint",
                        "tourism_viewpointguestbook",
                        "tourism_viewpointpicnic_site",
                        "tourism_yes"
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
                    "key": "link_download_image_static",
                    "type": "link",
                    "name": "Download Image Static",
                    "shortName": "\uD83D\uDCE5",
                    "payload": {
                        "url": "./pics_full/{{id}}",
                        "target": "download",
                        "replacements": {
                            "id": "record.tdocimages[0].fileName"
                        }
                    },
                    "showFilter": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["show_only_on_popup"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["IMAGE", "image"]
                        }
                    ],
                    "configAvailability": [
                    ]
                },
                {
                    "key": "link_download_video_static",
                    "type": "link",
                    "name": "Download Video Static",
                    "shortName": "\uD83D\uDCE5",
                    "payload": {
                        "url": "./video_full/{{id}}",
                        "target": "download",
                        "replacements": {
                            "id": "record.tdocvideos[0].fileName"
                        }
                    },
                    "showFilter": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["show_only_on_popup"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["VIDEO", "video"]
                        }
                    ],
                    "configAvailability": [
                    ]
                },
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
            "defaultLayoutPerType": {
                "ALL": "FLAT",
                "ALL_ENTRIES": "FLAT",
                "IMAGE": "BIG",
                "INFO": "FLAT",
                "ODIMGOBJECT": "BIG",
                "DESTINATION": "FLAT",
                "ROUTE": "FLAT",
                "TRACK": "FLAT",
                "LOCATION": "BIG",
                "TRIP": "BIG",
                "NEWS": "BIG",
                "PLAYLIST": "FLAT",
                "POI": "FLAT",
                "VIDEO": "BIG"
            }
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
                "VIDEO": true,
                "POI": true
            }
        },
        "tdoc-albumpage": {
            "allowAutoplay": true,
            "m3uAvailable": true
        },
        "cdoc-listheader": {
            "allowAutoplay": true
        },
        "pdoc-sectionpage": {
            "pageContainerOrder": [
                "contentContainer",
                "topTenContainer",
                "tagcloudContainer"
            ],
            "bestMatchingTabsOrder": [
                "TRIP",
                "TRACK",
                "IMAGE",
                "VIDEO",
                "ROUTE",
                "DESTINATION",
                "LOCATION",
                "POI",
                "INFO",
                "PLAYLIST",
                "ALL"
            ],
            "favoritesTabsOrder": [
                "IMAGE",
                "VIDEO",
                "TRACK",
                "ROUTE",
                "DESTINATION",
                "ALL"
            ],
            "availableTabs": {
                "DESTINATION": true,
                "IMAGE": true,
                "INFO": true,
                "ROUTE": true,
                "TRACK": true,
                "LOCATION": true,
                "TRIP": true,
                "PLAYLIST": true,
                "POI": true,
                "VIDEO": true,
                "ALL": true
            }
        },
        "cdoc-odobjectdetails": {
            "defaultShowKeyAsTooltip": true,
            "defaultFilterForNameToShowNameAndKey": ["bla", "Defa.*", "Default"]
        },
        "cdoc-extended-object-properties":  {
            "allowedExtendedObjectProperties": {
                "list-item-flat-big": ["IMAGE_COUNT", "IMAGE_TOP_COUNT", "IMAGE_FAV_COUNT", "VIDEO_COUNT", "ADDITIONAL_ROUTE_COUNT", "TRACK_COUNT", "ROUTE_COUNT", "TRIP_COUNT", "NEWS_COUNT", "INFO_COUNT", "LOCATION_COUNT", "POI_COUNT"],
                "show-big": ["IMAGE_COUNT", "IMAGE_TOP_COUNT", "IMAGE_FAV_COUNT", "VIDEO_COUNT", "ADDITIONAL_ROUTE_COUNT", "TRACK_COUNT", "ROUTE_COUNT", "TRIP_COUNT", "NEWS_COUNT", "INFO_COUNT", "LOCATION_COUNT", "POI_COUNT"]
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

var script = document.createElement('script');
script.type='application/json';
script.id = 'assets/staticdata/static.mytbconfig.js';
var text = document.createTextNode(importStaticConfigJsonP);
script.appendChild(text);
document.head.appendChild(script);
