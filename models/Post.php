<?php
namespace app\models;
use yii\db\ActiveRecord;

class Post extends ActiveRecord
{
    public static function tableName() { return 'posts'; }

    public function getUser() { return $this->hasOne(User::class, ['id' => 'user_id']); }
    public function getLikes() { return $this->hasMany(Like::class, ['post_id' => 'id']); }
    public function getComments() { return $this->hasMany(Comment::class, ['post_id' => 'id']); }
}