package io.landzcape.discovery.transformation

class GenericParser(val splittingFilter: (Char)->Boolean, val keepSplitter: Boolean) {

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
        return result
    }

}
