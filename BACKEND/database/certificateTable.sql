CREATE TABLE certificates(
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    organization_name (255) NOT NULL
    img_public_id VARCHAR(255),
    img_url TEXT
);