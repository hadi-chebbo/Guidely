<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\Student\SessionResource;
use App\Models\MentorSession;
use Illuminate\Http\Request;

class SessionController extends Controller
{

    public function index(Request $request)
    {
        $sessions = MentorSession::query()
            ->whereHas('mentor')
            ->whereHas('availabilities', function ($q) {
                $q->where('scheduled_at', '>=', now());
            })
            ->with([
                'mentor',
                'availabilities' => function ($q) {
                    $q->where('scheduled_at', '>=', now())
                        ->orderBy('scheduled_at');
                }
            ])
            ->latest()
            ->paginate(10);

        return SessionResource::collection($sessions);
    }
}
