package ch.ffhs.rushb

import ch.ffhs.rushb.controller.GameController
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

const val GAME_ENDPOINT: String = "/ws"

@Configuration
@EnableWebSocket
class WSConfig : WebSocketConfigurer {
	override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
		registry.addHandler(GameController(), GAME_ENDPOINT).setAllowedOriginPatterns("*").withSockJS()
	}
}

@SpringBootApplication
class RushbApplication

fun main(args: Array<String>) {
	runApplication<RushbApplication>(*args)
}
