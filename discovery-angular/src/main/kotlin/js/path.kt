@file:JsModule("path")
@file:JsNonModule
package path;

external fun dirname(path: String): String
external fun dirname(path: String, child: String): String
external fun resolve(vararg path: String): String
external val delimiter: String