package ch.ffhs.rushb.behavior

fun listToJSON(list: List<Serializable>): String {
    return """
            [${list.joinToString(separator = ",") { e -> e.toJSON() }}]
        """.trimIndent()
}

fun stringListToJSON(list: List<String>): String {
    return """
            [${list.joinToString(separator = ",") { s -> "\"$s\"" }}]
        """.trimIndent()
}
