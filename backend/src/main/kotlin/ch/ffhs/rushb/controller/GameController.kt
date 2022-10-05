package ch.ffhs.rushb.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.atomic.AtomicLong

data class Subscriber(val id: Long, var player: MockPlayer?)
data class MockPlayer(val name: String)
data class Message(val msgType: String, val data: Any)

class GameController : TextWebSocketHandler() {

    private val sessionList = HashMap<WebSocketSession, Subscriber>()
    private var uid = AtomicLong(0)

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        broadcastToOthers(session, Message("left", session))
        sessionList -= session
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val json = ObjectMapper().readTree(message.payload)
        when (json.get("type").asText()) {
            "subscribe" -> {
                val subscriber = Subscriber(uid.getAndIncrement(), null)
                sessionList += mapOf(session to subscriber)
                broadcast(Message("subscriber", sessionList.values))
            }

            "message" -> {
                broadcast(Message("message", json.get("data").asText()))
            }

            "register-as-player" -> {
                sessionList[session]?.player = MockPlayer(json.get("data").asText())
                broadcast(Message("subscriber", sessionList.values))
            }

            else -> {
                broadcast(Message("unknown message type", json.get("data").asText()))
            }
        }
    }

    private fun emit(session: WebSocketSession, msg: Message) =
        session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(msg)))

    private fun broadcast(msg: Message) = sessionList.forEach { emit(it.key, msg) }
    private fun broadcastToOthers(me: WebSocketSession, msg: Message) =
        sessionList.filterNot { it.key == me }.forEach { emit(it.key, msg) }
}

