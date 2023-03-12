DROP TABLE IF EXISTS polls CASCADE;
CREATE TABLE polls (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  question VARCHAR(255) NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  date_completed TIMESTAMP,
  complete BOOLEAN DEFAULT FALSE
);
