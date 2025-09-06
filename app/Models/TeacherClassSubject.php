<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\TeacherClassSubject
 *
 * @property int $id
 * @property int $user_id
 * @property int $class_id
 * @property int $subject_id
 * @property int $academic_year
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $teacher
 * @property-read \App\Models\SchoolClass $schoolClass
 * @property-read \App\Models\Subject $subject
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject query()
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TeacherClassSubject whereUserId($value)
 * @method static \Database\Factories\TeacherClassSubjectFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class TeacherClassSubject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'class_id',
        'subject_id',
        'academic_year',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'academic_year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the teacher that owns the assignment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the class that owns the assignment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the subject that owns the assignment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}