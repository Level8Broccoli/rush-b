package ch.ffhs.rushb.api

import ch.ffhs.rushb.controller.RunningGame
import ch.ffhs.rushb.model.OpenGame
import ch.ffhs.rushb.model.User
import org.springframework.web.socket.WebSocketSession

typealias AddToSessions = (WebSocketSession, User) -> Unit
typealias AddToSessionsWrapper = (MutableMap<WebSocketSession, User>) -> AddToSessions

val createFnAddToSessions: AddToSessionsWrapper = { sessionList ->
    { session, user ->
        sessionList.putIfAbsent(
            session, user
        )
    }
}


typealias AddToUsers = (User) -> Unit
typealias AddToUsersWrapper = (MutableList<User>) -> AddToUsers

val createAddToUsers: AddToUsersWrapper = { userList ->
    { user ->
        userList.add(user)
    }
}

typealias AddToOpenGames = (OpenGame) -> Unit
typealias AddToOpenGamesWrapper = (MutableList<OpenGame>) -> AddToOpenGames

val createAddToOpenGames: AddToOpenGamesWrapper = { openGameList ->
    { openGame ->
        openGameList.add(openGame)
    }
}


typealias RemoveFromOpenGames = (OpenGame) -> Unit
typealias RemoveFromOpenGamesWrapper = (MutableList<OpenGame>) -> RemoveFromOpenGames

val createRemoveFromOpenGames: RemoveFromOpenGamesWrapper = { openGameList ->
    { openGame ->
        openGameList.remove(openGame)
    }
}

typealias AddToGames = (RunningGame) -> Unit
typealias AddToGamesWrapper = (MutableList<RunningGame>) -> AddToGames

val createAddToRunningGames: AddToGamesWrapper = { gameList ->
    { runningGame ->
        gameList.add(runningGame)
    }
}

