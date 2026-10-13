<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MakeAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_an_administrator_non_interactively(): void
    {
        $this->artisan('krijo:make-admin', [
            '--name' => 'Pronari',
            '--email' => 'Pronari@Example.com',
            '--password' => 'fjalekalim-shume-i-gjate',
        ])->assertSuccessful();

        $user = User::query()->where('email', 'pronari@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('Pronari', $user->name);
        $this->assertTrue(Hash::check('fjalekalim-shume-i-gjate', $user->password));
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue($user->canAccessPanel(\Filament\Facades\Filament::getPanel('admin')));
    }

    public function test_it_rejects_short_passwords(): void
    {
        $this->artisan('krijo:make-admin', [
            '--name' => 'Pronari',
            '--email' => 'pronari@example.com',
            '--password' => 'shkurt',
        ])->assertFailed();

        $this->assertSame(0, User::query()->count());
    }

    public function test_it_refuses_to_overwrite_an_existing_account_without_the_update_flag(): void
    {
        User::factory()->create(['email' => 'pronari@example.com']);

        $this->artisan('krijo:make-admin', [
            '--name' => 'Tjetër',
            '--email' => 'pronari@example.com',
            '--password' => 'fjalekalim-shume-i-gjate',
        ])->assertFailed();

        $this->assertSame(1, User::query()->count());
    }

    public function test_it_updates_an_existing_account_with_the_update_flag(): void
    {
        $user = User::factory()->create(['email' => 'pronari@example.com']);

        $this->artisan('krijo:make-admin', [
            '--name' => 'Emër i ri',
            '--email' => 'pronari@example.com',
            '--password' => 'fjalekalim-i-ri-shume-i-gjate',
            '--update' => true,
        ])->assertSuccessful();

        $user->refresh();
        $this->assertSame('Emër i ri', $user->name);
        $this->assertTrue(Hash::check('fjalekalim-i-ri-shume-i-gjate', $user->password));
        $this->assertSame(1, User::query()->count());
    }

    public function test_the_created_administrator_can_log_in_to_the_panel(): void
    {
        $this->artisan('krijo:make-admin', [
            '--name' => 'Pronari',
            '--email' => 'pronari@example.com',
            '--password' => 'fjalekalim-shume-i-gjate',
        ])->assertSuccessful();

        $this->actingAs(User::query()->firstOrFail())->get('/admin')->assertOk();
    }
}
