<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'user_name',
    'user_email',
    'password',
    'role',
    'poblacion',
    'descuentoQ',
    'descuentoF',
    'codigodiente',
    'serie',
])]
#[Hidden(['password', 'api_token'])]
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // No usar cast "hashed" aquí: las contraseñas ya están en bcrypt en la BD.
        ];
    }

    public function getNameAttribute(): string
    {
        return (string) $this->attributes['user_name'];
    }

    public function getEmailAttribute(): string
    {
        return (string) $this->attributes['user_email'];
    }
}
