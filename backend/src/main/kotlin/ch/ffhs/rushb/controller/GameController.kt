package ch.ffhs.rushb.controller

import ch.ffhs.rushb.api.*
import ch.ffhs.rushb.behavior.listToJSON
import ch.ffhs.rushb.model.OpenGame
import ch.ffhs.rushb.model.User
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Controller
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler


data class Message(val msgType: String, val data: Any)

@EnableScheduling
@Controller
class GameController : TextWebSocketHandler() {

    companion object {
        var instance: GameController? = null
    }

    val sessionList = HashMap<WebSocketSession, User>()
    val userList = mutableListOf<User>()
    val openGameList = mutableListOf<OpenGame>()
    val runningGameList = mutableListOf<Game>()
//    private var game = Game("game 0", User("0", "DemoPlayer"), Level(TileMap.ONE))

    init {
        if (instance == null) {
            print("this will get initialized")
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


    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val subscriber = instance!!.sessionList[session]
        println("Left: $subscriber")
        broadcastToOthers(session, Message("left", session))
        instance!!.sessionList -= session
    }

    @Scheduled(fixedRate = 200)
    fun sendGameStatus() {
        instance!!.runningGameList.forEach { game ->
            game.applyGameLoop()
            val gameData = game.toJSON()
            broadcast(Message("game", gameData))
            println("Push Running Game")
            println(game.toJSON())
        }

        // TODO: remove inactive games
    }

    @Scheduled(fixedRate = 10_000)
    fun sendOpenGames() {
        broadcast(Message("openGames", listToJSON(instance!!.openGameList)))
        println("Push Open Games")
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val json = ObjectMapper().readTree(message.payload)
        val event = parseFromClient(json, instance!!.userList)
        when (event?.event) {
            ClientEventType.Subscribe -> {
                val e = event as SubscribeEvent
                instance!!.sessionList += mapOf(session to e.user)
                instance!!.userList += e.user
                emit(
                    session, Message("openGames", listToJSON(instance!!.openGameList))
                )
//                broadcast(Message("subscriber", instance!!.sessionList.values))
                println("Subscribe Event")
                println(e.user)
            }

            ClientEventType.Message -> {
                val e = event as MessageEvent
//                broadcast(Message("message", e.messages))
            }

            ClientEventType.KeyPress -> {
                val e = event as KeyPressEvent
                val keys = e.keys
                for (key in keys) {
                    if (key == Key.ARROW_LEFT) {
//                        instance!!.game.setVelocityX(instance!!.game.getPlayer1(), -1.0)
                    } else if (key == Key.ARROW_RIGHT) {
//                        instance!!.game.setVelocityX(instance!!.game.getPlayer1(), 1.0)
                    } else if (key == Key.ARROW_UP || key == Key.SPACE) {
//                        instance!!.game.setVelocityY(instance!!.game.getPlayer1())
                    } else if (key == Key.KEY_E) {
//                        instance!!.game.paint(instance!!.game.getPlayer1())
                    } else if (key == Key.KEY_Q) {
                        // TODO: quit
                    }
                }
            }

            ClientEventType.CreateGame -> {
                val e = event as CreateGameEvent
                val newGame = OpenGame(e.gameId, e.user)
                instance!!.openGameList += newGame

                println("Create Game Event")
                println(newGame)
            }

            null -> {
                println("Event couln't get parsed. $json")
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
        println("Try to emit $session $msg")
        try {
            session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(msg)))
        } catch (e: RuntimeException) { // org.springframework.web.socket.sockjs.SockJsTransportFailureException, com.fasterxml.jackson.databind.exc.InvalidDefinitionException
            println(e)
        }
    }
}

