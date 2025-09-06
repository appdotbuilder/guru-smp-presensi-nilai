<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
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
            'assignment_id' => 'required|exists:teacher_class_subjects,id',
            'type' => 'required|in:daily,midterm,final',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'grades' => 'required|array|min:1',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.score' => 'required|numeric|min:0|max:100',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'assignment_id.required' => 'Kelas dan mata pelajaran harus dipilih.',
            'assignment_id.exists' => 'Kelas dan mata pelajaran tidak valid.',
            'type.required' => 'Jenis nilai harus dipilih.',
            'type.in' => 'Jenis nilai tidak valid.',
            'date.required' => 'Tanggal nilai harus diisi.',
            'date.date' => 'Format tanggal tidak valid.',
            'description.max' => 'Deskripsi maksimal 255 karakter.',
            'grades.required' => 'Data nilai siswa harus diisi.',
            'grades.min' => 'Minimal harus ada satu siswa yang dinilai.',
            'grades.*.student_id.required' => 'ID siswa harus ada.',
            'grades.*.student_id.exists' => 'Siswa tidak ditemukan.',
            'grades.*.score.required' => 'Nilai harus diisi.',
            'grades.*.score.numeric' => 'Nilai harus berupa angka.',
            'grades.*.score.min' => 'Nilai minimal 0.',
            'grades.*.score.max' => 'Nilai maksimal 100.',
        ];
    }
}