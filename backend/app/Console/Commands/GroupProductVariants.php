<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

#[Signature('products:group-variants')]
#[Description('Agrupa productos por variantes de talla/color a partir del codigo')]
class GroupProductVariants extends Command
{
    private const COLOR_WORDS = [
        'NEGRO', 'NEGRA', 'GRIS', 'ROSA', 'AZUL', 'VERDE', 'ROJO', 'ROJA',
        'BLANCO', 'BLANCA', 'AMARILLO', 'AMARILLA', 'NARANJA', 'MARRON',
        'MARRÓN', 'BEIGE', 'LILA', 'MORADO', 'MORADA', 'CELESTE', 'TURQUESA',
        'FUCSIA', 'CREMA', 'DORADO', 'DORADA', 'PLATEADO', 'PLATEADA',
        'MANZANA',
    ];

    public function handle(): int
    {
        $products = Product::query()
            ->orderBy('id')
            ->get(['id', 'codigo', 'nombre', 'medidas']);

        if ($products->isEmpty()) {
            $this->warn('No hay productos.');

            return self::SUCCESS;
        }

        $groups = $this->buildGroups($products);

        $updated = 0;

        foreach ($groups as $grupo => $members) {
            /** @var Collection<int, Product> $members */
            $tipo = $this->detectType($members);
            $principalId = $this->pickPrincipalId($members);

            foreach ($members as $product) {
                $label = $this->buildLabel($product, $tipo, $members->count() > 1);

                $product->forceFill([
                    'grupo' => $grupo,
                    'variante_tipo' => $members->count() > 1 ? $tipo : null,
                    'variante_label' => $members->count() > 1 ? $label : null,
                    'es_principal' => $product->id === $principalId,
                ])->save();

                $updated++;
            }
        }

        $multi = collect($groups)->filter(fn (Collection $m) => $m->count() > 1)->count();

        $this->info("Actualizados {$updated} productos.");
        $this->info("Grupos con variantes: {$multi}.");
        $this->info('Grupos totales: '.count($groups).'.');

        return self::SUCCESS;
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return array<string, Collection<int, Product>>
     */
    private function buildGroups(Collection $products): array
    {
        $byCodigo = $products->keyBy(fn (Product $p) => strtoupper(trim((string) $p->codigo)));

        /** @var array<string, list<Product>> $buckets */
        $buckets = [];

        foreach ($products as $product) {
            $codigo = strtoupper(trim((string) $product->codigo));
            $grupo = $this->resolveGrupo($codigo, $byCodigo);
            $buckets[$grupo][] = $product;
        }

        $groups = [];
        foreach ($buckets as $grupo => $members) {
            $groups[$grupo] = collect($members)->sortBy('id')->values();
        }

        return $groups;
    }

    /**
     * @param  Collection<string, Product>  $byCodigo
     */
    private function resolveGrupo(string $codigo, Collection $byCodigo): string
    {
        if (str_contains($codigo, '/')) {
            return explode('/', $codigo, 2)[0];
        }

        if (preg_match('/^(.+)-([A-Z])$/u', $codigo, $matches) === 1) {
            $base = $matches[1];
            $siblings = 0;

            foreach ($byCodigo->keys() as $other) {
                if (preg_match('/^'.preg_quote($base, '/').'-[A-Z]$/u', (string) $other) === 1) {
                    $siblings++;
                }
            }

            if ($siblings >= 2) {
                return $base;
            }
        }

        return $codigo;
    }

    /**
     * @param  Collection<int, Product>  $members
     */
    private function detectType(Collection $members): string
    {
        if ($members->count() <= 1) {
            return 'talla';
        }

        $colorHits = 0;

        foreach ($members as $product) {
            $nombre = strtoupper((string) $product->nombre);
            $codigo = strtoupper(trim((string) $product->codigo));

            foreach (self::COLOR_WORDS as $color) {
                if (str_contains($nombre, $color)) {
                    $colorHits++;
                    continue 2;
                }
            }

            if (preg_match('/-[A-Z]$/u', $codigo) === 1) {
                $colorHits++;
            }
        }

        return $colorHits >= (int) ceil($members->count() / 2) ? 'color' : 'talla';
    }

    /**
     * @param  Collection<int, Product>  $members
     */
    private function pickPrincipalId(Collection $members): int
    {
        $base = $members->first(function (Product $product) {
            $codigo = strtoupper(trim((string) $product->codigo));

            return ! str_contains($codigo, '/') && preg_match('/-[A-Z]$/u', $codigo) !== 1;
        });

        if ($base) {
            return (int) $base->id;
        }

        $letterA = $members->first(function (Product $product) {
            return preg_match('/-A$/u', strtoupper(trim((string) $product->codigo))) === 1;
        });

        if ($letterA) {
            return (int) $letterA->id;
        }

        return (int) $members->sortBy('id')->first()->id;
    }

    /**
     * @param  Collection<int, Product>  $members
     */
    private function buildLabel(Product $product, string $tipo, bool $hasVariants): ?string
    {
        if (! $hasVariants) {
            return null;
        }

        $nombre = strtoupper((string) $product->nombre);
        $codigo = strtoupper(trim((string) $product->codigo));

        if ($tipo === 'color') {
            foreach (self::COLOR_WORDS as $color) {
                if (str_contains($nombre, $color)) {
                    return ucfirst(mb_strtolower($color));
                }
            }

            if (preg_match('/-([A-Z])$/u', $codigo, $matches) === 1) {
                return $matches[1];
            }
        }

        if (preg_match('/\b(\d+\s*[xX×]\s*\d+(?:\s*[xX×]\s*\d+)?)\b/u', $nombre, $matches) === 1) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]) ?? $matches[1]);
        }

        if (preg_match('/\b(\d+\s*(?:GR|G|KG|ML|L|CM|UD|UNIDADES?))\b/u', $nombre, $matches) === 1) {
            return strtoupper(preg_replace('/\s+/', '', $matches[1]) ?? $matches[1]);
        }

        $medidas = strtoupper(trim((string) ($product->medidas ?? '')));
        if (
            $medidas !== ''
            && preg_match('/^(\d+\s*(?:GR|G|KG|ML|L|CM|UD)|(?:\d+\s*[xX×]\s*\d+))$/u', $medidas) === 1
        ) {
            return strtoupper(preg_replace('/\s+/', '', $medidas) ?? $medidas);
        }

        if (str_contains($codigo, '/')) {
            $suffix = explode('/', $codigo, 2)[1];

            return match (strtoupper($suffix)) {
                'G' => 'Granel',
                default => $suffix,
            };
        }

        if (preg_match('/-([A-Z])$/u', $codigo, $matches) === 1) {
            return $matches[1];
        }

        if ($medidas !== '' && ! in_array($medidas, ['PERRO', 'GATO', 'EMPAPADORES', 'TOALLITAS', 'CHAMPÚS', 'CHAMPUS'], true)) {
            return ucfirst(mb_strtolower($medidas));
        }

        return 'Único';
    }
}
