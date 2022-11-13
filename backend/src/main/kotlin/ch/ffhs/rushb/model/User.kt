package ch.ffhs.rushb.model

import ch.ffhs.rushb.behavior.Serializable

data class User(override val id: String, var name: String) : Serializable {
    override fun toJSON(): String {
        return """
            {
                "id": "$id" , 
                "name": "$name"
            }
            """.trimIndent()
    }
}