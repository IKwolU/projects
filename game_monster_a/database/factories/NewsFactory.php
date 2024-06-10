<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Collection;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    $content = [
      'en' => [
        'title' => $this->faker->text(20) . '(en)',
        'article' => $this->faker->paragraph . '(en)'
      ],
      'ru' => [
        'title' => $this->faker->text(20) . '(ru)',
        'article' => $this->faker->paragraph . '(ru)',
      ],
    ];
    return [
      'categories' => json_encode([NewsCategory::all()->random()->id]),
      'content' => json_encode($content),
      'image' => json_encode('https://img.razrisyika.ru/kart/121/1200/483800-s-maynkraftom-38.jpg')
    ];
  }
}
