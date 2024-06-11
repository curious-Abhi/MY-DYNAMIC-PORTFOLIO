CREATE TABLE timelines (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    from_date DATE,
    to_date DATE
);
