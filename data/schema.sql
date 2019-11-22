drop database if exists music;

create database music;

use music;

create table users (
	user_id varchar(8) not null,
	username varchar(32) not null,
	primary key (user_id)
);

insert into users(user_id, username) values
	('4d0cae84', 'fred'),
	('26a85b1c', 'barney'),
	('675cee52', 'betty'),
	('27b965f6', 'wilma'),
	('820e8a4d', 'bambam'),
	('fc42a34d', 'pebbles');

-- create list of defaults countries with ISO3166 code
create table if not exists countries (
    name char(64) not null,
    code varchar(4) not null,
    
    primary key (code)
);

insert into countries values 
    ('Singapore', 'sg'),
    ('Malaysia', 'my'),
    ('United Kingdom', 'uk'),
    ('United States of America', 'us'),
    ('Russia', 'ru'),
    ('Japan', 'jp');

-- create songs table with auto increment id as primary key
create table songs( 
	title varchar(128) not null,	-- song title
    song_url varchar(128) not null,	-- spaces filename
    country_code char(4) not null,		-- store country code as ISO 3166
    lyrics text,
    slot int default 3,	
    available int not null,
    primary key (country_code)
);

-- manage song checkout history
create table if not exists checkouts (
	id int auto_increment not null,
    country_code char(4) not null,
    user_id varchar(8) not null,
	timestamp timestamp default current_timestamp,
    
    primary key (id),
    constraint fk_song_id_tb_checkouts
    foreign key(country_code) references songs(country_code),
    constraint fk_user_id_tb_checkouts
    foreign key(user_id) references users(user_id)
);

-- manage user checkout history
create table if not exists user_history (
	id int auto_increment not null,
	user_id varchar(8) not null,
    song_name varchar(128) not null,
    checkout_timestamp timestamp not null,
    
    primary key (id),
    constraint fk_user_id_tb_user_history
    foreign key(user_id) references users(user_id)
);



