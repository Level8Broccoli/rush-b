package ch.ffhs.rushb.controller

import ch.ffhs.rushb.behavior.Serializable
import ch.ffhs.rushb.model.User

interface Game
    : Serializable {
    val creator: User
    var secondPlayer: User?
}