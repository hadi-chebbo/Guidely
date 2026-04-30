<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f4; padding: 40px; }
        .container { background: #fff; padding: 40px; border-radius: 8px; max-width: 500px; margin: auto; }
        .btn { display: inline-block; padding: 12px 24px; background: #4F46E5; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello, {{ $userName }}!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="{{ $verificationUrl }}" class="btn">Verify Email Address</a>
        <p>This link will expire in <strong>60 minutes</strong>.</p>
        <p>If you did not create an account, no further action is required.</p>
        <div class="footer">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="{{ $verificationUrl }}">{{ $verificationUrl }}</a>
        </div>
    </div>
</body>
</html>