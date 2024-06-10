<?php

namespace Database\Factories;

use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'game_id' => Game::all()->random()->id,
            'category' => mt_rand(0, 2),
            'podCategory' => mt_rand(0, 3),
            'type' => 0,
            'name' => $this->faker->text(100),
            'description' => $this->faker->paragraph,
            'price' => mt_rand(0, 10000),
            'count' => mt_rand(0, 9999),
            'shutdownTime' => null,
        ];
    }
}
