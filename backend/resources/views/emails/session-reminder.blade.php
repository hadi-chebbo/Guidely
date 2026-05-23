<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 24px; color: #111;">
    <h2>Hi {{ $reservation->user->name }},</h2>

    <p>
        Your session <strong>{{ $reservation->sessionAvailability->mentorSession->title }}</strong>
        starts in <strong>5 minutes</strong>
        at {{ $reservation->sessionAvailability->scheduled_at
            ->setTimezone($reservation->sessionAvailability->timezone)
            ->format('H:i T') }}.
    </p>

    <p>
        Platform: <strong>{{ $reservation->sessionAvailability->meeting_platform }}</strong>
    </p>

    <p>
        Meeting link:
        <a href="{{ $reservation->sessionAvailability->meeting_link }}">
            Join here
        </a>
    </p>

    <p>Get ready!</p>
</body>
</html>