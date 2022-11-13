package ch.ffhs.rushb.controller

import ch.ffhs.rushb.enums.Role
import ch.ffhs.rushb.model.OpenGame
import ch.ffhs.rushb.model.User
import org.springframework.web.socket.WebSocketSession

data class RequestContext(
    val session: WebSocketSession,
    val user: User,
    val openGame: OpenGame?,
    val runningGame: RunningGame?,
    val role: Role?
)