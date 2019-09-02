SELECT k_id, LEAST(k_datevon, ktp_datevon) AS calced_datevon, k_datevon, ktp_datevon,
             GREATEST(k_datebis, ktp_datebis) AS calced_datebis, k_datebis, ktp_datebis
FROM (
  SELECT
    kategorie.k_id,
    k_datevon,
    MIN(ktp_date) AS ktp_datevon,
    k_datebis,
    MAX(ktp_date) AS ktp_datebis
  FROM kategorie, kategorie_tourpoint
  WHERE kategorie_tourpoint.k_id = kategorie.k_id
  GROUP BY kategorie.k_id, k_datevon, k_datebis
) grouped WHERE (k_datevon > ktp_datevon OR k_datebis < ktp_datebis) and k_id > 2293
ORDER BY k_id DESC

UPDATE kategorie toupdate,
  (SELECT k_id, LEAST(k_datevon, ktp_datevon) AS calced_datevon, k_datevon, ktp_datevon,
                GREATEST(k_datebis, ktp_datebis) AS calced_datebis, k_datebis, ktp_datebis
       FROM (
         SELECT
           kategorie.k_id,
           k_datevon,
           MIN(ktp_date) AS ktp_datevon,
           k_datebis,
           MAX(ktp_date) AS ktp_datebis
         FROM kategorie, kategorie_tourpoint
         WHERE kategorie_tourpoint.k_id = kategorie.k_id
         GROUP BY kategorie.k_id, k_datevon, k_datebis
       ) grouped WHERE k_datevon > ktp_datevon OR k_datebis < ktp_datebis
    ) getMinMax
SET
  toupdate.k_datevon=getMinMax.calced_datevon,
  toupdate.k_datebis=getMinMax.calced_datebis
WHERE toupdate.k_id=getMinMax.k_id and toupdate.k_id > 2293 and (toupdate.k_datevon > ktp_datevon OR toupdate.k_datebis < ktp_datebis);
