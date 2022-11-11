package ch.ffhs.rushb.api

// should be kept in sync with `serverEvents.ts`

enum class ClientEventType(val value: String) {
    Subscribe("subscribe"),
    KeyPress("keyPress"),
    Message("message"),
    CreateGame("createGame");

    companion object {
        fun fromString(value: String): ClientEventType? {
            return ClientEventType.values().find { k -> k.value == value }
        }
    }
}

enum class Key(val value: String) {
    ARROW_LEFT("ArrowLeft"),
    ARROW_RIGHT("ArrowRight"),
    ARROW_UP("ArrowLeft"),
    SPACE("SPACE"),
    KEY_E("KeyE"),
    KEY_Q("KeyQ");

    companion object {
        fun fromString(value: String): Key? {
            return Key.values().find { k -> k.value == value }
        }
    }
}

interface ClientEvent {
    val event: ClientEventType
}

data class SubscribeEvent(val userId: String) : ClientEvent {
    override val event: ClientEventType
        get() = ClientEventType.Subscribe
}

data class MessageEvent(val messages: List<String>) : ClientEvent {
    override val event: ClientEventType
        get() = ClientEventType.Message
}

data class KeyPressEvent(val keys: List<Key>) : ClientEvent {
    override val event: ClientEventType
        get() = ClientEventType.KeyPress
}

data class CreateGameEvent(val clientId: String) : ClientEvent {
    override val event: ClientEventType
        get() = ClientEventType.CreateGame
}
