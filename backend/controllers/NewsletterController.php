<?php
require_once __DIR__ . '/../config/database.php';

class NewsletterController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // POST /newsletter/subscribe  (public)
    public function subscribe(): never {
        $data  = input();
        $email = trim(strtolower($data['email'] ?? ''));

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 191) {
            respond(422, 'Please provide a valid email address.');
        }

        // Upsert: if already exists just re-activate
        $stmt = $this->db->prepare(
            "INSERT INTO newsletter_subscribers (email, status)
             VALUES (:email, 'active')
             ON DUPLICATE KEY UPDATE status = 'active', subscribed_at = subscribed_at"
        );
        $stmt->execute([':email' => $email]);

        respond(200, ['message' => 'Subscribed successfully.']);
    }

    // GET /admin/newsletter  (admin only)
    public function getSubscribers(): never {
        $rows = $this->db->query(
            "SELECT id, email, status, subscribed_at
             FROM newsletter_subscribers
             ORDER BY subscribed_at DESC"
        )->fetchAll(PDO::FETCH_ASSOC);

        respond(200, $rows);
    }
}
