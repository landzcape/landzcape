package io.landzcape.domain

data class DomainId(val name: String, val context: ContextId) {

    companion object {
        fun from(name: String?, context: ContextId?): DomainId? {
            if(name!=null && context != null) {
                return DomainId(name, context)
            }
            return null
        }
    }
}