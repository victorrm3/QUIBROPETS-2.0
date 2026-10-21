<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Laravel\Sanctum\PersonalAccessToken;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $this->resolveUser($request);
        $limit = $request->integer('limit');
        $ids = collect(explode(',', (string) $request->query('ids', '')))
            ->map(fn ($id) => (int) trim($id))
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values()
            ->all();

        $proveedor = trim((string) $request->query('proveedor', ''));
        $denominaciones = collect(explode(',', (string) $request->query('denominacion', '')))
            ->map(fn ($value) => trim($value))
            ->filter()
            ->unique()
            ->values()
            ->all();

        $query = Product::query();

        if ($ids !== []) {
            $query->whereIn('id', $ids);
        } else {
            $query->where('es_principal', true);

            if ($proveedor !== '') {
                $query->where('proveedor', $proveedor);
            }

            if ($denominaciones !== []) {
                $query->whereIn('denominacion', $denominaciones);
            }

            $query->orderBy('orden')->orderBy('id');

            if ($limit > 0) {
                $query->limit(min($limit, 500));
            }
        }

        $principals = $query->get();

        if ($ids !== []) {
            $order = array_flip($ids);
            $principals = $principals
                ->sortBy(fn (Product $product) => $order[$product->id] ?? PHP_INT_MAX)
                ->values();
        }

        $variantsByGrupo = $this->variantsByGrupo($principals);

        $products = $principals->map(
            fn (Product $product) => $this->serializeProduct($product, $user, $variantsByGrupo)
        );

        return response()->json([
            'data' => $products,
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $this->resolveUser($request);
        $product = Product::query()->find($id);

        if (! $product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        $display = $product;

        if ($product->grupo) {
            $principal = Product::query()
                ->where('grupo', $product->grupo)
                ->where('es_principal', true)
                ->first();

            if ($principal) {
                $display = $principal;
            }
        }

        $variantsByGrupo = $this->variantsByGrupo(collect([$display]));
        $payload = $this->serializeProduct($display, $user, $variantsByGrupo);
        $payload['selected_id'] = $product->id;

        return response()->json([
            'data' => $payload,
        ]);
    }

    /**
     * @param  Collection<int, Product>  $products
     * @return Collection<string, Collection<int, Product>>
     */
    private function variantsByGrupo(Collection $products): Collection
    {
        $grupos = $products
            ->pluck('grupo')
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($grupos === []) {
            return collect();
        }

        return Product::query()
            ->whereIn('grupo', $grupos)
            ->orderBy('id')
            ->get()
            ->groupBy('grupo');
    }

    /**
     * @param  Collection<string, Collection<int, Product>>  $variantsByGrupo
     * @return array<string, mixed>
     */
    private function serializeProduct(Product $product, ?User $user, Collection $variantsByGrupo): array
    {
        $basePrice = (float) $product->precio;
        $discount = $this->discountForProduct($product, $user);
        $finalPrice = $discount > 0
            ? round($basePrice * (1 - ($discount / 100)), 2)
            : $basePrice;

        $siblings = $product->grupo
            ? ($variantsByGrupo->get($product->grupo) ?? collect([$product]))
            : collect([$product]);

        $variantes = $siblings->map(function (Product $variant) use ($user) {
            $variantBase = (float) $variant->precio;
            $variantDiscount = $this->discountForProduct($variant, $user);
            $variantFinal = $variantDiscount > 0
                ? round($variantBase * (1 - ($variantDiscount / 100)), 2)
                : $variantBase;

            return [
                'id' => $variant->id,
                'codigo' => $variant->codigo,
                'label' => $variant->variante_label ?: $variant->codigo,
                'tipo' => $variant->variante_tipo,
                'stock' => $variant->stock,
                'precio' => $variantFinal,
                'precio_base' => $variantBase,
                'descuento' => $variantDiscount,
                'imagen' => $variant->imagen,
                'nombre' => $variant->nombre,
            ];
        })->values()->all();

        return [
            'id' => $product->id,
            'codigo' => $product->codigo,
            'nombre' => $product->nombre,
            'proveedor' => $product->proveedor,
            'denominacion' => $product->denominacion,
            'stock' => $product->stock,
            'precio' => $finalPrice,
            'precio_base' => $basePrice,
            'descuento' => $discount,
            'imagen' => $product->imagen,
            'medidas' => $product->medidas,
            'grupo' => $product->grupo,
            'variante_tipo' => $product->variante_tipo,
            'variantes' => $variantes,
        ];
    }

    private function resolveUser(Request $request): ?User
    {
        $token = $request->bearerToken();

        if (! $token) {
            return null;
        }

        $accessToken = PersonalAccessToken::findToken($token);

        $tokenable = $accessToken?->tokenable;

        return $tokenable instanceof User ? $tokenable : null;
    }

    private function discountForProduct(Product $product, ?User $user): int
    {
        if (! $user) {
            return 0;
        }

        $proveedor = strtoupper(trim((string) $product->proveedor));

        if ($proveedor === 'QUIBROPETS') {
            return (int) ($user->descuentoQ ?? 0);
        }

        if ($proveedor === 'FERRIBIELLA') {
            return (int) ($user->descuentoF ?? 0);
        }

        return 0;
    }
}
