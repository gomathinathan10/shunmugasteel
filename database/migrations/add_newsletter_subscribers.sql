CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(191) NOT NULL UNIQUE,
  status       ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
  subscribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
