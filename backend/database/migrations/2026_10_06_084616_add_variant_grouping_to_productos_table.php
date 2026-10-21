<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->string('grupo', 64)->nullable()->after('codigo')->index();
            $table->string('variante_tipo', 16)->nullable()->after('grupo');
            $table->string('variante_label', 64)->nullable()->after('variante_tipo');
            $table->boolean('es_principal')->default(false)->after('variante_label')->index();
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropIndex(['grupo']);
            $table->dropIndex(['es_principal']);
            $table->dropColumn(['grupo', 'variante_tipo', 'variante_label', 'es_principal']);
        });
    }
};
