CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  proficiency INTEGER NOT NULL,
  svg_public_id VARCHAR(255),
  svg_url TEXT
);
