@file:JsModule("glob")
@file:JsNonModule
package glob

external fun sync(pattern: String, options: Any?): Array<String>
