<?php

namespace App\Services;

use App\Models\MentorSession;
use App\Models\SessionAvailability;

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
                'created'   => collect(),
                'conflicts' => $conflicts,
                'all_conflicted' => true,
            ];
        }

        SessionAvailability::insert($toCreate);

        $created = $session->availabilities()
            ->whereIn('scheduled_at', array_column($toCreate, 'scheduled_at'))
            ->get();

        return [
            'created'        => $created,
            'conflicts'      => $conflicts,
            'all_conflicted' => false,
        ];
    }

    private function hasConflict(MentorSession $session, array $slot): bool
    {
        return $session->availabilities()
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($slot) {
                $query->whereBetween('scheduled_at', [$slot['scheduled_at'], $slot['ends_at']])
                    ->orWhereBetween('ends_at', [$slot['scheduled_at'], $slot['ends_at']])
                    ->orWhere(function ($q) use ($slot) {
                        $q->where('scheduled_at', '<=', $slot['scheduled_at'])
                            ->where('ends_at', '>=', $slot['ends_at']);
                    });
            })
            ->exists();
    }

    private function prepareSlot(int $sessionId, array $slot): array
    {
        return [
            'mentor_session_id' => $sessionId,
            'scheduled_at'      => $slot['scheduled_at'],
            'ends_at'           => $slot['ends_at'],
            'timezone'          => $slot['timezone'] ?? 'UTC',
            'status'            => 'open',
            'created_at'        => now(),
            'updated_at'        => now(),
        ];
    }
}
