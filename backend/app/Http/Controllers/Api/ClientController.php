<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:usuarios,user_email'],
            'password' => ['required', 'string', 'min:8'],
            'serie' => ['required', 'integer', 'min:0'],
            'numero_cliente' => ['required', 'integer', 'min:0'],
            'poblacion' => ['required', 'string', 'max:255'],
            'is_admin' => ['required', 'boolean'],
            'descuentoQ' => ['nullable', 'integer', 'min:0', 'max:100'],
            'descuentoF' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $user = User::query()->create([
            'user_name' => $data['nombre'],
            'user_email' => $data['email'],
            'password' => Hash::make($data['password']),
            'serie' => $data['serie'],
            'codigodiente' => $data['numero_cliente'],
            'poblacion' => $data['poblacion'],
            'role' => $data['is_admin'] ? 'admin' : 'user',
            'descuentoQ' => $data['descuentoQ'] ?? null,
            'descuentoF' => $data['descuentoF'] ?? null,
        ]);

        return response()->json([
            'message' => 'Cliente creado correctamente.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'serie' => $user->serie,
                'numero_cliente' => $user->codigodiente,
                'poblacion' => $user->poblacion,
                'descuentoQ' => $user->descuentoQ,
                'descuentoF' => $user->descuentoF,
            ],
        ], 201);
    }
}
