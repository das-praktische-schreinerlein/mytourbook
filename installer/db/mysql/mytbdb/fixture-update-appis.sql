update appids set ai_curid = (select max(i_id)+1 from IMAGE) where ai_table = 'IMAGE';
update appids set ai_curid = (select max(ik_id)+1 from IMAGE_KEYWORD) where ai_table = 'IMAGE_KEYWORD';
update appids set ai_curid = (select max(io_id)+1 from IMAGE_OBJECT) where ai_table = 'IMAGE_OBJECT';
update appids set ai_curid = (select max(ip_id)+1 from IMAGE_PLAYLIST) where ai_table = 'IMAGE_PLAYLIST';
update appids set ai_curid = (select max(if_id)+1 from INFO) where ai_table = 'INFO';
update appids set ai_curid = (select max(ifkw_id)+1 from INFO_KEYWORD) where ai_table = 'INFO_KEYWORD';
update appids set ai_curid = (select max(k_id)+1 from KATEGORIE) where ai_table = 'KATEGORIE';
update appids set ai_curid = (select max(kk_id)+1 from KATEGORIE_KEYWORD) where ai_table = 'KATEGORIE_KEYWORD';
update appids set ai_curid = (select max(kt_id)+1 from KATEGORIE_TOUR) where ai_table = 'KATEGORIE_TOUR';
update appids set ai_curid = (select max(ktp_id)+1 from KATEGORIE_TOURPOINT) where ai_table = 'KATEGORIE_TOURPOINT';
update appids set ai_curid = (select max(kw_id)+1 from KEYWORD) where ai_table = 'KEYWORD';
update appids set ai_curid = (select max(l_id)+1 from LOCATION) where ai_table = 'LOCATION';
update appids set ai_curid = (select max(lk_id)+1 from LOCATION_KEYWORD) where ai_table = 'LOCATION_KEYWORD';
update appids set ai_curid = (select max(pn_id)+1 from PERSON) where ai_table = 'PERSON';
update appids set ai_curid = (select max(p_id)+1 from PLAYLIST) where ai_table = 'PLAYLIST';
update appids set ai_curid = (select max(t_id)+1 from TOUR) where ai_table = 'TOUR';
update appids set ai_curid = (select max(tp_id)+1 from TOURPOINT) where ai_table = 'TOURPOINT';
update appids set ai_curid = (select max(tk_id)+1 from TOUR_KEYWORD) where ai_table = 'TOUR_KEYWORD';
