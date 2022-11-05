package kotlincode.ch.ffhs.rushb.behavior

interface Serializable {
    val id: String
    fun toJSON(): String
}