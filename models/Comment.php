<?php
namespace app\models;
use yii\db\ActiveRecord;

class Comment extends ActiveRecord
{
    public static function tableName() { return 'comments'; }

    public function getUser() { return $this->hasOne(User::class, ['id' => 'user_id']); }
}