<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponseTrait;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    use ApiResponseTrait;
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user=$request->user();

        if(! $user){
            return $this->error('Unauthorized',401);
        }

        if (!in_array($user->role, $roles)) {
            return $this->error('Forbidden',403);
        }
        
        return $next($request);
    }
}
