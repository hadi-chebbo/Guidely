<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MajorDetailsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name_en'              => $this->name_en,
            'name_ar'              => $this->name_ar,
            'slug'                 => $this->slug,
            'description'          => $this->description,
            'duration_years'       => $this->duration_years,
            'difficulty_level'     => $this->difficulty_level,
            'salary_min'           => $this->salary_min,
            'salary_max'           => $this->salary_max,
            'local_demand'         => $this->local_demand,
            'international_demand' => $this->international_demand,
            'is_featured'          => $this->is_featured,
            'cover_image'          => $this->cover_image,
            
            'category' => [
                'slug'    => $this->category?->slug,
                'name_en' => $this->category?->name_en,
                'name_ar' => $this->category?->name_ar,
                'icon'    => $this->category?->icon
            ],

            'skills' => $this->skills->map(function ($skill) {
                return [
                    'name' => $skill->name,
                    'type' => $skill->type,
                    'icon' => $skill->icon
                ];
            }),

            'points' => $this->points->map(function ($point) {
                return [
                    'type'    => $point->type,
                    'content' => $point->content,
                ];
            }),

            'faqs' => $this->faqs->map(function ($faq) {
                return [
                    'question'   => $faq->question,
                    'answer'     => $faq->answer,
                    'sort_order' => $faq->sort_order
                ];
            }),

            'job_opportunities' => $this->jobOpportunities->map(function ($job) {
                return [
                    'id'             => $job->id,
                    'title_en'       => $job->title_en,
                    'title_ar'       => $job->title_ar,
                    'description_en' => $job->description_en,
                ];
            }),

            'hiring_companies' => $this->hiringCompanies->map(function ($company) {
                return [
                    'slug'     => $company->slug,
                    'name'     => $company->company_name,
                    'website'  => $company->website_url,
                    'industry' => $company->industry,
                    'location' => $company->location,
                    'logo'     => $company->logo_url
                ];
            }),

            'universities' => $this->universityMajors->map(function ($universityMajor) {
                return [
                    'slug'                    => $universityMajor->university?->slug,
                    'name_en'                 => $universityMajor->university?->name_en,
                    'name_ar'                 => $universityMajor->university?->name_ar,
                    'location'                => $universityMajor->university?->location,
                    'type'                    => $universityMajor->university?->type,
                    'logo'                    => $universityMajor->university?->logo_url,
                    'total_credits'           => $universityMajor->total_credits,
                    'credit_price_usd'        => $universityMajor->credit_price_usd,
                    'language_of_instruction' => $universityMajor->language_of_instruction,
                ];
            }),
            
        ];
    }
}
