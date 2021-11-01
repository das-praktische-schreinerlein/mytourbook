/* #############
# initalize-playlistpos
############# */
UPDATE video_playlist
SET vp_pos = (select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
              FROM video_playlist ip
              where p_id = 17
                and video_playlist.vp_id = ip.vp_id
              order by v_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
             FROM video_playlist ip
             where p_id = 17
               and video_playlist.vp_id = ip.vp_id
             order by v_id);

UPDATE video_playlist
SET vp_pos = (select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
              FROM video_playlist ip
              where p_id = 18
                and video_playlist.vp_id = ip.vp_id
              order by v_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
             FROM video_playlist ip
             where p_id = 18
               and video_playlist.vp_id = ip.vp_id
             order by v_id);

UPDATE video_playlist
SET vp_pos = (select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
              FROM video_playlist ip
              where p_id = 24
                and video_playlist.vp_id = ip.vp_id
              order by v_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
             FROM video_playlist ip
             where p_id = 24
               and video_playlist.vp_id = ip.vp_id
             order by v_id);

UPDATE video_playlist
SET vp_pos = (select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
              FROM video_playlist ip
              where p_id = 25
                and video_playlist.vp_id = ip.vp_id
              order by v_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
             FROM video_playlist ip
             where p_id = 25
               and video_playlist.vp_id = ip.vp_id
             order by v_id);

UPDATE video_playlist
SET vp_pos = (select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
              FROM video_playlist ip
              where p_id = 29
                and video_playlist.vp_id = ip.vp_id
              order by v_id)
WHERE EXISTS(select ROW_NUMBER() OVER ( ORDER BY v_id) as RowNum
             FROM video_playlist ip
             where p_id = 29
               and video_playlist.vp_id = ip.vp_id
             order by v_id);
