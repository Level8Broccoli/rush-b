package ch.ffhs.rushb.api

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.JsonNodeType

fun parseFromClient(json: JsonNode): ClientEvent? {
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
    val data = json.get("data").asIterable().toList()
    return when (eventType) {
        ClientEventType.Subscribe -> parseSubscribe(data)
        ClientEventType.KeyPress -> parseKeypress(data)
        ClientEventType.Message -> parseMessage(data)
        ClientEventType.CreateGame -> parseCreateGame(data)
    }
}


private fun parseSubscribe(data: List<JsonNode>): ClientEvent? {
    if (data.size == 1 && data[0].nodeType == JsonNodeType.STRING) {
        val clientId = data[0].textValue()
        return SubscribeEvent(clientId)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun parseKeypress(data: List<JsonNode>): ClientEvent? {
    for (key in data) {
        if (key.nodeType != JsonNodeType.STRING) {
            println("Data didn't match expected form: $data")
            return null
        }
    }
    val keys = data.map { j -> j.asText() }.mapNotNull { s -> Key.fromString(s) }
    return KeyPressEvent(keys)
}

private fun parseMessage(data: List<JsonNode>): ClientEvent? {
    for (key in data) {
        if (key.nodeType != JsonNodeType.STRING) {
            println("Data didn't match expected form: $data")
            return null
        }
    }
    val messages = data.map { j -> j.asText() }
    return MessageEvent(messages)
}

private fun parseCreateGame(data: List<JsonNode>): ClientEvent? {
    if (data.size == 1 && data[0].nodeType == JsonNodeType.STRING) {
        val clientId = data[0].textValue()
        return CreateGameEvent(clientId)
    }
    println("Data didn't match expected form: $data")
    return null
}