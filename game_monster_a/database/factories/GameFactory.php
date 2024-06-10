<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            [
                'name' => [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                'podCategories' => [
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)']
                ]
            ],
            [
                'name' => [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                'podCategories' => [
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)']
                ]
            ],
            [
                'name' => [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                'podCategories' => [
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)'],
                    [$this->faker->word . '(ru)', $this->faker->word . '(en)']
                ]
            ],
        ];
        $name = [
            'title_en' => $this->faker->text(10) . '(en)',
            'title_ru' => $this->faker->text(10) . '(ru)'
        ];
        return [
            'name' => json_encode($name),
            'categories' => json_encode($categories),
            'image' => 'https://images.hdqwalls.com/download/shadow-of-the-tomb-raider-z3-2932x2932.jpg',
            'longImage' => 'https://images.hdqwalls.com/download/shadow-of-the-tomb-raider-z3-2932x2932.jpg'
        ];
    }
}
