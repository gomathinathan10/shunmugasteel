CREATE TABLE IF NOT EXISTS contact_enquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(191) NOT NULL,
  email       VARCHAR(191) NOT NULL,
  phone       VARCHAR(30)  DEFAULT NULL,
  subject     VARCHAR(100) DEFAULT NULL,
  message     TEXT         NOT NULL,
  status      ENUM('new','read','replied') NOT NULL DEFAULT 'new',
  admin_reply TEXT         DEFAULT NULL,
  replied_at  DATETIME     DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
