package io.landzcape.discovery

enum class PathBasedDiscoverySource {
    FOLDER;
    companion object {
        fun fromString(string: String): PathBasedDiscoverySource {
            val uppercaseString = string.toUpperCase()
            val value = values().find { value -> value.name == uppercaseString }
            if (value == null) {
                val possibleValues = values().joinToString(", ") { it.name }
                val s = "$string is not a valid discovery source. Use one of $possibleValues"
                throw IllegalArgumentException(s)
            }
            return value

        }

    }
}
