package io.landzcape.domain

data class ContextId(val name: String) {

    companion object {
        fun from(name: String?): ContextId? {
            if (name != null) {
                return ContextId(name)
            }
            return null
        }
    }
}