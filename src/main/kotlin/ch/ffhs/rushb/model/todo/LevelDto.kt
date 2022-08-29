package ch.ffhs.rushb.model.todo

data class LevelDto (
    val id : String,
    val tileMap: Array<IntArray>
    ) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as LevelDto

        if (id != other.id) return false
        if (!tileMap.contentDeepEquals(other.tileMap)) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + tileMap.contentDeepHashCode()
        return result
    }
}