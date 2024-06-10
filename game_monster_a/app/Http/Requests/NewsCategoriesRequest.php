<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsCategoriesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title_ru' => 'required|max:255|min:2',
            'title_en' => 'required|max:255|min:2'
        ];
    }
}
