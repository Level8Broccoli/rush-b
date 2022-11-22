package ch.ffhs.rushb.api

import ch.ffhs.rushb.behavior.listToJSON
import ch.ffhs.rushb.behavior.stringListToJSON
import ch.ffhs.rushb.controller.*
import ch.ffhs.rushb.model.User
import org.springframework.web.socket.WebSocketSession

// should be kept in sync with `serverEvents.ts`

enum class ClientEventType(val value: String) {
    Subscribe("subscribe"),
    KeyPress("keyPress"),
    Message("message"),
    CreateOpenGame("createOpenGame"),
    DeleteOpenGame("deleteOpenGame"),
    JoinOpenGame("joinOpenGame"),
    StartGame("startGame");

    companion object {
        fun fromString(value: String): ClientEventType? {
            return ClientEventType.values().find { k -> k.value == value }
        }
    }
}

enum class Key(val value: String) {
    ARROW_LEFT("ArrowLeft"), ARROW_RIGHT("ArrowRight"), ARROW_UP("ArrowUp"), SPACE("Space"), KEY_E("KeyE"), KEY_Q("KeyQ");

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
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
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
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        addToSessions(session, user)
        addToUsers(user)
        emit(session, Message(ServerEventTypes.OPEN_GAMES, listToJSON(openGames)))
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
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        broadcast(Message(ServerEventTypes.MESSAGE, stringListToJSON(messages)))
    }

    override val event: ClientEventType
        get() = ClientEventType.Message
}

data class KeyPressEvent(val keys: List<Key>, val runningGame: RunningGame) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        for (key in keys) {
            if (key == Key.ARROW_LEFT) {
                runningGame.setVelocityX(runningGame.getPlayer1(), -1.0)
            } else if (key == Key.ARROW_RIGHT) {
                runningGame.setVelocityX(runningGame.getPlayer1(), 1.0)
            } else if (key == Key.ARROW_UP || key == Key.SPACE) {
                runningGame.setVelocityY(runningGame.getPlayer1())
            } else if (key == Key.KEY_E) {
                runningGame.paint(runningGame.getPlayer1())
            } else if (key == Key.KEY_Q) {
                // TODO: quit
            }
        }
    }

    override val event: ClientEventType
        get() = ClientEventType.KeyPress
}

data class CreateOpenGameEvent(val user: User, val gameId: String) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        val newGame = OpenGame(gameId, user)
        addToOpenGames(newGame)
        broadcast(Message(ServerEventTypes.OPEN_GAMES, listToJSON(openGames)))
    }

    override val event: ClientEventType
        get() = ClientEventType.CreateOpenGame
}

data class DeleteOpenGameEvent(val openGame: OpenGame) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        removeFromOpenGames(openGame)
        broadcast(Message(ServerEventTypes.OPEN_GAMES, listToJSON(openGames)))
    }

    override val event: ClientEventType
        get() = ClientEventType.DeleteOpenGame
}

data class JoinOpenGameEvent(val user: User, val openGameId: String) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        val openGame = openGames.find { g -> g.id == openGameId }
        if (openGame == null) {
            println("Game not found")
            return
        }
        if (openGame.secondPlayer != null) {
            println("Game already has a second player: ${openGame.secondPlayer}")
            return
        }
        openGame.secondPlayer = user
        broadcast(Message(ServerEventTypes.OPEN_GAMES, listToJSON(openGames)))
    }

    override val event: ClientEventType
        get() = ClientEventType.JoinOpenGame
}

data class StartGameEvent(val openGame: OpenGame) : ClientEvent {
    override fun execute(
        session: WebSocketSession,
        addToSessions: AddToSessions,
        addToUsers: AddToUsers,
        addToOpenGames: AddToOpenGames,
        removeFromOpenGames: RemoveFromOpenGames,
        addToGames: AddToGames,
        openGames: List<OpenGame>,
        emit: Emit,
        broadcast: Broadcast,
        broadcastToOthers: BroadcastToOthers
    ) {
        val runningGame = openGame.startGame()
        addToGames(runningGame)
        removeFromOpenGames(openGame)
        broadcast(Message(ServerEventTypes.OPEN_GAMES, listToJSON(openGames)))
    }

    override val event: ClientEventType
        get() = ClientEventType.StartGame
}
