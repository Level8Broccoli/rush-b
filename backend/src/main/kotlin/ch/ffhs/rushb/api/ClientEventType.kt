package ch.ffhs.rushb.api

import ch.ffhs.rushb.behavior.listToJSON
import ch.ffhs.rushb.controller.*
import ch.ffhs.rushb.model.OpenGame
import ch.ffhs.rushb.model.User
import org.springframework.web.socket.WebSocketSession

// should be kept in sync with `serverEvents.ts`

enum class ClientEventType(val value: String) {
    Subscribe("subscribe"), KeyPress("keyPress"), Message("message"), CreateGame("createGame");

    companion object {
        fun fromString(value: String): ClientEventType? {
            return ClientEventType.values().find { k -> k.value == value }
        }
    }
}

enum class Key(val value: String) {
    ARROW_LEFT("ArrowLeft"), ARROW_RIGHT("ArrowRight"), ARROW_UP("ArrowLeft"), SPACE("SPACE"), KEY_E("KeyE"), KEY_Q("KeyQ");

    companion object {
        fun fromString(value: String): Key? {
            return Key.values().find { k -> k.value == value }
        }
    }
}

interface ClientEvent {
    fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    )

    val event: ClientEventType
}

data class SubscribeEvent(val user: User) : ClientEvent {

    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        addToSessions(session, user)
        addToUsers(user)
        emit(session, Message("openGames", listToJSON(openGames)))
        println("Subscribe Event")
        println(user)
    }

    override val event: ClientEventType
        get() = ClientEventType.Subscribe
}

data class MessageEvent(val messages: List<String>) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        broadcast(Message("message", messages))
    }

    override val event: ClientEventType
        get() = ClientEventType.Message
}

data class KeyPressEvent(val keys: List<Key>) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
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

    override val event: ClientEventType
        get() = ClientEventType.KeyPress
}

data class CreateGameEvent(val user: User, val gameId: String) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        val newGame = OpenGame(gameId, user)
        addToOpenGames(newGame)
        println("Create Game Event")
        println(newGame)
    }

    override val event: ClientEventType
        get() = ClientEventType.CreateGame
}
