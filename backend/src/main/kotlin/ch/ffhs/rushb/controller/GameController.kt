package ch.ffhs.rushb.controller

import ch.ffhs.rushb.api.*
import ch.ffhs.rushb.enums.Role
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
    private final val emit: Emit
    private final val broadcast: Broadcast
    private final val broadcastToOthers: BroadcastToOthers
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
        emit = createFnEmit()
        broadcast = createFnBroadcast(instance!!.sessionList, emit)
        broadcastToOthers = createFnBroadcastToOthers(instance!!.sessionList, emit)

    }


    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val subscriber = instance!!.sessionList[session]
        println("Left: $subscriber")
        broadcastToOthers(session, Message(ServerEventTypes.SESSION_CLOSED, session.toString()))
        instance!!.sessionList -= session
    }

    @Scheduled(fixedRate = 200)
    fun sendGameStatus() {
        instance!!.runningGameList.forEach { game ->
            game.applyGameLoop()
            val gameData = game.toJSON()
            broadcast(Message(ServerEventTypes.GAME, gameData))
            println("Push Running Game")
            println(game.toJSON())
        }

        // TODO: remove inactive games
    }


    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        val ctx = getRequestContext(session)
        val json = ObjectMapper().readTree(message.payload)
        val event = parseFromClient(json, ctx, instance!!.userList)
        if (event == null) {
            println("Event couldn't get parsed. $json")
            return
        }
        val addToSessions = createFnAddToSessions(instance!!.sessionList)
        val addToUsers = createAddToUsers(instance!!.userList)
        val addToOpenGames = createAddToOpenGames(instance!!.openGameList)
        val removeFromOpenGames = createRemoveFromOpenGames(instance!!.openGameList)

        event.execute(
            session,
            addToSessions,
            addToUsers,
            addToOpenGames,
            removeFromOpenGames,
            instance!!.openGameList,
            emit,
            broadcast,
            broadcastToOthers
        )

        println("****")
        println(instance!!.sessionList)
        println(instance!!.userList)
        println(instance!!.openGameList)
        println("****")
    }

    private fun getRequestContext(session: WebSocketSession): RequestContext? {
        val user = instance!!.sessionList[session] ?: return null
        val creatorOfOpenGame = instance!!.openGameList.find { g -> g.creator == user }
        if (creatorOfOpenGame != null) {
            return RequestContext(session, user, creatorOfOpenGame, null, Role.CREATOR)
        }
        val secondPlayerOfOpenGame = instance!!.openGameList.find { g -> g.secondPlayer == user }
        if (secondPlayerOfOpenGame != null) {
            return RequestContext(session, user, secondPlayerOfOpenGame, null, Role.SECOND_PLAYER)
        }
        return RequestContext(session, user, null, null, null)
    }
}

