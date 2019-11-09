--
-- set todo-keywords
--

-- insert keyword
INSERT INTO keyword (kw_name) SELECT "KW_TODOKEYWORDS" FROM dual
    WHERE NOT EXISTS (SELECT 1 FROM keyword WHERE kw_name="KW_TODOKEYWORDS")


-- add todo-keywords
INSERT INTO kategorie_keyword(k_id, kw_id)
    SELECT k_id, (SELECT MAX(kw_id) FROM keyword WHERE kw_name="KW_TODOKEYWORDS") AS kw_id FROM kategorie
        WHERE k_id NOT IN (SELECT distinct k_id FROM kategorie_keyword)
INSERT INTO tour_keyword(t_id, kw_id)
    SELECT t_id, (SELECT MAX(kw_id) FROM keyword WHERE kw_name="KW_TODOKEYWORDS") AS kw_id FROM tour
        WHERE t_id NOT IN (SELECT distinct t_id FROM tour_keyword)
INSERT INTO location_keyword(l_id, kw_id)
    SELECT l_id, (SELECT MAX(kw_id) FROM keyword WHERE kw_name="KW_TODOKEYWORDS") AS kw_id FROM location
        WHERE l_id NOT IN (SELECT distinct l_id FROM location_keyword)

