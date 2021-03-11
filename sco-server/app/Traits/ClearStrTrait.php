<?php

namespace App\Traits;

/**
 * Trait untuk membersihkan string
 */
trait ClearStrTrait
{
    public function clearStr(String $str, String $type = null)
    {
        switch (strtolower($type)) {
            case "upper":
                return htmlspecialchars(trim(strtoupper($str)));
                break;

            case "proper":
                return htmlspecialchars(trim(ucwords($str)));
                break;

            case "lower":
                return htmlspecialchars(trim(strtolower($str)));
                break;

            default:
                return htmlspecialchars(trim($str));
                break;
        }
    }
}
