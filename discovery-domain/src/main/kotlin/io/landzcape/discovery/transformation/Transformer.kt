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
        }

        parser = getParser(split[0])
        plotter = getPlotter(split[2])
    }

    private fun getPlotter(to: String): Plotter {
        if(PLOTTERS.containsKey(to)) {
            return PLOTTERS.getValue(to)
        }
        throw IllegalArgumentException("Transformation to $to is unknown")
    }

    private fun getParser(from: String): Parser {
        if (from == "any") {
            return ANY_PARSER
        } else if (PARSERS.containsKey(from)) {
            return PARSERS.getValue(from)
        }
        throw IllegalArgumentException("Transformation from $from is unknown")
    }

    fun transform(string: String): String{
        return plotter(parser(string))
    }

    companion object {

        private val ANY_PARSER_TIE_ORDER = listOf("capital", "kebab", "snake", "camel")
        private val ANY_PARSER: Parser = { string ->
            val scoredParsers = PARSERS.entries.groupBy { getScore(it.value, string) }
            val bestScored = scoredParsers[scoredParsers.keys.max()]
            bestScored!!.sortedBy { ANY_PARSER_TIE_ORDER.indexOf(it.key) }.first().value.invoke(string)
        }

        private fun getScore(parser: Parser, string: String): Int {
            return parser.invoke(string).filter { it.length > 1 }.size
        }

        private val PARSERS: Map<String, Parser> = mapOf(
                Pair("camel", { string -> GenericParser({ c -> Regex("[A-Z]").matches(c.toString()) }, true, true).parse(string) }),
                Pair("kebab", { string -> GenericParser({ c -> '-'.equals(c) }).parse(string)}),
                Pair("snake", { string -> GenericParser({ c -> '_'.equals(c) }).parse(string)}),
                Pair("capital", { string -> GenericParser({ c -> ' '.equals(c) }).parse(string)})
        )
        private val PLOTTERS: Map<String, Plotter> = mapOf(
                Pair("camel", { tokens -> tokens.map { it[0].toUpperCase() + it.substring(1) }.joinToString("") }),
                Pair("kebab", { tokens -> tokens.joinToString("-").toLowerCase() }),
                Pair("snake", { tokens -> tokens.joinToString("_").toLowerCase() }),
                Pair("capital", { tokens -> tokens.map { it[0].toUpperCase() + it.substring(1) }.joinToString(" ") })
        )

    }

}