<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\SubmitQuizRequest;
use App\Http\Resources\Student\QuestionResource;
use App\Models\Question;
use App\Services\QuizService;
use App\Traits\ApiResponseTrait;

class TestController extends Controller
{
    use ApiResponseTrait;

    public function getQuestions()
    {
        $questions = Question::with('options')
            ->orderBy('section')
            ->orderBy('order')
            ->get();

        return $this->success(QuestionResource::collection($questions), "Test Questions Fetched Successfully", 200);
    }

    public function submit(SubmitQuizRequest $request, QuizService $service)
    {
        $result = $service->submit($request->validated());
        return $this->success(
            [
                'recommendations' => $result['recommendations'],
            ],
            'Test Submitted Successfully',
            200
        );
    }
}
