<?php

namespace App\Observers;

use App\Models\UserLog;

class UserLogObserver
{
    public function creating(UserLog $user_log)
    {
        $user_log->ip      = $this->getClientIp();
        $user_log->ip2     = $this->getClientIp2();
        $user_log->browser = $this->getClientBrowser();
        $user_log->device  = $this->getClientDevice();
        $user_log->os      = $_SERVER["HTTP_USER_AGENT"];
    }

    // public function updating(UserLog $user_log)
    // {
    // }


    /**
     * Method untuk mengambil ip dari env
     * @return String
     */
    private function getClientIp2()
    {
        $ip = "IP address not recognized";
        if (getenv("HTTP_CLIENT_IP")) {
            $ip = getenv("HTTP_CLIENT_IP");
        } else if (getenv("HTTP_X_FORWARDED_FOR")) {
            $ip = getenv("HTTP_X_FORWARDED_FOR");
        } else if (getenv("HTTP_X_FORWARDED")) {
            $ip = getenv("HTTP_X_FORWARDED");
        } else if (getenv("HTTP_FORWARDED_FOR")) {
            $ip = getenv("HTTP_FORWARDED_FOR");
        } else if (getenv("HTTP_FORWARDED")) {
            $ip = getenv("HTTP_FORWARDED");
        } else if (getenv("REMOTE_ADDR")) {
            $ip = getenv("REMOTE_ADDR");
        }

        return $ip;
    }


    /**
     * Method untuk mengambil ip dari $_SERVER
     * @return String
     */
    private function getClientIp()
    {
        $ip2 = "IP address not recognized";
        if (isset($_SERVER["HTTP_CLIENT_IP"])) {
            $ip2 = $_SERVER["HTTP_CLIENT_IP"];
        } else if (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
            $ip2 = $_SERVER["HTTP_X_FORWARDED_FOR"];
        } else if (isset($_SERVER["HTTP_X_FORWARDED"])) {
            $ip2 = $_SERVER["HTTP_X_FORWARDED"];
        } else if (isset($_SERVER["HTTP_FORWARDED_FOR"])) {
            $ip2 = $_SERVER["HTTP_FORWARDED_FOR"];
        } else if (isset($_SERVER["HTTP_FORWARDED"])) {
            $ip2 = $_SERVER["HTTP_FORWARDED"];
        } else if (isset($_SERVER["REMOTE_ADDR"])) {
            $ip2 = $_SERVER["REMOTE_ADDR"];
        }

        return $ip2;
    }


    /**
     * Method untuk mengambil browser yang digunakan
     * @return String
     */
    private function getClientBrowser()
    {
        $browser = "Another browser";
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Netscape")) {
            $browser = "Netscape";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Firefox")) {
            $browser = "Firefox";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Chrome")) {
            $browser = "Chrome";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Opera")) {
            $browser = "Opera";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "MSIE")) {
            $browser = "Internet Explorer";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Safari")) {
            $browser = "Safari";
        }

        return $browser;
    }


    /**
     * Method untuk mengambil tipe device yang digunakan
     * @return String
     */
    private function getClientDevice()
    {
        $device = "Another device";
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Mobile")) {
            if (strpos($_SERVER["HTTP_USER_AGENT"], "Android")) {
                $device = "Andoid";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "iPhone")) {
                $device = "iPhone";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "iPad")) {
                $device = "iPad";
            } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Windows Phone")) {
                $device = "Windows Phone";
            }
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Windows")) {
            $device = "Windows";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Linux")) {
            $device = "Linux";
        } else if (strpos($_SERVER["HTTP_USER_AGENT"], "Mac OS")) {
            $device = "Mac OS";
        }

        return $device;
    }
}
