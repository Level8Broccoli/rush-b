package ch.ffhs.rushb.controller

import ch.kaiki.nn.neuralnet.NeuralNetwork
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Controller
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.lang.RuntimeException
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
    private var game = Game()

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        broadcastToOthers(session, Message("left", session))
        instance.sessionList -= session
    }

    @Scheduled(fixedRate = 300)
    fun sendGameStatus() {
        instance.game.applyGameLoop()
        val moveData = instance.game.getCharacter1().toString()
        broadcast(Message("move", moveData))
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val json = ObjectMapper().readTree(message.payload)

        println("[Received WS Data] Session: ${session.getId()} | Type: ${json.get("type")} | Data: ${json.get("data")}")
        when (json.get("type").asText()) {
            "subscribe" -> {
                val subscriber = Subscriber(instance.uid.getAndIncrement(), null)
                instance.sessionList += mapOf(session to subscriber)
                broadcast(Message("subscriber", instance.sessionList.values))
            }

            "message" -> {
                broadcast(Message("message", json.get("data").asText()))
            }

            "keyPress" -> {
                val keys = json.get("data").asIterable()
                for (key in keys) {
                    if (key.asText() == "ArrowLeft") {
                        instance.game.getPlayer1().setVelocityX(-1.0);
                    } else if (key.asText() == "ArrowRight") {
                        instance.game.getPlayer1().setVelocityX(1.0);
                    } else if (key.asText() == "ArrowUp" || key.asText() == "SPACE") {
                        instance.game.getPlayer1().setVelocityY();
                    } else if (key.asText() == "EKey") {
                        // TODO: paint
                    } else if (key.asText() == "RKey") {
                        // TODO: hit
                    } else if (key.asText() == "QKey") {
                        // TODO: quit
                    }
                }
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



    private fun broadcast(msg: Message) {
        instance.sessionList.forEach { emit(it.key, msg) }
    }

    private fun broadcastToOthers(me: WebSocketSession, msg: Message) {
        instance.sessionList.filterNot { it.key == me }.forEach { emit(it.key, msg) }
    }

    @Synchronized private fun emit(session: WebSocketSession, msg: Message) {
        try {
            session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(msg)))
        } catch (e: RuntimeException) { // org.springframework.web.socket.sockjs.SockJsTransportFailureException
            println(e)
        }
    }

}

