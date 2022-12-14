package ch.ffhs.rushb.controller

import ch.ffhs.rushb.api.ServerEventTypes
import ch.ffhs.rushb.model.User
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession

data class Message(val type: ServerEventTypes, val data: String) {
    data class Data(val type: String, val data: String)

    fun toData(): Data {
        return Data(type.value, data)
    }
}


typealias Emit = (WebSocketSession, Message) -> Unit
typealias EmitWrapper = () -> Emit

val createFnEmit: EmitWrapper = {
    { session, message ->
        if (session.isOpen) {
            session.sendMessage(TextMessage(ObjectMapper().writeValueAsBytes(message.toData())))
        }
    }
}

typealias Broadcast = (Message) -> Unit
typealias BroadcastWrapper = (Map<WebSocketSession, User>, Emit) -> Broadcast

val createFnBroadcast: BroadcastWrapper =
    { sessionList, emit ->
        { message ->
            sessionList.forEach { s -> emit(s.key, message) }
        }
    }

typealias BroadcastToOthers = (WebSocketSession, Message) -> Unit
typealias BroadcastToOthersWrapper = (Map<WebSocketSession, User>, Emit) -> BroadcastToOthers

val createFnBroadcastToOthers: BroadcastToOthersWrapper =
    { sessionList, emit ->
        { session, message ->
            sessionList.filterNot { s -> s.key == session }.forEach { s -> emit(s.key, message) }
        }
    }

