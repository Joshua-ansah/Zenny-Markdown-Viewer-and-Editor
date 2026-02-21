# Quland CMS — Support Ticket System

## 1. Overview

The SupportTicket module (`Modules/SupportTicket`) provides a messaging system between users and admins with ticket priority levels, file attachments, and seen/unseen message tracking.

## 2. Module Structure

```
Modules/SupportTicket/
├── Entities/
│   ├── SupportTicket.php
│   └── SupportTicketMessage.php
├── Http/Controllers/
│   ├── UserSupportTicketController.php
│   └── AdminSupportTicketController.php
├── Routes/web.php
└── Resources/views/
```

## 3. Models

### 3.1 SupportTicket

```php
protected $fillable = [
    'user_id', 'subject', 'priority', 'status',
];

// Priority: low, medium, high
// Status: open, closed

public function messages()
{
    return $this->hasMany(SupportTicketMessage::class);
}

public function user()
{
    return $this->belongsTo(User::class);
}

// Helper: count unseen admin messages for user
public function unseenUserMessages()
{
    return $this->messages()
        ->where('sender_type', 'admin')
        ->where('is_seen', 0)
        ->count();
}

// Helper: count unseen user messages for admin
public function unseenAdminMessages()
{
    return $this->messages()
        ->where('sender_type', 'user')
        ->where('is_seen', 0)
        ->count();
}
```

### 3.2 SupportTicketMessage

```php
protected $fillable = [
    'support_ticket_id',
    'message',
    'sender_type',  // 'user' or 'admin'
    'file',         // Attachment filename
    'is_seen',      // 0 = unseen, 1 = seen
];
```

## 4. User-Side Operations

**Controller:** `Modules/SupportTicket/Http/Controllers/UserSupportTicketController.php`

### 4.1 Routes

```
GET  /user/support-tickets          → index()       Ticket listing
GET  /user/support-ticket/create    → create()      Create form
POST /user/support-ticket           → store()       Submit ticket
GET  /user/support-ticket/{id}      → show()        View conversation
POST /user/support-ticket/reply     → reply()       Send reply
```

### 4.2 Create Ticket

```php
public function store(Request $request)
{
    $request->validate([
        'subject' => 'required|max:255',
        'priority' => 'required|in:low,medium,high',
        'message' => 'required',
        'file' => 'nullable|file|max:5120',
    ]);

    $ticket = SupportTicket::create([
        'user_id' => Auth::id(),
        'subject' => $request->subject,
        'priority' => $request->priority,
        'status' => 'open',
    ]);

    $messageData = [
        'support_ticket_id' => $ticket->id,
        'message' => $request->message,
        'sender_type' => 'user',
    ];

    if ($request->hasFile('file')) {
        $fileName = uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
        $request->file('file')->move(public_path('uploads/support_tickets/'), $fileName);
        $messageData['file'] = $fileName;
    }

    SupportTicketMessage::create($messageData);
}
```

### 4.3 View Ticket (Mark messages seen)

```php
public function show($id)
{
    $ticket = SupportTicket::where('user_id', Auth::id())->findOrFail($id);

    // Mark all admin messages as seen
    SupportTicketMessage::where('support_ticket_id', $id)
        ->where('sender_type', 'admin')
        ->update(['is_seen' => 1]);

    $messages = SupportTicketMessage::where('support_ticket_id', $id)
        ->orderBy('created_at')
        ->get();

    return view('supportticket::user.show', compact('ticket', 'messages'));
}
```

## 5. Admin-Side Operations

**Controller:** `Modules/SupportTicket/Http/Controllers/AdminSupportTicketController.php`

### 5.1 Routes

```
GET  /admin/support-tickets         → index()       All tickets
GET  /admin/support-ticket/{id}     → show()        View conversation
POST /admin/support-ticket/reply    → reply()       Admin reply
GET  /admin/support-ticket-close/{id} → close()     Close ticket
```

### 5.2 Admin Reply

```php
public function reply(Request $request)
{
    $request->validate([
        'ticket_id' => 'required|exists:support_tickets,id',
        'message' => 'required',
        'file' => 'nullable|file|max:5120',
    ]);

    $messageData = [
        'support_ticket_id' => $request->ticket_id,
        'message' => $request->message,
        'sender_type' => 'admin',
    ];

    if ($request->hasFile('file')) {
        $fileName = uniqid() . '.' . $request->file('file')->getClientOriginalExtension();
        $request->file('file')->move(public_path('uploads/support_tickets/'), $fileName);
        $messageData['file'] = $fileName;
    }

    SupportTicketMessage::create($messageData);

    // Mark all user messages as seen
    SupportTicketMessage::where('support_ticket_id', $request->ticket_id)
        ->where('sender_type', 'user')
        ->update(['is_seen' => 1]);
}
```

## 6. Unseen Message Badge (Global)

**File:** `app/Providers/AppServiceProvider.php`

```php
View::composer('*', function ($view) {
    if (Auth::check()) {
        $unseenMessages = SupportTicketMessage::whereHas('ticket', function ($q) {
            $q->where('user_id', Auth::id());
        })->where('sender_type', 'admin')
          ->where('is_seen', 0)
          ->count();

        $view->with('unseen_support_messages', $unseenMessages);
    }
});
```

This makes the unseen count available in all views for badge display.

## 7. File Storage

| Content | Path |
|---------|------|
| Ticket attachments | `public/uploads/support_tickets/` |
| Max file size | 5 MB |
