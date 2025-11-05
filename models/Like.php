<?php
namespace app\models;
use yii\db\ActiveRecord;

class Like extends ActiveRecord
{
    public static function tableName() { return 'likes'; }
}