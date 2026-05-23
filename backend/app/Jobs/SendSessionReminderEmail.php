<?php

namespace App\Jobs;

use App\Mail\SessionReminderEmail;
use App\Models\UserReservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendSessionReminderEmail implements ShouldQueue
{
    use Dispatchable, Queueable, InteractsWithQueue, SerializesModels;

    public int $tries = 3;

    /**
     * Create a new job instance.
     */
    public function __construct(public readonly UserReservation $reservation){}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $reservation = $this->reservation->fresh();

        if(!$reservation || $reservation->status !== 'confirmed') return;

        Mail::to($reservation->user->email)
            ->send(new SessionReminderEmail($reservation));
    }
}
