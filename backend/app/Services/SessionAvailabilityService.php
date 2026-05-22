<?php

namespace App\Services;

use App\Models\MentorSession;
use App\Models\SessionAvailability;
use Illuminate\Support\Str;

class SessionAvailabilityService
{
    public function createSlots(MentorSession $session, array $slots): array
    {
        $conflicts = [];
        $toCreate  = [];

        foreach ($slots as $index => $slot) {

            if ($this->hasConflict($session, $slot)) {
                $conflicts[] = $index;
                continue;
            }

            $toCreate[] = $this->prepareSlot($session->id, $slot);
        }

        if (empty($toCreate)) {
            return [
                'created'        => collect(),
                'conflicts'      => $conflicts,
                'all_conflicted' => true,
            ];
        }

        SessionAvailability::insert($toCreate);

        $created = $session->availabilities()
            ->whereIn('uuid', array_column($toCreate, 'uuid'))
            ->get();

        return [
            'created'        => $created,
            'conflicts'      => $conflicts,
            'all_conflicted' => false,
        ];
    }

    public function hasConflict(MentorSession $session, array $slot, ?int $ignoreId = null): bool
    {
        return $session->availabilities()
            ->when($ignoreId, function ($query) use ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        })
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($slot) {

                $query
                    ->where('scheduled_at', '<', $slot['ends_at'])
                    ->where('ends_at', '>', $slot['scheduled_at']);
            })
            ->exists();
    }

    private function prepareSlot(int $sessionId, array $slot): array
    {
        return [
            'uuid'               => Str::uuid(),

            'mentor_session_id' => $sessionId,

            'scheduled_at'      => $slot['scheduled_at'],

            'ends_at'           => $slot['ends_at'] ?? null,

            'timezone'          => $slot['timezone'] ?? 'UTC',

            'meeting_platform'  => $slot['meeting_platform'],

            'meeting_link'      => $slot['meeting_link'],

            'status'            => 'open',

            'created_at'        => now(),

            'updated_at'        => now(),
        ];
    }
}
