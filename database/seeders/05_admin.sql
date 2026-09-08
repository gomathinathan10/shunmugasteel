USE shunmugasteel_db;

-- Default admin account
-- Password: Admin@2026 (bcrypt hashed — change after first login)
INSERT INTO admins (name, email, password, role) VALUES
('Shunmuga Admin', 'admin@shunmugasteel.com',
 '$2y$12$8OJZQCKD7AEmLxX/7MyYzurkfVKsOyTC38Ci/meUDWpTiWOSl0LQW',
 'super_admin');
