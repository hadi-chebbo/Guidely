<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\SearchUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;

class UserController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $users = User::when($request->role, fn($q) => $q->where('role', $request->role))
            ->paginate(15)
            ->withQueryString();

        return $this->success(UserResource::collection($users),"Users Fetched Successfully",200);
    }

    public function toggleBlock(User $user)
    {
        $user->is_blocked = !$user->is_blocked;
        $user->save();

        $message = $user->is_blocked ? "{$user->username} blocked successfully" : "{$user->username} unblocked successfully";

        return $this->success(new UserResource($user),$message,200);
    }

    public function search(SearchUserRequest $request)
    {
        $request->validated();

        $users = User::query()
            ->where('username','LIKE', '%' . $request->username . '%')
            ->limit(10)
            ->paginate(15);
        
        return $this->success(UserResource::collection($users),'Users Fetched Successfully',200);
    }
}
