<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Game;
use App\Models\News;
use App\Models\NewsCategory;
use App\Models\NewsPosition;
use App\Models\Product;
use App\Models\settings;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        NewsCategory::factory(10)->create();
        News::factory(40)->create();
        NewsPosition::factory(1)->create();

        User::factory(10)->create();
        Game::factory(12)->create();

        Product::factory(1000)->create();

        settings::factory(1)->create();

        Role::create(['name' => 'User', 'guard_name' => 'web']);
        Role::create(['name' => 'SuperAdmin']);


    }
}
