# Quland CMS — OpenAI Integration

## 1. Overview

Quland integrates OpenAI's GPT API for AI-assisted content generation within the admin panel. Admins can generate blog descriptions, product descriptions, SEO text, and other content using a text prompt.

## 2. Configuration

### 2.1 Package

**Package:** `openai-php/laravel` (via Composer)

### 2.2 Config File

**File:** `config/openai.php`

```php
return [
    'api_key' => env('OPENAI_API_KEY', ''),
    'organization' => env('OPENAI_ORGANIZATION', null),
    'model' => 'gpt-4o-mini',
    'max_tokens' => 500,
];
```

### 2.3 Dynamic Credential Loading

The API key is NOT loaded from `.env`. Instead, it's stored in the `global_settings` table and set at runtime:

```php
$open_ai_key = GlobalSetting::where('key', 'open_ai_secret_key')->first();
Config::set('openai.api_key', $open_ai_key->value);
```

This allows the admin to update the OpenAI API key without server access.

## 3. Controller

**File:** `app/Http/Controllers/Admin/OpenAIController.php`

**Route:** `POST /admin/open-ai` → `text_generate()`

```php
public function text_generate(Request $request)
{
    $request->validate([
        'text_field' => 'required|string|max:1000',
    ]);

    $open_ai_key = GlobalSetting::where('key', 'open_ai_secret_key')->first();
    Config::set('openai.api_key', $open_ai_key->value);

    $result = OpenAI::chat()->create([
        'model' => config('openai.model'),      // gpt-4o-mini
        'messages' => [
            ['role' => 'user', 'content' => $request->text_field],
        ],
        'max_tokens' => (int) config('openai.max_tokens'),  // 500
    ]);

    return response()->json([
        'response' => $result->choices[0]->message->content
    ]);
}
```

## 4. Frontend Usage (Admin Panel)

The OpenAI feature is consumed via AJAX from admin forms:

```javascript
// Example usage in admin blade template
$('.ai-generate-btn').click(function() {
    let prompt = $(this).data('prompt');
    let targetField = $(this).data('target');

    $.ajax({
        url: "{{ route('admin.openai.text') }}",
        method: 'POST',
        data: {
            text_field: prompt,
            _token: "{{ csrf_token() }}"
        },
        success: function(response) {
            $(targetField).val(response.response);
        }
    });
});
```

## 5. Admin Configuration

The API key is configured via the Global Settings admin panel:

**Setting Key:** `open_ai_secret_key`
**Setting Location:** Admin → Settings → OpenAI

## 6. Limitations

- Single prompt/response only (no conversation context)
- Fixed model (`gpt-4o-mini`) — not configurable via admin UI
- Fixed max tokens (500) — not configurable via admin UI
- No streaming support
- No error handling for API quota limits displayed to user
- No usage tracking or cost monitoring
