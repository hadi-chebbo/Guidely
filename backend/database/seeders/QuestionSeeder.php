<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [

            // ==================
            // INTEREST SECTION
            // ==================

            [
                'text_en' => 'What type of problems do you enjoy solving the most?',
                'text_ar' => 'ما نوع المشكلات التي تستمتع بحلها أكثر؟',
                'section' => 'interest',
                'order'   => 1,
                'options' => [
                    [
                        'text_en' => 'Technical and engineering problems',
                        'text_ar' => 'مشكلات تقنية وهندسية',
                        'weights' => ['1' => 5],
                    ],
                    [
                        'text_en' => 'Business and financial challenges',
                        'text_ar' => 'تحديات تجارية ومالية',
                        'weights' => ['2' => 5],
                    ],
                    [
                        'text_en' => 'Health and human body related problems',
                        'text_ar' => 'مشكلات تتعلق بالصحة وجسم الإنسان',
                        'weights' => ['3' => 5],
                    ],
                ],
            ],

            [
                'text_en' => 'Which environment would you prefer to work in?',
                'text_ar' => 'ما البيئة التي تفضل العمل فيها؟',
                'section' => 'interest',
                'order'   => 2,
                'options' => [
                    [
                        'text_en' => 'A lab or technical workspace',
                        'text_ar' => 'مختبر أو مكان عمل تقني',
                        'weights' => ['1' => 4, '3' => 2],
                    ],
                    [
                        'text_en' => 'An office or corporate setting',
                        'text_ar' => 'مكتب أو بيئة شركات',
                        'weights' => ['2' => 5],
                    ],
                    [
                        'text_en' => 'A hospital or clinic',
                        'text_ar' => 'مستشفى أو عيادة',
                        'weights' => ['3' => 5],
                    ],
                ],
            ],

            [
                'text_en' => 'How do you feel about mathematics and logic?',
                'text_ar' => 'كيف تشعر تجاه الرياضيات والمنطق؟',
                'section' => 'interest',
                'order'   => 3,
                'options' => [
                    [
                        'text_en' => 'I love them, they come naturally to me',
                        'text_ar' => 'أحبهما وأجدهما سهلين',
                        'weights' => ['1' => 5, '2' => 2],
                    ],
                    [
                        'text_en' => 'I prefer working with people and ideas',
                        'text_ar' => 'أفضل العمل مع الناس والأفكار',
                        'weights' => ['2' => 4, '3' => 2],
                    ],
                    [
                        'text_en' => 'I prefer biology and natural sciences',
                        'text_ar' => 'أفضل الأحياء والعلوم الطبيعية',
                        'weights' => ['3' => 5],
                    ],
                ],
            ],

            [
                'text_en' => 'What motivates you most in a career?',
                'text_ar' => 'ما الذي يحفزك أكثر في مسيرتك المهنية؟',
                'section' => 'interest',
                'order'   => 4,
                'options' => [
                    [
                        'text_en' => 'Building systems and technologies',
                        'text_ar' => 'بناء الأنظمة والتقنيات',
                        'weights' => ['1' => 5],
                    ],
                    [
                        'text_en' => 'Growing a business and making profit',
                        'text_ar' => 'تنمية الأعمال وتحقيق الأرباح',
                        'weights' => ['2' => 5],
                    ],
                    [
                        'text_en' => 'Helping people improve their health',
                        'text_ar' => 'مساعدة الناس على تحسين صحتهم',
                        'weights' => ['3' => 5],
                    ],
                ],
            ],

            [
                'text_en' => 'Which subject did you enjoy most in school?',
                'text_ar' => 'ما المادة التي أحببتها أكثر في المدرسة؟',
                'section' => 'interest',
                'order'   => 5,
                'options' => [
                    [
                        'text_en' => 'Physics and computer science',
                        'text_ar' => 'الفيزياء وعلوم الحاسوب',
                        'weights' => ['1' => 5],
                    ],
                    [
                        'text_en' => 'Economics and accounting',
                        'text_ar' => 'الاقتصاد والمحاسبة',
                        'weights' => ['2' => 5],
                    ],
                    [
                        'text_en' => 'Biology and chemistry',
                        'text_ar' => 'الأحياء والكيمياء',
                        'weights' => ['3' => 5],
                    ],
                ],
            ],

            // ==================
            // SKILL SECTION
            // ==================

            [
                'text_en' => 'How comfortable are you with analyzing complex information?',
                'text_ar' => 'ما مدى راحتك في تحليل المعلومات المعقدة؟',
                'section' => 'skill',
                'order'   => 1,
                'options' => [
                    [
                        'text_en' => 'Very comfortable, I do it naturally',
                        'text_ar' => 'مرتاح جداً، أفعلها بشكل طبيعي',
                        'weights' => ['1' => 5],  // Critical Thinking
                    ],
                    [
                        'text_en' => 'Somewhat comfortable',
                        'text_ar' => 'مرتاح نوعاً ما',
                        'weights' => ['1' => 3],
                    ],
                    [
                        'text_en' => 'Not really my strength',
                        'text_ar' => 'ليست نقطة قوتي',
                        'weights' => ['1' => 1],
                    ],
                ],
            ],

            [
                'text_en' => 'When you face a difficult problem, what do you usually do?',
                'text_ar' => 'عندما تواجه مشكلة صعبة، ماذا تفعل عادةً؟',
                'section' => 'skill',
                'order'   => 2,
                'options' => [
                    [
                        'text_en' => 'Break it down and solve it step by step',
                        'text_ar' => 'أقسمها وأحلها خطوة بخطوة',
                        'weights' => ['2' => 5],  // Problem Solving
                    ],
                    [
                        'text_en' => 'Ask someone for help',
                        'text_ar' => 'أطلب المساعدة من شخص آخر',
                        'weights' => ['2' => 2, '3' => 2],
                    ],
                    [
                        'text_en' => 'Try different approaches until something works',
                        'text_ar' => 'أجرب طرقاً مختلفة حتى ينجح أحدها',
                        'weights' => ['2' => 3],
                    ],
                ],
            ],

            [
                'text_en' => 'How would you rate your communication skills?',
                'text_ar' => 'كيف تقيّم مهاراتك في التواصل؟',
                'section' => 'skill',
                'order'   => 3,
                'options' => [
                    [
                        'text_en' => 'Excellent, I express myself clearly',
                        'text_ar' => 'ممتازة، أعبر عن نفسي بوضوح',
                        'weights' => ['3' => 5],  // Communication
                    ],
                    [
                        'text_en' => 'Good, but I prefer writing over speaking',
                        'text_ar' => 'جيدة، لكنني أفضل الكتابة على الكلام',
                        'weights' => ['3' => 3],
                    ],
                    [
                        'text_en' => 'I prefer working independently',
                        'text_ar' => 'أفضل العمل باستقلالية',
                        'weights' => ['3' => 1],
                    ],
                ],
            ],

            [
                'text_en' => 'Have you ever written code or built a software project?',
                'text_ar' => 'هل سبق أن كتبت كوداً أو بنيت مشروعاً برمجياً؟',
                'section' => 'skill',
                'order'   => 4,
                'options' => [
                    [
                        'text_en' => 'Yes, I do it regularly',
                        'text_ar' => 'نعم، أفعل ذلك بانتظام',
                        'weights' => ['4' => 5],  // Programming
                    ],
                    [
                        'text_en' => 'I have tried it a few times',
                        'text_ar' => 'جربت ذلك عدة مرات',
                        'weights' => ['4' => 3],
                    ],
                    [
                        'text_en' => 'Never, but I am interested',
                        'text_ar' => 'لا، لكنني مهتم بتعلمه',
                        'weights' => ['4' => 1],
                    ],
                ],
            ],

            [
                'text_en' => 'How comfortable are you working with data and numbers?',
                'text_ar' => 'ما مدى راحتك في العمل مع البيانات والأرقام؟',
                'section' => 'skill',
                'order'   => 5,
                'options' => [
                    [
                        'text_en' => 'Very comfortable, I enjoy data analysis',
                        'text_ar' => 'مرتاح جداً، أستمتع بتحليل البيانات',
                        'weights' => ['5' => 5],  // Data Analysis
                    ],
                    [
                        'text_en' => 'Somewhat, I can handle basic analysis',
                        'text_ar' => 'نوعاً ما، أستطيع التعامل مع التحليل الأساسي',
                        'weights' => ['5' => 3],
                    ],
                    [
                        'text_en' => 'Not really, I prefer creative or people work',
                        'text_ar' => 'ليس كثيراً، أفضل العمل الإبداعي أو مع الناس',
                        'weights' => ['5' => 1],
                    ],
                ],
            ],

            [
                'text_en' => 'How familiar are you with computer networks and systems?',
                'text_ar' => 'ما مدى إلمامك بشبكات الحاسوب والأنظمة؟',
                'section' => 'skill',
                'order'   => 6,
                'options' => [
                    [
                        'text_en' => 'Very familiar, I understand how networks work',
                        'text_ar' => 'ملم جداً، أفهم كيف تعمل الشبكات',
                        'weights' => ['6' => 5],  // Networking
                    ],
                    [
                        'text_en' => 'Basic knowledge only',
                        'text_ar' => 'معرفة أساسية فقط',
                        'weights' => ['6' => 2],
                    ],
                    [
                        'text_en' => 'Not familiar at all',
                        'text_ar' => 'غير ملم بها على الإطلاق',
                        'weights' => ['6' => 0],
                    ],
                ],
            ],
        ];

        foreach ($questions as $questionData) {
            $options = $questionData['options'];
            unset($questionData['options']);

            $question = Question::create($questionData);

            foreach ($options as $option) {
                $question->options()->create($option);
            }
        }
    }
}