--
-- set todo-desc
--
UPDATE location SET l_meta_shortdesc='TODODESC' WHERE COALESCE(l_meta_shortdesc, '') = '';
UPDATE news SET n_message='TODODESC' WHERE COALESCE(n_message, '') = '';
UPDATE trip SET tr_meta_shortdesc='TODODESC' WHERE COALESCE(tr_meta_shortdesc, '') = '';
UPDATE kategorie SET k_meta_shortdesc='TODODESC' WHERE COALESCE(k_meta_shortdesc, '') = '';
UPDATE tour SET t_meta_shortdesc='TODODESC' WHERE COALESCE(t_meta_shortdesc, '') = '';
