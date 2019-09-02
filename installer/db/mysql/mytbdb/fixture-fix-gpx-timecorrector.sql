-- sommerzeit
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=2
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon >= '2014-03-30'
        AND k_datevon <= '2014-10-26'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=2
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon >= '2015-03-29'
        AND k_datevon <= '2015-10-25'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=2
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon >= '2016-03-27'
        AND k_datevon <= '2016-10-30'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=2
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon >= '2017-03-26'
        AND k_datevon <= '2017-10-29'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=2
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon >= '2018-03-25'
        AND k_datevon <= '2018-10-28'
        AND k_id > 99999;
-- winterzeit
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=1
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon < '2015-03-29'
        AND k_datevon > '2014-10-26'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=1
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon < '2016-03-27'
        AND k_datevon > '2015-10-25'
        AND k_id > 99999;
UPDATE kategorie
    SET k_gpstracks_gpx_timecorrector=1
    WHERE
        k_gpstracks_gpx_timecorrector IS NULL OR k_gpstracks_gpx_timecorrector=0
        AND k_datevon < '2018-03-25'
        AND k_datevon > '2017-10-29'
        AND k_id > 99999;
