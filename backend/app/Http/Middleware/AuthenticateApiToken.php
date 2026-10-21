<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = $request->bearerToken();

        if (! $header) {
            return response()->json(['message' => 'No autenticado.'], 401);
        }

        $user = User::query()->where('api_token', $header)->first();

        if (! $user) {
            return response()->json(['message' => 'Token inválido.'], 401);
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
