<?php
require_once __DIR__ . '/../config/database.php';

class ContactController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // POST /contact/submit  (public)
    public function submit(): never {
        $data    = input();
        $name    = trim($data['name']    ?? '');
        $email   = trim(strtolower($data['email']   ?? ''));
        $phone   = trim($data['phone']   ?? '');
        $subject = trim($data['subject'] ?? '');
        $message = trim($data['message'] ?? '');

        if (!$name || strlen($name) > 191) {
            respond(422, 'Please provide a valid name.');
        }
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 191) {
            respond(422, 'Please provide a valid email address.');
        }
        if (!$message) {
            respond(422, 'Message cannot be empty.');
        }

        $stmt = $this->db->prepare(
            "INSERT INTO contact_enquiries (name, email, phone, subject, message)
             VALUES (:name, :email, :phone, :subject, :message)"
        );
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':phone'   => $phone ?: null,
            ':subject' => $subject ?: null,
            ':message' => $message,
        ]);

        respond(200, ['message' => 'Your message has been received. We will get back to you within 2 hours.']);
    }

    // GET /admin/contact  (admin only)
    public function getEnquiries(): never {
        $rows = $this->db->query(
            "SELECT id, name, email, phone, subject, message, status, admin_reply, replied_at, created_at
             FROM contact_enquiries
             ORDER BY created_at DESC"
        )->fetchAll(PDO::FETCH_ASSOC);

        respond(200, $rows);
    }

    // PATCH /admin/contact/:id  (admin only — mark read or reply)
    public function update(int $id): never {
        $data   = input();
        $action = $data['action'] ?? '';

        if ($action === 'read') {
            $this->db->prepare(
                "UPDATE contact_enquiries SET status = 'read' WHERE id = :id AND status = 'new'"
            )->execute([':id' => $id]);
            respond(200, ['message' => 'Marked as read.']);
        }

        if ($action === 'reply') {
            $reply = trim($data['reply'] ?? '');
            if (!$reply) respond(422, 'Reply cannot be empty.');

            $this->db->prepare(
                "UPDATE contact_enquiries
                 SET status = 'replied', admin_reply = :reply, replied_at = NOW()
                 WHERE id = :id"
            )->execute([':reply' => $reply, ':id' => $id]);
            respond(200, ['message' => 'Reply saved.']);
        }

        respond(422, 'Unknown action.');
    }
}
