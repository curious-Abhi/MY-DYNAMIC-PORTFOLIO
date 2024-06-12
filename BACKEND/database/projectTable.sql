CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  git_repo_link TEXT NOT NULL,
  project_link TEXT NOT NULL,
  stack TEXT[] NOT NULL,
  technologies TEXT[] NOT NULL,
  deployed BOOLEAN NOT NULL,
  project_banner_public_id VARCHAR(255),
  project_banner_url TEXT
);
