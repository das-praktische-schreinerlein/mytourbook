/* #############
# initalize-playlistpos
############# */
-- init playlist_pos
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=12 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=13 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=14 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=15 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=16 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=17 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=18 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=19 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=20 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=21 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=22 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=23 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=24 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=25 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=26 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=27 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=28 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=29 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=30 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=31 order by v_id;
select @a := 0;
UPDATE video_playlist SET vp_pos = (select @a := @a + 1) where p_id=32 order by v_id;
