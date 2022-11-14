--
-- clean data
--

-- remove location OFFEN
UPDATE location SET l_parent_id = NULL WHERE l_parent_id = 1;
UPDATE trip SET l_id = NULL WHERE l_id = 1;
UPDATE tour SET l_id = NULL WHERE l_id = 1;
UPDATE kategorie_full SET l_id = NULL WHERE l_id = 1;

-- remove tour OFFEN, Keine Tour
UPDATE tour SET l_id = NULL WHERE l_id = 1;
UPDATE kategorie_full SET t_id = 0 WHERE t_id IN (SELECT t_id FROM tour WHERE lower(t_name) LIKE '%keine tour%');
UPDATE kategorie_full SET t_id = 0 WHERE t_id IN (SELECT t_id FROM tour WHERE lower(t_name) LIKE 'offen');

-- remove person: Unbekannt
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, '^Unbekannt,,', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, '^Unbekannt,', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',,Unbekannt,,', ',,');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',Unbekannt,', ',');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',,Unbekannt$', '');
UPDATE kategorie_full SET k_persons=REGEXP_REPLACE(k_persons, ',Unbekannt$', '');

-- clear objects: Default, CommonFace
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^Default,,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^Default,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,Default,,', ',,');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',Default,', ',');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,Default', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',Default', '');

UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^CommonFace,,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, '^CommonFace,', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,CommonFace,,', ',,');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',CommonFace,', ',');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',,CommonFace', '');
UPDATE kategorie_full SET k_objects=REGEXP_REPLACE(k_objects, ',CommonFace', '');

-- add statistics: kategorie_full
update kategorie_full
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image WHERE image.k_id = kategorie_full.k_id),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image WHERE image.k_id = kategorie_full.k_id AND i_rate >= 6),
    countPois=(select COUNT(DISTINCT kategorie_poi.poi_id) FROM kategorie_poi WHERE kategorie_poi.k_id = kategorie_full.k_id),
    countRoutes=(select COUNT(DISTINCT kategorie_tour.t_id) FROM kategorie_tour WHERE kategorie_tour.k_id = kategorie_full.k_id),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video WHERE video.k_id = kategorie_full.k_id);

-- add statistics: tour
update tour
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.t_id=tour.t_id),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.t_id=tour.t_id AND i_rate >= 6),
    countInfos=(select COUNT(DISTINCT info.if_id) FROM info LEFT JOIN tour_info ON info.if_id=tour_info.if_id WHERE tour_info.t_id=tour.t_id),
    countNews=(select COUNT(DISTINCT kategorie_full.n_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id WHERE kategorie_tour.t_id = tour.t_id),
    countPois=(select COUNT(DISTINCT tour_poi.poi_id) FROM tour_poi WHERE tour_poi.t_id = tour.t_id),
    countTracks=(select COUNT(DISTINCT kategorie_tour.k_id) FROM kategorie_tour WHERE kategorie_tour.t_id = tour.t_id),
    countTrips=(select COUNT(DISTINCT kategorie_full.tr_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id WHERE kategorie_tour.t_id = tour.t_id),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video INNER JOIN kategorie_full ON video.k_id=kategorie_full.k_id WHERE kategorie_full.t_id=tour.t_id);

-- add statistics: destination
update destination
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id INNER JOIN tour ON kategorie_full.t_id=tour.t_id WHERE tour.d_id=destination.d_id),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id INNER JOIN tour ON kategorie_full.t_id=tour.t_id WHERE tour.d_id=destination.d_id AND i_rate >= 6),
    countInfos=(select COUNT(DISTINCT info.if_id) FROM info INNER JOIN tour_info ON info.if_id=tour_info.if_id INNER JOIN tour ON tour.t_id=tour_info.t_id WHERE tour.d_id=destination.d_id),
    countNews=(select COUNT(DISTINCT kategorie_full.n_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id INNER JOIN tour ON kategorie_tour.t_id=tour.t_id WHERE tour.d_id=destination.d_id),
    countPois=(select COUNT(DISTINCT tour_poi.poi_id) FROM tour_poi INNER JOIN tour on tour_poi.t_id = tour.t_id WHERE tour.d_id=destination.d_id),
    countRoutes=(select COUNT(DISTINCT tour.t_id) FROM tour WHERE tour.d_id=destination.d_id),
    countTracks=(select COUNT(DISTINCT kategorie_tour.k_id) FROM kategorie_tour INNER JOIN tour ON kategorie_tour.t_id=tour.t_id WHERE tour.d_id=destination.d_id),
    countTrips=(select COUNT(DISTINCT kategorie_full.tr_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id INNER JOIN tour ON kategorie_tour.t_id=tour.t_id WHERE tour.d_id=destination.d_id),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video INNER JOIN kategorie_full ON video.k_id=kategorie_full.k_id INNER JOIN tour ON kategorie_full.t_id=tour.t_id WHERE tour.d_id=destination.d_id);

-- add statistics: location
update location
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids)),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids) AND i_rate >= 6),
    countInfos=(select COUNT(DISTINCT info.if_id) FROM info LEFT JOIN location_info ON info.if_id=location_info.if_id WHERE location_info.l_id=location.l_id OR info.l_id=location.l_id),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video INNER JOIN kategorie_full ON video.k_id=kategorie_full.k_id WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids)),
    countTracks=(select COUNT(DISTINCT kategorie_full.k_id) FROM kategorie_full WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids)),
    countTrips=(select COUNT(DISTINCT kategorie_full.tr_id) FROM kategorie_full WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids)),
    countNews=(select COUNT(DISTINCT kategorie_full.n_id) FROM kategorie_full WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids)),
    countRoutes=(select COUNT(DISTINCT kategorie_tour.t_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id WHERE FIND_IN_SET(kategorie_full.k_id, location.l_katids));

-- add statistics: trip
update trip
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.tr_id = trip.tr_id),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.tr_id = trip.tr_id AND i_rate >= 6),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video INNER JOIN kategorie_full ON video.k_id=kategorie_full.k_id WHERE kategorie_full.tr_id = trip.tr_id),
    countTracks=(select COUNT(DISTINCT kategorie_full.k_id) FROM kategorie_full WHERE kategorie_full.tr_id = trip.tr_id),
    countRoutes=(select COUNT(DISTINCT kategorie_tour.t_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id WHERE kategorie_full.tr_id = trip.tr_id);

-- add statistics: news
update news
set
    countImages=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.n_id = news.n_id),
    countImagesTop=(select COUNT(DISTINCT image.i_id) FROM image INNER JOIN kategorie_full ON image.k_id=kategorie_full.k_id WHERE kategorie_full.n_id = news.n_id AND i_rate >= 6),
    countVideos=(select COUNT(DISTINCT video.v_id) FROM video INNER JOIN kategorie_full ON video.k_id=kategorie_full.k_id WHERE kategorie_full.n_id = news.n_id),
    countTrips=(select COUNT(DISTINCT kategorie_full.tr_id) FROM kategorie_full WHERE kategorie_full.n_id = news.n_id),
    countTracks=(select COUNT(DISTINCT kategorie_full.k_id) FROM kategorie_full WHERE kategorie_full.n_id = news.n_id),
    countRoutes=(select COUNT(DISTINCT kategorie_tour.t_id) FROM kategorie_full INNER JOIN kategorie_tour ON kategorie_tour.k_id = kategorie_full.k_id WHERE kategorie_full.n_id = news.n_id);

-- add statistics: info
update info
set
    countLocations=(select COUNT(DISTINCT location_info.l_id) FROM location_info WHERE location_info.if_id = info.if_id),
    countPois=(select COUNT(DISTINCT importmytbdb_poi_info.poi_id) FROM importmytbdb_poi_info WHERE importmytbdb_poi_info.if_id = info.if_id),
    countRoutes=(select COUNT(DISTINCT tour_info.t_id) FROM tour_info WHERE tour_info.if_id = info.if_id);

-- add statistics: playlist
update playlist
set
    countInfos=(select COUNT(DISTINCT info_playlist.if_id) FROM info_playlist WHERE info_playlist.p_id = playlist.p_id),
    countImages=(select COUNT(DISTINCT image_playlist.i_id) FROM image_playlist WHERE image_playlist.p_id = playlist.p_id),
    countLocations=(select COUNT(DISTINCT location_playlist.l_id) FROM location_playlist WHERE location_playlist.p_id = playlist.p_id),
    countRoutes=(select COUNT(DISTINCT tour_playlist.t_id) FROM tour_playlist WHERE tour_playlist.p_id = playlist.p_id),
    countTracks=(select COUNT(DISTINCT kategorie_playlist.k_id) FROM kategorie_playlist WHERE kategorie_playlist.p_id = playlist.p_id),
    countTrips=(select COUNT(DISTINCT trip_playlist.tr_id) FROM trip_playlist WHERE trip_playlist.p_id = playlist.p_id),
    countVideos=(select COUNT(DISTINCT video_playlist.v_id) FROM video_playlist WHERE video_playlist.p_id = playlist.p_id);

-- add statistics: poi
update poi
set
    countRoutes=(select COUNT(DISTINCT tour_poi.t_id) FROM tour_poi WHERE tour_poi.poi_id = poi.poi_id),
    countTracks=(select COUNT(DISTINCT kategorie_poi.k_id) FROM kategorie_poi WHERE kategorie_poi.poi_id = poi.poi_id);

-- -------------
-- navigation_objects
-- -------------

-- playlist
UPDATE playlist
SET p_calced_navigation_objects =
    CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=PREDECESSOR")
                     FROM playlist pr1
                     WHERE p_name < (SELECT p_name FROM playlist pr2  WHERE p_id IN (playlist.p_id))
                     ORDER BY p_name DESC, p_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=SUCCESSOR")
                     FROM playlist suc1
                     WHERE p_name > (SELECT p_name FROM playlist suc2 WHERE p_id IN (playlist.p_id))
                     ORDER BY p_name, p_id LIMIT 1),
            '')
        )
WHERE p_calced_navigation_objects IS NULL
;

-- info
UPDATE info
SET if_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=INFO_", if_id, ":::name=", COALESCE(if_name, "null"), ":::navtype=PREDECESSOR")
                     FROM info pr1
                     WHERE if_name < (SELECT if_name FROM info pr2  WHERE if_id IN (info.if_id))
                     ORDER BY if_name DESC, if_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=INFO_", if_id, ":::name=", COALESCE(if_name, "null"), ":::navtype=SUCCESSOR")
                     FROM info suc1
                     WHERE if_name > (SELECT if_name FROM info suc2 WHERE if_id IN (info.if_id))
                     ORDER BY if_name, if_id LIMIT 1),
            '')
            )
WHERE if_calced_navigation_objects IS NULL
;

-- destination
UPDATE destination
SET d_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=DESTINATION_", d_id, ":::name=", COALESCE(d_name, "null"), ":::navtype=PREDECESSOR")
                     FROM destination pr1 LEFT JOIN location ON pr1.l_id = location.l_id
                     WHERE CONCAT(L_lochirarchietxt, d_name) < (SELECT CONCAT(L_lochirarchietxt, d_name) FROM destination pr2 LEFT JOIN location ON pr2.l_id = location.l_id WHERE d_id IN (destination.d_id))
                     ORDER BY L_lochirarchietxt, d_name DESC, d_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=DESTINATION_", d_id, ":::name=", COALESCE(d_name, "null"), ":::navtype=SUCCESSOR")
                     FROM destination suc1 LEFT JOIN location ON suc1.l_id = location.l_id
                     WHERE CONCAT(L_lochirarchietxt, d_name) > (SELECT CONCAT(L_lochirarchietxt, d_name) FROM destination suc2 LEFT JOIN location ON suc2.l_id = location.l_id WHERE d_id IN (destination.d_id))
                     ORDER BY L_lochirarchietxt, d_name, d_id LIMIT 1),
            '')
            )
WHERE d_calced_navigation_objects IS NULL
;

-- kategorie_full
UPDATE kategorie_full
SET k_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=PREDECESSOR")
                     FROM kategorie_full pr1
                     WHERE k_datevon < (SELECT k_datevon FROM kategorie_full pr2  WHERE k_id IN (kategorie_full.k_id))
                     ORDER BY k_datevon DESC, k_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=TRACK_", k_id, ":::name=", COALESCE(k_name, "null"), ":::navtype=SUCCESSOR")
                     FROM kategorie_full suc1
                     WHERE k_datevon > (SELECT k_datevon FROM kategorie_full suc2 WHERE k_id IN (kategorie_full.k_id))
                     ORDER BY k_datevon, k_id LIMIT 1),
            '')
            )
WHERE k_calced_navigation_objects IS NULL
;

-- tour
UPDATE tour
SET t_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=PREDECESSOR")
                     FROM tour pr1 LEFT JOIN location ON pr1.l_id = location.l_id
                     WHERE CONCAT(L_lochirarchietxt, t_name) < (SELECT CONCAT(L_lochirarchietxt, t_name) FROM tour pr2 LEFT JOIN location ON pr2.l_id = location.l_id WHERE t_id IN (tour.t_id))
                     ORDER BY L_lochirarchietxt, t_name DESC, t_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=ROUTE_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=SUCCESSOR")
                     FROM tour suc1 LEFT JOIN location ON suc1.l_id = location.l_id
                     WHERE CONCAT(L_lochirarchietxt, t_name) > (SELECT CONCAT(L_lochirarchietxt, t_name) FROM tour suc2 LEFT JOIN location ON suc2.l_id = location.l_id WHERE t_id IN (tour.t_id))
                     ORDER BY L_lochirarchietxt, t_name, t_id LIMIT 1),
            '')
            )
WHERE t_calced_navigation_objects IS NULL
;

-- location
UPDATE location
SET l_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=PREDECESSOR")
                     FROM location pr1
                     WHERE l_lochirarchietxt < (SELECT l_lochirarchietxt FROM location pr2  WHERE l_id IN (location.l_id))
                     ORDER BY l_lochirarchietxt DESC, l_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=LOCATION_", l_id, ":::name=", COALESCE(l_name, "null"), ":::navtype=SUCCESSOR")
                     FROM location suc1
                     WHERE l_lochirarchietxt > (SELECT l_lochirarchietxt FROM location suc2 WHERE l_id IN (location.l_id))
                     ORDER BY l_lochirarchietxt, l_id LIMIT 1),
            '')
            )
WHERE l_calced_navigation_objects IS NULL
;

-- poi
UPDATE poi
SET poi_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=poi_", poi_id, ":::name=", COALESCE(poi_name, "null"), ":::navtype=PREDECESSOR")
                     FROM poi pr1
                     WHERE poi_name < (SELECT poi_name FROM poi pr2  WHERE poi_id IN (poi.poi_id))
                     ORDER BY poi_name DESC, poi_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=poi_", poi_id, ":::name=", COALESCE(poi_name, "null"), ":::navtype=SUCCESSOR")
                     FROM poi suc1
                     WHERE poi_name > (SELECT poi_name FROM poi suc2 WHERE poi_id IN (poi.poi_id))
                     ORDER BY poi_name, poi_id LIMIT 1),
            '')
            )
WHERE poi_calced_navigation_objects IS NULL
;

-- image
UPDATE image
SET i_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_katname, "null"), ":::navtype=PREDECESSOR")
                     FROM image pr1
                     WHERE i_date < (SELECT i_date FROM image pr2  WHERE i_id IN (image.i_id))
                     ORDER BY i_date DESC, i_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=IMAGE_", i_id, ":::name=", COALESCE(i_katname, "null"), ":::navtype=SUCCESSOR")
                     FROM image suc1
                     WHERE i_date > (SELECT i_date FROM image suc2 WHERE i_id IN (image.i_id))
                     ORDER BY i_date, i_id LIMIT 1),
            '')
            )
WHERE i_calced_navigation_objects IS NULL
;

-- video
UPDATE video
SET v_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=video_", v_id, ":::name=", COALESCE(v_katname, "null"), ":::navtype=PREDECESSOR")
                     FROM video pr1
                     WHERE v_date < (SELECT v_date FROM video pr2  WHERE v_id IN (video.v_id))
                     ORDER BY v_date DESC, v_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=video_", v_id, ":::name=", COALESCE(v_katname, "null"), ":::navtype=SUCCESSOR")
                     FROM video suc1
                     WHERE v_date > (SELECT v_date FROM video suc2 WHERE v_id IN (video.v_id))
                     ORDER BY v_date, v_id LIMIT 1),
            '')
            )
WHERE v_calced_navigation_objects IS NULL
;

-- trip
UPDATE trip
SET tr_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=trip_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=PREDECESSOR")
                     FROM trip pr1
                     WHERE tr_datevon < (SELECT tr_datevon FROM trip pr2  WHERE tr_id IN (trip.tr_id))
                     ORDER BY tr_datevon DESC, tr_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=trip_", tr_id, ":::name=", COALESCE(tr_name, "null"), ":::navtype=SUCCESSOR")
                     FROM trip suc1
                     WHERE tr_datevon > (SELECT tr_datevon FROM trip suc2 WHERE tr_id IN (trip.tr_id))
                     ORDER BY tr_datevon, tr_id LIMIT 1),
            '')
            )
WHERE tr_calced_navigation_objects IS NULL
;

-- news
UPDATE news
SET n_calced_navigation_objects =
        CONCAT(
            COALESCE(
                    (SELECT CONCAT("navid=news_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=PREDECESSOR")
                     FROM news pr1
                     WHERE n_datevon < (SELECT n_datevon FROM news pr2  WHERE n_id IN (news.n_id))
                     ORDER BY n_datevon DESC, n_id DESC LIMIT 1),
            ''),
            'SEPARATOR',
            COALESCE(
                    (SELECT CONCAT("navid=news_", n_id, ":::name=", COALESCE(n_headline, "null"), ":::navtype=SUCCESSOR")
                     FROM news suc1
                     WHERE n_datevon > (SELECT n_datevon FROM news suc2 WHERE n_id IN (news.n_id))
                     ORDER BY n_datevon, n_id LIMIT 1),
            '')
            )
WHERE n_calced_navigation_objects IS NULL
;


-- -------------
-- extended_object_properties
-- -------------
UPDATE playlist
SET p_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(countInfos AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=LOCATION_COUNT:::value=", CAST(countLocations AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(countTrips AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE info
SET if_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=LOCATION_COUNT:::value=", CAST(countLocations AS CHAR)
);

UPDATE destination
SET d_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=NEWS_COUNT:::value=", CAST(countNews AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(countInfos AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(countTrips AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE kategorie_full
SET k_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE tour
SET t_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=NEWS_COUNT:::value=", CAST(countNews AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(countTrips AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(countInfos AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE location
SET l_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=NEWS_COUNT:::value=", CAST(countNews AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=INFO_COUNT:::value=", CAST(countInfos AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(countTrips AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE poi
SET poi_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR)
);

UPDATE trip
SET tr_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

UPDATE news
SET n_calced_extended_object_properties = CONCAT(
    "category=ENTITYCOUNT:::name=ROUTE_COUNT:::value=", CAST(countRoutes AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRIP_COUNT:::value=", CAST(countTrips AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=TRACK_COUNT:::value=", CAST(countTracks AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_COUNT:::value=", CAST(countImages AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=IMAGE_TOP_COUNT:::value=", CAST(countImagesTop AS CHAR), 'SEPARATOR',
    "category=ENTITYCOUNT:::name=VIDEO_COUNT:::value=", CAST(countVideos AS CHAR)
);

-- -------------
-- linkedplaylists
-- -------------
UPDATE info toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.if_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(info_playlist.ifp_pos, "null")) linkedplaylists, info_playlist.if_id
                FROM playlist
                     INNER JOIN info_playlist ON playlist.p_id = info_playlist.p_id
                     INNER JOIN info ON info_playlist.if_id = info.if_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY if_id
        ) updateSrc
SET toUpdate.if_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.if_id = updateSrc.if_id
;

UPDATE kategorie_full toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.k_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(kategorie_playlist.kp_pos, "null")) linkedplaylists, kategorie_playlist.k_id
                FROM playlist
                     INNER JOIN kategorie_playlist ON playlist.p_id = kategorie_playlist.p_id
                     INNER JOIN kategorie_full ON kategorie_playlist.k_id = kategorie_full.k_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY k_id
        ) updateSrc
SET toUpdate.k_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.k_id = updateSrc.k_id
;

UPDATE tour toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.t_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(tour_playlist.tp_pos, "null")) linkedplaylists, tour_playlist.t_id
                FROM playlist
                     INNER JOIN tour_playlist ON playlist.p_id = tour_playlist.p_id
                     INNER JOIN tour ON tour_playlist.t_id = tour.t_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY t_id
        ) updateSrc
SET toUpdate.t_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.t_id = updateSrc.t_id
;

UPDATE location toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.l_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(location_playlist.lp_pos, "null")) linkedplaylists, location_playlist.l_id
                FROM playlist
                     INNER JOIN location_playlist ON playlist.p_id = location_playlist.p_id
                     INNER JOIN location ON location_playlist.l_id = location.l_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY l_id
        ) updateSrc
SET toUpdate.l_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.l_id = updateSrc.l_id
;

UPDATE image toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.i_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(image_playlist.ip_pos, "null")) linkedplaylists, image_playlist.i_id
                FROM playlist
                     INNER JOIN image_playlist ON playlist.p_id = image_playlist.p_id
                     INNER JOIN image ON image_playlist.i_id = image.i_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY i_id
        ) updateSrc
SET toUpdate.i_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.i_id = updateSrc.i_id
;

UPDATE video toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.v_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(video_playlist.vp_pos, "null")) linkedplaylists, video_playlist.v_id
                FROM playlist
                     INNER JOIN video_playlist ON playlist.p_id = video_playlist.p_id
                     INNER JOIN video ON video_playlist.v_id = video.v_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY v_id
        ) updateSrc
SET toUpdate.v_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.v_id = updateSrc.v_id
;

UPDATE trip toUpdate,
        (SELECT GROUP_CONCAT(linkedplaylists, 'SEPARATOR') as linkedplaylists, linkedplaylistssrc.tr_id
            FROM (
                SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"),
                    ":::refId=", CAST(playlist.p_id AS CHAR),
                    ":::position=", COALESCE(trip_playlist.trp_pos, "null")) linkedplaylists, trip_playlist.tr_id
                FROM playlist
                     INNER JOIN trip_playlist ON playlist.p_id = trip_playlist.p_id
                     INNER JOIN trip ON trip_playlist.tr_id = trip.tr_id
                ORDER BY p_name) linkedplaylistssrc
            GROUP BY tr_id
        ) updateSrc
SET toUpdate.tr_calced_linkedplaylists = updateSrc.linkedplaylists
WHERE toUpdate.tr_id = updateSrc.tr_id
;

-- -------------
-- linkedroutes
-- -------------
UPDATE kategorie_full toUpdate,
    (
        SELECT GROUP_CONCAT(linkedroutes ORDER BY linkedroutes SEPARATOR 'SEPARATOR') linkedroutes, routessrc.k_id
        FROM (
                 SELECT CONCAT("type=mainroute:::name=", COALESCE(t_name, "null"),
                               ":::refId=", CAST(tour.t_id AS CHAR),
                               ":::full=true:::linkedRouteAttr=", COALESCE(kategorie_full.k_route_attr, "null"))
                            AS linkedroutes,
                        kategorie_full.k_id
                 FROM tour INNER JOIN kategorie_full ON tour.t_id = kategorie_full.t_id
                 UNION
                 SELECT CONCAT("type=subroute:::name=", COALESCE(t_name, "null"),
                               ":::refId=", CAST(tour.t_id AS CHAR),
                               ":::full=", CAST(COALESCE(kt_full, "false") AS CHAR),
                               ":::linkedRouteAttr=", COALESCE(kategorie_tour.kt_route_attr, "null"))
                            AS linkedroutes,
                        kategorie_tour.k_id
                 FROM tour INNER JOIN kategorie_tour ON kategorie_tour.t_id = tour.t_id
             ) routessrc
        GROUP BY routessrc.k_id
        ORDER BY linkedroutes
    ) updateSrc
SET toUpdate.k_calced_linkedroutes = updateSrc.linkedroutes
WHERE toUpdate.k_id = updateSrc.k_id
;

-- -------------
-- linkedinfos
-- -------------
UPDATE destination toUpdate,
    (SELECT GROUP_CONCAT(linkedinfos order by linkedinfos SEPARATOR 'SEPARATOR') linkedinfos, linkedinfossrc.d_id
     FROM (
              SELECT CONCAT("type=", COALESCE(if_typ, "null"),
                            ":::name=", COALESCE(if_name, "null"),
                            ":::refId=", CAST(info.if_id AS CHAR),
                            ":::linkedDetails=", COALESCE(tour_info.tif_linked_details, "null")) as linkedinfos,
                     destination.d_id
              FROM info
                       INNER JOIN tour_info ON tour_info.if_id = info.if_id
                       INNER JOIN tour ON tour_info.t_id = tour.t_id
                       INNER JOIN destination ON destination.d_id = tour.d_id
              ORDER BY if_name) linkedinfossrc
     GROUP BY d_id
    ) updateSrc
SET toUpdate.d_calced_linkedinfos = updateSrc.linkedinfos
WHERE toUpdate.d_id = updateSrc.d_id
;

UPDATE tour toUpdate,
    (SELECT GROUP_CONCAT(linkedinfos order by linkedinfos SEPARATOR 'SEPARATOR') linkedinfos, linkedinfossrc.t_id
     FROM (
              SELECT CONCAT("type=", COALESCE(if_typ, "null"),
                            ":::name=", COALESCE(if_name, "null"),
                            ":::refId=", CAST(info.if_id AS CHAR),
                            ":::linkedDetails=", COALESCE(tour_info.tif_linked_details, "null")) as linkedinfos,
                     tour_info.t_id
              FROM info INNER JOIN tour_info ON tour_info.if_id = info.if_id
                        INNER JOIN tour ON tour_info.t_id = tour.t_id
              ORDER BY if_name) linkedinfossrc
     GROUP BY t_id
    ) updateSrc
SET toUpdate.t_calced_linkedinfos = updateSrc.linkedinfos
WHERE toUpdate.t_id = updateSrc.t_id
;

UPDATE location toUpdate,
    (SELECT GROUP_CONCAT(linkedinfos order by linkedinfos SEPARATOR 'SEPARATOR') linkedinfos, linkedinfossrc.l_id
     FROM (SELECT CONCAT("type=", COALESCE(if_typ, "null"),
                         ":::name=", COALESCE(if_name, "null"),
                         ":::refId=", CAST(info.if_id AS CHAR),
                         ":::linkedDetails=", COALESCE(location_info.lif_linked_details, "null")) as linkedinfos,
                  location_info.l_id
           FROM info INNER JOIN location_info ON location_info.if_id = info.if_id
                     INNER JOIN location ON location_info.l_id = location.l_id
           ORDER BY if_name) linkedinfossrc
     GROUP BY l_id
    ) updateSrc
SET toUpdate.l_calced_linkedinfos = updateSrc.linkedinfos
WHERE toUpdate.l_id = updateSrc.l_id
;

UPDATE poi toUpdate,
    (SELECT GROUP_CONCAT(linkedinfos order by linkedinfos SEPARATOR 'SEPARATOR') linkedinfos, linkedinfossrc.poi_id
     FROM (SELECT CONCAT("type=", COALESCE(if_typ, "null"),
                         ":::name=", COALESCE(if_name, "null"),
                         ":::refId=", CAST(info.if_id AS CHAR),
                         ":::linkedDetails=", COALESCE(poi_info.poiif_linked_details, "null")) as linkedinfos,
                  poi.poi_id
           FROM info INNER JOIN poi_info ON poi_info.if_id = info.if_id
                     INNER JOIN POI ON poi_info.poi_id = poi.poi_id
           ORDER BY if_name) linkedinfossrc
     GROUP BY poi_id
    ) updateSrc
SET toUpdate.poi_calced_linkedinfos = updateSrc.linkedinfos
WHERE toUpdate.poi_id = updateSrc.poi_id
;

-- -------------
-- linkedpois
-- -------------
UPDATE kategorie_full toUpdate,
    (SELECT GROUP_CONCAT(linkedpois, 'SEPARATOR') linkedpois, linkedpoissrc.k_id
     FROM (
              SELECT CONCAT("type=", COALESCE(1, "null"),
                            ":::name=", COALESCE(poi_name, "null"),
                            ":::refId=", CAST(poi.poi_id AS CHAR),
                            ":::poitype=", COALESCE(kategorie_poi.kpoi_type, "null"),
                            ":::position=", COALESCE(kategorie_poi.kpoi_pos, "null"),
                            ":::geoLoc=", poi_geo_latdeg, ",", poi_geo_longdeg,
                            ":::geoEle=", COALESCE(poi_geo_ele, 0))
                         AS linkedpois,
                     kategorie_poi.k_id
              FROM poi INNER JOIN kategorie_poi ON kategorie_poi.poi_id = poi.poi_id
                       INNER JOIN kategorie_full ON kategorie_poi.k_id = kategorie_full.k_id
              ORDER BY kategorie_poi.kpoi_pos) linkedpoissrc
     GROUP BY k_id
    ) updateSrc
SET toUpdate.k_calced_linkedpois = updateSrc.linkedpois
WHERE toUpdate.k_id = updateSrc.k_id
;

UPDATE tour toUpdate,
    (SELECT GROUP_CONCAT(linkedpois, 'SEPARATOR') linkedpois, linkedpoissrc.t_id
     FROM (
              SELECT CONCAT("type=", COALESCE(1, "null"),
                            ":::name=", COALESCE(poi_name, "null"),
                            ":::refId=", CAST(poi.poi_id AS CHAR),
                            ":::poitype=", COALESCE(tour_poi.tpoi_type, "null"),
                            ":::position=", COALESCE(tour_poi.tpoi_pos, "null"),
                            ":::geoLoc=", poi_geo_latdeg, ",", poi_geo_longdeg,
                            ":::geoEle=", COALESCE(poi_geo_ele, 0))
                         AS linkedpois,
                     tour_poi.t_id
              FROM poi INNER JOIN tour_poi ON tour_poi.poi_id = poi.poi_id
                       INNER JOIN tour ON tour_poi.t_id = tour.t_id
              ORDER BY tour_poi.tpoi_pos) linkedpoissrc
     GROUP BY t_id
    ) updateSrc
SET toUpdate.t_calced_linkedpois = updateSrc.linkedpois
WHERE toUpdate.t_id = updateSrc.t_id
;
