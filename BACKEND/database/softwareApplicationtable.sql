CREATE TABLE software_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  svg_public_id VARCHAR(255),
  svg_url TEXT
);
