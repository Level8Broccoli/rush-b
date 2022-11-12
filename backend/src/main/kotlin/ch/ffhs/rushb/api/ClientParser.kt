package ch.ffhs.rushb.api

import ch.ffhs.rushb.model.User
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.JsonNodeType

fun parseFromClient(json: JsonNode, userList: List<User>): ClientEvent? {
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
        ClientEventType.CreateGame -> parseCreateGame(data, userList)
    }
}


private fun parseSubscribe(data: List<String>): ClientEvent? {
    if (data.size == 2) {
        val user = User(data[0], data[1])
        return SubscribeEvent(user)
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

private fun parseCreateGame(data: List<String>, userList: List<User>): ClientEvent? {
    if (data.size == 2) {
        val userId = data[0]
        val user = userList.find { u -> u.id == userId }
        if (user == null) {
            println(userList)
            println("User does not exist: $userId")
            return null
        }
        val gameId = data[1]
        return CreateGameEvent(user, gameId)
    }
    println("Data didn't match expected form: $data")
    return null
}

private fun nodeToString(nodes: List<JsonNode>): List<String> {
    return nodes.filter { n -> n.nodeType == JsonNodeType.STRING }.map { n -> n.asText() }
}