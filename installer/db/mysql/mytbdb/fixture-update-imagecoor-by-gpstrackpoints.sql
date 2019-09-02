UPDATE image toupdate,
 (SELECT distinct image.i_id, ktp.KTP_ID, i_date, ktp_date, ktp_ele, ktp_lat, ktp_lon
    FROM image, kategorie_tourpoint ktp
    WHERE image.i_id
          AND image.I_GPS_ELE is null
          AND ktp.KTP_ID=(SELECT distinct ktp_id
            FROM kategorie_tourpoint
            WHERE kategorie_tourpoint.k_id=image.k_id
                  AND ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(image.i_date)) < 300
            ORDER BY ABS(UNIX_TIMESTAMP(ktp_date) - UNIX_TIMESTAMP(image.i_date)) ASC
            LIMIT 1)
     GROUP BY image.i_id
  ) grouped
SET
    toupdate.I_GPS_ELE=grouped.KTP_ELE,
    toupdate.I_GPS_LAT=grouped.KTP_LAT,
    toupdate.I_GPS_LON=grouped.KTP_LON
WHERE toupdate.i_id=grouped.i_id AND k_id > 2293;
