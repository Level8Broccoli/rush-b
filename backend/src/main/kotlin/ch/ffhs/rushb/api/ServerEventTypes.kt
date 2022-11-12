package ch.ffhs.rushb.api

enum class ServerEventTypes(val value: String) {
    OPEN_GAMES("openGames"),
    MESSAGE("message"),
    GAME("game"),
    SESSION_CLOSED("sessionClosed")
}