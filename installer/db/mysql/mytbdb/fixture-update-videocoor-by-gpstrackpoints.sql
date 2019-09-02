UPDATE video toupdate,
 (SELECT distinct video.v_id, ktp.KTP_ID, v_date, ktp_date, ktp_ele, ktp_lat, ktp_lon
    FROM video, kategorie_tourpoint ktp
    WHERE video.v_id
          AND video.v_GPS_ELE is null
          AND ktp.KTP_ID=(SELECT distinct ktp_id
            FROM kategorie_tourpoint
            WHERE kategorie_tourpoint.k_id=video.k_id
                  AND ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(video.v_date)) < 300
            ORDER BY ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(video.v_date)) ASC
            LIMIT 1)
     GROUP BY video.v_id
  ) grouped
SET
    toupdate.v_GPS_ELE=grouped.KTP_ELE,
    toupdate.v_GPS_LAT=grouped.KTP_LAT,
    toupdate.v_GPS_LON=grouped.KTP_LON
WHERE toupdate.v_id=grouped.v_id AND k_id > 2293;
