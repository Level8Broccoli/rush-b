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
    val data = nodeToString(json.get("data").asIterable().toList())
    return when (eventType) {
        ClientEventType.Subscribe -> parseSubscribe(data)
        ClientEventType.KeyPress -> parseKeypress(data)
        ClientEventType.Message -> parseMessage(data)
        ClientEventType.CreateGame -> parseCreateGame(data)
    }
}


private fun parseSubscribe(data: List<String>): ClientEvent? {
    if (data.size == 2) {
        val clientId = data[0]
        val clientName = data[1]
        return SubscribeEvent(clientId, clientName)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun parseKeypress(data: List<String>): ClientEvent {
    val keys = data.mapNotNull { s -> Key.fromString(s) }
    return KeyPressEvent(keys)
}

private fun parseMessage(data: List<String>): ClientEvent {
    return MessageEvent(data)
}

private fun parseCreateGame(data: List<String>): ClientEvent? {
    if (data.size == 2) {
        val clientId = data[0]
        val userName = data[1]
        return CreateGameEvent(clientId, userName)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun nodeToString(nodes: List<JsonNode>): List<String> {
    return nodes.filter { n -> n.nodeType == JsonNodeType.STRING }.map { n -> n.asText() }
}