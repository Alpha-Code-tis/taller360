<?php

namespace Database\Seeders;

use App\Models\RepresentateLegal;
use Illuminate\Database\Seeder;

class RepresentanteLegalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RepresentateLegal::create([
            'id_representante' => 1,
        ]);
    }
}
