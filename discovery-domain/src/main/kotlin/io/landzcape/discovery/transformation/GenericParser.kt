package io.landzcape.discovery.transformation

class GenericParser(
        val splittingFilter: (Char)->Boolean,
        val keepSplitter: Boolean = false,
        val joinSingleCharacters: Boolean = false
) {

    fun parse(string: String):List<String> {
        if(string.isEmpty()) {
            return emptyList()
        }
        val result = ArrayList<String>()
        val builder = StringBuilder()
        string.forEach { char ->
            if(this.splittingFilter(char)) {
                val token = builder.toString()
                if(token.isNotEmpty()) {
                    result.add(token)
                }
                builder.clear()
                if(keepSplitter) {
                    builder.append(char)
                }
            } else {
                builder.append(char)
            }
        }
        result.add(builder.toString())
        if (joinSingleCharacters) {
            val joinedResult = ArrayList<String>()
            val builder = StringBuilder()
            result.forEach { part ->
                if(part.length > 1) {
                    if (builder.length > 0) {
                        joinedResult.add(builder.toString())
                        builder.clear()
                    }
                    joinedResult.add(part)
                } else {
                    builder.append(part)
                }
            }
            val last = builder.toString()
            if(last.isNotEmpty()) {
                joinedResult.add(last)
            }
            return joinedResult
        }
        return result
    }

}
