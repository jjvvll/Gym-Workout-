<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseInstanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return  [
            'id' => $this->id,
            'exercise_id' => $this->exercise_id,
            'weight' => $this->weight,
            'weight_unit' => $this->weight_unit,
            'reps' => $this->reps,
            'sets' => $this->sets,
        ];
    }
}
