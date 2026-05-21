<?php

namespace App\Http\Requests\Mentor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Validator;

class UpdateSessionAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'scheduled_at' => ['sometimes', 'required', 'date_format:Y-m-d H:i:s', 'after:now'],
            'ends_at' => ['sometimes', 'required', 'date_format:Y-m-d H:i:s'],
            'status' => ['sometimes', 'required', 'string', 'in:open,full,cancelled,completed'],
            'timezone' => ['sometimes', 'required', 'string', 'timezone'],
            'meeting_platform' => ['sometimes', 'string', 'max:124'],
            'meeting_link' => ['sometimes', 'url'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $data = $this->only(['scheduled_at', 'ends_at', 'status', 'timezone']);

            if (empty($data)) {
                $validator->errors()->add('availability', 'At least one field is required.');

                return;
            }

            $availability = $this->route('availability');

            $scheduledAt = $data['scheduled_at'] ?? $availability?->scheduled_at;
            $endsAt = $data['ends_at'] ?? $availability?->ends_at;

            if (
                ($this->has('scheduled_at') || $this->has('ends_at')) &&
                (! $scheduledAt || ! $endsAt)
            ) {
                $validator->errors()->add('ends_at', 'The availability end time is required.');

                return;
            }

            if ($scheduledAt && $endsAt && Carbon::parse($endsAt)->lte(Carbon::parse($scheduledAt))) {
                $validator->errors()->add('ends_at', 'The ends at field must be after scheduled at.');
            }
        });
    }
}
