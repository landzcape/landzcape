@file:JsModule("fs")
@file:JsNonModule
package js;

external fun readFile(fileName: String, encoding: String): String
external fun readFileSync(fileName: String, encoding: String): String
external fun writeFileSync(fileName: String, content: String)