-- Insert initial genres
INSERT INTO genres (name)
VALUES ('Action'), ('Drama'), ('Comedy'), ('Horror');

-- Insert an admin user
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@movies.com', 'hashed_password', 'admin');
