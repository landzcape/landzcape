package io.landzcape.discovery.transformation

typealias Parser = (String) -> List<String>
typealias Plotter = (List<String>) -> String

class Transformer {

    val parser: Parser;
    val plotter: Plotter;

    constructor(type: String) {
        val split = type.split("-")
        if(split.size != 3 || split[1] != "to") {
            throw IllegalArgumentException("Transformer type needs to have 3 components in a format like 'kebab-to-camel'.")
        } else if(!PARSERS.containsKey(split[0]) || !PLOTTERS.containsKey(split[2])) {
            throw IllegalArgumentException("Transformation "+type+" is unknown")
        }
        parser = PARSERS[split[0]]!!
        plotter = PLOTTERS[split[2]]!!
    }

    fun transform(string: String): String{
        return plotter(parser(string))
    }

    companion object {
        val PARSERS: Map<String, Parser> = mapOf(
                Pair("camel", { string -> GenericParser({ c -> Regex("[A-Z]").matches(c.toString()) }, true).parse(string) }),
                Pair("kebab", { string -> GenericParser({ c -> '-'.equals(c) }, false).parse(string)}),
                Pair("snake", { string -> GenericParser({ c -> '_'.equals(c) }, false).parse(string)})
        )
        val PLOTTERS: Map<String, Plotter> = mapOf(
            Pair("camel", { tokens -> tokens.map { it[0].toUpperCase() + it.substring(1) }.joinToString("")}),
            Pair("kebab", { tokens -> tokens.joinToString("-")}),
            Pair("snake", { tokens -> tokens.joinToString("_")})
        )
    }

}