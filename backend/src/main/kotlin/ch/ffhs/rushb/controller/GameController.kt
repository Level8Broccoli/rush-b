package ch.ffhs.rushb.controller

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Controller
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.atomic.AtomicLong


data class Subscriber(val id: Long, var player: MockPlayer?)
data class MockPlayer(val name: String)
data class Message(val msgType: String, val data: Any)

@EnableScheduling
@Controller
class GameController : TextWebSocketHandler() {

    companion object {
        lateinit var instance: GameController
    }

    init {
        instance = this
    }

    private val sessionList = HashMap<WebSocketSession, Subscriber>()
    private var uid = AtomicLong(0)
    private val game = Game()

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        broadcastToOthers(session, Message("left", session))
        instance.sessionList -= session
    }

    @Scheduled(fixedRate = 100)
    fun sendGameStatus() {
        broadcast(Message("move", game.getCharacter1().toString()))
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val json = ObjectMapper().readTree(message.payload)
        when (json.get("type").asText()) {
            "subscribe" -> {
                val subscriber = Subscriber(uid.getAndIncrement(), null)
                instance.sessionList += mapOf(session to subscriber)
                broadcast(Message("subscriber", instance.sessionList.values))
            }

            "message" -> {
                broadcast(Message("message", json.get("data").asText()))
            }

            "keyPress" -> {
                val key = json.get("data").asText();
                if (key == "ArrowLeft") {
                    game.getPlayer1().setVelocityX(-1.0);
                } else if (key == "ArrowRight") {
                    game.getPlayer1().setVelocityX(1.0);
                } else if (key == "ArrowUp") {
                    game.getPlayer1().setVelocityY();
                }
                broadcast(Message("move", game.getCharacter1().toString()))
            }

            "register-as-player" -> {
                instance.sessionList[session]?.player = MockPlayer(json.get("data").asText())
                broadcast(Message("subscriber", instance.sessionList.values))
            }

            else -> {
                broadcast(Message("unknown message type", json.get("data").asText()))
            }
        }
    }

    private fun emit(session: WebSocketSession, msg: Message) {
        session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(msg)))
    }

    private fun broadcast(msg: Message) = instance.sessionList.forEach { emit(it.key, msg) }

    private fun broadcastToOthers(me: WebSocketSession, msg: Message) =
        instance.sessionList.filterNot { it.key == me }.forEach { emit(it.key, msg) }
}

