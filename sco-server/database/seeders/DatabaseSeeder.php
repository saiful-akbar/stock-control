<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->userData();
        $this->menuItemData();
        $this->menuSubItemData();
        $this->userMenuItemData();
        $this->userMenuSubItemData();
    }

    public function userData()
    {
        $user = User::create([
            'username'   => 'admin',
            'password'   => Hash::make('admin'),
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        Profile::create([
            'user_id'          => $user->id,
            'profile_avatar'   => null,
            'profile_name'     => 'Super Administrator',
            'profile_email'    => 'admin@mail.com',
            'profile_division' => 'Administrator',
            'profile_phone'    => 'xxxx-xxxx-xxxx',
            'profile_address'  => 'Indonesia',
            'created_at'       => now(),
            'updated_at'       => now()
        ]);
    }

    public function menuItemData()
    {
        return DB::table('menu_items')->insert([
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Menu Management',
                'menu_i_url'      => '/menu',
                'menu_i_icon'     => 'list',
                'menu_i_children' => false,
                'created_at'      => now(),
                'updated_at'      => now()
            ], [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Users',
                'menu_i_url'      => '/user',
                'menu_i_icon'     => 'people',
                'menu_i_children' => false,
                'created_at'      => now(),
                'updated_at'      => now()
            ], [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Master Data',
                'menu_i_url'      => '/master',
                'menu_i_icon'     => 'account_balance',
                'menu_i_children' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Incoming',
                'menu_i_url'      => '/incoming',
                'menu_i_icon'     => 'subdirectory_arrow_right',
                'menu_i_children' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Outgoing',
                'menu_i_url'      => '/outgoing',
                'menu_i_icon'     => 'subdirectory_arrow_left',
                'menu_i_children' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],

        ]);
    }

    public function menuSubItemData()
    {
        return DB::table('menu_sub_items')->insert([
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/master'),
                'menu_s_i_title' => 'Items',
                'menu_s_i_url'   => '/master/items',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/master'),
                'menu_s_i_title' => 'Consignee',
                'menu_s_i_url'   => '/master/consignee',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/master'),
                'menu_s_i_title' => 'Store',
                'menu_s_i_url'   => '/master/store',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/incoming'),
                'menu_s_i_title' => 'Purchase',
                'menu_s_i_url'   => '/incoming/purchase',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/incoming'),
                'menu_s_i_title' => 'Return',
                'menu_s_i_url'   => '/incoming/return',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('/incoming'),
                'menu_s_i_title' => 'Take In Warehouse',
                'menu_s_i_url'   => '/incoming/takeIn',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
        ]);
    }

    public function userMenuItemData()
    {
        return DB::table('user_menu_item')->insert([
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('/user'),
                'user_m_i_create' => true,
                'user_m_i_read'   => true,
                'user_m_i_update' => true,
                'user_m_i_delete' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('/menu'),
                'user_m_i_create' => true,
                'user_m_i_read'   => true,
                'user_m_i_update' => true,
                'user_m_i_delete' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('/outgoing'),
                'user_m_i_create' => true,
                'user_m_i_read'   => true,
                'user_m_i_update' => true,
                'user_m_i_delete' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('/incoming'),
                'user_m_i_create' => true,
                'user_m_i_read'   => true,
                'user_m_i_update' => true,
                'user_m_i_delete' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('/master'),
                'user_m_i_create' => true,
                'user_m_i_read'   => true,
                'user_m_i_update' => true,
                'user_m_i_delete' => true,
                'created_at'      => now(),
                'updated_at'      => now()
            ],

        ]);
    }

    public function userMenuSubItemData()
    {
        return DB::table('user_menu_sub_item')->insert([
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/incoming/purchase'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/incoming/return'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/incoming/takeIn'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/master/store'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/master/consignee'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/master/items'),
                'user_m_s_i_create' => true,
                'user_m_s_i_read'   => true,
                'user_m_s_i_update' => true,
                'user_m_s_i_delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
        ]);
    }

    private function getUser($username)
    {
        $user = DB::table('users')
            ->select('id')
            ->where('username', $username)
            ->first();

        return $user->id;
    }

    private function getMenuItem($url)
    {
        $mi = DB::table('menu_items')
            ->select('id')
            ->where('menu_i_url', $url)
            ->first();

        return $mi->id;
    }

    private function getMenuSubItem($url)
    {
        $msi = DB::table('menu_sub_items')
            ->select('id')
            ->where('menu_s_i_url', $url)
            ->first();

        return $msi->id;
    }
}
