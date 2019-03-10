package io.landzcape.discovery

import io.landzcape.domain.ContextId

data class ContextConfiguration(val name: String?, val label: String?) {

    fun getContextName(): String {
        if(name==null) {
            throw IllegalArgumentException("No name specified for context configuration")
        }
        return name;
    }

    fun getContextId(): ContextId {
        return ContextId(getContextName())
    }

    fun getContextLabel(): String {
        if(label==null) {
            return getContextName();
        }
        return label;
    }
}