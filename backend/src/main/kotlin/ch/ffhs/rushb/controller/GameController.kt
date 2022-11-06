package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.ai.GeneticFitter
import ch.ffhs.rushb.behavior.ai.MockGame
import ch.ffhs.rushb.behavior.ai.SeedUtil
import ch.ffhs.rushb.model.TileMap
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
        var instance: GameController? = null
    }

    init {
        if (instance == null) {
            instance = this

            /**
             * To train the AI, uncomment the next line. It will generate a serialized neural network
             * to your temp folder. To use it, remove the time stamp and move it to the resources folder.
             * To see the result, replace the variable game with
             * MockGame(SeedUtil().load())
             * instead of
             * Game("game 0", Level(TileMap.ONE))
             */

            // GeneticFitter().run()
        }
    }

    private val sessionList = HashMap<WebSocketSession, Subscriber>()
    private var uid = AtomicLong(0)
    private var game = Game("game 0", Level(TileMap.ONE))

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        broadcastToOthers(session, Message("left", session))
        instance!!.sessionList -= session
    }

    @Scheduled(fixedRate = 200)
    fun sendGameStatus() {
        instance!!.game.applyGameLoop()
        val gameData = instance!!.game.toJSON()
        broadcast(Message("game", gameData))
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val json = ObjectMapper().readTree(message.payload)
        when (json.get("type").asText()) {
            "subscribe" -> {
                val subscriber = Subscriber(instance!!.uid.getAndIncrement(), null)
                instance!!.sessionList += mapOf(session to subscriber)
                broadcast(Message("subscriber", instance!!.sessionList.values))
            }

            "message" -> {
                broadcast(Message("message", json.get("data").asText()))
            }

            "keyPress" -> {
                val keys = json.get("data").asIterable()
                for (key in keys) {
                    if (key.asText() == "ArrowLeft") {
                        instance!!.game.setVelocityX(instance!!.game.getPlayer1(), -1.0)
                    } else if (key.asText() == "ArrowRight") {
                        instance!!.game.setVelocityX(instance!!.game.getPlayer1(), 1.0)
                    } else if (key.asText() == "ArrowUp" || key.asText() == "SPACE") {
                        instance!!.game.setVelocityY(instance!!.game.getPlayer1())
                    } else if (key.asText() == "KeyE") {
                        instance!!.game.paint(instance!!.game.getPlayer1())
                    } else if (key.asText() == "KeyR") {
                        // TODO: hit
                    } else if (key.asText() == "KeyQ") {
                        // TODO: quit
                    }
                }
            }

            "register-as-player" -> {
                instance!!.sessionList[session]?.player = MockPlayer(json.get("data").asText())
                broadcast(Message("subscriber", instance!!.sessionList.values))
            }

            else -> {
                broadcast(Message("unknown message type", json.get("data").asText()))
            }
        }
    }


    private fun broadcast(msg: Message) {
        instance!!.sessionList.forEach { emit(it.key, msg) }
    }

    private fun broadcastToOthers(me: WebSocketSession, msg: Message) {
        instance!!.sessionList.filterNot { it.key == me }.forEach { emit(it.key, msg) }
    }

    @Synchronized
    private fun emit(session: WebSocketSession, msg: Message) {
        try {
            session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(msg)))
        } catch (e: RuntimeException) { // org.springframework.web.socket.sockjs.SockJsTransportFailureException, com.fasterxml.jackson.databind.exc.InvalidDefinitionException
            println(e)
        }
    }

}

