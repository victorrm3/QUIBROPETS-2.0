<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'productos';

    public $timestamps = false;

    protected $fillable = [
        'orden',
        'codigo',
        'grupo',
        'variante_tipo',
        'variante_label',
        'es_principal',
        'nombre',
        'proveedor',
        'denominacion',
        'stock',
        'precio',
        'imagen',
        'medidas',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'stock' => 'integer',
            'precio' => 'float',
            'es_principal' => 'boolean',
        ];
    }

    public function variants(): HasMany
    {
        return $this->hasMany(self::class, 'grupo', 'grupo')
            ->orderBy('id');
    }
}
