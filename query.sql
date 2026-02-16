CREATE TABLE countries(
    id serial primary key,
    country_code varchar(10),
    country_name varchar(50)
)

CREATE TABLE visited_countries(
    id serial primary key,
    country_code varchar(10) UNIQUE
)