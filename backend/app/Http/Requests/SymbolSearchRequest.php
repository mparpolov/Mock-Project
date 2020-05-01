<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SymbolSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'symbol' => 'required|string|min:1|max:10'
        ];
    }

    public function messages()
    {
        return [
            'symbol.required' => 'Query parameter "symbol" is required for this request.',
            'symbol.max' => 'Query paramenter "symbol" cannot have more than 10 characters'
        ];
    }
}
