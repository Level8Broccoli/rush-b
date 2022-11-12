package ch.ffhs.rushb.behavior

fun listToJSON(list: List<Serializable>): String {
    return """
            [${list.map { e -> e.toJSON() }.joinToString { "," }}]
        """.trimIndent()
}
