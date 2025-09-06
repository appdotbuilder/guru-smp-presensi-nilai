<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
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
            'date' => 'required|date',
            'attendances' => 'required|array|min:1',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,sick,permission,absent',
            'attendances.*.notes' => 'nullable|string|max:255',
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
            'date.required' => 'Tanggal presensi harus diisi.',
            'date.date' => 'Format tanggal tidak valid.',
            'attendances.required' => 'Data presensi siswa harus diisi.',
            'attendances.min' => 'Minimal harus ada satu siswa yang dipresensi.',
            'attendances.*.student_id.required' => 'ID siswa harus ada.',
            'attendances.*.student_id.exists' => 'Siswa tidak ditemukan.',
            'attendances.*.status.required' => 'Status presensi harus dipilih.',
            'attendances.*.status.in' => 'Status presensi tidak valid.',
            'attendances.*.notes.max' => 'Catatan maksimal 255 karakter.',
        ];
    }
}