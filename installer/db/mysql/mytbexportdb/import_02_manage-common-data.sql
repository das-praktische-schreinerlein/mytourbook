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
