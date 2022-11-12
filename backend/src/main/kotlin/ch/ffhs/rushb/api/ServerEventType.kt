package ch.ffhs.rushb.api

enum class ServerEventType(val value: String) {
    OPEN_GAMES("openGames"),
    MESSAGE("message"),
    GAME("game"),
    SESSION_CLOSED("sessionClosed"),
}