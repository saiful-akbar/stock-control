<?php

namespace Database\Seeders;

use App\Models\User;
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
            'password'   => Hash::make('admin1234'),
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $user->Profile()->create([
            'profile_avatar'   => null,
            'profile_name'     => 'Super Administrator',
            'profile_email'    => null,
            'profile_division' => null,
            'profile_phone'    => null,
            'profile_address'  => null,
            'created_at'       => now(),
            'updated_at'       => now()
        ]);
    }

    public function menuItemData()
    {
        return DB::table('menu_items')->insert([
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Master Data',
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Incoming',
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Outgoing',
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'menu_i_title'    => 'Download',
                'created_at'      => now(),
                'updated_at'      => now()
            ],

        ]);
    }

    public function menuSubItemData()
    {
        return DB::table('menu_sub_items')->insert([

            /* sub menu master data */
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Master Data'),
                'menu_s_i_icon'  => 'category',
                'menu_s_i_title' => 'Items',
                'menu_s_i_url'   => '/items',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Master Data'),
                'menu_s_i_icon'  => 'people',
                'menu_s_i_title' => 'Users',
                'menu_s_i_url'   => '/users',
                'created_at'     => now(),
                'updated_at'     => now()
            ],
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Master Data'),
                'menu_s_i_icon'  => 'list',
                'menu_s_i_title' => 'Menu Management',
                'menu_s_i_url'   => '/menu-management',
                'created_at'     => now(),
                'updated_at'     => now()
            ],

            /* Sub menu incoming */
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Incoming'),
                'menu_s_i_icon'  => 'shopping_cart',
                'menu_s_i_title' => 'Purchase',
                'menu_s_i_url'   => '/purchase',
                'created_at'     => now(),
                'updated_at'     => now()
            ],

            /* Sub menu outgoing */
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Outgoing'),
                'menu_s_i_icon'  => 'local_shipping',
                'menu_s_i_title' => 'Delivery Note (Surat Jalan)',
                'menu_s_i_url'   => '/delivery-note',
                'created_at'     => now(),
                'updated_at'     => now()
            ],

            /* Sub menu document & download */
            [
                'id'             => Str::random(32),
                'menu_item_id'   => $this->getMenuItem('Download'),
                'menu_s_i_icon'  => 'folder',
                'menu_s_i_title' => 'Documents',
                'menu_s_i_url'   => '/documents',
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
                'menu_item_id'    => $this->getMenuItem('Master Data'),
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('Incoming'),
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('Outgoing'),
                'created_at'      => now(),
                'updated_at'      => now()
            ],
            [
                'id'              => Str::random(32),
                'user_id'         => $this->getUser('admin'),
                'menu_item_id'    => $this->getMenuItem('Download'),
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
                'menu_sub_item_id'  => $this->getMenuSubItem('/items'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/users'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/menu-management'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/purchase'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/delivery-note'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
                'created_at'        => now(),
                'updated_at'        => now()
            ],
            [
                'id'                => Str::random(32),
                'user_id'           => $this->getUser('admin'),
                'menu_sub_item_id'  => $this->getMenuSubItem('/documents'),
                'create' => true,
                'read'   => true,
                'update' => true,
                'delete' => true,
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

    private function getMenuItem($title)
    {
        $mi = DB::table('menu_items')
            ->select('id')
            ->where('menu_i_title', $title)
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
