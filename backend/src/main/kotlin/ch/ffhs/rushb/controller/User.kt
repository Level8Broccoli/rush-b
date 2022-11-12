package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable

data class User(val serverId: Long, val clientId: String, var name: String) : Serializable {
    override val id: String
        get() = serverId.toString()

    override fun toJSON(): String {
        return """
            {
                "id": "$id" , 
                "clientId": "$clientId" , 
                "name": "$name" , 
            }
            """.trimIndent()
    }
}