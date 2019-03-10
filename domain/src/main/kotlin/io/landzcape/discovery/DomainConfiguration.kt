package io.landzcape.discovery

import io.landzcape.domain.ContextId
import io.landzcape.domain.DomainId

data class DomainConfiguration(val name: String?, val context: String?, val label: String?) {

    fun getDomainName(): String {
        if(name==null) {
            throw IllegalArgumentException("No name specified for domain configuration")
        }
        return name;
    }

    fun getContextName(): String {
        if(context==null) {
            throw IllegalArgumentException("No context specified for domain configuration")
        }
        return context;
    }

    fun getContextId(): ContextId {
        return ContextId(getContextName());
    }

    fun getDomainLabel(): String {
        if(label==null) {
            return getDomainName();
        }
        return label;
    }

    fun getDomainId(): DomainId {
        return DomainId(getDomainName(), getContextId())
    }


}