package ch.ffhs.rushb.api

import ch.ffhs.rushb.controller.RequestContext
import ch.ffhs.rushb.model.User
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.JsonNodeType

fun parseFromClient(
    json: JsonNode,
    ctx: RequestContext?
): ClientEvent? {
    val type = json.get("type").asText()
    if (type.trim().isBlank()) {
        println("No Type found on the incoming message: $json")
        return null
    }
    val eventType = ClientEventType.fromString(type)
    if (eventType == null) {
        println("Type of message is not implemented: $type, dump: $json")
        return null
    }
    val data = nodeToString(json.get("data").asIterable().toList())
    return when (eventType) {
        ClientEventType.Subscribe -> parseSubscribeEvent(data)
        ClientEventType.KeyPress -> parseKeypressEvent(data, ctx)
        ClientEventType.Message -> parseMessageEvent(data)
        ClientEventType.CreateOpenGame -> parseCreateOpenGameEvent(data, ctx)
        ClientEventType.DeleteOpenGame -> parseDeleteOpenGameEvent(data, ctx)
        ClientEventType.JoinOpenGame -> parseJoinOpenGameEvent(data, ctx)
        ClientEventType.StartGameVsAi -> parseStartGameVsAiEvent(data, ctx)
        ClientEventType.StartGameVsPlayer -> parseStartGameVsPlayerEvent(data, ctx)
    }
}


private fun parseSubscribeEvent(data: List<String>): ClientEvent? {
    if (data.size == 2) {
        val user = User(data[0], data[1])
        return SubscribeEvent(user)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun parseKeypressEvent(data: List<String>, ctx: RequestContext?): ClientEvent? {
    if (ctx?.runningGame == null) {
        println("Missing or false request context: $data")
        return null
    }
    val keys = data.mapNotNull { s -> Key.fromString(s) }
    return KeyPressEvent(keys, ctx.runningGame)
}

private fun parseMessageEvent(data: List<String>): ClientEvent {
    return MessageEvent(data)
}

private fun parseCreateOpenGameEvent(data: List<String>, ctx: RequestContext?): ClientEvent? {
    if (ctx?.user == null) {
        println("Missing or false request context: $data")
        return null
    }
    if (data.size == 1) {
        val gameId = data[0]
        return CreateOpenGameEvent(ctx.user, gameId)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun parseDeleteOpenGameEvent(
    data: List<String>,
    ctx: RequestContext?,
): ClientEvent? {
    if (data.isNotEmpty()) {
        println("Data didn't match expected form: $data")
        return null
    }
    if (ctx?.openGame == null) {
        println("Missing or false request context: $data")
        return null
    }
    return DeleteOpenGameEvent(ctx.openGame)
}

private fun parseJoinOpenGameEvent(
    data: List<String>,
    ctx: RequestContext?,
): ClientEvent? {
    if (data.size != 1) {
        println("Data didn't match expected form: $data")
        return null
    }
    if (ctx?.user == null) {
        println("Missing or false request context: $data")
        return null
    }
    val openGameId = data[0]
    return JoinOpenGameEvent(ctx.user, openGameId)
}

private fun parseStartGameVsAiEvent(
    data: List<String>,
    ctx: RequestContext?,
): ClientEvent? {
    if (data.isNotEmpty()) {
        println("Data didn't match expected form: $data")
        return null
    }
    if (ctx?.openGame == null) {
        println("Missing or false request context: $data")
        return null
    }
    return StartGameVsAiEvent(ctx.openGame)
}

private fun parseStartGameVsPlayerEvent(
    data: List<String>,
    ctx: RequestContext?,
): ClientEvent? {
    if (data.isNotEmpty()) {
        println("Data didn't match expected form: $data")
        return null
    }
    if (ctx?.openGame == null) {
        println("Missing or false request context: $data")
        return null
    }
    return StartGameVsPlayerEvent(ctx.openGame)
}

private fun nodeToString(nodes: List<JsonNode>): List<String> {
    return nodes.filter { n -> n.nodeType == JsonNodeType.STRING }.map { n -> n.asText() }
}