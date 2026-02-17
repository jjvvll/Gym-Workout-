<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResrource extends JsonResource
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
            'workout_set_id' => $this->workout_set_id,
            'name' => $this->name,
            'is_bodyweight_exercise' => $this->is_bodyweight_exercise,
            'description' => $this->description,
            'restTime' => $this->restTime,
            'instances' => ExerciseInstanceResource::collection($this->whenLoaded('instances')),
        ];
    }
}
