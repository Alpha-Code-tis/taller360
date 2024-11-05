<?php

namespace Database\Seeders;

use App\Models\Ajuste;
use Illuminate\Database\Seeder;

class AjusteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Ajuste::create([
            'fecha_inicio_autoevaluacion' => null,
            'fecha_fin_autoevaluacion' => null,
            'fecha_inicio_eva_final' => null,
            'fecha_fin_eva_final' => null,
            'fecha_inicio_eva_cruzada' => null,
            'fecha_fin_eva_cruzada' => null,
        ]);
    }
}
