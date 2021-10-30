/* #############
# initalize-playlistpos
############# */
UPDATE image_playlist
SET ip_pos = (select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
              FROM image_playlist ip
              where p_id = 17
                and image_playlist.ip_id = ip.ip_id
              order by i_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
             FROM image_playlist ip
             where p_id = 17
               and image_playlist.ip_id = ip.ip_id
             order by i_id);

UPDATE image_playlist
SET ip_pos = (select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
              FROM image_playlist ip
              where p_id = 18
                and image_playlist.ip_id = ip.ip_id
              order by i_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
             FROM image_playlist ip
             where p_id = 18
               and image_playlist.ip_id = ip.ip_id
             order by i_id);

UPDATE image_playlist
SET ip_pos = (select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
              FROM image_playlist ip
              where p_id = 24
                and image_playlist.ip_id = ip.ip_id
              order by i_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
             FROM image_playlist ip
             where p_id = 24
               and image_playlist.ip_id = ip.ip_id
             order by i_id);

UPDATE image_playlist
SET ip_pos = (select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
              FROM image_playlist ip
              where p_id = 25
                and image_playlist.ip_id = ip.ip_id
              order by i_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
             FROM image_playlist ip
             where p_id = 25
               and image_playlist.ip_id = ip.ip_id
             order by i_id);

UPDATE image_playlist
SET ip_pos = (select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
              FROM image_playlist ip
              where p_id = 29
                and image_playlist.ip_id = ip.ip_id
              order by i_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY i_id) as RowNum
             FROM image_playlist ip
             where p_id = 29
               and image_playlist.ip_id = ip.ip_id
             order by i_id);
