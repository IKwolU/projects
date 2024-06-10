<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NewsPosition>
 */
class NewsPositionFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $positions = [
      News::all()->random()->id,
      News::all()->random()->id,
      News::all()->random()->id,
      News::all()->random()->id
    ];
    return [
      'positions' => json_encode($positions)
    ];

  }
}
