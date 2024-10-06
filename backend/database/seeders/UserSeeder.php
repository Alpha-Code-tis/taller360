<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Docente;
use App\Models\Administrador;
use App\Models\Estudiante;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear un docente
        $docente = Docente::create([
            'nombre_docente' => 'Juan',
            'ap_pat' => 'Pérez',
            'ap_mat' => 'García',
            'correo' => 'juan@example.com',
            'contrasenia' => Hash::make('password123'),
        ]);

        // Crear un administrador
        $admin = Administrador::create([
            'nombre' => 'Admin',  // Asume que tienes este campo en la tabla
            'correo' => 'admin@example.com',
            'contrasenia' => Hash::make('adminpassword'),
        ]);

        // Crear un estudiante
        $estudiante = Estudiante::create([
            'nombre_estudiante' => 'María',
            'ap_pat' => 'Rodríguez',
            'ap_mat' => 'López',
            'correo' => 'maria@example.com',
            'contrasenia' => Hash::make('studentpass'),
        ]);
    }
}
