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
FROM (SELECT k_id,
             k_name,
             TIMESTAMPDIFF(MINUTE, minKtpDate, minIDate)  diffKtpIMin,
             TIMESTAMPDIFF(MINUTE, maxKtpDate, maxIDate)  diffKtpIMax,
             TIMESTAMPDIFF(MINUTE, K_DATEVON, minIDate)   diffKIMin,
             TIMESTAMPDIFF(MINUTE, K_DATEBIS, maxIDate)   diffKIMax,
             TIMESTAMPDIFF(MINUTE, K_DATEVON, minKtpDate) diffKKtpMin,
             TIMESTAMPDIFF(MINUTE, K_DATEBIS, maxKtpDate) diffKKtpMax,
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
                   min(ktp_date) minKtpDate,
                   min(i_date)   minIDate,
                   max(ktp_date) maxKtpDate,
                   max(i_date)   maxIDate
            FROM kategorie
                     INNER JOIN kategorie_tourpoint kt ON kategorie.K_ID = kt.K_ID
                     INNER JOIN image i ON kategorie.K_ID = i.K_ID
            WHERE kategorie.k_id
            GROUP BY kategorie.k_id, kategorie.k_name, K_DATEVON, K_DATEBIS) kats) katStats
WHERE true
-- only new after migration from java to nodejs
     AND katStats.k_id > 2646
-- only diff between image and trackpoints max30minutes
--    AND (ABS(diffKtpIMin) > 30 or ABS(diffKtpIMax) > 30)
-- only where images and trackpoints inside trackdata
--    AND diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10
-- only where not images and trackpoints inside trackdata
    AND NOT (diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10)
ORDER BY katStats.K_DATEVON
 */
;

UPDATE image toupdate,
 (SELECT distinct image.i_id, ktp.KTP_ID, i_date, ktp_date, ktp_ele, ktp_lat, ktp_lon
    FROM image, kategorie_tourpoint ktp
    WHERE image.i_id
          AND image.I_GPS_ELE is null
          AND ktp.KTP_ID=(SELECT distinct ktp_id
            FROM kategorie_tourpoint
            WHERE kategorie_tourpoint.k_id=image.k_id
                  AND ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(image.i_date)) < 300
                  -- only new after migration from java to nodejs
                  AND kategorie_tourpoint.k_id > 2646
            ORDER BY ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(image.i_date)) ASC
            LIMIT 1)
     GROUP BY image.i_id
  ) grouped
SET
    toupdate.I_GPS_ELE=grouped.KTP_ELE,
    toupdate.I_GPS_LAT=grouped.KTP_LAT,
    toupdate.I_GPS_LON=grouped.KTP_LON
WHERE toupdate.i_id=grouped.i_id
  -- only new after migration from java to nodejs
  AND toupdate.k_id > 2646
  AND (
      -- static whitelist
      k_id IN (-1
              ) OR
      -- must pass trackpoint/image restrictions
      k_id IN (
            SELECT k_id
            FROM (SELECT k_id,
                         k_name,
                         TIMESTAMPDIFF(MINUTE, minKtpDate, minIDate)  diffKtpIMin,
                         TIMESTAMPDIFF(MINUTE, maxKtpDate, maxIDate)  diffKtpIMax,
                         TIMESTAMPDIFF(MINUTE, K_DATEVON, minIDate)   diffKIMin,
                         TIMESTAMPDIFF(MINUTE, K_DATEBIS, maxIDate)   diffKIMax,
                         TIMESTAMPDIFF(MINUTE, K_DATEVON, minKtpDate) diffKKtpMin,
                         TIMESTAMPDIFF(MINUTE, K_DATEBIS, maxKtpDate) diffKKtpMax,
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
                               min(ktp_date) minKtpDate,
                               min(i_date)   minIDate,
                               max(ktp_date) maxKtpDate,
                               max(i_date)   maxIDate
                        FROM kategorie
                                 INNER JOIN kategorie_tourpoint kt ON kategorie.K_ID = kt.K_ID
                                 INNER JOIN image i ON kategorie.K_ID = i.K_ID
                        WHERE kategorie.k_id
                        GROUP BY kategorie.k_id, kategorie.k_name, K_DATEVON, K_DATEBIS) kats) katStats
            WHERE true
                -- only diff between image and trackpoints max30minutes
                --    and (abs(diffKtpIMin) > 30 or abs(diffKtpIMax) > 30)
                -- only where images and trackpoints inside trackdata
                AND diffKKtpMin >= -1 AND diffKKtpMax <= 1 AND diffKIMin >= -10 AND diffKIMax <= 10
            )
      )
;
