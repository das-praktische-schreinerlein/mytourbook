SELECT i_id, i_dir, i_file, i_rate, i_rate_motive, i_rate_wichtigkeit FROM image
    WHERE (i_rate IS NULL OR i_rate in (0)) AND (i_rate_motive IS NULL OR i_rate_motive in (0)) AND (i_rate_wichtigkeit IS NULL OR i_rate_wichtigkeit in (0))
    ORDER BY i_id desc;
UPDATE image SET i_rate=-1 WHERE (i_rate IS NULL OR i_rate in (0)) AND (i_rate_motive IS NULL OR i_rate_motive in (0)) AND (i_rate_wichtigkeit IS NULL OR i_rate_wichtigkeit in (0))