<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    
    protected $fillable = [
        'name',
        'task',
        'delivery_date',
        'user_id'
    ];
    
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
}
