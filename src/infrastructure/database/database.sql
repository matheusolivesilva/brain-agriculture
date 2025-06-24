DROP DATABASE IF EXISTS agriculture_test;
CREATE DATABASE agriculture_test;

DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS producers;
DROP TABLE IF EXISTS harvests;
DROP TABLE IF EXISTS crops_planted;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS locations;

CREATE TABLE producers (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	document TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE properties (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	producer_id UUID,
	name TEXT NOT NULL,
	total_area NUMERIC NOT NULL,
	arable_area NUMERIC NOT NULL,
	vegetation_area NUMERIC NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (producer_id) REFERENCES producers (id)

);

CREATE TABLE harvests (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	year NUMERIC UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE crops_planted (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	harvest_id UUID NOT NULL,
	property_id UUID,
	type TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (harvest_id) REFERENCES harvests(id),
	FOREIGN KEY (property_id) REFERENCES properties(id)
);


CREATE TABLE states (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	state TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE cities (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	state_id UUID NOT NULL,
	city TEXT UNIQUE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (state_id) REFERENCES states(id)
);

CREATE TABLE locations (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	property_id UUID NOT NULL,
	city_id UUID NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	FOREIGN KEY (property_id) REFERENCES properties(id),
	FOREIGN KEY (city_id) REFERENCES cities(id)
);

