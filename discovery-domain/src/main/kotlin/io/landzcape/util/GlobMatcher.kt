package io.landzcape.util


class GlobMatcher(val pattern: String?) {

    fun matches(string: String?): Boolean {
        if(string!= null && pattern!=null) {
            return matches(string, pattern);
        }
        return false
    }

    private fun matches(text: String, glob: String): Boolean {
        var pattern = glob
        var rest: String? = null
        val pos = pattern.indexOf('*')
        if (pos != -1) {
            rest = pattern.substring(pos + 1)
            pattern = pattern.substring(0, pos)
        }

        if (pattern.length > text.length)
            return false

        // handle the part up to the first *
        for (i in 0 until pattern.length)
            if (pattern[i] != '?' && !pattern.substring(i, i + 1).equals(text.substring(i, i + 1), ignoreCase = true))
                return false

        // recurse for the part after the first *, if any
        if (rest == null) {
            return pattern.length == text.length
        } else {
            for (i in pattern.length..text.length) {
                if (matches(text.substring(i), rest))
                    return true
            }
            return false
        }
    }
}