select *
from cities
where unaccent("name") ILIKE unaccent('campofrio%')
order by "country"
limit 10