<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

/**
 * Owner-only way to create (or reset) an administrator account for the /admin panel.
 * There is no public registration and no default credentials are shipped.
 */
class MakeAdminCommand extends Command
{
    protected $signature = 'krijo:make-admin
        {--name= : Display name of the administrator}
        {--email= : Login email address}
        {--password= : Password (omit to be prompted securely)}
        {--update : Update the name/password of an existing account with the same email}';

    protected $description = 'Create an administrator account for the Filament admin panel';

    public function handle(): int
    {
        $name = $this->option('name') ?: text(
            label: 'Administrator name',
            required: true,
        );

        $email = $this->option('email') ?: text(
            label: 'Administrator email',
            required: true,
            validate: fn (string $value): ?string => filter_var($value, FILTER_VALIDATE_EMAIL) ? null : 'Enter a valid email address.',
        );

        $email = mb_strtolower(trim($email));

        $existing = User::query()->where('email', $email)->first();

        if ($existing && ! $this->option('update')) {
            $scripted = ! $this->input->isInteractive() || filled($this->option('password'));

            if ($scripted) {
                $this->components->error("An account with the email {$email} already exists. Re-run with --update to change its password.");

                return self::FAILURE;
            }

            if (! confirm("An account with the email {$email} already exists. Update its name and password?", default: false)) {
                return self::FAILURE;
            }
        }

        $plainPassword = $this->option('password') ?: password(
            label: 'Password (minimum 12 characters)',
            required: true,
            validate: fn (string $value): ?string => mb_strlen($value) >= 12 ? null : 'Use at least 12 characters.',
        );

        $validator = Validator::make(
            ['name' => $name, 'email' => $email, 'password' => $plainPassword],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'password' => ['required', 'string', Password::min(12)],
            ],
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->components->error($error);
            }

            return self::FAILURE;
        }

        $user = $existing ?? new User;
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($plainPassword);
        $user->email_verified_at ??= now();
        $user->save();

        $this->components->info(($existing ? 'Updated' : 'Created')." administrator {$email}. Sign in at ".url('/admin').'.');

        return self::SUCCESS;
    }
}
