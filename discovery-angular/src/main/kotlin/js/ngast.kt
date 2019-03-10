@file:JsModule("ngast")
@file:JsNonModule
package js;

external class ProjectSymbols {
    fun getModules(): Array<ModuleSymbol>;
    constructor(tsconfig: String, reader: FileReader, errorHandler: ErrorHandler)
}

external class ModuleSymbol {
    val symbol: StaticSymbol;
    fun getImportedModules(): Array<ModuleSymbol>
}

external class StaticSymbol {
    val filePath: String;
    val name: String;
    val members: Array<String>;
}

external interface FileReader {
    fun get(name: String): Any;
    fun getSync(name: String): Any;
}

external interface ErrorHandler {
    fun error(error: Any, path: String);
}

