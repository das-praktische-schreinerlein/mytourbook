/**
SELECT k_id,
       k_name,
       ABS(diffKtpIMin),
       ABS(diffKtpIMax),
       ABS(diffKIMin),
       ABS(diffKIMax),
       ABS(diffKKtpMin),
       ABS(diffKKtpMax),
       K_DATEVON,
       minKtpDate,
       minIDate,
       K_DATEBIS,
       maxKtpDate,
       maxIDate,
       diffKtpIMin,
       diffKtpIMax,
       diffKIMin,
       diffKIMax,
       diffKKtpMin,
       diffKKtpMax
FROM (
    SELECT k_id,
             k_name,
             (STRFTIME('%s', minIDate) - STRFTIME('%s', minKtpDate)) / 60  diffKtpIMin,
             (STRFTIME('%s', maxIDate) - STRFTIME('%s', maxKtpDate)) / 60  diffKtpIMax,
             (STRFTIME('%s', minIDate) - STRFTIME('%s', K_DATEVON)) / 60   diffKIMin,
             (STRFTIME('%s', maxIDate) - STRFTIME('%s', K_DATEBIS)) / 60   diffKIMax,
             (STRFTIME('%s', minKtpDate) - STRFTIME('%s', K_DATEVON)) / 60 diffKKtpMin,
             (STRFTIME('%s', maxKtpDate) - STRFTIME('%s', K_DATEBIS)) / 60 diffKKtpMax,
             K_DATEVON,
             minKtpDate,
             minIDate,
             K_DATEBIS,
             maxKtpDate,
             maxIDate
      FROM (SELECT kategorie.k_id,
                   k_name,
                   K_DATEVON,
                   K_DATEBIS,
                   min(datetime(ktp_date / 1000, 'auto', 'localtime')) minKtpDate,
                   min(v_date)   minIDate,
                   max(datetime(ktp_date / 1000, 'auto', 'localtime')) maxKtpDate,
                   max(v_date)   maxIDate
            FROM kategorie
                     INNER JOIN kategorie_tourpoint kt ON kategorie.K_ID = kt.K_ID
                     INNER JOIN video i ON kategorie.K_ID = i.K_ID
            WHERE kategorie.k_id
            GROUP BY kategorie.k_id, kategorie.k_name, K_DATEVON, K_DATEBIS
            ) kats
    ) katStats
WHERE true
-- only new after migration from java to nodejs
--     AND katStats.k_id > 2646
-- only diff between video and trackpoints max30minutes
--    AND (ABS(diffKtpIMin) > 30 or ABS(diffKtpIMax) > 30)
-- only where videos and trackpoints inside trackdata
--    AND diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10
-- only where not videos and trackpoints inside trackdata
    AND NOT (diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10)
ORDER BY katStats.K_DATEVON
 */
;

UPDATE video
SET
    V_GPS_ELE=grouped.KTP_ELE,
    V_GPS_LAT=grouped.KTP_LAT,
    V_GPS_LON=grouped.KTP_LON
FROM
 (
 SELECT distinct video.v_id, ktp.KTP_ID, video.v_date, datetime(ktp_date / 1000, 'auto', 'localtime'), ktp_ele, ktp_lat, ktp_lon
    FROM video inner join kategorie_tourpoint ktp
    WHERE video.v_id
          AND video.V_GPS_ELE is null
          AND ktp.KTP_ID in
              (SELECT distinct ktp_id
                FROM (
                    SELECT distinct ktp_id,
                          ABS(STRFTIME('%s', video.v_date) - STRFTIME('%s', datetime(ktp_date / 1000, 'auto', 'localtime'))) / 60 as timedist
                        FROM kategorie_tourpoint
                        WHERE kategorie_tourpoint.k_id=video.k_id
                          AND ABS(STRFTIME('%s', video.v_date) - STRFTIME('%s', datetime(ktp_date / 1000, 'auto', 'localtime'))) / 60 < 300
                          -- only new after migration from java to nodejs
                          -- AND kategorie_tourpoint.k_id > 2646
                     )
                ORDER BY timedist ASC
                LIMIT 1
                )
     GROUP BY video.v_id
  ) AS grouped
WHERE video.v_id=grouped.v_id
  -- only new after migration from java to nodejs
  -- AND toupdate.k_id > 2646
  AND (
      -- static whitelist
      k_id IN (-1
              ) OR
      -- must pass trackpoint/video restrictions
      k_id IN (
            SELECT k_id
            FROM (
                SELECT k_id,
                         k_name,
                         (STRFTIME('%s', minIDate) - STRFTIME('%s', kats.minKtpDate)) / 60  diffKtpIMin,
                         (STRFTIME('%s', maxIDate) - STRFTIME('%s', maxKtpDate)) / 60  diffKtpIMax,
                         (STRFTIME('%s', minIDate) - STRFTIME('%s', K_DATEVON)) / 60   diffKIMin,
                         (STRFTIME('%s', maxIDate) - STRFTIME('%s', K_DATEBIS)) / 60   diffKIMax,
                         (STRFTIME('%s', minKtpDate) - STRFTIME('%s', K_DATEVON)) / 60 diffKKtpMin,
                         (STRFTIME('%s', maxKtpDate) - STRFTIME('%s', K_DATEBIS)) / 60 diffKKtpMax,
                         K_DATEVON,
                         minKtpDate,
                         minIDate,
                         K_DATEBIS,
                         maxKtpDate,
                         maxIDate
                  FROM (SELECT kategorie.k_id,
                               k_name,
                               K_DATEVON,
                               K_DATEBIS,
                               min(datetime(ktp_date / 1000, 'auto', 'localtime')) minKtpDate,
                               min(v_date)   minIDate,
                               max(datetime(ktp_date / 1000, 'auto', 'localtime')) maxKtpDate,
                               max(v_date)   maxIDate
                        FROM kategorie
                                 INNER JOIN kategorie_tourpoint kt ON kategorie.K_ID = kt.K_ID
                                 INNER JOIN video i ON kategorie.K_ID = i.K_ID
                        WHERE kategorie.k_id
                        GROUP BY kategorie.k_id, kategorie.k_name, K_DATEVON, K_DATEBIS
                        ) AS kats
                ) katStats
            WHERE true
                -- only diff between video and trackpoints max30minutes
                --    and (abs(diffKtpIMin) > 30 or abs(diffKtpIMax) > 30)
                -- only where videos and trackpoints inside trackdata
                AND diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10
            )
      )
;
